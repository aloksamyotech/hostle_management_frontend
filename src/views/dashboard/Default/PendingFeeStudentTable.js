import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
  TableContainer,
  TableHead,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tab,
  Tabs
} from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';
import TableStyle from 'ui-component/TableStyle';
import { styled } from '@mui/material/styles';
import { t } from 'i18next';
import url from '../../../constant/url.js';
import { getApi } from '../../../constant/api.js';
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
  // '&:nth-of-type(even)': {
  //   backgroundColor: theme.palette.action.hover,
  // },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const PendingFeeStudent = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [paymentData, setPaymentData] = useState([]);
  const [hostelId, setHostelId] = useState(null);

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchPaymentData(Hos_Id);
  }, []);

  // Fetch All Payment Data Here
  const fetchPaymentData = async (hostelId) => {
    try {
      const response = await getApi(`${url.payments.list}${hostelId}`);
      console.log('response of api =======rohit', response);

      setPaymentData(response.data.result);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };
  console.log('paymentData===>', paymentData);

  return (
    <>
      <Container>
        <TableStyle>
          <Box width="100%" sx={{ mt: '10px' }}>
            <Card>
              <Stack direction="row" alignItems="center" justifyContent="space-between" padding={2}>
                <Typography variant="h4">{t('Pending Fee List')}</Typography>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell align="center">{t('Student Name')}</HeaderCell>
                      <HeaderCell align="center">{t('Month')}</HeaderCell>
                      <HeaderCell align="center">{t('Library Amount')}</HeaderCell>
                      <HeaderCell align="center">{t('Food Amount')}</HeaderCell>
                      <HeaderCell align="center">{t('Monthly Hostel Rent')}</HeaderCell>
                      <HeaderCell align="center">{t('Monthly Total Rent')}</HeaderCell>
                      <HeaderCell align="center">{t('Monthly Paid Amount')}</HeaderCell>
                      <HeaderCell align="center">{t('Monthly Pending Amount')}</HeaderCell>
                      <HeaderCell align="center">{t('Action')}</HeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paymentData.map((row) =>
                      row.monthlyPending > 0 ? (
                        <TableRow key={row.id}>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            <Box textAlign="center">
                              {row.studentName}
                              <br />
                              {row.studentPhoneNo}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ verticalAlign: 'middle' }}>{row.month}</TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            {row.libraryAmount}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            {row.foodAmount}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            {row.hostelRent}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            {row.monthlyTotalAmount}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            {row.paidAmount}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle', color: 'red' }}>
                            {row.monthlyPending}
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                minWidth: '60px',
                                padding: '2px 8px',
                                fontSize: '8px',
                                borderRadius: '6px',
                                lineHeight: 1.2
                              }}
                            >
                              {t('Send Message')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : null
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default PendingFeeStudent;
