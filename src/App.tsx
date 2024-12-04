/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TablePagination,
} from "@mui/material";

function CandidatesApp() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/candidates"
      );
      const data = await response.json();
      console.log(data);
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
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

  const handleChangePage = (_: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      {loading ? (
        <p>Loading candidates...</p>
      ) : candidates.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Job Application ID</TableCell>
                  <TableCell>Job Application Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate: any) => (
                    <TableRow key={candidate.id}>
                      <TableCell>{candidate.id}</TableCell>
                      <TableCell>{candidate.firstName}</TableCell>
                      <TableCell>{candidate.lastName}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.jobApplicationId}</TableCell>
                      <TableCell>
                        {new Date(
                          candidate.jobApplicationCreatedAt
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={candidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadCSV}
            sx={{ marginTop: 2 }}
          >
            Download as CSV
          </Button>
        </>
      ) : (
        <p>No candidates found. Click "Fetch All Candidates" to load data.</p>
      )}
    </Paper>
  );
}

export default CandidatesApp;
