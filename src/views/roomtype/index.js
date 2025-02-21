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
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Notices from './type.js';
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

const NoticeBoard = (props) => {
  console.log('rohiut malvita==========================================================', props);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [hostelId, setHostelId] = useState(null);

  const [allNotice, setAllNotices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editNotice, setEditNotice] = useState(null);
  const [deleteNoticeId, setDeleteNotice] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchNotices(hostelId);
  };

  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchNotices(HosId);
  }, []);
  console.log('hostelId=>', hostelId);

  const fetchNotices = async (hostelId) => {
    try {
      console.log('URL=>', `${REACT_APP_BACKEND_URL}/notice_board/index/${hostelId}`);
      const response = await getApi(`${url.roomtype.getType}${hostelId}`);
      console.log('response=============================  malviya rohit', response);
      setAllNotices(response.data);
      setTotalCount(response.data.length);
    } catch (error) {
      console.error('Error fetching notices data:', error);
    }
  };
  console.log('typess==================================>', allNotice);

  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    const notice = allNotice.find((notice) => notice._id === id);
    setEditNotice(notice);
  };

  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteNotice(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/notice_board/delete/${deleteNoticeId}`);
      let response = await deleteApi(`${url.roomtype.delete}${deleteNoticeId}`);
      console.log('delete =====> response =====>', response);
      setOpenDeleteDialog(false);
      fetchNotices(hostelId);
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
    <Link underline="hover" key="2" color="inherit">
      {t('Dashboard')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('List')}
    </Typography>
  ];

  return (
    <>
      <Notices open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editNotice={editNotice} />
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
            {t('Room Type')}
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
        <Box width="100%" marginTop={'17px'}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>#</HeaderCell>
                    <HeaderCell>{t('Notice Title')}</HeaderCell>

                    <HeaderCell>{t('Action')}</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allNotice.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.Roomtypee}</TableCell>

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
export default NoticeBoard;
