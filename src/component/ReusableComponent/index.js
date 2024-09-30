import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, TablePagination,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DeleteOutlineOutlined } from '@mui/icons-material';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover || '#f5f5f5',
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected || '#ececec',
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.light || '#3f51b5',
    color: theme.palette.common.white || '#fff',
}));

const ReusableTable = ({ headers, rows, rowsPerPage,  setRowsPerPage, page, setPage, handleDeleteRow, ids}) => {

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page when rows per page changes
    };

    // Paginated rows
    const paginatedRows = rows ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    return (
        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                    <StyledTableCell key={'Sno'} align="center">
                                S.No.
                            </StyledTableCell>
                        {headers.map((header, index) => (
                            <StyledTableCell key={index} align="center">
                                {header}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedRows && paginatedRows.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                            <TableCell key={'11'} align="center" sx={{ padding: '12px' }}>
                                    {rowIndex + 1}
                                </TableCell>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} align="center" sx={{ padding: '12px' }}>
                                    {cell}
                                </TableCell>
                            ))}
                            <TableCell key={rowIndex} align="center" sx={{ padding: '12px' }}>
                                    <IconButton onClick={() => handleDeleteRow(ids[rowIndex])}>
                                        <DeleteOutlineOutlined />
                                    </IconButton>
                                </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={rows.length} // Total number of rows
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            />
        </TableContainer>
    );
};

export default ReusableTable;
