import { useState } from "react";

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobApplicationId: number;
  jobApplicationCreatedAt: string;
}

const useFetchCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/candidates"
      );
      const data: Candidate[] = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCandidatesCSV = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/candidates-csv",
        {
          method: "GET",
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "candidates.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return {
    candidates,
    fetchCandidates,
    downloadCandidatesCSV,
    loading,
    setCandidates,
  };
};

export default useFetchCandidates;
