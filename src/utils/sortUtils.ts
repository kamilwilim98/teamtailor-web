import { Candidate } from "../hooks/useFetchCandidates";

export const sortCandidates = <K extends keyof Candidate>(
  candidates: Candidate[],
  key: K,
  direction: "asc" | "desc"
) => {
  return [...candidates].sort((a, b) => {
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
