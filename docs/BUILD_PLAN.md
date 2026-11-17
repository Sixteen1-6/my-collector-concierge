# My Collector Concierge: Build Plan

This is the order of work for turning the demo into the real product. It sits next to [PROPOSAL.md](PROPOSAL.md), which covers what gets built and why. This file covers what to do first, the commits to make, and how changes get checked.

## Do these before the AWS account

AWS is not step one. Nothing below needs it.

1. Turn on CI and the AI reviewer in this repo. This pull request does that.
2. Decide where the product code lives. Recommended: a new private repo, in a GitHub organization My CC owns, so the proposal's ownership promise is true from the first commit. This repo stays the public demo.
3. Lock the capture setup. One flat shot and four low-angle light shots per side, camera and card fixed, only the light moves.
4. Shoot 200 to 300 cards that already have known answers in the ledger.
5. Run identification on them and measure accuracy. If the score is not good enough, fix it here, where a change costs minutes.
6. Start the slow outside items now, because they are waits and not work: D-U-N-S number, eBay developer account, PSA dealer status, a licensed sales feed quote.

Then create the AWS accounts. They should be created under a My CC email and billing card, not a personal one. Use AWS Organizations with separate production and staging accounts, as the proposal describes.

## Commit plan

Each line is one commit, small enough to review in a few minutes. Commit messages use the form `type(area): what changed`.

### Milestone 0: prove the AI (no AWS)

- `ci: add site checks and AI review to the demo repo`
- `docs: add build plan`
- `docs(capture): shot list, lighting angles, camera settings, file naming`
- `feat(eval): manifest of 200 labelled cards from the ledger`
- `feat(identify): v0 script that returns year, set, number, player, parallel as structured fields`
- `feat(identify): catalog check that rejects set and number pairs that do not exist`
- `feat(eval): scoring script with accuracy by field and a list of misses`
- `docs(eval): first accuracy report and the go or no-go call`

### Milestone 1: foundation

- `chore: start the monorepo with pnpm, TypeScript, lint and format`
- `ci: lint, typecheck and unit tests on every pull request`
- `feat(shared): Zod schemas for card, scan, valuation and card event`
- `feat(infra): SST app with a staging stage`
- `feat(db): first migration with cards, scans and card_events`
- `feat(api): Hono API with a health route`
- `feat(obs): trace ID on every request, JSON logs, reference codes`
- `feat(db): model_calls and model_corrections tables`
- `feat(import): ledger import with a reconciliation report for all 7,964 cards`
- `ci: preview deploy per pull request and staging deploy on merge`

### Milestone 2: one card, end to end

- `feat(capture): upload endpoint, originals kept in S3, resize worker`
- `feat(identify): worker with model tiers, cheap model first and stronger models for uncertain cards`
- `feat(review): staff queue for low-confidence cards, corrections saved as new rows`
- `feat(pricing): sales table with a source tag on every sale`
- `feat(pricing): PricingSource interface and the first licensed feed adapter`
- `feat(pricing): match sale titles to cards, value is the median of recent comps`
- `feat(portal): card page reading real data`
- `ci: eval gate that blocks a prompt or model change if accuracy drops`

### Milestone 3: widen

- `feat(grading): grade-or-sell calculator with odds per grade`
- `feat(grading): run builder, packing list, cert lookup on return`
- `feat(grading): log pregrade against the PSA result for the side model`
- `feat(listing): eBay listing drafts from the card record`
- `feat(listing): auto-publish under a value limit, one tap above it`
- `feat(capture): surface maps from the low-angle light shots`

## CI and CD

What runs today in this repo, all at the same time on every pull request and every push to main:

| Job | What it catches |
|---|---|
| Links, data and scans | A page pointing at a file that is gone, a ledger that no longer parses, a card that lost its scan |
| JavaScript syntax | A script that will not load |
| Pages load | A page or data file that does not return |
| Claude review | Bugs and risky changes a person might miss |

What gets added in the product repo, in the same pattern:

- On every pull request: lint, typecheck, unit tests, migration check, a preview deploy with its own URL, browser tests against that preview, and the AI review. The eval gate runs only when prompts or identification code change.
- On merge to main: deploy to staging, then smoke tests.
- To production: a tagged release with one manual approval.

Turn on branch protection for main so nothing merges unless these checks pass. This is what makes several Claude sessions working at once safe. Each session works on its own branch, and a session cannot break main without a check going red first.

## AI reviewer

The review workflow uses Anthropic's official GitHub action with its code review plugin. It is already in this repo and stays off until one secret exists. To turn it on:

1. Open Claude Code in this repo and run `/install-github-app`. It installs the Claude GitHub app and saves the secret for you.
2. Or do it by hand: install the app at https://github.com/apps/claude, run `claude setup-token`, then `gh secret set CLAUDE_CODE_OAUTH_TOKEN`.

The token ties reviews to one person's Claude subscription. Once more than one person commits, switch the workflow to an API key from the Claude Console.

CodeRabbit is the other easy option. It installs as a GitHub app with no workflow file and reviews public repos for free. Full reviews on private repos need a paid seat. Running both on the same pull requests mostly produces duplicate comments, so pick one.

## Rules for parallel sessions

- One branch and one feature per session.
- Shared rules live in a `CLAUDE.md` file at the repo root, so every session follows the same conventions.
- Schema changes go through one session at a time. Two sessions writing migrations will collide.
- A pull request merges only when CI is green and the review has no open blocking comment.
