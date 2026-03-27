"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { reviewCodeAction } from "@/app/actions";
import { initialReviewState } from "@/lib/review-state";
import { sampleSnippets } from "@/lib/reviewer";

const initialSample = sampleSnippets[0];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Reviewing..." : "Run Smart Review"}
    </button>
  );
}

export function ReviewWorkbench() {
  const [code, setCode] = useState(initialSample.code);
  const [language, setLanguage] = useState(initialSample.language);
  const [focus, setFocus] = useState(initialSample.focus);
  const [state, formAction] = useActionState(
    reviewCodeAction,
    initialReviewState,
  );

  const loadSample = (sampleId: string) => {
    const sample = sampleSnippets.find((item) => item.id === sampleId);
    if (!sample) return;

    setCode(sample.code);
    setLanguage(sample.language);
    setFocus(sample.focus);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <form
        action={formAction}
        className="rounded-[2rem] border border-stone-900/10 bg-[#fffdf8] p-6 shadow-[0_18px_80px_rgba(62,39,16,0.12)] sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Review Workbench
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] text-stone-950">
              Paste code and run a pre-review
            </h2>
          </div>
          <SubmitButton />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-stone-700">
            <span className="mb-2 block font-medium">Sample snippet</span>
            <select
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none"
              defaultValue={initialSample.id}
              onChange={(event) => loadSample(event.target.value)}
            >
              {sampleSnippets.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-stone-700">
            <span className="mb-2 block font-medium">Language</span>
            <select
              name="language"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option>TypeScript</option>
              <option>JavaScript</option>
            </select>
          </label>

          <label className="text-sm text-stone-700">
            <span className="mb-2 block font-medium">Focus</span>
            <select
              name="focus"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
            >
              <option>Maintainability</option>
              <option>Readability</option>
              <option>Testing</option>
            </select>
          </label>
        </div>

        <label className="mt-6 block text-sm text-stone-700">
          <span className="mb-2 block font-medium">Code snippet</span>
          <textarea
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-[340px] w-full rounded-[1.75rem] border border-stone-300 bg-[#fffaf2] px-5 py-4 font-mono text-sm leading-6 text-stone-800 outline-none"
            spellCheck={false}
          />
        </label>
      </form>

      <div className="flex flex-col gap-6">
        <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-6 text-stone-100 shadow-[0_18px_60px_rgba(62,39,16,0.16)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
                AI Output
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Review summary
              </h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              {state.review ? `${state.review.score}/100` : "Ready"}
            </div>
          </div>

          {state.error ? (
            <p className="mt-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">
              {state.error}
            </p>
          ) : null}

          {!state.review && !state.error ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-stone-300">
              Run the review to generate actionable feedback, a maintainability
              score, and suggested tests before human review starts.
            </p>
          ) : null}

          {state.review ? (
            <>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm leading-6 text-stone-200">
                  {state.review.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-stone-400">
                  <span>Maintainability: {state.review.maintainability}</span>
                  <span>Focus: {focus}</span>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {state.review.improvements.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-amber-200">
                        {index + 1}. {item.title}
                      </p>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-300">
                        {item.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.35rem] border border-emerald-300/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-200">
                  Positive note
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {state.review.positive}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
