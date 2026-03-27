# Smart Code Reviewer

A small Next.js prototype for the screening challenge prompt:

> Create an AI assistant that reviews code for readability, structure, and maintainability before human review.

## What It Shows

- A landing page for the prototype concept
- A sample AI review output with three improvements and one positive note
- The exact prompt structure behind the assistant
- A ready-to-submit 100-word summary in [`submission-summary.txt`](./submission-summary.txt)

## Local Run

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment

Create a `.env` file with:

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openrouter/auto
OPENROUTER_SITE_URL=http://localhost:3000
```

`OPENROUTER_MODEL` and `OPENROUTER_SITE_URL` are optional. If omitted, the app defaults to `openrouter/auto` and `http://localhost:3000`.

## Build Checks

```bash
npm run lint
npm run build
```

Both pass in the current workspace.

## Suggested Submission Assets

- Public link: deploy this repo to Vercel
- Document: use the contents of `submission-summary.txt`
- Screenshot: capture the homepage after running `npm run dev`

## Data

This prototype uses self-created sample snippets only, so no public dataset is required.
