# My Collector Concierge: Build Plan

This is the order of work for turning the demo into the real product. It sits next to [PROPOSAL.md](PROPOSAL.md), which covers what gets built and why. This file covers what to do first, the commits to make, and how changes get checked.

## The main thing: every screen is live

The product is not a set of pages that show what was true when they loaded. A card's value and its status come from data that keeps arriving: new sales, new scans, grading results, staff moving a box. When any of it changes, every open screen shows the change within about two seconds. That holds for the collector, for staff and for the owner, all looking at the same card at the same moment.

This is the test every feature has to pass: if the data behind a screen changes while someone is looking at it, the screen changes too, and it does so smoothly.

### Several views of value, side by side

One number is not enough to make a decision about a card. Each card, and the collection as a whole, shows these together:

| View | The question it answers | Where it comes from |
|---|---|---|
| Recorded | What value does My CC have on file for this card? | The latest value staff entered or imported, with its source and date. A card with no value on file reads "Not priced yet", not $0 |
| Market now | What is it selling for today, as it is? | The median of recent matching sales, shown with how many sales, their dates and the low to high range. This view needs a licensed feed of individual sales. None of the three pricing sources in the proposal provides one. Choosing and paying for a feed is the owner's decision. Until a feed is signed, the card shows the Recorded value only |
| If graded | What would it be worth at each grade it could get? | Sales of the graded card at each grade in the pregrade range, each shown minus the full grading cost. No single blended number is shown until enough graded results exist to work out real odds. Today the submission sheets have 59 cards with both a pregrade and a final grade |
| Net if sold | What would actually reach the collector? | Market now, minus fees and shipping, from the same pricing code the quotes use |
| Trend | Is it going up or down? | The value history over 7, 30 and 90 days. Each window is shown only when the card has that much dated history |

Every value is labeled an estimate, shows the time it was last worked out, and opens to the sales behind it in one tap. When there are too few sales to trust, the screen says so and shows no number.

Four notes on these views:

- **When each one ships.** Recorded and Market now ship in Milestone 2. If graded, Net if sold and Trend ship in Milestone 3.
- **History starts at the import.** The ledger values have no source or date today. The import tags them as "ledger import" with the import date, so value history starts on that day.
- **Which value sets fees.** The Recorded value is the one that sets the grading fee band and the declared value for grading and insurance. It is locked into a quote when the quote is approved, as the proposal says. Whether Market now should ever take over that job is the owner's decision.
- **Only exact matches are priced.** A sale counts toward a card only when it matches exactly on the identity fields the proposal lists: year, set, number, player and parallel, plus grader and grade for graded cards. Anything less certain goes to staff review and is never priced automatically.

### What is happening to the card

Next to the values, each card shows where it is right now (received, inventoried, at the grader and at which stage, vaulted, listed, sold, shipped), the last thing that happened, and the next expected step with a date. The collection has one activity feed built from the same events.

### How it is built

1. **Every change is an event.** The proposal already writes each change to the append-only `card_events` and `card_valuations` tables. Two small tables hold the prepared answers screens read: `card_live` (one row per card with its status, each value view, the range, the time worked out and a version number) and `account_live` (collection totals). A card's status in `card_live` is updated in the same transaction as the event, because it is one cheap write. Values and totals are updated by a worker in its own transaction.
2. **A row and its announcement are saved together.** Whichever transaction changes a `card_live` or `account_live` row also raises its version and writes a row to an `outbox` table with that version. So a change and its announcement can never get separated, and a push never goes out before the row it points to is ready.
3. **Changes are pushed straight after they are saved.** The code that saves a change sends the push itself, as soon as its transaction commits, and then marks the outbox row as sent. It waits for the send to finish before the function returns, because Lambda freezes a function once it has answered. A sweeper function runs every minute and sends any outbox row still unsent after 10 seconds, which covers a crash between the save and the send. The normal path adds well under a second.
4. **The push carries no private data.** It is a small message: "card 574 changed, now version 42". The screen then asks the API for the new row, so permissions are checked in one place, the API. A push can arrive twice or out of order, so a screen ignores a message whose version it already has. If a screen fetches a row and gets a lower version than the push named, it asks again after a short wait.
5. **Nothing is missed.** Every push also carries a change number for the account. The number is a counter kept on the account's row in `account_live`, not the database's automatic ID. Each transaction locks that row briefly, adds one, and stamps its outbox row with the result. Automatic IDs are handed out when a row is written, not when it is committed, so a lower one can appear after a higher one and be skipped. A locked counter cannot do that. Each screen remembers the last change number it saw. After a dropped connection, or when the app comes back to the front, it asks the API for everything since that number. Staff boards cover every account, so after a drop they reload their lists in full. The 30-second check from the proposal stays as a safety net and always reloads in full, so a failed push only makes an update slower, never lost.
6. **One action, one message.** When one action changes many cards, the backend sends one message per channel, not one per card. It says how many cards changed and the latest change number for each account touched. The screen makes one "changes since" call, not 120 separate fetches. Screens also group pushes that arrive within a quarter of a second into one fetch.
7. **Values are reworked only when needed.** A new sale is matched to its card, and only that card's values are worked out again. A value change is announced only when a new sale arrives or the value moves past a set threshold, so screens do not flicker over cents.
8. **Everything is traceable.** The trace ID travels from the change, through the outbox and the push, to the screen. A dashboard shows the delay between a change being saved and the screen showing it, with an alarm when it grows.

### The push service

The push channel is AWS AppSync Events, a managed service for sending messages to open screens over WebSockets. It accepts the same Cognito logins and needs no table of open connections. It sits behind one small `LiveChannel` interface. If it ever falls short, an API Gateway WebSocket can replace it without changing screen code.

