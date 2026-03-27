# Smart Code Reviewer

Smart Code Reviewer is a small Next.js prototype for the screening challenge:

> Create an AI assistant that reviews code for readability, structure, and maintainability before human review.

The app lets a reviewer paste a short code snippet, choose a language and review focus, and generate structured feedback with:

- a short summary
- a maintainability score
- three suggested improvements
- one positive note

## Why this project

This prototype is designed as a practical internal engineering tool rather than a generic demo. The goal is to reduce reviewer fatigue by catching basic readability and maintainability issues before a human code review starts.

It is intentionally lightweight:

- built as a single-page Next.js app
- uses a Server Action instead of a separate REST endpoint
- supports live model responses through OpenRouter
- keeps a simple local fallback path if the model is unavailable

## Features

- Paste a code snippet and run a pre-review
- Switch between sample snippets for quick demos
- Choose the review focus: maintainability, readability, or testing
- Generate structured feedback suitable for engineering teams
- Use a Server Action for review submission
- Fall back gracefully when the external model is unavailable

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- OpenRouter for model access
- Next.js Server Actions for server-side review execution

## Project Structure

```text
app/
  actions.ts                     Server Action for running reviews
  components/
    review-workbench.tsx         Interactive review UI
  page.tsx                       Main landing page
lib/
  reviewer.ts                    Review types, samples, and fallback analyzer
  review-state.ts                Client-safe action state definitions
```

## How it works

1. The user selects or pastes a short code snippet.
2. The form submits to a Next.js Server Action.
3. The Server Action sends the review prompt to OpenRouter.
4. The model returns structured JSON for the UI.
5. If the live model fails, the app can still return a fallback local review.

## Environment Variables

Create a `.env` file in the project root:

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openrouter/auto
```

Notes:

- `OPENROUTER_API_KEY` is required for live AI reviews.
- `OPENROUTER_MODEL` is optional.
- If the live request fails, the app currently shows an error state instead of exposing provider internals in the UI.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Quality Checks

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

Both commands pass in the current project state.

## Data Usage

This prototype uses self-created sample snippets only. No confidential or private data is required.

## Future Improvements

- Review pull request diffs instead of pasted snippets
- Add repository-aware review suggestions
- Support team-specific review policies
- Add test generation suggestions per framework
- Add copy/export options for review output
