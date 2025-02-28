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
  Link,
  Breadcrumbs
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import ConsumptionInventory from './InventoryConsumption';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
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

const InventoryConsumption = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allConsumeProducts, setConsumeProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editConsumeProduct, setEditConsumeProduct] = useState(null);
  const [deleteConsumeProduct, setDeleteConsumeProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditConsumeProduct(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchConsumptionProducts(hostelId);
  };

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchConsumptionProducts(HosId);
  }, []);
  console.log('hostelId==>', hostelId);

  const fetchConsumptionProducts = async (hostelId) => {
    try {
      const response = await getApi(`${url.consumptionInventory.index}${hostelId}`);

      setConsumeProducts(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching consume inventory data:', error);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);

    const product = allConsumeProducts.find((product) => product._id === id);
    setEditConsumeProduct(product);
  };

  //Handle Delete Action Here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteConsumeProduct(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/canteen_inventory_consume/delete/${deleteConsumeProduct}`);
      let response = await deleteApi(`${url.consumptionInventory.delete}${deleteConsumeProduct}`);
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchConsumptionProducts(hostelId);
    } catch (error) {
      console.error('Error deleting inventory:', error);
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
      <ConsumptionInventory open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editConsumeProduct={editConsumeProduct} />

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
            {t('Inventory Consumption')}
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
                    <HeaderCell align="center">{t('Consume Quantity')}</HeaderCell>
                    <HeaderCell align="center">{t('Remaning Quantity')}</HeaderCell>
                    <HeaderCell align="center">{t('Date')}</HeaderCell>
                    <HeaderCell align="center">{t('Action')}</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allConsumeProducts.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row?.productName}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row?.quantity}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row?.remaning}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {moment(row?.date).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        <Stack direction="row" justifyContent={'center'}>
                          <IconButton onClick={() => handleEdit(row?._id)} aria-label="edit" style={{ color: 'green' }}>
                            <EditOutlined />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row?._id)} aria-label="delete" style={{ color: 'red' }}>
                            <DeleteOutline />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </TableStyle>

      {/*-------------------- Dialog for Delete ----------------- */}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">{t('Delete Administrator')}</DialogTitle>
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
export default InventoryConsumption;