Signing in is not enough to listen to a channel. A valid login alone would let a user subscribe to any channel, so each channel group has a small subscribe rule that AppSync runs before it accepts a subscription:

- The customer rule allows only the channel that matches the user's own account, and rejects wildcards.
- The staff rule allows only logins from the staff pool.
- Only the backend can publish, using its AWS role. No login can publish.

The Event API is a new public address that does not sit behind CloudFront, so it gets its own WAF web ACL, the same way the Cognito pools do. A short first spike confirms two things before anything is built on it: that one Event API accepts both Cognito pools, and that the WAF web ACL attaches to it. If one API cannot take both pools, each pool gets its own.

### Rules that keep it feeling good

- A change appears in place. The number ticks to its new value with a short highlight. The page does not reload, jump or show a spinner over content already on screen.
- A tap shows its result at once. The server then confirms it or puts it back with a clear message.
- Many changes at once are summed up. "120 cards moved to At PSA" appears once, not as 120 flashes.
- The screen is honest about being live. A small "Live" marker shows when updates are flowing. When the connection drops it reads "Reconnecting. Showing data from 2:02 pm." Old data is never shown as current.
- First view is fast. Repeat visits show the last known data straight away and then update it. Placeholders have the shape of the content they stand in for.
- Motion is optional. With reduced motion turned on, values change without animation. Screen readers are told about a change only on the card in focus.

### Targets, and where each is checked

| Target | Number | Where it is checked |
|---|---|---|
| A change saved to `card_live` shows on an open screen | Under 2 seconds, 95 times out of 100 | The staging and production dashboard, over many changes, with an alarm |
| A card page opens on a repeat visit | Under 1 second | A page speed check on staging after every merge |
| A card page opens the first time, on a phone | Under 2.5 seconds | The same page speed check |
| Updates missed after a dropped connection | None | The live test on every pull request |

The clock for the first target starts when the transaction that changes `card_live` commits and stops when the screen shows the new value. The API logs how long after the commit each screen fetched the new row, using the server clock only, because phone clocks can be wrong. The screen reports the time from that fetch to the value showing. The dashboard adds the two, so it shows the whole trip and not only the push.

A push makes every subscribed screen call the API at the same moment, which is when Lambda starts slow new copies of a function. So each screen waits a random 0 to 300 milliseconds before it fetches. If the dashboard still shows slow starts breaking the target, the API function keeps a few copies warm. A warm copy costs about $5 a month.

### What this changes in the proposal

This plan changes more than the 30-second check. Each item below is a proposed change for the owner to approve. Each gets an hours or cost estimate first, as the proposal's change list rule requires.

- **Sync.** In "Keeping the website, portal, and mobile app synchronized", the promise of about 30 seconds becomes about 2 seconds. The push service is AWS AppSync Events, not the API Gateway WebSocket named there.
- **Later phases.** The "Later phases or change requests" list puts instant updates and a licensed feed outside the quoted hours. Both move into the build.
- **Data model.** New tables: `outbox`, `card_live`, `account_live`, `sales`, `model_calls` and `model_corrections`.
- **Pricing.** Market now needs a feed of individual sales, which is not one of the three sources listed under "Card Ladder pricing and market data".
- **Calculator and insights.** The proposal places the grading calculator and collection insights in Phase 3.
- **Card identification by AI.** The proposal does not include this feature. Its hours, its test set, its review queue and its provider bills are all new.
- **Capture and storage.** The storage paragraph, the "Scanner model and settings" checklist line and the S3 line in the cost table all assume two scans per card. Capture is now ten camera frames per card.
- **Cost table.** Add AppSync Events (under $2 a month at launch size), its WAF web ACL ($5 a month plus $1 per rule), the AI provider bills and the sales feed subscription. The last two are not priced yet.
- **Hours.** The milestones in this plan are not the proposal's phases. Milestone 2 pulls work from Phases 2 and 3, so both need a new estimate.

## Do these before the AWS account

AWS is not step one. Nothing below needs it.

1. Turn on CI and the AI reviewer in this repo. This pull request does that.
2. Create the private repo for the product code. For now it sits on the developer's personal GitHub account, and this repo stays the public demo. See "Where the code lives" below for the move to My CC.
3. Do a dry run on the cards that already have scans. The inventory spreadsheets link a front and back scan for about 8,000 cards, each with its answer already filled in. Download those scans first, then build the identification step and the scoring, and get a first accuracy number. The scans are not rig photos, so this proves the code and the scoring, not the final accuracy. See "The data we have today" below.
4. Lock the capture setup, described under "Capture setup" below.
5. Shoot 300 cards that already have known answers in the ledger. Use 200 for writing prompts and keep 100 hidden for the ship decision.
6. Run identification on them and measure accuracy. If the score is not good enough, fix it here, where a change costs minutes.
7. Start the slow outside items now, because they are waits and not work: D-U-N-S number, eBay developer account, PSA dealer status, a licensed sales feed quote, and the AI provider accounts. New provider accounts can start with low limits and a monthly spending cap, so check what each one starts with.

The dry run in step 3 can use the developer's existing API key. Before real customer cards are processed, the provider accounts are opened under a My CC email, each with a monthly spending limit.

Then create the AWS accounts. They should be created under a My CC email and billing card, not a personal one. Use AWS Organizations with separate production and staging accounts, as the proposal describes.

## The data we have today

The staff member who keeps the inventory sent the working spreadsheets in November 2026. They replace the single ledger file the demo was built from, and they hold more than it did.

