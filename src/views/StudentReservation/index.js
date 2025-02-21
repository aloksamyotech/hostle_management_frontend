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
  TableContainer,
  TableHead,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tab,
  Tabs,
  Link,
  Breadcrumbs
} from '@mui/material';
import Iconify from '../../ui-component/iconify';
import AddNewReservation from './AddNewReservation';

import TableStyle from '../../ui-component/TableStyle';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import VerifiedIcon from '@mui/icons-material/Verified';
import HomeIcon from '@mui/icons-material/Home';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { EditOutlined, DeleteOutline, VisibilityOutlined } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { deleteApi, getApi, updateApi } from 'constant/api';
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

const StudentReservation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [studentData, setStudentsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState({});

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchReserveStudentData(Hos_Id);
  }, []);

  // Fetch All Student Data Here
  const fetchReserveStudentData = async (hostelId) => {
    try {
      const response = await getApi(`${url.studentReservation.index}${hostelId}`);
      const students = response.data.result;
      setStudentsData(students);
      setTotalCount(response.data.totalRecodes);

      const initialStatus = {};
      students.forEach((student) => {
        initialStatus[student._id] = student.status === 'active';
      });
      setStatus(initialStatus);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchReserveStudentData(hostelId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNavigate = (id) => {
    navigate(`/dashboard/student_reservation/view_profile/${id}`);
  };

  const handleEdit = (id) => {
    setOpenAdd(true);
    let student = studentData.find((student) => student._id === id);
    setEditStudent(student);
  };

  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setDeleteStudentId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteApi(`${url.studentReservation.delete}${deleteStudentId}`);
      setOpenDeleteDialog(false);
      fetchReserveStudentData(hostelId);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // For Filter Search Input
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

  const filteredData = studentData.filter(generalFilter);
  console.log('fitered sutdent data is ==========================>', filteredData);
  // console.log(`http://localhost:4000/uploads/students/${filtered.studentphoto}`);

  const handleStatusToggle = async (id) => {
    const newStatus = !status[id];
    console.log('on id =>id', id, 'status=>', newStatus);
    // if(newStatus){
    //   status = 'active'
    // }else{
    //   status = 'deactive'
    // }
    try {
      console.log('url up =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/updateStatus/${id}`, {
        status: newStatus ? 'active' : 'deactive'
      });
      const response = await updateApi(`${url.studentReservation.updateStatus}${id}`, {
        status: newStatus ? 'active' : 'deactive'
      });
      console.log('url down =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/updateStatus/${id}`, {
        status: newStatus ? 'active' : 'deactive'
      });
      console.log('response     ===========>   ', response);
      setStatus((prevStatus) => ({ ...prevStatus, [id]: newStatus }));
      console.log('on id =========>id', id, 'status=>', newStatus);
    } catch (error) {
      console.error('Error updating student status:', error);
    }
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
      <AddNewReservation open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editStudent={editStudent} />

      <Container
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 0.5,
          px: 2
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontSize: '1.3rem' }}>
            {t('Student Details')}
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
        justifyContent="flex-end"
        spacing={2}
        sx={{ bgcolor: 'white', marginTop: '15px', px: 2, height: '45px' }}
      >
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

      <TableStyle>
        <Box width="100%" sx={{ mt: '17px' }}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>#</HeaderCell>

                    <HeaderCell>{t('Student Contact Details')}</HeaderCell>

                    <HeaderCell align="center">{t('Start Date')}</HeaderCell>
                    <HeaderCell align="center">{t('End Date')}</HeaderCell>
                    <HeaderCell align="center">{t('Room No')}</HeaderCell>
                    <HeaderCell align="center">{t('Address')}</HeaderCell>
                    <HeaderCell align="center">{t('Action')}</HeaderCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {index + 1}
                      </TableCell>

                      <TableCell align="center" sx={{ verticalAlign: 'middle' }} onClick={() => handleNavigate(row._id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={
                              row.studentphoto ? `${url.studentReservation.Uploadstudent}${row.studentphoto}` : 'path/to/placeholder.jpg'
                            }
                            alt="Student"
                            style={{ width: 50, height: 50, borderRadius: '50%' }}
                          />

                          <div>
                            <span
                              style={{
                                textDecoration: 'underline',
                                color: 'blue',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              {row.studentName}
                              <CheckCircleIcon sx={{ fontSize: 'small', marginLeft: 1 }} />
                            </span>
                            <br />

                            <span style={{ color: 'gray', fontSize: '14px' }}>{row.email}</span>
                            <br />

                            <span style={{ color: 'gray', fontSize: '14px' }}>{row.studentPhoneNo}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {moment(row.startDate).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {moment(row.endDate).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle', fontWeight: '800' }}>
                        {row.roomNumber}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row.city} {row.state} {row.address}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        <Stack direction="row">
                          <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" style={{ color: 'green' }}>
                            <EditOutlined />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row._id)} aria-label="delete" style={{ color: 'red' }}>
                            <DeleteOutline />
                          </IconButton>
                          <Switch checked={status[row._id]} color="primary" onChange={() => handleStatusToggle(row._id)} />
                          <IconButton onClick={() => handleNavigate(row._id)} aria-label="view" sx={{ color: 'blue' }}>
                            <VisibilityOutlined />
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

      {/*-------------------- Dialog for Delete ----------------- */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">Delete Administrator</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Student Details?</Typography>
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

export default StudentReservation;
