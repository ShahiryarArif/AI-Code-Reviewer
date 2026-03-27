import type { ReviewResponse } from "@/lib/reviewer";

export type ReviewActionState = {
  error: string | null;
  review: ReviewResponse | null;
};

export const initialReviewState: ReviewActionState = {
  error: null,
  review: null,
};