| File | What it holds | Size |
|---|---|---|
| Master inventories (baseball, football, Formula 1, non-sport) | Every card on hand, one sheet per product | About 7,700 cards |
| Next PSA | The working queue for the next grading submission | 89 cards |
| PSA submissions | One sheet per submission since June 2026 | 18 sheets, about 620 cards |

What these files give the build:

- **The right answer for almost every card.** Each row has year, brand, set, subset, player, card number, attributes and team. The card number was missing from the demo ledger and is here.
- **Scans.** About 8,100 rows link a front and a back scan. The links point at an outside service, so every scan is downloaded and kept in private storage before anything depends on it.
- **Grading history.** 419 submitted cards have the four pregrade scores (centering, corners, edges, surface). 143 have a final grade back, and 59 of those also have a pregrade.

What the import has to handle:

- **Rows disappear.** A card's row is removed from the master inventory when it goes to PSA, and cards marked to sell or send back do not return to the list. So the spreadsheets hold no history. The import keeps a dated copy of every file it is given and compares it with the last one. A card that has gone missing becomes a question for staff, not a silent delete.
- **The inventory number is the key.** It is the `sku` column. About 200 rows have none, and 25 numbers appear twice. Both go on the reconciliation report.
- **Column names differ between sheets.** Some sheets say `Value` and others `sale_price`. The older submission sheets have their own layouts.
- **Pregrades and grades are free text.** "9 or 10", "gem likely" and "9 at best" all need one agreed scale, and final grades have spelling variants.
- **These files are private.** They belong in the private product repo's storage, never in this public demo repo.

## Where the code lives

The product code starts in a private repo on the developer's personal GitHub account. A private repo works with AWS the same way a public one does. GitHub Actions signs in to AWS with short-lived logins, so no AWS keys are stored in GitHub.

The proposal promises that the code lives in My CC's GitHub from the first commit. Until the move, that promise is kept another way: the owner is added to the private repo as a collaborator from day one and can see every commit.

Before launch, the repo is transferred to a GitHub organization that My CC owns. A transfer keeps the full history, the pull requests and the issues, and old links redirect. Three things have to be redone after it:

- The AWS login rule names the repo by its owner and name. It has to be updated to the new owner, or deploys stop.
- GitHub apps, such as the AI reviewer, have to be installed again on the organization.
- Secrets and branch rules should be checked once, since some settings do not carry over.

## Capture setup

The camera and the card stay fixed, and only the light moves. Tilting the card changes its shape in the picture every time, which makes two shots of the same card impossible to compare.

### The shots

Each side of the card gets five frames, so ten frames per card.

| Shot | Light | What it is for |
|---|---|---|
| 1 flat shot, glare removed | Camera straight down. Both flat lights on at 45 degrees, each with a sheet of polarizing film over it. A polarizing filter on the lens, turned at a right angle to the film | The catalog image. Used for identification, centering and color |
| 4 low-angle shots | One light at a time from the top, right, bottom and left, about 10 to 20 degrees above the card. No film on these lights | Scratches, print lines and dents. These show up as glints, and polarized light would remove them |

A filter on the lens alone does very little with the camera pointing straight down. Glare is only removed when the light is polarized too. The lens filter stays on for every frame, so nobody touches the camera. Lock it with its axis running corner to corner, so the four low-angle shots all lose the same amount of light. Then turn the film on the flat lights until the glare on a glossy test card goes dark. The polarized flat shot needs roughly 10 times more light than an unpolarized one, so the flat shot and the low-angle shots each have their own fixed exposure.

With the card filling at least 80 percent of the short side of the frame, the 61-megapixel camera records about 2,000 pixels per inch. This needs a true macro lens of about 90 to 105 mm, because the card is shot at about one third life size. Ordinary lenses often do not focus that close or stay sharp to the corners. Corners and edges are cropped from the flat shot, as long as the test shows the crop is sharp enough to see corner wear. If it is not, a close-up is added.

### What goes under the camera

- **Raw cards** are shot bare, out of the sleeve and top loader, and held by the edges. Plastic in front of the card adds its own glare and its own scratches. If the owner wants some cards left in their holders, those cards get the flat shot only.
- **Graded slabs** do not fit the frame set for raw cards. A PSA slab is about 5.4 inches long, and the frame that gives 2,000 pixels per inch is about 4.75 by 3.2 inches. Measure the real slabs. Slabs get their own camera height, saved as a second preset, and the pixels per inch of each preset is recorded with the scan.
- **Slabs get the flat shot only.** Low-angle shots of a slab show scratches in the case and not in the card.
- **Thick cards**, such as patch and relic cards, sit higher than standard cards and get their own focus preset.

### Keeping every card the same

- A printed outline, or two low stops thinner than a card, on a matte background. Software finds the card's edges and straightens the crop, so the card only needs to sit roughly in place. A stop taller than the card throws a shadow across its edge in the low-angle shots, and pushing a corner into a hard stop can damage it.
- One fixed manual exposure for the flat shot and one for the low-angle shots, a fixed white balance, ISO 100, and one aperture between f/5.6 and f/8 picked in the test.
- Manual focus, set once on a flat test card and locked. Autofocus is off. All frames of a card use the same focus, or they will not line up. Sharp focus is only about 1 to 2 mm deep, so a warped card is flagged for staff review.
- Room lights off, or a black shroud around the stand. Stray light changes through the day and puts glare back.
- Low-angle lights set well back from the card, so the near edge is not much brighter than the far edge.
- At the start of every session, one frame of a plain gray card under each light. Software uses these to even out each light. They also show when a lamp has moved or dimmed.
- A color reference card shot at the start of every session, under the same polarized lights as the flat shot.
- Lens corrections either off or the same fixed profile for every frame.
- Dust blown off the card and the stand with a hand blower before each side. In low-angle light a speck of dust looks like a surface defect.
- Lights fired in order by the computer the camera is connected to. Staff only place the card and flip it. The capture doc names what switches each light and what software drives the camera.
- One file name pattern: inventory number, side, shot. For example `574_front_flat` and `574_back_low-left`.

