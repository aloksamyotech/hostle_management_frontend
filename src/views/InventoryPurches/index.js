import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
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
  Link,
  Breadcrumbs
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import PurchaseInventory from './InventoryPurches';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'i18next';
import url from '../../constant/url.js';
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

const InventoryPurches = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [purchaseProduct, setPurchaseProduct] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editPurchase, setEditPurchase] = useState(null);
  const [deletePurchaseProduct, setDeletePurchaseProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditPurchase(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchPurchaseInventory(hostelId);
  };

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchPurchaseInventory(HosId);
  }, []);

  console.log('hostelId==>', hostelId);

  const fetchPurchaseInventory = async (hostelId) => {
    try {
      console.log('Url =>', `${REACT_APP_BACKEND_URL}/canteen_inventory_purches/index/${hostelId}`);
      // const response = await axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/index/${hostelId}`);
      const response = await axios.get(`${url.purchaseInventory.index}${hostelId}`);
      console.log('response==>', response);
      setPurchaseProduct(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching purchase inventory data:', error);
    }
  };

  //Handle Edit Action Here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);

    const product = purchaseProduct.find((product) => product._id === id);
    setEditPurchase(product);
  };
  console.log('editPurchase==>', editPurchase);

  //Handle Delete Action Here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeletePurchaseProduct(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/canteen_inventory_purches/delete/${deletePurchaseProduct}`);
      let response = await axios.delete(`${url.purchaseInventory.delete}${deletePurchaseProduct}`);
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchPurchaseInventory(hostelId);
    } catch (error) {
      console.error('Error deleting inventory:', error);
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
    <Link underline="hover" key="2" color="inherit" to="/dashboard/default" component={RouterLink}>
      {t('Dashboard')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('List')}
    </Typography>
  ];

  return (
    <>
      <PurchaseInventory open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editPurchase={editPurchase} />

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
            {t('Inventory Purchase')}
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
                    <HeaderCell align="center">#</HeaderCell>
                    <HeaderCell align="center">{t('Product Name')}</HeaderCell>
                    <HeaderCell align="center">{t('Quantity')}</HeaderCell>
                    <HeaderCell align="center">{t('Price')}</HeaderCell>
                    <HeaderCell align="center">{t('Date')}</HeaderCell>
                    <HeaderCell align="center">{t('Action')}</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseProduct.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row.productName}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row.quantity}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row.price}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {moment(row.date).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        <Stack direction="row" justifyContent={'center'}>
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
        <DialogTitle variant="h4">Delete Administrator</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('Are you sure you want to delete this Product')}?</Typography>
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
export default InventoryPurches;
