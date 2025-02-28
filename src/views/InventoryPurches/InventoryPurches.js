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
import { useFormik } from 'formik';
import { FormControl, FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { productPurchesValidationSchema } from 'views/Validation/validationSchema';

import { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { getApi, postApi, updateApi } from 'constant/api.js';
const PurchaseInventory = (props) => {
  const { open, handleClose, hostelId, editPurchase } = props;
  console.log('props==>', props);

  const [allProductList, setProductList] = useState([]);
  const [Loading, setLoading] = useState(false);

  //When Found editPurchase Data
  useEffect(() => {
    if (open && editPurchase) {
      const formattedDate = moment(editPurchase.date).format('YYYY-MM-DD');
      formik.setValues({
        productName: editPurchase.productName || '',
        quantity: editPurchase.quantity || '',
        price: editPurchase.price || '',
        date: formattedDate || ''
      });
    }
  }, [open, editPurchase]);

  //Get All Product Which Adeed
  useEffect(() => {
    if (open) {
      getApi(`${url.purchaseInventory.purchaseitem}${hostelId}`)
        .then((response) => {
          console.log('response for Product ==>', response);

          const ProductNames = response.data.result.map((product) => product['productName']);
          console.log('==>', ProductNames);
          setProductList(ProductNames);
        })
        .catch((error) => {
          console.log('Product List is not Found!!', error);
        });
    }
  }, [open]);
  console.log('allProductList==>', allProductList);

  const formik = useFormik({
    initialValues: {
      productName: '',
      quantity: '',
      price: '',
      date: ''
    },
    validationSchema: productPurchesValidationSchema,
    onSubmit: async (values) => {
      if (Loading) return;
      setLoading(true);
      console.log('Form is valid ====>', values);

      try {
        let response;
        if (editPurchase) {
          response = await updateApi(`${url.purchaseInventory.edit}${editPurchase._id}`, values);
        } else {
          response = await postApi(`${url.purchaseInventory.add}${hostelId}`, values);
        }

        if (response.status === 201 || response.status === 200) {
          toast.success('Inventory Purchase Add Successfully');

          handleClose();
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log('Found Error', error);
      } finally {
        setLoading(false);
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editPurchase) {
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
          <Typography variant="h6">{t('Inventory Purchase')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Product List</FormLabel>
                <Select
                  id="productName"
                  name="productName"
                  size="small"
                  fullWidth
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {allProductList.map((product) => (
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
                <FormLabel>{t('Price')}</FormLabel>
                <TextField
                  id="price"
                  name="price"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && !!formik.errors.price}
                  helperText={formik.touched.price && formik.errors.price}
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
              if (!Loading && formik.isValid) {
                formik.handleSubmit();
              }
            }}
            style={{ textTransform: 'capitalize' }}
            color="secondary"
            disabled={Loading || !formik.isValid}
          >
            {Loading ? 'Saving...' : 'Save'}
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
export default PurchaseInventory;