### Things to settle during the test shoot

- **Polarized light on shiny cards.** Under crossed polarizers, foil, refractor and chrome surfaces turn dark and lose their shine. That shine is part of how the parallel is told apart. Shoot shiny cards a second time with the film taken off the flat lights, and check which flat shot identifies better. If the plain shot is needed, it becomes a sixth frame per side on shiny cards, named `574_front_flat-plain`.
- **The aperture.** Pixel count is not the same as detail. Shoot a resolution target at the center and at all four corners, and pick the aperture from that.
- **The background.** Start with matte black. Check that software can find the edge of black-bordered cards for centering. If it cannot, change to a mid-gray background.
- **The odd cards.** The test set includes a few slabs, thick cards and warped chrome cards.
- **Real file sizes and upload speed.** Both feed the storage numbers below.

### File formats and upload

Decide the file formats during the test shoot and write them down. Recommended:

- Each flat shot is kept as the camera's lossless compressed raw file. The capture computer also makes a full-size JPEG of it, because the resize worker cannot open raw files.
- The eight low-angle shots are saved as high-quality JPEGs on the capture computer.

All of this happens before upload. The proposal stores originals unchanged in a bucket that keeps every version, so a file replaced after upload is billed twice. Files go straight from the capture computer to S3 with a pre-signed upload. They cannot pass through the API, which accepts at most 10 MB per request. At 20 megabits per second, one card takes about 100 seconds to upload.

### Storage

Storage costs much more than the proposal budgeted. The proposal assumed 11 MB per card. Rough sizes for a 61-megapixel frame, to be replaced with measured ones:

| What is kept per card | Size per card | Against the proposal |
|---|---|---|
| Ten raw files, about 70 MB each | about 700 MB | about 60 times |
| Ten top-quality JPEGs, about 35 MB each | about 350 MB | about 30 times |
| Two raw flat shots plus eight JPEG low-angle shots at about 12 MB each | about 250 MB | about 20 times |

At 250 MB per card, launch is about 2 TB and 100,000 cards is about 25 TB. In S3 Standard that is about $46 and $575 a month, against $2 and $25 in the proposal.

Once a card has been processed, its original files move to S3 Glacier Instant Retrieval. It costs about $0.004 per GB a month against $0.023 for Standard, and a file still opens in milliseconds. That matters because the proposal lets a collector open the original on request. In that class the same storage is about $8 and $100 a month, about four times the proposal's line. Do not use Glacier Flexible Retrieval or Deep Archive. They are cheaper again, but a file takes minutes to hours to come back.

Two costs to know about: each file is billed for at least 90 days, and reading a file back costs about $0.03 per GB. So the thumbnail and detail-size copies stay in S3 Standard, and any job that reads every card again reads those copies and not the originals. The replica in the backup account grows the same way. Update the proposal's cost table once real sizes are measured.

## Model layer: any provider

No part of the product depends on one AI company. Switching the model behind a task is a change to one config file, and the test set decides whether the switch is an improvement.

### How it works

Product code calls one function, `runTask('identify-card', { images, traceId })`. It never names a company, a model or a prompt version. A small router reads the task config, picks the tier, fills in the model and the prompt for that tier, and calls the right adapter. The adapters are the only code that knows a company's API.

```ts
// packages/ai/src/provider.ts
export interface ModelProvider {
  id: string; // one adapter per company, plus one for our own models
  run<T>(request: ModelRequest<T>): Promise<ModelResult<T>>;
}

export interface ModelRequest<T> {
  task: TaskName;       // for example "identify-card"
  model: string;        // filled in by the router from the task config
  prompt?: PromptRef;   // a prompt file and its version; our own models take none
  images: ScanRef[];    // our own scan IDs
  schema: z.ZodType<T>; // our own shape for the answer
  traceId: string;
}

export interface ModelResult<T> {
  answer: T;
  provider: string;
  model: string;
  tokens: number;
  cost: number;
  ms: number;
}
```

```ts
// packages/ai/models.config.ts
export const tasks = {
  'identify-card': {
    tiers: [
      { provider: '<provider A>', model: '<dated low-cost vision model>', prompt: 'v3', cutoff: 0.9 },
      { provider: '<provider B>', model: '<dated stronger vision model>', prompt: 'v3.provider-b', cutoff: 0.8 },
    ],
    fallback: { provider: '<provider C>', model: '<dated vision model>', prompt: 'v3', cutoff: 0.9 },
    maxCostPerCard: 0.05,
    maxSpendPerDay: 50,
  },
};
```

A card goes to the first tier. An uncertain card goes to the next tier, and after the last tier to the staff review queue.

**What counts as uncertain.** An answer is uncertain when any of these is true: it fails the schema after one retry, the catalog check finds no such set and number, the model marks a field as unreadable, the look-alike matcher disagrees, or two readings of the same card disagree. A model's own confidence number is not trusted as it stands. Each model gets its own cutoff, set from the test set, and a new model gets a new cutoff.

**What counts as down.** A provider is down after three failed tries with a growing wait between them, or when it says the account's spending limit is reached. A "slow down" reply is not down: the worker waits the time the provider asks for and tries again. When a provider is down, the fallback takes over and the switch is logged. The fallback model must have passed the test set too.

**Spend limits.** Each task has a cost limit per card and a spend limit per day. When the day's limit is reached, the queue pauses and an alarm goes to the owner.

