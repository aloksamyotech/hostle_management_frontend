import { useState, useEffect } from 'react';
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
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Link,
  Breadcrumbs
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddComplaint from './AddComplaint';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
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

const ResidentComplaints = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [editComplaint, setEditComplaint] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditComplaint(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchAllComplaint(hostelId);
  };

  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchAllComplaint(HosId);
  }, []);
  console.log('hostelId ===>', hostelId);

  const fetchAllComplaint = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/student_complaint/index/${hostelId}`);
      const response = await getApi(`${url.studentComplaint.index}${hostelId}`, {});
      console.log('complaint response ===>', response);
      setAllComplaints(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  console.log('allComplaints=>', allComplaints);

  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    let complaint = allComplaints.find((complaint) => complaint._id === id);
    console.log('complaint==>', complaint);
    setEditComplaint(complaint);
  };
  console.log('editComplaint=>', editComplaint);

  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteStudentId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/student_complaint/deleteData/${deleteStudentId}`);
      let response = await deleteApi(`${url.studentComplaint.delete}${deleteStudentId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchAllComplaint(hostelId);
    } catch (error) {
      console.error('Error deleting complaint:', error);
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
      <AddComplaint open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editComplaint={editComplaint} />

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
            {t('Resident Complaint')}
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
        sx={{ bgcolor: 'white', marginTop: '15px', px: 2, height: '50px' }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            {t('Add New')}
          </Button>
        </Stack>
      </Stack>

      <TableStyle>
        <Box width="100%" mt={'16px'}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>#</HeaderCell>
                    <HeaderCell>{t('Contact Details')}</HeaderCell>
                    <HeaderCell>{t('Room No')}</HeaderCell>
                    <HeaderCell>{t('Date')}</HeaderCell>
                    <HeaderCell>{t('Discription')}</HeaderCell>
                    <HeaderCell>{t('Status')}</HeaderCell>
                    <HeaderCell>{t('Action')}</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allComplaints.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {row.studentName}
                        <br />
                        {row.studentPhoneNo}{' '}
                      </TableCell>
                      <TableCell>{row.roomNumber}</TableCell>
                      <TableCell>{moment(row.datetime).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{row.problemDescription}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          {row.status === 'register' ? (
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
                                {t('Register')}
                              </Button>
                            </Typography>
                          ) : row.status === 'in progress' ? (
                            <Typography variant="body2" color="warning">
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                sx={{
                                  minWidth: '60px',
                                  padding: '2px 8px',
                                  fontSize: '12px',
                                  borderRadius: '6px',
                                  lineHeight: 1.2
                                }}
                              >
                                {t('In Progress')}
                              </Button>
                            </Typography>
                          ) : row.status === 'complete' ? (
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
                          ) : null}
                        </Stack>
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

      {/*-------------------- Dialog for Delete ----------------- */}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">{t('Delete Administrator')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('Are you sure you want to delete this Room Details?')}</Typography>
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

export default ResidentComplaints;
