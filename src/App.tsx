import { useState } from "react";
import { Button, Paper, TextField } from "@mui/material";
import CandidatesTable from "./components/CandidatesTable";
import useFetchCandidates from "./hooks/useFetchCandidates";
import "./global.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    candidates,
    fetchCandidates,
    downloadCandidatesCSV,
    loading,
    setCandidates,
  } = useFetchCandidates();

  return (
    <Paper sx={{ padding: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchCandidates}
        sx={{ marginBottom: 2 }}
      >
        Fetch All Candidates
      </Button>
      <TextField
        label="Search by Email"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <CandidatesTable
          candidates={candidates}
          setCandidates={setCandidates}
          searchTerm={searchTerm}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={downloadCandidatesCSV}
        sx={{ marginTop: 2 }}
      >
        Download as CSV
      </Button>
    </Paper>
  );
}

export default App;