### The image every model gets

An adapter never sends a camera original. A 61-megapixel frame is larger than providers accept, and each provider would shrink it differently. Every model gets the same model-sized copy, which we make ourselves: the card cropped out of the flat shot, about 2,000 pixels on the long side, saved as a JPEG. Some models shrink images further on their side, so small print gets its own crops from the full-quality shot: the card number on the back and any serial number stamp. The copy size is a setting with a version number. It is tested on the test set and saved with every call.

### Rules

1. **Our own answer shapes.** Every answer is checked against our Zod schema, whichever model wrote it. An answer that fails is retried once and then treated as uncertain.
2. **Prompts are plain files in git, paired with a model.** For example `prompts/identify-card/v3.md`. They contain no company-specific syntax. A prompt is still tuned to the model it was written against, so the task config names a prompt version next to each model, and the test set scores the pair. A new model is first tried with the current prompt. If it scores lower, it may get its own wording before it is judged. The answer shape stays shared. The config names exact dated model versions, never a "latest" name, because providers move those names and retire models.
3. **The product works without company-only features.** Things like prompt caching can be used to save money, but the product must work with them turned off, and the test set score must hold either way. Batch pricing is different, because the answer comes back later, sometimes hours later. It is used only for bulk work nobody is waiting on, such as test set runs, and has its own pair of functions on the adapter.
4. **Every call is recorded.** `model_calls` stores the provider, model, prompt version, image copy version, input scan IDs, full output, confidence, tokens, cost, time taken and trace ID. Rows are never edited. Staff corrections are new rows that point at the call they correct. In Milestone 0, before the database exists, each call is written to a local log file with the same fields.
5. **The test set decides.** A change ships only if it is not worse than the current setup and is better on accuracy or on cost. "Not worse" needs a margin, because a model gives slightly different answers from run to run and a few hundred cards is a small sample. Run the current setup three times to see how far the score moves by itself, and treat anything inside that spread as a tie. Compare the two setups card by card on the same cards. Every staff correction is added to the set, so it grows past 1,000 cards.
6. **Embeddings do not transfer.** A stored embedding only works with the model that made it. Each one is saved with its model name. Embeddings are made from the model-sized copy, which stays in standard storage for as long as the card record is kept, so cards can be embedded again after a switch.
7. **Keys and data terms.** In Milestone 0 the keys live in a local `.env` file that git ignores, and in GitHub Actions secrets for the test set job. From Milestone 1 they are stored in AWS Secrets Manager. Use paid API plans only, and read each provider's data terms on the day the account is opened, because free plans can allow the provider to use what is sent. Never turn on a provider's data sharing option, even when it comes with free credits. "Does not train" is not "does not keep": paid plans still hold requests for a time to check for abuse. Prompts carry card images and card facts only, never a customer's name, email or address.
8. **Our own models use the same door.** The grade model is trained in Python. The surface maps are computed from the four low-angle shots, not trained. Both sit behind the same `ModelProvider` interface, so the rest of the code cannot tell the difference.

### What the test set can score

The inventory spreadsheets give the right answer for year, set, card number, player and parallel on almost every card. A wrong label would count a right answer as a miss, so staff check each test card by hand before the set is trusted. Where a row leaves the subset blank, staff confirm whether the card is a base card and record that as the answer. The catalog check needs a checklist of real sets and card numbers, and its source has to be named before Milestone 0 starts.

### Library

The adapters are written on top of a library that already speaks to many providers, so each one is a few lines. The recommended choice is the Vercel AI SDK. It is open source under the Apache 2.0 licence, has one call shape across providers and returns answers checked against a Zod schema. Three rules keep it from tying the product to Vercel or to one provider:

- Adapters import each company's own package and never pass a model as a bare name, because the library sends a bare name to Vercel's own gateway service by default.
- Answer schemas stay plain: every field is required, an unknown value is `null`, and limits such as number ranges are checked in our own code after the answer comes back. Providers accept different parts of the schema language, and a plain schema works on all of them.
- The library version is pinned, and only the adapters import it.

Amazon Bedrock is added as one of the providers once the AWS accounts exist. It puts several model families on the AWS bill with AWS permissions in place of keys.

## Our own models, trained alongside

The provider models do the work at the start. Our own models are built next to them from the first week, on a separate branch, so My CC ends up with models it owns. They cost almost nothing per card, and they keep working if a provider changes its price or its terms.

The inventory spreadsheets link scans for about 8,000 labeled cards. That is enough to test any model and to start the first two tracks early. Graded results are still few, so the grade model starts last:

| Track | What it is | When it can start | What it needs |
|---|---|---|---|
| Look-alike matcher | An open, already-trained image model turns each scan into a fingerprint. A new card is matched to the known card with the closest fingerprint | Milestone 0. It needs no training to begin | A reference picture of each card it should recognize |
| Trained identifier | A small model trained on My CC's own confirmed cards | After the dry run, once the spreadsheet labels have been spot-checked | Labels from the spreadsheets at first, then from `model_calls` and the staff corrections |
| Grade model | Predicts the grade a card is likely to get | Once enough graded cards have come back. Today 143 have a final grade | Photos of each card taken before it goes to the grader, paired with the grade it got |

Rules for all three:

- **Same door, same test.** Each one sits behind the `ModelProvider` interface, runs on the same test set as the provider models, and ships under the same rule: not worse, and better on accuracy or on cost.
- **A second opinion first.** The look-alike matcher starts as a check on the provider model. When the two agree, the answer is trusted. When they disagree, the card goes to staff review.
- **Test cards stay out of training.** The cards in the test set are never used to train, or the score means nothing.
- **Photograph before shipping.** A card that goes to the grader without rig photos gives a grade with nothing to pair it with. Every card is shot on the rig before it leaves.
- **Training is in Python.** Everything else stays in TypeScript.

