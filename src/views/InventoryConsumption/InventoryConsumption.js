import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { productConsumeValidationSchema } from 'views/Validation/validationSchema';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { getApi, postApi, updateApi } from 'constant/api.js';
const ConsumptionInventory = (props) => {
  const { open, handleClose, hostelId, editConsumeProduct } = props;
  console.log('props==>', props);

  const [allPurchaseProducts, setAllPurchaseProducts] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && editConsumeProduct) {
      const formattedDate = moment(editConsumeProduct.date).format('YYYY-MM-DD');
      formik.setValues({
        productName: editConsumeProduct.productName || '',
        quantity: editConsumeProduct.quantity || '',
        date: formattedDate || ''
      });
    }
  }, [open, editConsumeProduct]);

  useEffect(() => {
    const fetchPurchaseInventory = async () => {
      if (!open || !hostelId) return;

      try {
        const response = await getApi(`${url.purchaseInventory.index}${hostelId}`);
        const productNames = response.data?.result?.map((product) => product?.productName) || [];

        console.log('Fetched Product Names:', productNames);
        setAllPurchaseProducts(productNames);
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };

    fetchPurchaseInventory();
  }, [open, hostelId]);

  const formik = useFormik({
    initialValues: {
      productName: '',
      quantity: '',
      date: ''
    },
    validationSchema: productConsumeValidationSchema,
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);

      try {
        let response;
        if (editConsumeProduct) {
          response = await updateApi(`${url.consumptionInventory.edit}${editConsumeProduct._id}`, values);
          if (response == 200) {
            toast.success('update successfully');
          }
        } else {
          response = await postApi(`${url.consumptionInventory.add}${hostelId}`, values);
          if (response.status === 200) {
            toast.success('Consume Added sussecesfully');
          }
        }

        if (response.status === 205) {
          toast.warning('Insufficient Consume Quantity');
        }

        if (response.status === 201 || response.status === 200) {
          handleClose();
          toast.success('Consume Added sussecesfully');
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log('Found Error', error);
      }
      setLoading(false);
    }
  });

  useEffect(() => {
    if (open && !editConsumeProduct) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">{t('Inventory Consumption')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Product List')}</FormLabel>
                <Select
                  id="productName"
                  name="productName"
                  size="small"
                  fullWidth
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {allPurchaseProducts.map((product) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.productName && formik.errors.productName ? (
                  <FormHelperText error>{formik.errors.productName}</FormHelperText>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Quantity')}</FormLabel>
                <TextField
                  id="quantity"
                  name="quantity"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  error={formik.touched.quantity && !!formik.errors.quantity}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Date & Time')}</FormLabel>
                <TextField
                  id="date"
                  name="date"
                  size="small"
                  type="date"
                  fullWidth
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && !!formik.errors.date}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              if (!loading && formik.isValid) {
                formik.handleSubmit();
              }
            }}
            style={{ textTransform: 'capitalize' }}
            color="secondary"
            disabled={loading || !formik.isValid}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>

          <Button
            onClick={() => {
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConsumptionInventory;
