import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
  TableContainer,
  TableHead,
  TextField,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Breadcrumbs
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AllExpenses from './Expenditure';
import Cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { deleteApi, getApi } from 'constant/api';
const HeaderCell = styled(MuiTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.common.black,
  fontWeight: 'bold',
  padding: theme.spacing(1)
}));

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const TableRow = styled(MuiTableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const Expenditure = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editExpense, setEditExpense] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchExpenses(hostelId);
  };

  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchExpenses(HosId);
  }, []);

  const fetchExpenses = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/expense/index/${hostelId}`);
      const response = await getApi(`${url.expenditure.index}${hostelId}`, {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }
      });
      setAllExpenses(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching expenses data:', error);
    }
  };

  const handleFilter = () => {
    fetchExpenses(hostelId);
  };

  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    let expense = allExpenses.find((expense) => expense._id === id);
    console.log('expense==>', expense);
    setEditExpense(expense);
  };

  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/expense/delete/${deleteId}`);
      let response = await deleteApi(`${url.expenditure.delete}${deleteId}`);
      console.log('delete  response =====>', response);

      setOpenDeleteDialog(false);
      fetchExpenses(hostelId);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log('New Page:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit">
      <HomeIcon color="secondary" />
    </Link>,
    <Link underline="hover" key="2" color="inherit" to="/dashboard/default" component={RouterLink}>
      {t('Dashboard')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('List')}
    </Typography>
  ];

  return (
    <>
      <AllExpenses open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editExpense={editExpense} />
      <Container>
        <Container
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 0.5
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontSize: '1.3rem' }}>
              {t('All Expenditures')}
            </Typography>
            <Stack spacing={2}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Stack>
          </Stack>
        </Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ bgcolor: 'white', marginTop: '15px', display: 'flex', justifyContent: 'flex-end', height: '45px' }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ paddingRight: 2 }}>
            <TextField
              label={t('Start Date')}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: '5px',
                '& .MuiInputBase-root': {
                  height: '33px'
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px'
                }
              }}
            />

            <TextField
              label={t('End Date')}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: startDate
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: '5px',
                '& .MuiInputBase-root': {
                  height: '33px'
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px'
                }
              }}
            />

            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add New')}
            </Button>
          </Stack>
        </Stack>

        <TableStyle>
          <Box width="100%">
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>#</HeaderCell>
                      <HeaderCell>{t('Expense Title')}</HeaderCell>
                      <HeaderCell>{t('Date')}</HeaderCell>
                      <HeaderCell>{t('Price')}</HeaderCell>
                      <HeaderCell>{t('Bill Image')}</HeaderCell>
                      <HeaderCell>{t('Action')}</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.expenseTitle}</TableCell>
                        <TableCell>{moment.utc(row.date).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{row.price} /-</TableCell>
                        <TableCell>
                          {row.billPhoto && (
                            <a href={`${REACT_APP_BACKEND_URL}/uploads/bills/${row.billPhoto}`} target="_blank" rel="noopener noreferrer">
                              {row.billPhoto}
                            </a>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" style={{ color: 'green' }}>
                              <EditOutlined />
                            </IconButton>

                            <IconButton onClick={() => handleDelete(row._id)} aria-label="delete" style={{ color: 'red' }}>
                              <DeleteOutline />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>

      {/*-------------------- Dialog for Delete ----------------- */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">{t('Delete Administrator')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('Are you sure you want to delete this Room Details')}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="contained" color="primary">
            {t('Cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Expenditure;