## Guesses in the background

What a collector sees is always backed by evidence: a value comes from real sales, and a grade comes from the grader. Behind that, the AI makes its own guess on every card, and every guess is recorded. Nobody sees these guesses. They exist to build data and to show, with numbers, when a model has become good enough to use.

| What is guessed | Guessed from | The real answer it is scored against | When the real answer arrives |
|---|---|---|---|
| Which card it is | The photos | The identity staff confirmed | At review |
| The grade | The photos and the surface map | The grade the grader gave | When the card comes back |
| The value | The photos, the identity and the grade guess | The value worked out from sales, and the price the card actually sells for | Straight away for the first, at the sale for the second |

How it works:

- **Several models guess the same card.** Provider models and our own models run side by side. Each guess is a row in `model_calls`, marked as a background guess.
- **A guess is scored when the truth arrives.** The real answer is saved as a new row that points at the guess. Nothing is edited.
- **A scoreboard per task.** It shows each model's accuracy over time and by type of card, so it is clear which model is winning and where each one is weak.
- **These pairs are the training data.** Every guess with its real answer is one more example for our own models.
- **It runs on the cheap path.** Nobody is waiting for a background guess, so it uses batch pricing and stays inside the daily spend limit.
- **A guess is promoted, not assumed.** A background guess starts being used only under the ship rule. For value and grade, that is also the owner's decision, because those numbers reach collectors.

A value guessed from a picture will probably stay weaker than one backed by sales. It is still useful in two places before it is ever shown: flagging a card whose guess is far from its recorded value so staff take a look, and giving staff a starting point on a card with no recent sales.

## Any picture can come in

The rig gives the best pictures, but it is not the only source. The scans that exist today came from the current inventory tool, staff will take pictures with the phone app, and collectors will send their own. The system takes all of them through one front door.

1. **One intake for every image.** Whatever the source or the file format, the original is stored unchanged and tagged with where it came from, the device, the format, its size and, when known, its pixels per inch and the kind of lighting.
2. **One standard working copy.** Each image is turned into the same form: the card found, straightened and cropped, in one file format and one color setting. Formats that models and browsers do not read, such as camera raw files and the HEIC files phones make, are converted here. The model-sized copy is made from this.
3. **Models only see the standard copy.** Adding a new source or format is a change to the intake, never to the models.
4. **A quality check on the way in.** Sharpness, glare, resolution and whether the whole card is in frame are scored. A poor phone picture is turned back with a clear reason, such as "glare on the top left, please retake".
5. **Scores are kept by source.** The test set reports accuracy separately for each source. A model can be good enough to use on rig photos and not yet on phone photos.

What each source can support:

| Source | Which card it is | Centering and corners | Surface and grade |
|---|---|---|---|
| The rig | Yes | Yes | Yes |
| Scans from the current inventory tool | Yes | Yes | No, flat light hides the surface |
| Staff phone photos | Yes | Rough | No |
| A collector's own photos | Yes | Rough | No |

A collector's own photos open up one more use: a quick check of what a card is and roughly what it is worth before it is ever mailed in.

## Where sales data comes from

A value is only as good as the sales behind it. Every source plugs into the same `PricingSource` interface, and every sale is tagged with where it came from, so adding or dropping a source is one adapter.

| Source | What it gives | Status |
|---|---|---|
| My CC's own sales | Every consignment sale, matched to the exact card. The most exact source there is, and free | Starts with the first sale and grows |
| A licensed feed of individual sales | Dated sales across the market | The owner's choice. A quote is on the list of outside items |
| eBay's official tools for developers | Current asking prices, and sold items for developers eBay has approved | Apply once the developer account exists |
| Public websites that allow automated collection | Auction results and sold prices published on the open web | Each site is checked first, as described below |
| A price guide with its own connection | One price per card and grade. A cross-check, not individual sales | Optional |
| Staff entry and file import | Anything the others miss | In the proposal |

The goal is the best information a collector can get, so every source that is allowed gets used. Three rules keep it honest:

- **Collect from the web wherever it is allowed, and only there.** Before a collector is built for a site, its terms and its robots file are read, and a dated note of what they allow is saved in the repo. If the terms forbid automated collection, the options are to ask for written permission or to use the site's official connection. The collector identifies itself, goes slowly, and stops if a site asks it to.
- **eBay is not collected this way.** eBay's terms forbid it, and eBay is where My CC sells, so losing that account would cost far more than the data is worth. eBay's sold prices come through its official developer tools, which need eBay's approval.
- **An asking price is not a sale.** Asking prices are stored apart from sales and shown as "listed for". They help suggest a listing price. They never go into Market now.

How several sources become one good number:

- The same sale often appears on more than one source. It is counted once.
- A sale that is far from the others is set aside for staff to look at, not averaged in.
- Recent sales count for more than old ones.
- The card page shows which sources a value came from, so a collector can judge it.

The proposal says "no scraping". This plan narrows that to "no collection that breaks a site's terms", which is a change for the owner to approve.

## Listing prices that follow the market

A listing is not priced once and left alone.

- When a card is listed, the suggested price comes from Market now and what similar cards are listed for.
- While it is listed, a market move past a set threshold produces a new suggested price.
- A price never goes below the minimum the collector agreed to. Inside a range the collector approved, the change is applied automatically. Outside it, staff approve it with one tap.
- Every price change is an event on the card's timeline, with the sales that caused it.

## Ideas for later

