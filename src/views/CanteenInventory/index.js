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
import { Link as RouterLink } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddInventory from './AddInventory';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import HomeIcon from '@mui/icons-material/Home';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { deleteApi, getApi, postApi } from 'constant/api';
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

const CanteenInventory = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allInventory, setAllInventory] = useState([]);
  const [editInventory, setEditInventory] = useState(null);
  const [deleteInventoryId, setDeleteInventoryId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openImportModal, setOpenImportModal] = useState(false);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditInventory(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchInventory(hostelId);
  };

  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchInventory(HosId);
  }, []);

  const fetchInventory = async (hostelId) => {
    try {
      const response = await getApi(`${url.canteenInventory.index}${hostelId}`);
      setAllInventory(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  const handleEdit = (id) => {
    setOpenAdd(true);
    let inventory = allInventory.find((inventory) => inventory._id === id);
    setEditInventory(inventory);
  };

  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setDeleteInventoryId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      let response = await deleteApi(`${url.canteenInventory.delete}${deleteInventoryId}`);
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchInventory(hostelId);
    } catch (error) {
      console.error('Error deleting inventory:', error);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('jsonData ====>', jsonData);

      try {
        const response = await postApi(`${url.canteenInventory.importFile}${hostelId}`, jsonData);

        if (response.status === 200) {
          fetchInventory(hostelId);
        } else {
          console.error('Failed to import items');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleOpenImportModal = () => {
    setOpenImportModal(true);
  };

  const handleCloseImportModal = () => {
    setOpenImportModal(false);
    fetchInventory(hostelId);
  };
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit">
      <HomeIcon color="secondary" />
    </Link>,
    <Link underline="hover" key="2" color="inherit" to="/dashboard/default" component={RouterLink}>
      Dashboard
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      List
    </Typography>
  ];

  return (
    <>
      <AddInventory open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editInventory={editInventory} />

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
            {t('Canteen Inventory')}
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
                    <HeaderCell align="center">{t('Measurement')}</HeaderCell>
                    <HeaderCell align="center">{t('Action')}</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allInventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row?.productName}
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        {row?.mesurment}
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

      {/* -------------------- for import button ------------------ */}

      <Dialog open={openImportModal} onClose={handleCloseImportModal} sx={{ minWidth: '500px', padding: '20px', borderRadius: '10px' }}>
        <DialogTitle>{t('Import Items File Form Here')}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Button variant="contained" component="label">
              {t('Upload File')}
              <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportModal} color="secondary">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CanteenInventory;
