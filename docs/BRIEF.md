# My Collector Concierge: Developer Brief

My Collector Concierge (My CC) is a trading-card concierge business. Collectors ship us boxes of cards (sports, Pokémon, Disney and non-sport). We inventory and price the cards, check their condition, send selected cards to professional graders, store cards in our vault, return cards, consign cards for sale on eBay and Fanatics Collect, and make engraved display slabs. Customers approve a quote before we do any paid work.

**What exists today.** We have an approved public website design and a collector portal prototype. The prototype is front end only. It has no server, database, logins or payments, and all of its data comes from one static JSON file. The code and design are at https://github.com/Sixteen1-6/my-collector-concierge, and a live demo runs on GitHub Pages at https://sixteen1-6.github.io/my-collector-concierge/.

**What we want from a development partner.** We want one company to take over the website and portal, keep the approved design, build the real backend, staff tools and integrations, and then host and support the product. My CC must own all of the code, the accounts and the data.

**How to respond.** Read the "About My CC and this project" section first. Every topic below is numbered T1 to T20, and every vendor question is numbered Q1 to Q121 across the whole document. Answer by question number, in the format set out in "Proposal format" near the end. Send all questions to the single contact named in that section.

## At a glance

| Item | Figure |
|---|---|
| Cards in the real sample inventory | 7,964 |
| Recorded value of the sample | About $430,000 |
| Cards in grading | 335 cards in 12 PSA and BGS grading runs |
| Cards vaulted | 38 |
| Cards waiting for a customer decision | 7,591 |
| Categories in the sample | Baseball 6,471, Football 1,134, Basketball 171, Non-sport 171, Wrestling 17 |
| Sample records with no inventory number | 99 |
| Cards with front and back scans in the prototype | About 90 |
| Prototype data file | One JSON file, about 1.3 MB |
| Prototype front end | One HTML page, inline CSS, plain JavaScript, no framework or build step |
| Portal tabs in the prototype | Overview, Collection (gallery and ledger), Submissions, Requests, Billing |

## About My CC and this project

### What My CC does

1. **Intake.** A collector ships a box of cards to My CC.
2. **Inventory and pricing.** We give selected cards an inventory number, scan the front and back, and record a market price from pricing software.
3. **Pregrade.** For cards that may be worth grading, we check centering, corners, edges and surface, and record an estimated grade such as "9 or 10".
4. **Grading.** With the customer's approval, we send cards to PSA, BGS, SGC or CGC in grading runs, track each run through its stages, and record the final grade and cert number.
5. **Vault.** Customers with a vault membership store cards with us.
6. **Returns.** We ship cards back on request.
7. **Consignment.** We sell cards for customers on eBay and Fanatics Collect and pay out the proceeds.
8. **Display slabs.** We make engraved aluminum display slabs. They are display only, not a grading product.

The rule that runs through everything: **no paid work starts until the customer approves a quote.**

### Price list

This is the only place in this brief where prices are stated. Every other section refers to this table. All prices must be stored as settings My CC can change without a developer.

| Service | Price | Notes |
|---|---|---|
| Inventory and pricing | $2 per card | Front and back scans, inventory number, market price from pricing software |
| Condition check and pregrade | $10 per card | Centering, corners, edges, surface, estimated grade. See business rule B6. |
| Grading submission (PSA, BGS, SGC, CGC) | My CC fee of $25, $35, $65 or $125 per card, banded by card value, plus grader fees passed through at cost | No gem-mint fee. Band thresholds: business rule B1. |
| Vault: Bronze | $29 | Up to 200 cards. Billing period: business rule B3. |
| Vault: Silver | $99 | Up to 1,000 cards |
| Vault: Gold | $249 | Up to 2,000 cards |
| Vault: Diamond | $499 | Up to 4,000 cards |
| Vault labor discount | 5% to 20% off labor, by tier | Which percentage goes with which tier, and which services count as labor: business rule B2 |
| Extra vault space | $30 per 200 cards | Billing period: business rule B3 |
| Returns | $5 per shipment plus $0.25 per card | |
| Consignment (eBay, Fanatics Collect) | 10% of the sale price, $10 minimum | Per card or per sale: business rule B5. Other deductions: business rule B4. |
| Display slab | $99 | Engraved aluminum, display only |

### Business rules JB must fill in

Vendors cannot build billing correctly without these values. B1 to B6 come from the approved website. My CC will fill in the rest before this brief is sent. If any value is still blank when you receive it, state in your proposal the assumption you priced.

| ID | Rule | My CC's answer |
|---|---|---|
| B1 | Card-value thresholds for the $25 / $35 / $65 / $125 grading fee bands | Value agreed at intake: up to $1,000 is $25; $1,000 to $2,500 is $35; $2,500 to $10,000 is $65; over $10,000 is $125. |
| B2 | Labor discount percentage for Bronze, Silver, Gold and Diamond, and which services count as "labor" | Bronze 5%, Silver 10%, Gold 15%, Diamond 20%. Labor means My CC fees for inventory, condition checks and grading prep. Grader fees, postage, insurance and taxes are never discounted. Display slabs have fixed member prices ($94, $89, $79, $74) that do not stack with the discount. |
| B3 | Whether vault tier prices and the $30 extra-space charge are monthly or annual | Monthly. Extra space is $30 per 200 cards a month, in whole 200-card blocks. Members can change or cancel any month. |
| B4 | Any consignment deductions besides My CC's 10% and marketplace fees (for example shipping or photography) | 10% is on the item sale price, excluding tax and shipping. Marketplace fees pass through separately. [JB to confirm any other deductions] |
| B5 | Whether the $10 consignment minimum applies per card or per sale | Per sold card. |
| B6 | Whether the $10 pregrade is charged in addition to the $2 inventory fee for the same card | Yes, it is a separate $10 service. It is included at no extra charge when the card is sent for grading. |
| B7 | Existing scans: how many exist today, where the originals are stored (local drive, scanner software, cloud), file format, resolution, and how files are named | [JB to fill in] |
| B8 | The market pricing tool My CC uses today | [JB to fill in] |
| B9 | Current intake steps and equipment (scanner model, how scan files are named and matched to cards) | [JB to fill in] |
| B10 | Largest expected single-customer collection | [JB to fill in. Planning default: 25,000 cards] |
| B11 | Which card-history events customers can see (the rest are staff only) | [JB to fill in] |
| B12 | What happens when a customer closes their account: cards still in My CC's custody, open invoices, pending consignment payouts | [JB to fill in] |
| B13 | Whether iPhone and Android apps are in scope or an optional add-on | Optional add-on, priced separately (see T4) |
| B14 | Accounting system: QuickBooks or Xero | [JB to fill in] |
| B15 | Vault capacity warning level (default: warn at 90% of the tier limit, editable in admin) | [JB to confirm] |

### Planning sizes

Use these sizes everywhere this brief asks for performance targets, storage estimates or running costs.

| Planning point | Cards | Card scan images (front and back) |
|---|---|---|
| A: today | 8,000 | 16,000 |
| B: growth | 40,000 | 80,000 |
| C: three-year planning | 100,000 | 200,000 |
| Single-account performance test | 25,000 cards in one customer account (see B10) | 50,000 |

Add slab photos after grading on top of these image counts and state your assumption.

### Scope and phases

Each requirement in this brief carries a phase tag: **[P0]** discovery, **[P1]** first launch, **[P2]** integrations, **[P3]** growth, or **[Optional]** priced separately. Quote to these tags. If you would move something to a different phase, say so in Q98.

| Area | Phase |
|---|---|
| Discovery, code review, technical plan, fixed Phase 1 scope | P0 |
| Customer accounts and login, staff roles, audit log | P1 |
| Staff admin tool: intake, scans, pregrades, quotes, grading runs, vault, returns | P1 |
| Customer portal with every prototype tab working on real data | P1 |
| Quotes and approval, card payments, invoices, vault memberships | P1 |
| Service requests per card, including display slab and consignment requests (handled by staff) | P1 |
| Grading run stages updated by staff, cert numbers and grades entered by staff | P1 |
| Email notifications | P1 |
| Data migration of the sample inventory | P1 |
| CSV exports, terms acceptance records, automated fee tests | P1 |
| Fee transparency on invoices, vault capacity meter (differentiating features 5 and 6) | P1 |
| PSA cert lookup that fills in grade data | P2 |
| eBay listing, orders, tracking and fees | P2 |
| Fanatics Collect tracking (manual or file import) and consignment payout statements | P2 |
| QuickBooks or Xero sync (Phase 1 uses CSV export only) | P2 |
| Shipping label, rate and tracking integration | P2 |
| Market pricing feed (Phase 1 uses staff entry and file import) | P2 |
| iPhone and Android apps with push notifications | Optional (P2 if chosen) |
| Staff reporting, value history, display slab engraving workflow | P3 |
| Remaining differentiating features (see T6) | P3 unless you propose earlier |
| BGS, SGC and CGC cert lookups | P3 |

### Out of scope for the vendor

- Writing legal text. My CC's lawyer supplies the Terms of Service, consignment agreement and privacy policy. You build the system that shows and records them (T15).
- Choosing insurance. That is a business decision for My CC and its broker. You build the records and checks (T11).
- Grader dealer or submitter status. My CC handles this directly with each grader (T8).
- Postage, carrier charges, grader fees and data subscriptions themselves. List them as third-party costs only.
- A public marketplace run by My CC. Sales go through eBay and Fanatics Collect.
- Scanners and other hardware.

### Budget

This brief does not state a budget. Please propose a Phase 1 that a small business can launch on, and price every other phase and optional item as a separate line so My CC can choose what to defer.

### Contact

All questions and proposals go to [contact name] at [email]. See "Proposal format" for dates.

### Glossary

| Term | Meaning at My CC |
|---|---|
| Raw card | A card that has not been graded |
| Inventory number | My CC's unique ID for a card, assigned at intake |
| Pregrade | My CC's condition check before grading: centering, corners, edges, surface and an estimated grade such as "9 or 10" |
| Grader | A grading company: PSA, BGS (Beckett), SGC or CGC |
| Grading run | A batch of cards sent to one grader at one service level, tracked through stages |
| Slab | The sealed plastic holder a grader returns a graded card in |
| Cert number | The grader's unique certificate number printed on the slab |
| Declared value | The value stated for a card on a grader submission or a shipment, used for fees and insurance |
| Quote | A list of proposed services and prices the customer must approve before paid work starts |
| Vault tier | A storage membership: Bronze, Silver, Gold or Diamond |
| Consignment | My CC sells a customer's card on eBay or Fanatics Collect and pays the customer the proceeds less fees |
| Display slab | An engraved aluminum display piece, display only |

---

## Website, Portal and Mobile App

The prototype shows exactly how the portal should look and behave, but every card, grading run and bill is read from one static file in the browser. This section asks you to take that work over, keep it looking and working the way JB approved it, build the real backend and database behind it, optionally ship iPhone and Android apps on the same backend, and add features that set My CC apart from larger vault and marketplace platforms.

What the prototype is today (from the delivered files):

