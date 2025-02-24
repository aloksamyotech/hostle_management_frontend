import {
  Stack,
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  TablePagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Breadcrumbs,
  Link
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';
import AddPayment from './AddPayment';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import { width } from '@mui/system';
import { t } from 'i18next';
import { Link as RouterLink } from 'react-router-dom';
import url from 'constant/url';
import { getApi } from 'constant/api';
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

const PaymentList = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hostelId, setHostelId] = useState();
  const [studentPaymentData, setStudentPaymentData] = useState([]);
  const [paymentRecordsCount, setPaymentRecords] = useState(0);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState('All');

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };
  console.log('status==>', status);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      console.log('debauncing is workong =====================');
    }, 5000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchPaymentData(Hos_Id);
  }, [debouncedQuery]);

  const fetchPaymentData = async (hostelId) => {
    try {
      const response = await getApi(`${url.payments.list}${hostelId}`);
      setStudentPaymentData(response.data.result);
      setPaymentRecords(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleOpenAdd = () => {
    setOpenAddPayment(true);
  };

  const handleCloseAddPayment = () => {
    setOpenAddPayment(false);
    fetchPaymentData(hostelId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setPage(0);
    }
  };

  const generalFilter = (row) => {
    const lowerCaseQuery = query.toLowerCase();
    return Object.values(row).some((value) => {
      return value !== undefined && value !== null && value.toString().toLowerCase().includes(lowerCaseQuery);
    });
  };

  const statusFilter = (row) => {
    if (status === 'All') return true;
    return status === 'Complete' ? row.monthlyPending <= 0 : row.monthlyPending > 0;
  };

  const filteredData = studentPaymentData.filter(generalFilter).filter(statusFilter);

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
      <AddPayment open={openAddPayment} handleClose={handleCloseAddPayment} hostelId={hostelId} currentStudent={currentStudent} />

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
            {t('Payment List')}
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
        sx={{ bgcolor: 'white', marginTop: '15px', px: 2 }}
      >
        <FormControl variant="filled" size="small" sx={{ width: 130, bgcolor: 'white' }}>
          <InputLabel sx={{ color: 'blue' }}>{t('Filter By Status')}</InputLabel>
          <Select
            value={status}
            onChange={handleStatusChange}
            defaultValue="All"
            label={t('"Filter By Status"')}
            sx={{ background: 'white' }}
          >
            <MenuItem value="All" sx={{ color: 'blue' }}>
              {t('All')}
            </MenuItem>
            <MenuItem value="Complete" sx={{ color: 'blue' }}>
              {t('Complete')}
            </MenuItem>
            <MenuItem value="Pending" sx={{ color: 'blue' }}>
              {t('Pending')}
            </MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            name="search"
            label={t('Search')}
            value={query}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            variant="standard"
            size="small"
            placeholder="Type to search by any field"
            sx={{ backgroundColor: 'transparent' }}
          />
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            {t('Add New')}
          </Button>
        </Stack>
      </Stack>

      <Box width="100%" sx={{ mt: '17px' }}>
        <Card sx={{ border: 'none', boxShadow: 'none' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell align="center">#</HeaderCell>
                  <HeaderCell align="center">{t('Student Name')}</HeaderCell>
                  <HeaderCell align="center">{t('Month')}</HeaderCell>
                  <HeaderCell align="center">{t('Library Amount')}</HeaderCell>
                  <HeaderCell align="center">{t('Food Amount')}</HeaderCell>
                  <HeaderCell align="center">{t('Hostel Rent')}</HeaderCell>
                  <HeaderCell align="center">{t('Monthly Total Rent')}</HeaderCell>
                  <HeaderCell align="center">{t('Monthly Paid Amount')}</HeaderCell>
                  <HeaderCell align="center">{t('Monthly Pending Amount')}</HeaderCell>
                  <HeaderCell align="center">{t('Status')}</HeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={row.id} sx={{ '& > *': { padding: '12px' } }}>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.studentName}
                      <br />
                      {row.studentPhoneNo}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.month}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.libraryAmount}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.foodAmount}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.hostelRent}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.monthlyTotalAmount}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      {row.paidAmount}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ color: row.monthlyPending > 0 ? 'red' : 'inherit', verticalAlign: 'middle', paddingX: '16px' }}
                    >
                      {row.monthlyPending}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: 'middle', paddingX: '16px' }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {row.monthlyPending > 0 ? (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                              minWidth: '70px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              borderRadius: '6px',
                              lineHeight: 1.2
                            }}
                          >
                            {t('Pending')}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{
                              minWidth: '70px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              borderRadius: '6px',
                              lineHeight: 1.2
                            }}
                          >
                            {t('Complete')}
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={paymentRecordsCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Box>
    </>
  );
};

export default PaymentList;
