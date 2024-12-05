import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from "@mui/material";
import TablePaginationControls from "./TablePaginationControls";
import { useState } from "react";
import { sortCandidates } from "../utils/sortUtils";
import { Candidate } from "../hooks/useFetchCandidates";

interface CandidatesTableProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  searchTerm: string;
}

const columnHeaders = {
  id: "ID",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  jobApplicationId: "Job Application ID",
  jobApplicationCreatedAt: "Application Date",
};

function CandidatesTable({
  candidates,
  setCandidates,
  searchTerm,
}: CandidatesTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Candidate) => {
    setPage(0);
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction });
    const sortedCandidates = sortCandidates(candidates, key, direction);
    setCandidates(sortedCandidates);
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                    onClick={() => handleSort(key as keyof Candidate)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCandidates
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((candidate) => (
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
      <TablePaginationControls
        count={filteredCandidates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
    </>
  );
}

export default CandidatesTable;