- One HTML page with inline CSS and plain JavaScript. No framework, no build step.
- Fonts: Newsreader (serif) and Geist (sans), loaded from Google Fonts.
- Colors defined as named tokens: dark bottle greens, warm paper whites, a brass accent, and status colors for ok, info, warning and critical.
- Data: one JSON file of about 1.3 MB holding 7,964 card records with short field codes (name, year, set, parallel, category, value, status, inventory number, grader, batch label, pregrade estimate, notes, submit date, scan flags).
- Card scans: front and back WebP images for about 90 cards. How many original scans exist outside the prototype is business rule B7.
- Portal tabs: Overview, Collection (gallery view and ledger view), Submissions, Requests and Billing.

### T1. Taking over development of the existing website and collector portal

**What My CC needs**

My CC needs one development partner to own the website and portal from here on: understand what was built, turn the prototype into production software, and keep it running after launch. JB is not a developer. My CC needs a partner who explains decisions in plain terms, and My CC must own everything that gets built so it is never locked in. Ownership requirements are in T14.

**Requirements and acceptance criteria**

- [P0] Discovery first: a short written review of the existing code and design, listing what you will keep, what you will rebuild, and why.
- [P1] Environments: a separate staging environment and a production environment. JB reviews every change on staging before it goes live.
- [P1] Handover readiness: a README and setup guide good enough that a different developer could run the project locally and deploy it without calling you.
- [All] Change process: every change goes through a tracked ticket and a code review, and every release has notes JB can read.
- [All] Support after launch follows the single severity table in T19.
- [P1] Acceptance: the public website and the portal run on My CC's production hosting, on My CC's domain, with every page and tab in the approved prototype working against real data.

**Questions your proposal must answer**

- **Q1.** Have you taken over a project started by someone else? Describe one and what you found.
- **Q2.** Will you keep the existing plain HTML and JavaScript front end, move it to a framework, or rebuild it? Explain the tradeoff in plain language, including the effect on cost and on future developers.
- **Q3.** How will you confirm, before writing code, that you understand every screen and behavior in the prototype?

### T2. Preserving the approved branding, design and functionality

**What My CC needs**

The website design and the portal look are approved. JB does not want a vendor to "refresh" them. The production site, the portal and any mobile apps must look like the same brand: the same fonts, colors, spacing, card imagery and tone. Every feature that works in the prototype must still work, with real data behind it.

**Requirements and acceptance criteria**

- [P1] Visual match: production pages match the approved prototype at desktop, tablet and phone widths. Any deviation is listed and approved by JB before release.
- [P1] Design tokens: the existing color and type tokens (Newsreader, Geist, the green, paper and brass palette, and the four status colors) become one shared design system for the website, the portal and, if chosen, the apps.
- [P1] Feature parity checklist, at minimum:
  - Overview: collection totals, value, cards in grading, vaulted count, items needing a decision.
  - Collection: search and filter across all cards, gallery view with front and back scans, ledger (table) view, card detail with inventory number, set, parallel, year, category, market value and status.
  - Submissions: grading runs per grader (PSA, BGS, SGC, CGC) with stages, cards in each run, submit dates and results.
  - Quote approval: the customer approves or declines a quote before any paid work starts.
  - Service requests: the customer can request a service on a specific card (pricing, pregrade, grading, vault, return, consignment, display slab). In Phase 1 staff fulfill these requests by hand and bill them through a quote.
  - Vault plan and billing: current tier, space used against the tier limit, charges and invoices.
