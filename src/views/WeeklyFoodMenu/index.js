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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Link,
  Breadcrumbs,
  Grid
} from '@mui/material';

import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import FoodMenu from './FoodMenu';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import { t } from 'i18next';
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

const WeeklyFoodMenu = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [hostelId, setHostelId] = useState(null);

  const [allFoodItem, setAllFoodItem] = useState([]);
  const [editFoodItem, setEditFoodItem] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteFoodId, setDeleteFoodId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchFoodMenuData(hostelId);
  };

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchFoodMenuData(HosId);
  }, []);
  console.log('hostelId==>', hostelId);

  //Fetch FoodMenu Data
  const fetchFoodMenuData = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/weeklyfoodmenu/index/${hostelId}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/weeklyfoodmenu/index/${hostelId}`);
      console.log('response===>', response);
      setAllFoodItem(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching visitors data:', error);
    }
  };

  //Handle Edit Action Here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    const foodmenu = allFoodItem.find((foodmenu) => foodmenu._id === id);
    setEditFoodItem(foodmenu);
  };
  console.log('editFoodItem==>', editFoodItem);

  //Handle Delete Action Here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteFoodId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/weeklyfoodmenu/delete/${deleteFoodId}`);
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/weeklyfoodmenu/delete/${deleteFoodId}`);
      console.log('delete =====> response =====>', response);
      setOpenDeleteDialog(false);
      fetchFoodMenuData(hostelId);
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

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
      <FoodMenu open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editFoodItem={editFoodItem} />
      <Container>
        <Grid
          container
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
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%', px: 2 }}>
              <Grid item>
                <Typography variant="subtitle1" sx={{ fontSize: '1.3rem' }}>
                  {t('Weekly Food Menu')}
                </Typography>
              </Grid>
              <Grid item>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end" sx={{ bgcolor: 'white', marginTop: '15px', height: '45px', px: 2 }}>
          <Grid item>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add New')}
            </Button>
          </Grid>
        </Grid>

        <TableStyle>
          <Grid container sx={{ mt: '17px' }}>
            <Grid item xs={12}>
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <HeaderCell>#</HeaderCell>
                        <HeaderCell>{t('Weekday')}</HeaderCell>
                        <HeaderCell>{t('Food Type')}</HeaderCell>
                        <HeaderCell>{t('Food Description')}</HeaderCell>
                        <HeaderCell>{t('Action')}</HeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allFoodItem.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.weekdays}</TableCell>
                          <TableCell>{row.foodType}</TableCell>
                          <TableCell>{row.foodDescription}</TableCell>
                          <TableCell>
                            <Grid container spacing={1}>
                              <Grid item>
                                <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" style={{ color: 'green' }}>
                                  <EditOutlined />
                                </IconButton>
                              </Grid>
                              <Grid item>
                                <IconButton onClick={() => handleDelete(row._id)} aria-label="delete" style={{ color: 'red' }}>
                                  <DeleteOutline />
                                </IconButton>
                              </Grid>
                            </Grid>
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
            </Grid>
          </Grid>
        </TableStyle>
      </Container>

      {/*-------------------- Dialog for Delete ----------------- */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">Delete Administrator</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('Are you sure you want to delete this Notice?')}</Typography>
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
export default WeeklyFoodMenu;
