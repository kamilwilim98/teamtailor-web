import { TablePagination } from "@mui/material";

interface TablePaginationControlsProps {
  count: number;
  rowsPerPage: number;
  page: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
}

const TablePaginationControls = ({
  count,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
}: TablePaginationControlsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 50, 100]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default TablePaginationControls;