- [P1] Every price shown matches the price list in "About My CC and this project" and comes from the shared settings described in T5.
- [P1] Performance: meets the page-speed targets in the T12 table, including the single-account performance test size.
- [P1] Accessibility: meets WCAG 2.2 Level AA, the current W3C Recommendation, published 12 December 2024 (https://www.w3.org/TR/WCAG22/), on the website and portal. If you test against a different version, say which and why.
- [P1] Acceptance: JB signs off a side-by-side review of each prototype screen against the production screen.

**Questions your proposal must answer**

- **Q4.** How will you capture the approved design as a reusable design system across the web and, if chosen, iPhone and Android?
- **Q5.** How will you prove visual and functional parity before launch (checklist, screenshots, recorded walkthrough)?
- **Q6.** The prototype loads all 7,964 cards into the browser at once. How will search, filtering and the gallery work with server-side data at the single-account performance test size?
- **Q7.** How will you handle card scan images in the interface (thumbnails, zoom, front and back flip, fast loading on phones)?
- **Q8.** What accessibility testing do you do, which WCAG version do you test against, and is it included in your quote?
- **Q9.** Where you believe a part of the approved design will not work in production, how will you raise it and get JB's decision?

### T3. Completing the backend technology and database

**What My CC needs**

The prototype has no server, no database, no logins, no staff tools and no payments. My CC needs a real backend that holds every customer, box, card, scan, quote, grading run, vault membership, consignment and invoice. Just as important, My CC staff need an internal admin tool to do the work: receive boxes, enter and price cards, upload scans, record pregrades, build grading runs, update stages and post results. Without that staff side, the customer portal has nothing to show.

**Requirements and acceptance criteria**

- [P1] Core records the database must hold, at minimum:
  - Customers and their addresses, contact details and vault tier.
  - Inbound shipments (boxes) and what was in each.
  - Cards: unique My CC inventory number, player or character, year, set, parallel, category (sports, Pokémon, Disney, non-sport and others), front and back scans, market value with its source and the date it was priced, status, and location (on hand, at grader, vaulted, consigned, returned).
  - Pregrade reports: centering, corners, edges, surface, estimated grade, notes, who did it and when.
  - Quotes: line items, totals, sent date, approved or declined, by whom and when. No paid work can be marked started without an approved quote.
  - Grading runs: grader, service level, cards included, stages, dates, grader fees at cost, My CC fee band, final grades and cert numbers.
  - Vault memberships: tier, card limit, extra space purchased, cards stored, labor discount applied.
  - Consignments [P2]: channel (eBay or Fanatics Collect), listing status, sale price, My CC commission, payout.
  - Returns and display slab orders.
  - Invoices, payments and refunds.
  - Service requests and messages per card.
  - An audit log of every change to value, grade, status and price (details in T13).
- [P1] Roles and permissions follow the roles table in T13.
- [P1] Staff admin tool: bulk intake (enter or import a box of cards), bulk scan upload matched to inventory numbers, bulk status changes for a whole grading run, and quote creation from selected cards.
- [P1] Intake throughput: you state a measured target in minutes per 100 cards, including front and back scans, based on My CC's current steps and equipment (business rule B9). The target is tested at acceptance with real cards.
- [P1] Data migration: the 7,964 records in the current JSON file are imported with no loss. Known clean-up items: 99 records have no inventory number, and grading batch labels are free text (for example "JB PSA 7 24 26") that must become proper grading-run records. You report every record you could not import cleanly. Existing scans are migrated as described in B7.
- [P1] Payments go through a payment processor (T9). My CC's systems never store full card numbers.
- [P1] Email notifications when a quote is ready, a grading stage changes, grades are back, a payment fails or a bill is due, and a return ships. [P2] when a consignment sells. Push notifications only if apps are chosen (T4).
- [P1] Exports: JB can export customers, cards and invoices to CSV at any time. The full data export is in T14.
- [P1] Security, backups and monitoring follow T12.
- [P1] Acceptance: a My CC staff member takes a real box from intake to an approved quote, payment, a grading run, posted grades and a return, and the customer sees each step in the portal, without developer involvement and without a spreadsheet.

**Questions your proposal must answer**

- **Q10.** What backend language, framework and database do you propose, and why are they a good fit for a small business that must keep costs and maintenance low? (Hosting providers are asked in Q66.)
- **Q11.** Show your proposed data model for the records listed above. What would you add or change?
- **Q12.** Describe the staff admin tool screens you will build. What intake throughput, in minutes per 100 cards including scans, will you commit to, and what does that assume about My CC's equipment and file naming?
- **Q13.** How will you migrate the existing 7,964 records and the existing scans, how will you prove the import is complete and correct (record counts, total value, runs, vaulted cards, scan links), and what will you do with records missing inventory numbers or with free-text batch labels?

### T4. Optional: iPhone and Android apps (price separately)

My CC has not decided whether native apps are needed at launch. Price this topic as a separate optional item. If My CC chooses it, it becomes part of Phase 2. All requirements below apply only if the apps are chosen.

**What My CC needs**

Collectors check their cards on their phones. If apps are built, they give customers the portal on the go: see their collection with scans, follow grading runs, approve quotes, request services and manage their vault plan, with push notifications when something needs them. Staff might also benefit from a phone-based intake helper (photograph cards, look up cert numbers) if it can be done affordably.

**Requirements and acceptance criteria (if chosen)**

- [Optional] Platforms: one app for iPhone (App Store) and one for Android (Google Play), using the same backend and design system as the web portal.
- [Optional] Customer features: sign in, overview, collection search with front and back scans, card detail, grading run tracking with stages, quote approve and decline, service requests per card, vault plan and space used, invoices and payment, notifications.
- [Optional] Push notifications for quote ready, stage change, grades posted, consignment sold and payment due. Customers choose which ones they get.
- [Optional] Real app behavior, not a wrapped website. Apple's review guidelines say an app "should include features, content, and UI that elevate it beyond a repackaged website" (Guideline 4.2, https://developer.apple.com/app-store/review/guidelines/). The app must handle a weak or missing connection gracefully: show the last loaded collection, clear messages, no browser error pages.
- [Optional] Account deletion: Apple's guidelines require that an app supporting account creation also offer account deletion in the app (Guideline 5.1.1(v), https://developer.apple.com/app-store/review/guidelines/). The app follows My CC's account-closure rules (business rule B12).
- [Optional] Payments: Apple Guideline 3.1.3(e) says apps that sell physical goods or services used outside the app must use payment methods other than in-app purchase (https://developer.apple.com/app-store/review/guidelines/). You confirm how this applies to My CC's services and what Google Play's equivalent policy says.
- [Optional] Store accounts owned by My CC. Apple's organization enrollment requires a legal entity and a D-U-N-S Number and costs 99 USD per membership year (https://developer.apple.com/programs/enroll/). Google Play organization accounts also require a D-U-N-S Number, which Google says is free from Dun & Bradstreet and can take up to 30 days (https://support.google.com/googleplay/android-developer/answer/13628312?hl=en). You guide JB through both enrollments early.
- [Optional] Store listings: you prepare screenshots, descriptions and privacy disclosures, and you handle submission and any review rejections.
- [Optional, priced separately again] Staff mode: camera capture of front and back scans tied to an inventory number, and lookup of graded cards by cert number.
- [Optional] Acceptance: both apps are approved and live in the US stores under My CC's name, and a test customer can complete every feature above on a current iPhone and a current Android phone.

**Questions your proposal must answer**

- **Q14.** Would you build native apps (Swift and Kotlin), one cross-platform codebase, or another approach? Explain the effect on cost, speed, app quality and future maintenance.
- **Q15.** How much code and design can the apps share with the web portal?
- **Q16.** How will you make sure the apps pass Apple Guideline 4.2 and Google Play review the first time? Have you had an app rejected, and what did you do?
- **Q17.** Which features will work offline or on a weak connection?
- **Q18.** How will push notifications be built, and how can JB send an announcement to all customers?
- **Q19.** Is the staff camera intake mode feasible, and what would it add to the price?
- **Q20.** Confirm how Apple Guideline 3.1.3(e) applies to grading, storage, returns and consignment, and what Google Play's equivalent payment policy requires.
- **Q21.** What minimum iOS and Android versions will you support, and what is your process and cost each year to keep the apps working on new OS versions?

### T5. Keeping the website, portal and apps synchronized

**What My CC needs**

A customer might approve a quote on the website, then open the portal on a phone and expect it to say "Approved". A staff member might move 120 cards into "At PSA", and every customer should see it on whatever device they use. My CC needs one source of truth so every screen shows the same data, prices and statuses.

**Requirements and acceptance criteria**

- [P1] One backend, one database. The web portal, the staff admin tool and any apps all read and write through the same API. No device keeps its own separate copy of the truth.
- [P1] Freshness: a change made by staff or by the customer appears on every other open screen within one minute (or a target you propose and justify), and immediately after a manual refresh.
- [P1] Safe approvals: approving a quote or paying an invoice twice (double click, two devices, poor connection) never charges twice or creates duplicate work. The second attempt shows the existing result.
- [P1] Conflicts: if two people change the same record, the system follows a clear rule (for example, the server decides and the other user is told), and the audit log records both attempts.
- [P1] Shared content: prices, vault tiers, service descriptions and legal text are stored once and shown on the website, portal and any apps from that one place. Changing a price in the admin tool changes it everywhere. Approved quotes keep the prices they were approved at.
- [P1] Versioning: the API is versioned so that an older client keeps working or is asked to update with a clear message.
- [All] Release coordination: a backend change never breaks a live client.
- [P1] Acceptance: the sync test in T16.

**Questions your proposal must answer**

- **Q22.** Describe your architecture for keeping the website, portal, admin tool and any apps in sync. Use plain language and a simple diagram.
- **Q23.** Will updates arrive live (pushed) or on refresh? What does each option cost?
- **Q24.** How do you prevent double charges and duplicate approvals?
- **Q25.** How will you handle clients running an older version (an open browser tab, or an old app version if apps are chosen) after an API change?
- **Q26.** How will prices, tiers, service pages and legal text be managed once and shown everywhere? Will you use a content management system, and can JB edit prices and content without a developer?

### T6. Developing features that distinguish My CC from competing platforms

**What My CC needs**

Large platforms already offer vaults, collection tracking and selling. My CC cannot outspend them, so its software must make visible what My CC does that they do not: personal, card-by-card handling of raw collections, an honest pregrade before money is spent on grading, a choice of graders, and approval before any paid work. The features below are proposals for you to cost and comment on, not fixed scope.

**What the competing platforms offer (public sources)**

| Platform | What it offers | Source |
|---|---|---|
| PSA app and PSA Vault | Build and track PSA grading submissions, grade reveal, track graded and ungraded cards in folders with public share links, portfolio value over time, store eligible cards in the PSA Vault and list them on eBay | https://apps.apple.com/us/app/id996239729 |
| PSA Vault fees | Insured, climate-controlled storage. Selling on eBay from the vault carries one consignment fee tied to the final sale price. Withdrawal fees apply. | https://psacard.com/info/psa-vault |
| Fanatics Collect vault | Keeping an item in the vault is free, a fulfillment fee applies if it is shipped out, and sellers can list from the vault at any time. The seller fee is 6% or 12% depending on price against market value per Card Ladder. | https://support.fanaticscollect.com/en_us/buy-now-fees-ry33QCXaxe.md |
| Card Ladder | Pro tier adds collection tracking with value estimates, all-time sales history and price alerts. Pro is $19.99 monthly or $199.99 yearly in the US App Store. Card Ladder was acquired by Collectors Universe, PSA's parent, in 2021. | https://apps.apple.com/us/app/card-ladder/id1541535971 and https://sportscollectorsdigest.com/news/collectors-universe-acquires-card-ladder-card-grading-values |
| Alt | No ongoing storage fees, $5 intake for raw cards, daily Alt Value pricing. Since December 2025 collectors can no longer manually upload non-vaulted items. | https://support.alt.xyz/en/articles/9213538-vault-fees and https://support.alt.xyz/en/articles/9213547-collection-management |
| Courtyard | Graded cards are vaulted, added to a digital wallet for trading, and redeemable for the physical card. Its help center says vaulting is temporarily paused and new shipments are returned. | https://intercom.help/courtyardio/en/articles/11006165-vault-your-cards |
| Loupe | Live-streamed breaks and auctions, group breaks, and singles through Loupe Market. The App Store listing does not describe a collection tracker or vault. | https://apps.apple.com/us/app/id1511419920 |

**Where My CC is different**

In the sources above, each platform is built around one thing: one grader (PSA), one marketplace (Fanatics Collect, Loupe), one vault and pricing engine (Alt), or tokenized trading (Courtyard). Card Ladder tracks values but does not handle the cards. None of them describes taking a collector's unsorted raw box, inventorying every card with scans, pregrading the ones worth it, and letting the collector approve each step. That is what My CC does, and the software should show it.

**Proposed differentiating features**

1. [P3] **Box-to-card timeline.** Every inbound box gets a tracking page: received, being inventoried, X of Y cards priced, quote ready. Each card links back to the box it came from.
2. [P3] **Grade-or-not decision view.** For each pregraded card, show the current raw value, the pregrade estimate, the market value at the estimated grade, and the full cost to grade (My CC fee band plus grader fee at cost). Values show their source and date and are labeled as estimates, not promises.
3. [P3] **Pregrade track record.** After grades come back, compare My CC's pregrade estimate with the actual grade, card by card and in total. Customers see their own results. My CC may publish an overall accuracy figure if JB chooses.
4. [P3] **Grader-neutral submissions.** One screen to compare and choose PSA, BGS, SGC or CGC for a card or group of cards, with every run tracked in the same stage view.
5. [P1] **Line-by-line fee transparency.** Every quote and invoice shows My CC's fee separately from grader fees passed through at cost, and states that there is no gem-mint fee. Vault members see the labor discount on each line.
6. [P1] **Vault capacity meter and smart upgrade.** Show cards stored against the tier limit, warn at the level set in business rule B15, and offer either extra space or the next tier, whichever costs less for that customer.
7. [P2] **One consignment view across eBay and Fanatics Collect.** A single list of each card for sale, its channel, listing status, sale price, My CC's commission and the payout. Depends on what each marketplace allows (T10).
8. [P3] **Display slab ordering from the card page.** Order a display slab from a card's detail page with a preview using the card's scan and inventory details, clearly labeled display only.
9. [P3] **Collection report for insurance or estate planning.** A printable or PDF report with scans, inventory numbers, values and value dates. My CC does not state that any insurer accepts it.
10. [P1] **All categories treated equally.** Sports, Pokémon, Disney, wrestling and other non-sport cards share the same tools, search and pricing display. The sample already holds 171 non-sport and 17 wrestling cards.

**Requirements and acceptance criteria**

- Each feature you quote is described with screens, the data it needs, and where that data comes from.
- Any feature that depends on a third party (grader data, market values, marketplace listings) states whether an official API or partner program exists, what access requires, and a fallback if it does not.
- Value estimates always show source and date and are labeled as estimates. Any pricing source used must be licensed for display to My CC's customers (T7).
- Acceptance per feature: a working demo on staging with real migrated data, signed off by JB.

**Questions your proposal must answer**

- **Q27.** Which of the ten features would you build in the first release, and which later? Give your reasoning.
- **Q28.** For each feature you quote, which third-party data does it need? Refer to your answers in T7, T8 and T10, and name any additional source you would use.
- **Q29.** How would you calculate and present the grade-or-not view so it is useful without promising an outcome?
- **Q30.** How would you build the pregrade track record so it is accurate and cannot be edited after grades are posted?
- **Q31.** What other differentiators do you see, based on your own knowledge of PSA Vault, Fanatics Collect, Alt, Courtyard, Loupe and Card Ladder?
- **Q32.** Which features carry the most risk of depending on a partner who may change terms, and how would you reduce that risk?
- **Q33.** How will you measure whether these features are used (analytics) while respecting customer privacy?

---

## Integrations

My CC's portal has to talk to outside systems for pricing, grading, money, marketplaces and shipping. This section lists each integration, what it has to do in My CC's business, what "done" looks like, and the questions your proposal must answer.

The third-party facts below come from My CC's web research in November 2026, with the source link next to each one. Third parties change their APIs, terms and programs often. Confirm anything your design depends on, and say in your proposal if what you find is different.

**Rules that apply to every integration**

- API keys, passwords and tokens are stored on the server only, never in the browser or the repository.
- Every outbound call and inbound webhook is logged with time, result, and the card, order or shipment it relates to.
- If a partner is down or rate-limited, the portal keeps working. Failed calls are retried, and staff see a clear "needs attention" queue instead of silent failures.
- Every value that comes from a partner (price, grade, tracking status, payout) records its source and the date it was fetched.
- Staff can enter or correct partner data by hand when the integration is unavailable or does not exist yet.

### T7. Market pricing data

**What My CC needs**

My CC's $2 per card inventory service includes a market price from pricing software. The tool My CC uses today is business rule B8. Prices are used to:

- Show each collector a recorded value per card and for the whole collection.
- Choose the grading fee band (business rule B1) and the declared value on grader submissions.
- Set declared value for shipping insurance.
- Suggest list prices and check comparable sales for consignment.
- Refresh values on a schedule so vaulted and consigned cards stay current.

**What My CC's research found**

- Card Ladder: My CC's research did not find a public Card Ladder API, developer program or published data-licensing terms. Its published pricing is for consumer Pro plans (https://www.cardladder.com/pricing). Card Ladder was bought by Collectors Universe, PSA's parent company, in December 2021 (https://sportscollectorsdigest.com/news/collectors-universe-acquires-card-ladder-card-grading-values).
- Fanatics Collect uses Card Ladder market value to set its Buy Now seller fee: 6% when a card is listed under 120% of market value (https://support.fanaticscollect.com/en_us/buy-now-fees-ry33QCXaxe.md). This suggests Card Ladder data is available to some business partners. The terms are not public.

**Other sources to consider**

- PriceCharting publishes a Prices API. Its page says API and CSV data are licensed for internal use only, that showing the data to third parties or in a service others use needs a commercial license and written permission, and that the data must be purged when the subscription ends (https://www.pricecharting.com/price-guide). Its sports card sister site SportsCardsPro publishes API and CSV documentation and requires a paid subscription for API access (https://sportscardspro.com/api-documentation).
- GemRate offers an API that looks up graded cards by grader and cert number, with separate population and image endpoints. Keys are issued on request, and quotas apply (https://docs.gemrate.com/api-reference/certs/cert-lookup.md).
- eBay's Marketplace Insights API returns sold-item history for up to 90 days, but it is a Limited Release API for approved developers only (https://www.developer.ebay.com/api-docs/buy/marketplace-insights/overview.html).
- Fallback: staff enter values by hand from the tool My CC subscribes to, or import them from a file if that tool's terms allow it. This is the Phase 1 method.

**Requirements and acceptance criteria**

- [P1] Each card stores the current value, the source, the date, the match (which card, grade and variant the price is for), and the value history.
- [P1] Staff can enter, import or override any value. An override records who made it, when and why.
- [P1] Grading fee bands and insurance values update when a card's value changes, but quotes a collector has already approved do not change.
- [P2] Pricing is built behind one "pricing source" layer so My CC can switch or combine providers without rebuilding the portal.
- [P2] Any pricing source shown to customers is licensed for that use, in writing.
- [P2] If a source is cancelled and its terms require purging, the system can remove that source's values and fall back to another source or to "not priced", without breaking screens or approved quotes.
- [P2] Cards the system cannot match with confidence go to a staff review queue. They are not priced automatically.
- [P2] A scheduled refresh can reprice the full inventory at planning point B within the provider's limits.
- [All] No scraping, and no use of data that breaks a provider's terms of service.

**Questions your proposal must answer**

- **Q34.** Have you integrated Card Ladder or another card pricing source before? Under what agreement, and what did it give you (per-card values, sales comps, history, bulk export)?
- **Q35.** Which source do you recommend for sports cards, Pokémon, Disney and non-sport cards? What does each cover well or poorly, and are we allowed under its terms to show its prices to our customers?
- **Q36.** How will you match My CC's inventory records to a provider's card catalog (year, set, number, player or character, parallel, grade), and what match rate do you expect?
- **Q37.** How often will values refresh, and how will you stay within the provider's rate limits and quotas?
- **Q38.** Who signs the data agreement and pays the data fees, My CC or your company? Are those fees in your price or separate?
- **Q39.** How will you handle cards no provider can price, such as rare parallels or low-volume non-sport cards?

### T8. PSA, with future support for other graders

**What My CC needs**

My CC sends cards to graders in runs. The sample has 335 cards in 12 PSA and BGS grading runs. The portal must:

- Group cards into a grading run with grader, service level, declared values, and the grader's fee for each card, passed through at cost.
- Track each run through its stages, from quote approved to shipped to grader, received, graded, shipped back, and returned to the collector or vault.
- When slabs come back, record the cert number and grade, check them against the grader, and show them to the collector.
- Compare the grade with My CC's pregrade estimate for internal quality tracking.
- Start with PSA, but use a data model that also fits BGS, SGC and CGC, so adding a grader is a configuration change and not a rebuild.

**What My CC's research found**

- PSA has a Public API. It needs a PSA account and uses OAuth 2 with the password grant (https://www.psacard.com/publicapi). The documentation says it currently offers cert verification for single lookups by cert number (`cert/GetByCertNumber/{certNumber}`) and is covered by the PSA API End User Agreement. The public documentation did not show submission, order-status or population methods, or pricing and call limits (https://www.psacard.com/publicapi/documentation).
- PSA submissions are made through its online Submission Center (https://www.psacard.com/Submissions). My CC's research found no PSA API or bulk file upload for creating submissions or tracking order status.
- PSA's terms say only dealers authorized by PSA may submit items on behalf of other people (https://www.psacard.com/termsandconditions). A separate PSA dealer agreement page appears to restrict submissions made for group submitters or for other dealers (https://www.psacard.com/termsandconditionsa). This is a business matter My CC is settling directly with PSA and the other graders before the grading workflow is designed. Your design should not assume any particular outcome.
- My CC's research found no official public cert-lookup API from Beckett (BGS), SGC or CGC. GemRate's third-party API covers cert lookups for PSA, Beckett, SGC and CGC (https://docs.gemrate.com/api-reference/certs/cert-lookup.md).

**Requirements and acceptance criteria**

- [P1] Staff can create a grading run, add approved cards, pick grader and service level, and print or export a packing list that matches the grader's submission. Acceptance test: staff build a 50-card run and export its packing list without retyping card data.
- [P1] The collector sees each card's stage in the portal, and the history of stage changes is kept.
- [P1] Staff enter cert numbers and grades by hand. Grader fees are entered at cost and shown separately from My CC's fee, with no markup.
- [P1] The data model has a grader table (name, service levels, fees, cert format, lookup method). Adding SGC, for example, needs no code changes for the basic workflow.
- [P1] Slab photos (front and back) can be attached after grading.
- [P2] Entering a PSA cert number fills in grade and card details from the PSA API. If the API data does not match the card on file, the card is flagged for review.
- [P3] Cert checks for BGS, SGC and CGC, by the method agreed in Q42.

**Questions your proposal must answer**

- **Q40.** Have you used the PSA Public API? What call limits apply, which terms in the PSA API End User Agreement affect how My CC can use it, and how will you handle PSA's password-grant login securely for a business account?
- **Q41.** Do you know of any PSA tool, program or dealer feature for submitting orders or reading order status by machine? If not, describe the staff workflow you will build instead.
- **Q42.** How will you support BGS, SGC and CGC cert checks: their websites by hand, a third party such as GemRate, or direct agreements? What does each option cost and what are its risks?
- **Q43.** Show the grading-run stage list you propose, and explain how staff and collectors see stage changes.
- **Q44.** How will the system handle a run where cards come back in a different order, with a different grade type (for example "Authentic"), or ungraded?

### T9. Accounting, billing, payments and collector payouts

**What My CC needs**

My CC charges for several services and pays money out to collectors. All prices are in the price list.

- **One-time charges after quote approval:** inventory and pricing, pregrade, grading (My CC fee plus grader fees at cost), returns and display slabs.
- **Vault memberships:** four tiers, extra space in 200-card blocks, and a labor discount by tier. The billing period is business rule B3. Do not assume monthly until My CC confirms.
- **Consignment payouts:** when a card sells on eBay or Fanatics Collect, My CC keeps its commission and pays the rest to the collector, less any deductions in business rule B4.
- **Accounting:** all of this has to land in My CC's books (business rule B14) without double entry.

No paid work starts until the collector approves a quote. The billing system has to follow that rule.

**What My CC's research found**

- Stripe Billing supports recurring subscriptions and metered usage (https://stripe.com/docs/billing/subscriptions/metered-billing). Stripe Tax can calculate sales tax on Stripe invoices (https://support.stripe.com/questions/understanding-stripe-tax-pricing). Stripe publishes its card pricing at https://stripe.com/pricing.
- Stripe Connect's "separate charges and transfers" model lets a platform move funds to connected accounts in amounts it chooses. Stripe recommends it only when the platform is responsible for connected accounts' negative balances (https://docs.stripe.com/connect/marketplace/tasks/accept-payment/separate-charges-and-transfers). Consignment sale money arrives from eBay or Fanatics Collect, not through a Stripe charge, so the funding of payouts needs explaining.
- Under Stripe Connect, whether Stripe or the platform files 1099-K forms depends on the connected account type and who controls pricing. The same Stripe page also lists 1099-NEC and 1099-MISC thresholds of $2,000 or more in payments (https://docs.stripe.com/connect/tax-reporting).
- The IRS says federal 1099-K reporting by third party settlement organizations is back to the old threshold of more than $20,000 and more than 200 transactions per payee per year, and notes some states have lower thresholds (https://www.irs.gov/newsroom/form-1099-k-faqs-general-information).
- eBay calculates, collects and remits sales tax for items shipped to buyers in all 50 states (https://developer.ebay.com/api-docs/sell/static/seller-accounts/tax-tables.html). Sales tax on My CC's own services varies by state and is a question for My CC's accountant.
- The QuickBooks Online Accounting API supports invoices, payments and refunds (https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api). The Xero Accounting API supports invoices, payments and bank transactions (https://developer.xero.com/documentation/api/accounting/banktransactions).

**Requirements and acceptance criteria**

- [P1] A quote shows every line item from the price list, with grader fees listed separately at cost. The collector approves or declines in the portal, and the approval is recorded as described in T15.
- [P1] After approval, the collector is charged or invoiced automatically. Card data is handled by a PCI-compliant processor through its hosted or tokenized checkout. My CC's servers never store card numbers.
- [P1] Vault plans bill on the period in business rule B3. Extra space is billed in 200-card blocks. The labor discount (business rule B2) is applied to eligible line items automatically. Upgrades, downgrades and failed payments behave in a documented way.
- [P1] Every fee amount, band and discount is set in admin settings, not hard-coded.
- [P1] Each collector has a ledger of every charge, credit and refund. [P2] Payouts are added to the same ledger.
- [P1] CSV export of invoices, payments and refunds for the accountant.
- [P2] Each consignment sale produces a payout statement: sale price, marketplace fees, My CC commission, other deductions and net payout. The formula is configurable.
- [P2] Payouts go to the collector's verified bank account. Collector tax details (such as a W-9) are collected before the first payout if My CC's accountant says that is required.
- [P2] Invoices, payments, refunds, fees and payouts sync to QuickBooks or Xero with the right accounts, and each record can be reconciled to its bank deposit.
- [P3] Reports for the accountant: revenue by service, grader fees passed through, vault revenue, consignment sales, and payouts by collector by year.

**Questions your proposal must answer**

- **Q45.** Which payment processor do you recommend for one-time quote payments and recurring vault memberships, and why? Show the fee impact on a typical quote and on each vault tier, and say what payment-card compliance work, if any, My CC itself would be responsible for under your design.
- **Q46.** How will you model vault tiers, extra-space blocks and tier labor discounts in that billing system?
- **Q47.** How do you propose to pay collectors their consignment proceeds when the money arrives from eBay and Fanatics Collect? If you propose Stripe Connect, which account type and charge model, and who carries negative-balance risk? If not, what instead?
- **Q48.** Under your payout design, who would file 1099 forms for collectors: My CC, the payment provider, or no one? List the questions My CC should take to its accountant, including which 1099 form, if any, applies to consignment payouts and at what threshold.
- **Q49.** How will you handle sales tax on My CC's own services: Stripe Tax, another tax service, or settings in the accounting system?
- **Q50.** QuickBooks or Xero: which do you recommend, what syncs (invoices, payments, payouts, fees), in which direction, and how often?
- **Q51.** How will refunds, disputes and chargebacks work, including a refund on a consigned card that has already paid out?
- **Q52.** What audit trail will show who approved each quote and who released each payout?

### T10. eBay and Fanatics Collect

**What My CC needs**

My CC consigns collectors' cards on eBay and Fanatics Collect. The portal must:

- Let a collector request consignment for a card and approve the terms (P1 as a service request, P2 as a full workflow).
- Create eBay listings from the card record (title, scans, item specifics, grade, cert number, price or auction settings) without retyping.
- Track each listing's status (draft, live, sold, unsold, ended) and show it to the collector.
- Pull in each sale (price, buyer shipping address, eBay fees, payout) so the payout statement and shipping label can be created.
- Track cards sent to Fanatics Collect and record their sales and payouts.

**What My CC's research found: eBay**

- eBay's Sell APIs cover this workflow. The Inventory API creates and manages inventory and offers (https://developer.ebay.com/api-docs/sell/inventory/overview.html). The Fulfillment API returns orders, records shipment tracking and issues refunds (https://developer.ebay.com/api-docs/sell/fulfillment/overview.html). The Finances API returns payouts and transaction details, including fees, for the seller account making the call (https://www.developer.ebay.com/develop/api/sell/finances_api.md).
- eBay has structured condition fields for trading cards. In the sports, collectible card game and non-sport singles categories, a listing must be Graded or Ungraded. Graded listings take a Professional Grader, a Grade and an optional Certification Number (https://developer.ebay.com/api-docs/user-guides/static/mip-user-guide/mip-enum-condition-descriptor-ids-for-trading-cards.html).
- Higher API call limits and some restricted APIs require passing eBay's Application Growth Check. eBay describes the check as free and says it needs a working application eBay can test (https://developer.ebay.com/grow/application-growth-check, https://developer.ebay.com/develop/api/sell/api_call_limits).

**What My CC's research found: Fanatics Collect**

- My CC's research found no public seller or consignment API for Fanatics Collect.
- Fanatics Collect's Dealer Program is aimed at hobby shops, breakers and volume sellers. Fanatics handles intake, pricing, imaging, listing, fulfillment and payouts, with better rates at higher volume (https://www.fanaticscollect.com/dealer-program). The program page does not mention API access or reporting tools.
- Sellers can also send items to the Fanatics Collect vault with a submission form and packing slip, then list them on Buy Now or in auctions (https://support.fanaticscollect.com/en_us/selling-on-fanatics-collect-Byq2QAQpel).
- Unless Fanatics Collect offers a data feed, assume staff record Fanatics Collect status and sales by hand or from a report file.

**Requirements and acceptance criteria**

- [P2] My CC connects its own eBay seller account through eBay's OAuth flow. Tokens refresh automatically.
- [P2] Acceptance test for listing: starting from a card with a grade and cert number, a staff member publishes a fixed-price eBay listing with scans, grader, grade and cert number filled in from the card record, without typing any card data. The test runs in the eBay sandbox first, then once on My CC's live account.
- [P2] New eBay orders appear in the portal automatically. The item is marked sold, a shipping label can be bought, and tracking is posted back to eBay.
- [P2] eBay fees and payouts are pulled in and matched to each sale for the payout statement.
- [P2] A card cannot be listed on both eBay and Fanatics Collect at the same time.
- [P2] Fanatics Collect consignments have the same statuses and payout statement as eBay, entered by staff or imported from a file.

**Questions your proposal must answer**

- **Q53.** Which eBay APIs will you use for listing, orders, tracking, refunds and fees? Do you need any API access eBay restricts or must approve? Have you taken an application through eBay's Application Growth Check?
- **Q54.** How will you map My CC's card records to eBay categories, item specifics and trading card condition descriptors?
- **Q55.** How will you handle auctions versus fixed-price listings, relists, best offers and returns?
- **Q56.** Have you integrated with Fanatics Collect? Can you confirm whether it offers any API, feed or bulk tool to consignment partners? If not, what manual or file-import workflow do you propose, and what should JB ask Fanatics Collect for (for example a sales report export)?
- **Q57.** How will the system prevent a card from being sold twice across channels?
- **Q58.** How will you test against the eBay sandbox before going live on My CC's real seller account?

### T11. Shipping: rates, labels, tracking, insurance, signatures, returns and notifications

**What My CC needs**

Cards move in many directions, and many are valuable:

- **Inbound:** collectors ship boxes to My CC.
- **To and from graders:** grading runs out and slabs back.
- **Returns:** cards back to collectors.
- **Consignment:** sold cards to eBay buyers, and cards to Fanatics Collect.
- **Display slabs:** finished slabs to collectors.

For each shipment the system must record what is inside and its declared value, and make sure that value is actually covered. In Phase 1 staff buy labels outside the portal and record the shipment. In Phase 2 the portal compares rates, buys labels and tracks packages.

**What My CC's research found: carrier coverage limits**

- USPS Priority Mail, Priority Mail Express and Ground Advantage include up to $100 of insurance. Registered Mail can be insured up to $50,000. Signature Confirmation is available (https://www.usps.com/ship/insurance-extra-services.htm).
- The FedEx Office Commodity Restrictions Guide lists collector's items, including sports cards, with a $1,000 limit of liability (https://www.fedex.com/content/dam/fedex/us-united-states/FedEx-Office/images/2025/Commodity_Restrictions_Guide_OTS.pdf). Confirm against the current U.S. FedEx Service Guide.
- UPS's U.S. terms appear to require a signed high-value shipment summary above $1,000 of declared value and to limit declared value to $50,000 per package (https://assets.ups.com/adobe/assets/urn:aaid:aem:c6bf8a2f-018f-4aa0-838b-ffc1a75eb1d9/original/as/terms-carriage-us-en.pdf). UPS says its terms were updated effective January 26, 2026. Confirm the current U.S. Tariff and Terms of Service, and whether trading cards fall under UPS's rules for articles of unusual value.

**What My CC's research found: third-party insurance**

- Shipsurance's Shopify program terms cover up to $5,000 per package for most listed carriers (https://www.shipsurance.com/shopify/terms). Collectible cards are not addressed on that page.
- U-PIC sells shipping insurance priced per $100 of declared value (https://u-pic.com/shipping-insurance). My CC's research did not find its maximum for collectibles.
- Collectibles Insurance Services sells dealer policies covering inventory, shipments, and consigned property of others documented in writing (https://collectinsure.com/dealers/). Its dealer application says signature-required shipping coverage is an add-on (https://collectinsure.com/wp-content/uploads/sites/2/2021/05/CIS-FR-2036-0121-DealerApp.pdf).
- Insurance choices are a business and broker decision for My CC. The software must record the declared value and coverage for every shipment and warn when coverage is too low.

**What My CC's research found: shipping platforms**

- EasyPost provides multi-carrier rates and labels, automatic tracking with webhook updates, and insurance that can be added at purchase or later (https://docs.easypost.com/guides/tracking-guide, https://docs.easypost.com/docs/insurance). Its billing pages describe a free monthly label allowance on its standard plan, and a separate Bring Your Own Carrier Account plan with its own monthly fee to which that free allowance does not apply (https://support.easypost.com/hc/en-us/articles/360042414212-Billing-FAQs, https://support.easypost.com/hc/en-us/articles/39984592062605-EasyPost-Wallet-and-Bring-Your-Own-Carrier-Account-Plans).
- Shippo provides labels, tracking webhooks and return labels. Its documentation says all Shippo return labels are scan-based and available for USPS, FedEx and UPS shipments (https://docs.goshippo.com/shipments/returns), and its support center describes return labels as charged only when used (https://support.goshippo.com/hc/en-us/articles/360035826412-How-to-Create-Return-Labels-in-Shippo). Shippo publishes subscription plans at https://goshippo.com/pricing.
- ShipStation API v2 provides rates, labels, tracking, voids and return labels (https://docs.shipstation.com/api-overview).

**Requirements and acceptance criteria**

- [P1] Every shipment records: cards inside, total declared value, carrier, service, tracking number, signature option, insurance provider and coverage amount.
- [P1] Rules flag or block a shipment when declared value is above the coverage of the chosen carrier and insurance. Signature confirmation is required above a value set in admin settings.
- [P1] Return shipping charges (price list) are added to the collector's invoice automatically.
- [P1] Inbound boxes are checked in and matched to the collector's account.
- [P2] Staff compare rates across at least USPS, UPS and FedEx and buy a label from inside the portal for any shipment type above.
- [P2] Collectors can get a prepaid inbound label or enter their own tracking number. Return labels can be emailed to collectors.
- [P2] Tracking updates arrive by webhook. The collector gets email (and optionally text, subject to T15) notices for label created, in transit, delivered and exceptions.
- [P2] Delivery exceptions, lost packages and damage show up in a staff queue with the information needed to file an insurance claim.
- [P2] eBay consignment orders post tracking back to eBay automatically.

**Questions your proposal must answer**

- **Q59.** Which shipping platform do you recommend (EasyPost, Shippo, ShipStation, direct carrier APIs or another), and why, for a business shipping high-value cards?
- **Q60.** Should My CC use its own carrier accounts or the platform's rates? What does that change for platform fees, insurance and claims?
- **Q61.** How will you apply carrier declared-value limits for collectibles so staff cannot buy a label with too little coverage?
- **Q62.** How will the system support a third-party collectibles insurer that may not connect to your shipping platform, for example by logging shipments for a monthly report?
- **Q63.** How will you handle very high-value shipments, such as Registered Mail or shipments split across several boxes?
- **Q64.** Which shipment notifications will collectors receive, by which channel, and can My CC edit the message text?
- **Q65.** How will inbound boxes from collectors be checked in and matched to the collector's account and quote?

---

## Hosting, Security and Ownership

My CC stores customers' cards, scans and money-related records. The sample inventory alone is 7,964 cards with about $430,000 in recorded value. The system must stay up, keep the data safe, prove where every card has been, and belong fully to My CC.

The targets below are My CC's starting position. If you think a target is wrong for a business this size, say so and explain the cost and risk of your alternative.

### T12. Hosting, performance, backups and security

**What My CC needs**

- A hosted production system for the customer portal, the staff tools and the public website. GitHub Pages, where the prototype runs today, is a static site hosting service (https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages), so the real product needs new hosting with a database, file storage and a server-side application.
- Separate environments: production, plus at least one staging environment that uses fake or anonymized data. Customer data is not copied into test environments without My CC's written approval.
- Storage for front and back scans at the planning sizes in "About My CC and this project".
- Scans are evidence. The original scan taken at intake shows the card's condition when it arrived. Originals must be kept unchanged, and the portal shows smaller resized copies for speed.
- Backups that let us recover from mistakes, bad deployments, ransomware or a provider outage, with tested restores.
- Monitoring, with alerts to the vendor and to My CC. Who responds and how fast is set in the T19 severity table.

Object storage services are the usual way to hold large numbers of images. As examples only, not a requirement: Amazon S3 states it is "designed to exceed 99.999999999% (11 nines)" data durability, S3 Standard is designed for 99.99% availability with a 99.9% availability SLA, and lower-cost classes for infrequently accessed data still return in milliseconds (https://aws.amazon.com/s3/storage-classes/). Cloudflare R2 lists egress (data transfer to the internet) as free (https://developers.cloudflare.com/r2/pricing/). Egress cost matters to My CC because customers will browse thousands of scans. Recommend what fits and explain why.

**Requirements and acceptance criteria**

| Area | Requirement | How we will check it |
|---|---|---|
| Uptime [P1] | Customer portal and staff tools available 99.9% per calendar month, excluding scheduled maintenance announced at least 48 hours ahead. | Monthly report from an external monitor that My CC can also log into. |
| Maintenance windows [P1] | Planned maintenance outside US business hours unless urgent. | Change log and notices. |
| Page speed [P1] | Collection search in an account at the single-account performance test size (25,000 cards, see B10) returns first results in under 2 seconds on a normal broadband connection. Card detail with front and back scans loads in under 2 seconds. | Demonstrated on staging with the 7,964-card sample scaled up with test data. |
| Image handling [P1] | Original scans stored unchanged, with a checksum recorded at upload. Resized versions (thumbnail, detail view) generated automatically. Each image linked to its inventory number and side (front or back). | Upload a scan, download the original, confirm the checksum matches. |
| Image privacy [P1] | Scans of a customer's private collection are viewable only by that customer and authorized staff. Links to private images expire. Only cards listed for consignment can be public. | Open a private image URL while logged out or as another customer. It must fail. |
| Encryption [P1] | All traffic over HTTPS. Database, backups and file storage encrypted at rest. | Configuration review and evidence in handover documents. |
| Backups: RPO [P1] | Recovery Point Objective of 1 hour or less for the database. Images are not lost once upload is confirmed. | Backup schedule shown in the admin console. |
| Backups: RTO [P1] | Recovery Time Objective of 4 hours or less to restore service after a major failure. | Full restore test into a separate environment before launch. |
| Restore testing [All] | A full restore test before launch and then once every quarter, each with a written report to My CC. This is the only restore-test schedule in this brief. | Quarterly report. |
| Backup retention [P1] | Daily backups kept at least 35 days, monthly backups at least 12 months. At least one copy in a separate region or provider, protected from deletion by a compromised admin account. | Retention settings shown. Restore of a specific older backup demonstrated. |
| Security standard [P1] | Build and test against OWASP ASVS (current release 5.0.0, published 30 May 2025, https://asvs.owasp.org/). State the level you target. | Self-assessment checklist delivered before launch. |
| Security testing [P1] | Independent penetration test before launch, with critical and high findings fixed before go-live. | Test report and fix list delivered to My CC. |
| Dependencies [All] | Automated scanning for vulnerable libraries. Critical patches applied within 7 days of a fix being available. | Scanning reports visible to My CC. |
| Payments [P1] | Card numbers never stored on My CC's servers (see T9). | Architecture diagram and processor account in My CC's name. |
| Monitoring [P1] | Uptime, error rates, failed logins and storage use monitored, with alerts to the vendor's on-call person and to a My CC contact. | Alert test during acceptance. |
| Incident response [P1] | Written incident plan. Response times follow the T19 severity table. Written post-incident report within 5 business days of any Severity 1. | Plan delivered before launch. |
| Breach notice [All] | Vendor notifies My CC within 24 hours of discovering any suspected unauthorized access to My CC data. | Contract clause. |
| Logs [P1] | Application and access logs kept at least 12 months. | Log retention settings shown. |

**Questions your proposal must answer**

- **Q66.** Which hosting provider(s) and regions do you propose for the application, database and image storage, and why?
- **Q67.** What uptime do you commit to in writing, and what happens (credits or otherwise) if you miss it?
- **Q68.** What RPO and RTO do you commit to, how are backups protected from deletion, and do you accept the quarterly restore-test schedule?
- **Q69.** How will you store, resize and serve front and back scans? Estimate monthly storage and data-transfer volume at planning points A, B and C, and identify which cost lines grow with volume.
- **Q70.** How do you keep private scans private while making consignment listing images public?
- **Q71.** Which security standard and level do you build to (for example an OWASP ASVS level), and who performs the pre-launch penetration test?
- **Q72.** What monitoring tools will you use, and will My CC have its own login to see uptime and alerts?
- **Q73.** Walk through your incident plan for a suspected data breach, including how and when you notify My CC.
- **Q74.** How do you handle environments and test data so real customer data does not end up in development?

### T13. Customer accounts, secure login and staff permissions

**What My CC needs**

- Customer accounts for collectors to see their collection and scans, track grading runs through each stage, approve quotes before any paid work, request services per card, and manage their vault plan and billing.
- Staff accounts with permissions limited to each person's job. Staff handle physical cards worth real money, so the system records who did what to which card, and when.
- A chain-of-custody record for every card from the moment a box is received until the card is returned, sold or shipped back. If a customer asks "where is my card and who touched it", we must be able to answer from the system.

NIST's current digital identity guidance states verifiers "SHALL offer at least one phishing-resistant authentication option at AAL2," and says syncable authenticators cannot be used at its highest level (AAL3) because their keys are exportable (https://pages.nist.gov/800-63-4/sp800-63b.html). My CC is not a federal system, but we want vendors to use this as the reference for login design.

**Roles**

This is the only roles definition in this brief. Every other section refers to it.

| Role | Can do | Cannot do |
|---|---|---|
| Customer | See own cards, scans, submissions, quotes, vault plan, invoices. Approve or decline quotes. Request services. Update own contact and shipping details. | See other customers' data. Change prices, grades or card status. |
| Intake | Log received shipments, create card records and inventory numbers, upload front and back scans, record intake condition notes. | Approve quotes for customers, issue refunds, change billing, delete cards. |
| Grading | Record pregrade results, build grading runs, record grader submission and return details and final grades. | Change billing or vault plans. |
| Vault | Check cards into and out of vault locations, record location moves, prepare returns and consignment shipments. | Change grades, prices or invoices. |
| Billing | Create and send quotes, apply membership discounts, record grader fees at cost, issue invoices, record payments and refunds. | Move cards or change scans and grades. |
| Admin | Everything staff roles can do, plus change prices and fee settings and manage staff accounts, if the Owner grants it. | Edit or delete audit log entries. Change the Owner's account. |
| Owner (JB) | Everything, including managing staff accounts and roles, pricing tables and exporting all data. | Edit or delete audit log entries (nobody can). |

A person may hold more than one role. The Owner can adjust roles and their permissions, and add new roles later (for example a consignment specialist), without a code change.

**Requirements and acceptance criteria**

- [P1] Customer login supports a phishing-resistant option (such as passkeys) plus at least one alternative MFA method. MFA is offered to all customers and the Owner can make it mandatory.
- [P1] MFA is mandatory for every staff, Admin and Owner account.
- [P1] Password rules, lockout after repeated failed attempts, and secure account recovery that cannot be bypassed by someone who only knows the customer's email address. You state the exact values (password rules, number of failed attempts, lockout duration), and they are admin settings.
- [P1] Sessions time out after inactivity, with staff sessions shorter than customer sessions. You state the exact timeouts, and they are admin settings. The Owner can force logout of any staff account immediately.
- [P1] Deactivating a staff member removes all access at once, while keeping their history in the audit log.
- [P1] Every action that changes a card, quote, invoice, vault plan or permission is permission-checked on the server, not only hidden on screen. Acceptance test: a logged-in Intake user calling the billing functions directly is refused.
- [P1] Audit log of every card movement and status change, at minimum: shipment received, card created, scanned, pregraded, quote sent, quote approved or declined, added to grading run, shipped to grader (with grader and tracking number), returned from grader, final grade recorded, vault check-in, vault location change, vault check-out, consignment listed, sold, return shipment created (with tracking number), and delivered.
- [P1] Each audit entry records: inventory number, action, previous and new value, account, date and time, and where relevant the physical location or tracking number.
- [P1] The audit log is append-only. No one, including the Owner and the vendor, can edit or delete entries through the application. Corrections are new entries that reference the old one. Entries are kept for the life of the business data.
- [P1] Staff see a card's full history. Customers see only the events listed in business rule B11 for their own cards. The Owner can export the log to CSV.
- [P1] Login events (success, failure, MFA changes, password resets) are logged separately for security review.

**Questions your proposal must answer**

- **Q75.** Which login and identity approach do you propose (built in-house or an identity service), and which MFA methods, including phishing-resistant ones, will customers and staff have?
- **Q76.** If you use a third-party identity service, is the account registered to My CC, what does it cost as user counts grow, and how do we export users if we leave it?
- **Q77.** How will the Owner create, change and remove roles and permissions, and add new roles later, without developer help?
- **Q78.** How do you enforce permissions on the server, and how will you prove it during acceptance testing?
- **Q79.** Describe your data model for the card chain-of-custody log. How do you make it append-only and tamper-evident?
- **Q80.** State the exact values you propose for password rules, failed-login lockout, and customer and staff session timeouts.
- **Q81.** How does account recovery work for a customer who loses their phone or passkey, and how do you prevent account takeover through recovery?
- **Q82.** How long are audit and login logs kept, and can My CC export them in full at any time?

### T14. My CC ownership of source code, data, domain and technology accounts

This is the only place in the brief where ownership is asked about. Other sections refer here.

**What My CC needs**

My CC must own everything it pays for and everything its business runs on, and must be able to switch vendors or bring work in-house without losing data, access or the website. Concretely:

- My CC owns all source code, designs, database schemas, documentation and content created for this project.
- All accounts (hosting, storage, domain registrar, DNS, email sending, payment processor, identity service, monitoring, code repository, marketplace and grader developer accounts, app stores if chosen) are registered in My CC's legal name, using a My CC-controlled email address, and billed to My CC directly or passed through transparently.
- The code lives in a GitHub organization owned by My CC, with the vendor's developers added as members or collaborators who can be removed.
- The domain is registered with My CC as the registrant. ICANN notes that only the "registered name holder or administrative contact" can start a domain transfer request (https://www.icann.org/news/blog/do-you-have-a-domain-name-here-s-what-you-need-to-know).

The approved design and prototype are at https://github.com/Sixteen1-6/my-collector-concierge. If that repository is moved into a My CC organization, GitHub's documentation says links to the old location redirect automatically, but "we don't redirect GitHub Pages associated with the repository," so the demo URL would change (https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository). Plan for this.

**Requirements and acceptance criteria**

- [All] **IP assignment.** The contract assigns to My CC all rights in work product created for My CC, effective on payment. You list any pre-existing code, libraries or tools you will reuse, and grant My CC a perpetual, irrevocable, royalty-free license to use and modify them as part of the product.
- [All] **Open source.** You deliver a list of all open-source components and their licenses, and do not use any component whose license would force My CC to publish its source code or restrict its commercial use, without My CC's written approval.
- [All] **Repository.** All code, infrastructure configuration and documentation are committed to the My CC GitHub organization from day one, at least daily. My CC holds the owner role.
- [All] **Accounts in My CC's name.** Every third-party account is created by or for My CC, under a My CC email address, with My CC holding the top-level admin role. Your team gets its own named user accounts with only the access it needs. No shared logins, and no vendor-owned accounts the business depends on.
- [All] **Credentials.** All passwords, API keys, MFA recovery codes and secrets are stored in a password manager or secrets store owned by My CC. Nothing critical exists only on a vendor laptop. Acceptance check: JB can log into every account on the list without vendor help.
- [All] **Account inventory.** A written list of every service the product uses, what it is for, who the admin is, the monthly cost and the renewal date, updated whenever something changes.
- [P1] **Infrastructure as code.** Hosting setup is scripted and stored in the repository, so another team can rebuild the environment from documentation.
- [P1] **Data ownership and export.** All customer, card, scan, quote, invoice, vault, consignment and audit data belong to My CC. The Owner can export all of it at any time in open formats: CSV or JSON for records, and original image files named or indexed by inventory number and side.
- [Each phase] **Documentation.** Setup guide, architecture overview, deployment steps, backup and restore runbook, and an admin guide for the Owner.
- [All] **Exit plan.** If the relationship ends for any reason, within an agreed period (we propose 30 days) you provide a full data export, the final repository state, an updated account and credentials inventory, removal of your own access, and an agreed number of hours of handover support to the new team at a rate stated in your proposal. You may not withhold code, data or access because of a billing dispute. Disputes are handled separately under the contract.

**Questions your proposal must answer**

- **Q83.** Do you agree to assign all IP in work product to My CC, effective on payment at each milestone? List any pre-existing components you will reuse and the license terms you offer for them.
- **Q84.** Confirm the code will be in a My CC-owned GitHub organization from the first commit. How will you handle moving the existing repository and the GitHub Pages demo URL?
- **Q85.** List every third-party service you expect to use and confirm each will be registered to My CC. (Put costs in the pricing spreadsheet, not here.)
- **Q86.** Where will secrets and credentials live, and how will you prove at handover that My CC can access everything without you?
- **Q87.** Will you use infrastructure as code? Which tool, and could another vendor rebuild production from your documentation alone?
- **Q88.** Describe the full data export: formats, what is included, how images are organized, and how long a full export takes at planning point C.
- **Q89.** What open-source components and licenses do you plan to use, and how will you report them?
- **Q90.** What does your exit and transition process look like, how long does it take, and what does handover support cost?
- **Q91.** What documentation will you deliver, and at which milestones?

### T15. Terms, consent and policy records

**What My CC needs**

Quote approvals, consignment agreements and vault memberships are commitments about valuable property and money. My CC needs proof of what each customer agreed to and when. My CC's lawyer supplies the text of the Terms of Service, consignment agreement and privacy policy. The vendor builds the system that shows that text, records acceptance and handles consent.

**Requirements and acceptance criteria**

- [P1] Terms, consignment agreement and privacy policy are stored as versioned documents. Publishing a new version does not change what earlier customers accepted.
- [P1] Every quote approval, consignment agreement and vault sign-up records the customer account, the exact version of terms shown, the date and time, and the IP address. The customer can see what they agreed to.
- [P1] New terms versions can require re-acceptance at next login when My CC chooses.
- [P1] Account closure follows business rule B12. Data retention after closure follows a period My CC sets in admin settings, with My CC's lawyer's advice.
- [P2] Optional text (SMS) shipping notices are sent only to customers who opted in, with the opt-in recorded, and customers can opt out at any time.
- [P1] Acceptance: JB approves a quote on staging, then publishes a new terms version, and the original approval still shows the old version, timestamp and IP address.

**Questions your proposal must answer**

- **Q92.** How will you store versioned terms and record acceptance so it can serve as evidence of what a customer agreed to?
- **Q93.** If My CC sends text messages, what consent records and sender registration does US business texting require today, and what would My CC need to do before launch?
- **Q94.** How will you implement data retention and deletion after account closure, including cards still in My CC's custody and records My CC must keep for tax purposes?

---

## Development Plan and Ongoing Support

This section explains how My CC wants the product built in stages, how costs are presented, how the product is looked after once it is live, and what we need to know about your company.

### T16. Testing and quality assurance

**What My CC needs**

Fee math is where a billing error would cost My CC money and customer trust. My CC needs automated tests that prove every fee is calculated correctly, a realistic staging data set, and a written test script JB can run at each milestone.

**Requirements and acceptance criteria**

- [P1] Automated tests for every fee calculation: $2 inventory, $10 pregrade (with business rule B6), grading fee bands at and around each threshold in B1, grader fees passed through at cost, tier labor discounts (B2), extra space blocks, return fee ($5 plus $0.25 per card), display slab, and [P2] consignment commission at 10% with the $10 minimum (B5).
- [P1] Tests run automatically on every change, and a failing fee test blocks release.
- [P1] A staging data set built from anonymized or fake data at the size of the sample, scaled to the single-account performance test size.
- [Each milestone] A written user acceptance test (UAT) script covering every acceptance criterion in that milestone, which JB runs on staging before sign-off.
- [P1] Sync test: staff change a card status while a customer approves a quote on a second device, and both changes appear on the website and the second device within the agreed time (T5).
- [P1] Visual parity review (T2) and penetration test (T12) completed before launch.
- [P2] eBay listing and order tests pass in the eBay sandbox before going live (T10).
- [All] No change goes to production without first passing on staging.

**Questions your proposal must answer**

- **Q95.** Describe your testing approach and tools. How will you show JB that every fee calculation is tested?
- **Q96.** Who writes the UAT script for each milestone, and how will you support JB while JB runs it?
- **Q97.** How will you build and refresh the staging data set without exposing real customer data?

### T17. Development phases, priorities and launch timeline

**What My CC needs**

We want a working product in customers' hands early, with the money-handling and record-keeping parts done properly first. Marketplace and partner integrations follow once the core is stable. The phase tags throughout this brief and the phase table in "About My CC and this project" define the proposed split. You may propose a different split if you explain why.

**Phase 0: Discovery and technical design**

- Review the approved design, the prototype and the sample data file.
- Confirm the data model: customers, shipments, cards, scans, inventory numbers, prices, services, quotes, grading runs, vault plans, invoices, consignments.
- Confirm which third-party services are used in Phase 1 and which wait.
- Deliver a written technical plan, a clickable or staging version of the first screens, and a fixed Phase 1 scope.

**Phase 1: the minimum My CC can run the business on**

Everything tagged [P1] in this brief. In summary: accounts and roles, staff intake and admin tool, the customer portal on real data, quotes and approval, pregrade records, grading runs with staff-updated stages, vault memberships, card payments and invoices, returns, service requests, email notifications, data migration, audit log, CSV exports, terms acceptance records and automated fee tests.

**Phase 2: integrations that save staff time**

Everything tagged [P2]: consignment workflow and payout statements, eBay, Fanatics Collect tracking, PSA cert lookup, accounting sync, shipping label API and market pricing feed. Optional iPhone and Android apps go here if My CC chooses them.

**Phase 3: growth features**

Everything tagged [P3]: staff reporting, display slab engraving workflow, customer value history, the remaining differentiating features, and BGS, SGC and CGC cert lookups if those graders offer suitable access.

**Known risk outside the software.** My CC's right to submit to PSA and other graders on behalf of customers depends on dealer or submitter terms that My CC is confirming with each grader (T8). The outcome may change the grading workflow. Note it in your risks.

**Timeline expectation.** My CC has not set a fixed launch date. We want Phase 1 live in the shortest realistic time without cutting corners on security, payments or data import. Give your own week-by-week estimate.

**Requirements and acceptance criteria**

- [P1] Phase 1 is accepted only when the end-to-end test in T3 passes: staff take a real box from intake to quote, approval, payment, grading run and return without a spreadsheet.
- [P1] The migrated data matches the sample file: 7,964 card records, the same recorded total value, 12 grading runs containing 335 cards, 38 vaulted cards, and every existing scan (B7) linked to the right card.
- [All] The portal keeps the approved visual design. Any design change needs My CC's written sign-off.
- [P1] A staging site exists from Phase 1 onward, and My CC tests each release there before it goes live.
- [Each phase] Each phase ends with a demo, a written list of what was delivered, and a short user guide for staff.

**Questions your proposal must answer**

- **Q98.** Do you agree with the Phase 0 / 1 / 2 / 3 split and the phase tags? If not, what would you move, and why?
- **Q99.** What is your estimated duration for each phase, in weeks, and what are the main risks to that estimate?
- **Q100.** What do you need from My CC in each phase (decisions, sample data, test cards, staff time, access), and by when?
- **Q101.** How will JB see progress during the build (demo cadence, staging updates, ticket board, written status reports)?

### T18. Upfront development costs and ongoing monthly expenses

**What My CC needs**

We need to know what the build costs, what it costs each month to keep running, and what support costs. We do not want one lump sum. Each item must be separate so we can decide what to defer. All pricing goes in one spreadsheet, `MyCC-Pricing-[VendorName].xlsx`, with the fixed tabs below. Use "N/A" rather than leaving a cell blank.

**Tab 1: Build cost by milestone.** Columns: milestone, phase, what JB can test at acceptance, duration in weeks, pricing model (fixed, or time and materials with a cap), price, payment due on acceptance. Include at least: Phase 0 discovery, each Phase 1 milestone, data migration, each Phase 2 integration as its own line, each Phase 3 feature as its own line, and project management and QA.

**Tab 2: Optional items.** Each as its own line: iPhone and Android apps (T4), staff camera mode, each differentiating feature not in Phase 1 (T6), 24x7 Severity 1 coverage (T19), live sync if priced separately (Q23).

**Tab 3: Rates.** Hourly rate by role for change requests and out-of-scope work.

**Tab 4: Running costs.** Columns: item, monthly cost at planning point A, B and C, Year 1, Year 2, Year 3 totals, who bills My CC (you or a third party), markup if any, and assumptions. Lines at minimum:

- Hosting and compute for the website, portal and admin.
- Database, including automated backups and point-in-time restore.
- Image storage and delivery, including bandwidth when customers browse their collections.
- Domain, SSL and DNS.
- Transactional email. SMS if you recommend it.
- Payment processing (processor named in Q45), with the fee impact on a typical quote and each vault tier.
- Shipping label and tracking API (platform named in Q59). Postage itself is a separate carrier cost.
- Market pricing data (source named in Q35), including any commercial display license.
- PSA Public API. PSA's documentation does not list pricing or call limits (https://www.psacard.com/publicapi/documentation). Confirm whether there is a cost.
- eBay developer program. The Application Growth Check is free (https://developer.ebay.com/grow/application-growth-check). List any other eBay-related costs.
- Identity service, if used.
- Error monitoring, uptime monitoring and logging.
- Security tooling such as vulnerability scanning.
- Paid libraries, templates or licenses.
- App store developer accounts, only if apps are chosen.
- Support and maintenance retainer (T19).

**Tab 5: Exclusions and assumptions.** Anything excluded from your price, and every assumption you made about blank business rules.

**Requirements and acceptance criteria**

- Every cost is in US dollars and states whether it is fixed or an estimate.
- Third-party costs are shown separately from your own fees, with any markup stated.
- Payment milestones are tied to delivered and accepted work, not calendar dates.

**Questions your proposal must answer**

- **Q102.** Which parts of your price are fixed and which are time and materials? What caps apply?
- **Q103.** What is your payment schedule, and which acceptance event triggers each payment?
- **Q104.** What are the expected monthly running costs at planning points A, B and C? (Summarize Tab 4.)
- **Q105.** Do you mark up any third-party costs? If so, by how much?
- **Q106.** What costs could surprise My CC in year one (traffic spikes, storage growth, API overages, data licensing)?

### T19. Maintenance, support, updates and future features

**What My CC needs**

Once live, the portal holds customer collections worth hundreds of thousands of dollars and takes payments. If it goes down or shows the wrong data, customers lose trust. We need a clear support agreement covering fixes, security updates, keeping integrations working when eBay or other providers change their APIs, and a predictable way to add new features.

**Severity levels**

This is the only severity table in the brief. T1 and T12 refer to it. Where a cell says "vendor to propose", give your commitment.

| Severity | Examples | First response | Fix or workaround |
|---|---|---|---|
| 1. Critical | Portal down, payments failing, a customer sees another customer's cards, suspected data breach, data loss | Within 1 hour, 24 hours a day, 7 days a week | Vendor to propose |
| 2. High | Quote approval or payment broken, billing run fails, grading stages not updating, scans not loading | Within 4 business hours | Vendor to propose |
| 3. Normal | A report is wrong, a filter misbehaves | Vendor to propose | Vendor to propose |
| 4. Low | Cosmetic issue, wording change | Vendor to propose | Vendor to propose |

24x7 Severity 1 coverage is a major cost for a small business. Price it as its own line in Tab 2 of the pricing spreadsheet, and also price a business-hours-only alternative.

**Ongoing work to be covered or quoted separately**

- Security patches and dependency updates.
- Monitoring, backups and the quarterly restore test (T12).
- Keeping integrations working when eBay, PSA, the payment processor, the shipping provider or the pricing source change their services.
- Price-list and content changes made by My CC staff in the admin, without a developer.
- New features through a written change request with a price and timeline My CC approves before work starts.

**Requirements and acceptance criteria**

- A written Service Level Agreement with response and fix targets per severity, business hours, and how to reach you after hours for Severity 1.
- A warranty period after each phase launch during which defects in delivered scope are fixed at no charge.
- A monthly report: uptime, incidents, updates applied, retainer hours used.
- No change goes to the live site without first passing on staging.

**Questions your proposal must answer**

- **Q107.** What response and fix times do you commit to for each severity level, and what happens if you miss them? What do 24x7 and business-hours-only Severity 1 coverage each cost?
- **Q108.** Describe your on-call coverage: hours, and who actually responds.
- **Q109.** How long is your post-launch warranty, and what does it cover?
- **Q110.** What retainer options do you offer (hours per month, price, whether unused hours roll over)?
- **Q111.** How do you price and schedule change requests during the build and after launch, and how quickly do you return a quote for one?
- **Q112.** How do you handle security updates and third-party API changes, and are they inside the retainer?

### T20. Company experience, references and long-term capacity

**What My CC needs**

My CC is a small business, and this product will run our daily operations for years. We need a partner who has built similar systems, will still be around after launch, and will not hand our project to a different team without telling us.

The most relevant experience for us:

- Inventory systems with large image libraries (thousands of items, each with photos).
- Customer portals with logins, quotes, approvals and payments.
- Recurring subscription billing.
- Marketplace integrations, especially eBay.
- Collectibles, trading cards, or other high-value consignment or storage businesses (helpful, not required).

**Requirements and acceptance criteria**

- At least three client references for comparable projects from the last 3 years, with contact details we may call. At least one is a small business, and at least one is a client you have supported for two years or more after launch.
- Links to live products you built, or screenshots if they are private.
- Names and roles of the people who will work on the project, and which of them stay on for support after launch.
- Disclosure of any subcontractors or team members outside your company or outside the US, and what they will do.
- A statement of the business insurance you carry that is relevant to software work (for example professional liability or cyber liability).

**Questions your proposal must answer**

- **Q113.** How long has your company been operating, and how many people work on client projects?
- **Q114.** Describe two or three projects most similar to ours, what you built, and what happened after launch.
- **Q115.** Provide at least three references as described above, with permission to contact them.
- **Q116.** Who exactly will work on the project, what are their roles and time commitments, and where are they located (time zone)? Who is JB's single point of contact during the build and after launch?
- **Q117.** Will any work be subcontracted, or done by people outside your company or outside the US? If so, by whom, for which parts, and how is their access controlled and removed?
- **Q118.** How do you keep project knowledge if a team member leaves?
- **Q119.** What insurance do you carry, and can you provide certificates?
- **Q120.** How many clients do you support on retainer, and how do you make sure a small client like My CC still gets timely attention?
- **Q121.** Have you ever had a client relationship end before a project finished? What happened, and what did you learn?

---

## Proposal format

Thank you for considering this project. To compare proposals fairly, My CC needs every vendor to use the structure below. Proposals that skip numbered questions will be asked to fill the gaps once. After that, any unanswered item scores zero.

### Key dates

| Milestone | Date |
|---|---|
| Brief sent | [date] |
| Confirm intent to bid and return signed NDA | [date] |
| Written questions due | [date, time, time zone] |
| Q&A call | [date, time, time zone], link sent to confirmed bidders |
| Written answers sent to all bidders | [date] |
| Proposals due | [date, time, time zone] |
| Finalist presentations | [date range] |
| Decision | [date] |
| Target project start | [date] |

Send all questions and the proposal to [contact name] at [email]. Do not contact anyone else at My CC about this project before the decision.

### What to submit

1. **One PDF proposal**, named `MyCC-Proposal-[VendorName].pdf`, no more than 30 pages. Appendices do not count toward the 30 pages.
2. **The completed response template** (`MyCC-Response-[VendorName].xlsx`). It lists every question Q1 to Q121 and every requirement, each with an answer cell. For each requirement, mark **Included**, **Partly included (explain)**, **Not included**, or **Needs confirmation (say what you will confirm and how)**. The template does not count toward the 30 pages.
3. **The pricing spreadsheet** (`MyCC-Pricing-[VendorName].xlsx`) with the five tabs defined in T18.

### Required structure of the PDF

**Section 1. Summary (1 page).** What you propose to build, in plain English, the total Phase 1 price, the total 3-year cost, and the time to launch Phase 1.

**Section 2. Approach by topic.** For each topic T1 to T20, a short narrative of your approach. Detailed answers go in the response template by question number (for example **Q45**). Where a third party is involved (graders, marketplaces, pricing, payment, shipping), say what access you know exists, how you confirmed it, and your plan if access is not available.

**Section 3. Company and relevant work.** Company size, location, years in business, and 2 or 3 comparable projects with live links or screenshots.

**Section 4. Team.** Named people, role, location, working hours and percent of time on this project (see Q116 and Q117).

**Section 5. Plan and milestones.** Phased plan with milestones. Each milestone says what JB can test and accept.

**Section 6. Risks and assumptions.** What could delay the work or change the price, and what you assume My CC provides, including assumptions about any blank business rules.

**Section 7. Contract.** Confirm you accept the requirements in T14 (IP assignment, accounts owned by My CC, code in My CC's repository from day one, data export, exit plan), payments tied to milestone acceptance, and the support terms in T19. List any exceptions clearly.

### How proposals will be evaluated

Proposals will be compared on: complete and specific answers to the numbered questions, relevant experience, technical approach and security, team and communication, plan and realism, total cost over 3 years (not only the build price), and acceptance of the ownership and contract requirements. References and finalist presentations will also be considered.

Proposals must remain valid for 90 days after the due date. My CC is not obliged to accept any proposal and will not pay for proposal preparation.

---

## Sources

- https://github.com/Sixteen1-6/my-collector-concierge
- https://sixteen1-6.github.io/my-collector-concierge/
- https://www.w3.org/TR/WCAG22/
- https://developer.apple.com/app-store/review/guidelines/
- https://developer.apple.com/programs/enroll/
- https://support.google.com/googleplay/android-developer/answer/13628312?hl=en
- https://apps.apple.com/us/app/id996239729
- https://psacard.com/info/psa-vault
- https://support.fanaticscollect.com/en_us/buy-now-fees-ry33QCXaxe.md
- https://apps.apple.com/us/app/card-ladder/id1541535971
- https://sportscollectorsdigest.com/news/collectors-universe-acquires-card-ladder-card-grading-values
- https://support.alt.xyz/en/articles/9213538-vault-fees
- https://support.alt.xyz/en/articles/9213547-collection-management
- https://intercom.help/courtyardio/en/articles/11006165-vault-your-cards
- https://apps.apple.com/us/app/id1511419920
- https://www.cardladder.com/pricing
- https://www.pricecharting.com/price-guide
- https://sportscardspro.com/api-documentation
- https://docs.gemrate.com/api-reference/certs/cert-lookup.md
- https://www.developer.ebay.com/api-docs/buy/marketplace-insights/overview.html
- https://www.psacard.com/publicapi
- https://www.psacard.com/publicapi/documentation
- https://www.psacard.com/Submissions
- https://www.psacard.com/termsandconditions
- https://www.psacard.com/termsandconditionsa
- https://stripe.com/docs/billing/subscriptions/metered-billing
- https://support.stripe.com/questions/understanding-stripe-tax-pricing
- https://stripe.com/pricing
- https://docs.stripe.com/connect/marketplace/tasks/accept-payment/separate-charges-and-transfers
- https://docs.stripe.com/connect/tax-reporting
- https://www.irs.gov/newsroom/form-1099-k-faqs-general-information
- https://developer.ebay.com/api-docs/sell/static/seller-accounts/tax-tables.html
- https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api
- https://developer.xero.com/documentation/api/accounting/banktransactions
- https://developer.ebay.com/api-docs/sell/inventory/overview.html
- https://developer.ebay.com/api-docs/sell/fulfillment/overview.html
- https://www.developer.ebay.com/develop/api/sell/finances_api.md
- https://developer.ebay.com/api-docs/user-guides/static/mip-user-guide/mip-enum-condition-descriptor-ids-for-trading-cards.html
- https://developer.ebay.com/grow/application-growth-check
- https://developer.ebay.com/develop/api/sell/api_call_limits
- https://www.fanaticscollect.com/dealer-program
- https://support.fanaticscollect.com/en_us/selling-on-fanatics-collect-Byq2QAQpel
- https://www.usps.com/ship/insurance-extra-services.htm
- https://www.fedex.com/content/dam/fedex/us-united-states/FedEx-Office/images/2025/Commodity_Restrictions_Guide_OTS.pdf
- https://assets.ups.com/adobe/assets/urn:aaid:aem:c6bf8a2f-018f-4aa0-838b-ffc1a75eb1d9/original/as/terms-carriage-us-en.pdf
- https://www.shipsurance.com/shopify/terms
- https://u-pic.com/shipping-insurance
- https://collectinsure.com/dealers/
- https://collectinsure.com/wp-content/uploads/sites/2/2021/05/CIS-FR-2036-0121-DealerApp.pdf
- https://docs.easypost.com/guides/tracking-guide
- https://docs.easypost.com/docs/insurance
- https://support.easypost.com/hc/en-us/articles/360042414212-Billing-FAQs
- https://support.easypost.com/hc/en-us/articles/39984592062605-EasyPost-Wallet-and-Bring-Your-Own-Carrier-Account-Plans
- https://docs.goshippo.com/shipments/returns
- https://support.goshippo.com/hc/en-us/articles/360035826412-How-to-Create-Return-Labels-in-Shippo
- https://goshippo.com/pricing
- https://docs.shipstation.com/api-overview
- https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages
- https://aws.amazon.com/s3/storage-classes/
- https://developers.cloudflare.com/r2/pricing/
- https://asvs.owasp.org/
- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://www.icann.org/news/blog/do-you-have-a-domain-name-here-s-what-you-need-to-know
- https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository
- https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-outside-collaborators/adding-outside-collaborators-to-repositories-in-your-organization
- https://www.score.org/find-mentor
- https://www.sba.gov/local-assistance/resource-partners/small-business-development-centers-sbdc
- https://clutch.co/developers
- https://www.goodfirms.co/directory/languages/top-software-development-companies
- https://www.upwork.com/agencies
- https://support.upwork.com/hc/en-us/articles/211063508-Difference-between-agency-and-freelancer
- https://codekeeper.co/source-code-escrow
- https://www.escrowtech.com/