- **A zoom tool for the model.** Today a model gets a fixed set of close-ups. A model could instead ask for a close-up of any part of the full-quality photo, look, and ask again. It would be offered to models as a tool. It is worth trying on the test set against the fixed close-ups before building on it.

## Payments: keeping the fees low

A card payment costs about 3%, and most of that goes to the customer's bank and the card network. That part is hard to avoid. The fees stacked on top of it are not. This is the direction to build toward when the billing work starts.

| How the customer pays | Fee | On a $1,000 invoice |
|---|---|---|
| Card, Apple Pay or Google Pay through Stripe | 2.9% + 30 cents | $29.30 |
| Bank transfer (ACH) through Stripe | 0.8%, capped at $5 | $5.00 |

- **One payment system.** Stripe handles cards, Apple Pay, Google Pay and bank transfers, so customers get every option and the books stay in one place. Apple Pay is still a card payment and costs the same. PayPal costs more than Stripe, so it is left out unless customers ask for it.
- **Bank transfer is the default for monthly vault plans and larger invoices.** Cards stay available for anyone who prefers them. A bank transfer takes a few days to clear and can bounce, so an invoice is marked paid only when the money lands.
- **Run the monthly billing ourselves.** The proposal uses Stripe Billing, which adds 0.7% to every plan payment, and Stripe Invoicing, which adds 0.4% to every paid invoice. The alternative is to keep the schedule in our own code and use Stripe only to move the money. That means building what those products do: the monthly charge, plan changes part way through a month, retries when a payment fails, receipts and reminders. The saving grows with the number of members, so price the build against it before starting.
- **Passing the card fee on is the owner's decision.** A card surcharge or a discount for paying by bank is allowed in most places, with rules that vary by state. Check them first.
- **eBay sales do not pass through Stripe.** The buyer pays eBay, so only eBay's fees apply to a consignment sale.

Moving off Stripe Billing and Stripe Invoicing changes the proposal, so it goes on the change list with an hours estimate for the owner to approve.

## Commit plan

Each line is one commit, small enough to review in a few minutes. Commit messages use the form `type(area): what changed`.

### Milestone 0: prove the AI (no AWS)

- `ci: add site checks and AI review to the demo repo`
- `ci: AI browser look on pull requests that change the site`
- `docs: add build plan`
- `feat(ai): runTask, the ModelProvider interface, task config and the first two provider adapters`
- `feat(ai): prompts as versioned files, each paired with a model in the task config`
- `feat(ai): local call log with the same fields as model_calls`
- `feat(identify): v0 script that returns year, set, number, player, parallel as structured fields`
- `feat(eval): scoring script with accuracy by field and a list of misses`
- `feat(import): read the inventory and submission spreadsheets, and keep a dated copy of every file received`
- `feat(import): download every linked scan into private storage, with a list of links that failed`
- `docs(eval): dry run report on the cards already scanned`
- `docs(capture): shot list, lighting, camera settings, file formats and file naming`
- `feat(capture): tethered script that fires the lights in order and names the files`
- `feat(eval): manifest of 300 labelled cards checked by staff, 200 for prompt work and 100 held back`
- `feat(ingest): one intake for any image source and format, original kept, source and format recorded`
- `feat(ingest): find, straighten and crop the card into a standard working copy, with a quality score`
- `feat(ai): model-sized copy and small-print crops of each working copy, with a version`
- `feat(identify): catalog check that rejects set and number pairs that do not exist`
- `feat(eval): run the same set against any provider, with accuracy next to cost per card and the run-to-run spread`
- `feat(match): look-alike matcher from an open image model, scored on the same set`
- `feat(eval): accuracy reported separately for each image source`
- `docs(capture): test shoot results for shiny cards, aperture, background, file sizes and upload speed`
- `docs(eval): first accuracy report and the go or no-go call`

### Milestone 1: foundation

- `chore: start the monorepo with pnpm, TypeScript, lint and format`
- `ci: lint, typecheck and unit tests on every pull request`
- `feat(shared): Zod schemas for card, scan, valuation and card event`
- `feat(infra): SST app with a staging stage`
- `feat(db): first migration with cards, scans and card_events`
- `feat(db): customers, grading runs and pregrades tables, and card_valuations as an add-only table`
- `feat(auth): customer and staff logins with Cognito, as the proposal describes`
- `feat(api): Hono API with a health route`
- `feat(obs): trace ID on every request, JSON logs, reference codes`
- `feat(db): model_calls and model_corrections tables`
- `feat(db): card_live and account_live tables, with a version on every row and a change counter per account`
- `feat(db): outbox table, written in the same transaction as every card_live and account_live change`
- `feat(import): spreadsheet import into the database, with a reconciliation report and a list of cards that went missing since the last file`
- `ci: preview deploy per pull request and staging deploy on merge`

### Milestone 2: one card, end to end

- `feat(capture): pre-signed upload straight to S3, checksum recorded, resize worker reads the full-size JPEG`
- `feat(identify): worker with model tiers, a cutoff per model, retry, fallback provider and spend limits`
- `feat(review): staff queue for uncertain cards, corrections saved as new rows`
- `feat(pricing): sales table with a source tag on every sale`
- `feat(pricing): PricingSource interface and the first licensed feed adapter` (starts once a feed is signed. Until then the pipeline is tested with staff-entered sales)
- `feat(pricing): match sales to cards on exact identity fields, send the rest to staff review, value is the median of recent comps`
- `feat(pricing): My CC's own sales recorded as a pricing source`
- `feat(pricing): rework only the cards a new sale touches, and write the result to card_live`
- `feat(live): spike to confirm both Cognito pools and a WAF web ACL work on one Event API`
- `feat(live): LiveChannel interface and the AppSync Events adapter`
- `feat(live): publish after commit, a one-minute sweeper for unsent outbox rows, one channel per account and one for staff`
- `feat(live): subscribe rule, so a collector can only listen to their own account and only staff can listen to the staff channel`
- `feat(live): "changes since" endpoint, so a screen catches up after a dropped connection`
- `feat(portal): card page reading real data, with Recorded, Market now and the sales behind them`
- `feat(portal): updates in place, the Live marker and the reconnecting message`
- `feat(obs): save-to-screen delay metric, dashboard and alarm`
- `feat(ai): background guesses for grade and value on every card, recorded and never shown`
- `feat(ai): link each guess to the real answer when it arrives, with a scoreboard per model`
- `feat(train): export confirmed cards and corrections as a training set, with the test cards held out`
- `ci: eval gate that blocks a prompt or model change if accuracy drops by more than the margin`
- `ci: two-browser test that a change made in one appears in the other, and that nothing is missed after a dropped connection`

