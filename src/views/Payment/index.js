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
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/list/${hostelId}`);
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
                  <HeaderCell>#</HeaderCell>
                  <HeaderCell>{t('Student Name')}</HeaderCell>
                  <HeaderCell>{t('Month')}</HeaderCell>
                  <HeaderCell>{t('Library Amount')}</HeaderCell>
                  <HeaderCell>{t('Food Amount')}</HeaderCell>
                  <HeaderCell>{t('Hostel Rent')}</HeaderCell>
                  <HeaderCell>{t('Monthly Total Rent')}</HeaderCell>
                  <HeaderCell>{t('Monthly Paid Amount')}</HeaderCell>
                  <HeaderCell>{t('Monthly Pending Amount')}</HeaderCell>
                  <HeaderCell>{t('Status')}</HeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row.studentName}
                      <br />
                      {row.studentPhoneNo}
                    </TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.libraryAmount}</TableCell>
                    <TableCell>{row.foodAmount}</TableCell>
                    <TableCell>{row.hostelRent}</TableCell>
                    <TableCell>{row.monthlyTotalAmount}</TableCell>
                    <TableCell>{row.paidAmount}</TableCell>
                    <TableCell sx={{ color: row.monthlyPending > 0 ? 'red' : 'inherit' }}>{row.monthlyPending}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center">
                        {row.monthlyPending > 0 ? (
                          <Typography variant="body2" color="error">
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{
                                minWidth: '60px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                lineHeight: 1.2
                              }}
                            >
                              {t('Pending')}
                            </Button>
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="success">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{
                                minWidth: '60px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                lineHeight: 1.2
                              }}
                            >
                              {t('Complete')}
                            </Button>
                          </Typography>
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
