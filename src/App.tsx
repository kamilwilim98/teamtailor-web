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
  TextField,
  TableSortLabel,
} from "@mui/material";

import "./global.css";

function CandidatesApp() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/candidates"
      );
      const data = await response.json();
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

  const handleSort = (key: string) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction });

    const sortedCandidates = [...candidates].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setCandidates(sortedCandidates);
  };

  const handleChangePage = (_: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columnHeaders: { [key: string]: string } = {
    id: "ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    jobApplicationId: "Job Application ID",
    jobApplicationCreatedAt: "Application Date",
  };

  const filteredCandidates = candidates.filter((candidate: any) =>
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      ) : filteredCandidates.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.entries(columnHeaders).map(([key, label]) => (
                    <TableCell key={key}>
                      <TableSortLabel
                        active={sortConfig?.key === key}
                        direction={
                          sortConfig?.key === key ? sortConfig.direction : "asc"
                        }
                        onClick={() => handleSort(key)}
                      >
                        {label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {searchTerm
                  ? filteredCandidates.map((candidate: any) => (
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
                    ))
                  : filteredCandidates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
            count={filteredCandidates.length}
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
