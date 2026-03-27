import { ReviewWorkbench } from "@/app/components/review-workbench";

const workflow = [
  "Developer pastes a code snippet or selects a sample.",
  "The assistant analyzes control flow, side effects, and maintainability cues.",
  "It returns a score, three improvements, one positive note, and suggested tests.",
  "Human reviewers spend time on deeper engineering judgment instead of basics.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.82),_rgba(244,237,224,0.95)_42%,_#e7dcc8_100%)] text-stone-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">
              AI Screening Prototype
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
              Smart Code Reviewer
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
              A lightweight AI assistant for engineering teams that reviews code
              before human review, highlights maintainability risks, and
              suggests concrete tests and refactors.
            </p>
          </div>
        </div>

        <ReviewWorkbench />

        <div className="mt-5 rounded-[2rem] border border-stone-900/10 bg-white/80 p-6 shadow-[0_18px_60px_rgba(62,39,16,0.08)] backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Workflow
          </p>
          <ol className="mt-5 space-y-4 text-sm leading-6 text-stone-700">
            {workflow.map((item, index) => (
              <li key={item}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
