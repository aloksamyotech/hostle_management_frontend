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
  IconButton,
  TablePagination,
  Breadcrumbs,
  Link
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddVisotor from './AddVisitor';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
// import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { t } from 'i18next';
import url from 'constant/url';
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

const Visitors = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [allVisitors, setAllVisitors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchVisitorData(hostelId);
  };

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchVisitorData(HosId);
  }, []);
  console.log('hostelId==>', hostelId);

  //Fetch Visitor's Data
  const fetchVisitorData = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/visitor/index/${hostelId}`);
      const response = await axios.get(`${url.visitor.index}${hostelId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });
      console.log('response===>', response);
      setAllVisitors(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching visitors data:', error);
    }
  };
  console.log('allVisitors==>', allVisitors);

  // Handle Pages
  const handleChangePage = (event, newPage) => {
    console.log('New Page:', newPage);
    setPage(newPage);
  };

  // Handle Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit">
      <HomeIcon color="secondary" />
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      {t('Dashboard')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('List')}
    </Typography>
  ];

  return (
    <>
      <AddVisotor open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} />

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
            {t('Visitor Basic Information')}
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
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            {t('Add New')}
          </Button>
        </Stack>
      </Stack>

      <TableStyle>
        <Box width="100%" sx={{ mt: '17px' }}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>#</HeaderCell>
                    <HeaderCell>{t('Student Name')}</HeaderCell>
                    <HeaderCell>{t('Visitor Name')}</HeaderCell>
                    <HeaderCell>{t('Phone No')}</HeaderCell>
                    <HeaderCell>{t('Date')}</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allVisitors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell>{row.visitorName}</TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{moment(row.dateTime).format('YYYY-MM-DD')}</TableCell>
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
    </>
  );
};
export default Visitors;
