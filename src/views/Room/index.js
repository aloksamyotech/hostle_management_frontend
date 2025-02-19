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
import { styled } from '@mui/material/styles';
import Iconify from '../../ui-component/iconify';

import AddRoom from './AddRoom';
import { EditOutlined, DeleteOutline, VisibilityOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import HomeIcon from '@mui/icons-material/Home';
import { t } from 'i18next';
import url from '../../constant/url.js';
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

const Room = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditRoom(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchRoomsData(hostelId);
  };

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleNavigate = (id) => {
    navigate(`/dashboard/room/view/${id}`);
  };

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchRoomsData(Hos_Id);
  }, []);

  const fetchRoomsData = async (hostelId) => {
    try {
      const response = await axios.get(`${url.room.index}${hostelId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });
      console.log('response is ====================', response.data);

      setRoomData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handleEdit = (id) => {
    setOpenAdd(true);
    let room = roomData.find((room) => room._id === id);
    setEditRoom(room);
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
      await axios.delete(`${url.room.delete}${deleteStudentId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });

      setOpenDeleteDialog(false);
      fetchRoomsData(hostelId);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
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
      <AddRoom open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editRoom={editRoom} />

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
            {t('Room Basic Details')}
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

      <Box width="100%" sx={{ mt: '17px' }}>
        <Card sx={{ border: 'none', boxShadow: 'none' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell align="center">#</HeaderCell>

                  <HeaderCell align="center">{t('Room No')}</HeaderCell>
                  <HeaderCell align="center">{t('Room Type')}</HeaderCell>
                  <HeaderCell align="center">{t('Total No. of Beds')}</HeaderCell>
                  <HeaderCell align="center">{t('Occupied Beds')}</HeaderCell>
                  <HeaderCell align="center">{t('Available Beds')}</HeaderCell>
                  <HeaderCell align="center">{t('Action')}</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roomData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                      onClick={() => handleNavigate(row._id)}
                    >
                      {row.roomNumber}
                    </TableCell>
                    <TableCell align="center">{row.roomType}</TableCell>
                    <TableCell align="center">{row.numOfBeds}</TableCell>
                    <TableCell align="center">{row.occupiedBeds}</TableCell>
                    <TableCell align="center">{row.availableBeds}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" sx={{ color: 'green' }}>
                          <EditOutlined />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row._id)} aria-label="delete" sx={{ color: 'red' }}>
                          <DeleteOutline />
                        </IconButton>
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

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">Delete Room</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Room Details?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="contained" color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Room;