### Milestone 3: widen

- `feat(grading): grade-or-sell calculator showing the value at each grade in the pregrade range`
- `feat(pricing): fee and shipping code shared by quotes, the calculator and Net if sold`
- `feat(billing): bank transfer as the default for vault plans and larger invoices, marked paid only when the money lands`
- `docs(billing): cost of running monthly billing ourselves against the Stripe Billing and Invoicing fees, for the owner to decide`
- `feat(portal): add If graded and Net if sold to the card page`
- `feat(portal): add Trend to the card page, each window shown only when the card has that much dated history`
- `feat(grading): run builder, packing list, cert lookup on return`
- `feat(grading): log pregrade against the PSA result for the grade model`
- `feat(listing): eBay listing drafts from the card record`
- `feat(listing): auto-publish under a value limit, one tap above it`
- `feat(pricing): asking prices from eBay's listing search, stored apart from sales`
- `feat(pricing): web collector for sites whose terms allow it, with the terms check saved for each site`
- `feat(pricing): count a sale once across sources, set outliers aside, and weight recent sales higher`
- `feat(listing): price suggestions that follow the market, inside the limits the collector approved`
- `feat(capture): surface maps computed from the low-angle shots, and where that job runs`
- `feat(portal): collection totals and the activity feed, read from account_live`
- `feat(staff): live intake and grading boards`
- `feat(ingest): phone photos from the staff app, with a retake prompt when quality is low`
- `feat(train): first trained identifier, shipped only under the ship rule`

## CI and CD

What runs today in this repo, all at the same time on every pull request and every push to main:

| Job | What it catches |
|---|---|
| Links, data and scans | A page pointing at a file that is gone, a ledger that no longer parses, a card that lost its scan |
| JavaScript syntax | A script that will not load |
| Pages load | A page or data file that does not return |
| Claude review | Bugs and risky changes a person might miss |
| Claude look | Things that look or behave broken in a real browser, on desktop and phone sizes |

What gets added in the product repo, in the same pattern:

- On every pull request: lint, typecheck, unit tests, migration check, a preview deploy with its own URL, browser tests against that preview, the AI review and the AI browser look.
- The eval gate runs when prompts, identification code, `models.config.ts` or the image copy settings change. It also runs once a week against the live config, to catch a change on the provider's side.
- Also on every pull request, the live test. Two browsers open the same card. One warm-up change is made and thrown away, because a fresh preview can start slowly. Then one browser makes a change, and the other must show it within 5 seconds. A second run closes only the live connection in one browser, makes a change in the other, and reopens the connection. The first browser must make the "changes since" call and show the change. The test checks for that call by name, because the 30-second check could otherwise hide a broken catch-up.
- On merge to main: deploy to staging, then smoke tests and the page speed check. The 2-second target is a 95 in 100 number, so it is measured on staging over many changes and not on a single run.
- To production: a tagged release with one manual approval.

Turn on branch protection for main so nothing merges unless these checks pass. This is what makes several Claude sessions working at once safe. Each session works on its own branch, and a session cannot break main without a check going red first.

## AI reviewer

The review workflow uses Anthropic's official GitHub action with its code review plugin. It is already in this repo and stays off until one secret exists. To turn it on:

1. Open Claude Code in this repo and run `/install-github-app`. It installs the Claude GitHub app and saves the secret for you.
2. Or do it by hand: install the app at https://github.com/apps/claude, run `claude setup-token`, then `gh secret set CLAUDE_CODE_OAUTH_TOKEN`.

The token ties reviews to one person's Claude subscription. Once more than one person commits, switch the workflow to an API key from the Claude Console.

CodeRabbit is the other easy option. It installs as a GitHub app with no workflow file and reviews public repos for free. Full reviews on private repos need a paid seat. Running both on the same pull requests mostly produces duplicate comments, so pick one.

## AI browser look

The second AI workflow, Claude look, has a model open the site in a real browser on every pull request that changes the site. It looks at each page at desktop and phone size, scrolls through it, tries the main buttons, and leaves one comment listing anything a visitor would see as broken. The screenshots it took are saved with the run for 14 days.

It is advice and does not block a merge. A model's opinion can change from run to run, so the fixed checks in the CI workflow stay the gate. The model can only drive the browser and write its report. It has no shell and no GitHub access, so nothing on a page can talk it into changing the repo.

It uses the same secret as the reviewer and stays off until that secret exists. In the product repo the same job points at the preview deploy for the pull request and signs in with a test account.

## Rules for parallel sessions

- One branch and one feature per session.
- Shared rules live in a `CLAUDE.md` file at the repo root, so every session follows the same conventions.
- Schema changes go through one session at a time. Two sessions writing migrations will collide.
- A pull request merges only when CI is green and the review has no open blocking comment.
