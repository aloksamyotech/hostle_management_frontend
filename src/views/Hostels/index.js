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
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import AddHostel from './AddHostel';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { t } from 'i18next';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom';
const Hostel = () => {
  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editHostel, setEditHostel] = useState(null);
  const [deleteHostelId, setDeleteHostelId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchHostelData();
  }, [openAdd]);

  const fetchHostelData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/list`);
      console.log('response==>', response);
      setHostelData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    }
  };

  const handleNavigate = (_id) => {
    navigate(`/superadmindashboard/hostel/view/${_id}`);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditHostel(null);
  };

  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    console.log('edit on id =>', id);
    const hostel = hostelData.find((hostel) => hostel._id === id);
    setOpenAdd(true);
    setEditHostel(hostel);
  };

  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setDeleteHostelId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${REACT_APP_BACKEND_URL}/hostel/delete/${deleteHostelId}`);
      setOpenDeleteDialog(false);
      fetchHostelData();
    } catch (error) {
      console.error('Error deleting hostel:', error);
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
      <AddHostel open={openAdd} handleClose={handleCloseAdd} editHostelData={editHostel} />
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
              {t('View Details of Hostel')}
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
                      <TableCell align="center">{t('Hostel Name')}</TableCell>
                      <TableCell align="center">{t('Owner Name')}</TableCell>
                      <TableCell align="center">{t('Email Id')}</TableCell>
                      <TableCell align="center">{t('Hostel Contact no')}</TableCell>
                      <TableCell align="center">{t('Owner Contact no')}</TableCell>
                      <TableCell align="center">{t('Action')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hostelData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row._id}>
                        <TableCell
                          align="center"
                          sx={{ verticalAlign: 'middle' }}
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                          onClick={() => handleNavigate(row._id)}
                        >
                          {row.hostelName}
                        </TableCell>
                        <TableCell>{row.ownerName}</TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                          {row.email}
                        </TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                          {row.hostelPhoneNumber}
                        </TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                          {row.ownerPhoneNumber}
                        </TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
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

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('Delete Hostel')}</DialogTitle>
        <DialogContent>
          <Typography>{t('Are you sure you want to delete this Hostel?')}</Typography>
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

export default Hostel;
