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
import { FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { weeklyFoodValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useEffect } from 'react';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { postApi, updateApi } from 'constant/api.js';
import { useState } from 'react';
const FoodMenu = (props) => {
  const { open, handleClose, hostelId, editFoodItem } = props;
  console.log('props===>', props);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [loading, isLoading] = useState(false);
  //When Found editRoom Data
  useEffect(() => {
    if (open && editFoodItem) {
      formik.setValues({
        weekdays: editFoodItem.weekdays || '',
        foodType: editFoodItem.foodType || '',
        foodDescription: editFoodItem.foodDescription || ''
      });
    }
  }, [open, editFoodItem]);

  const formik = useFormik({
    initialValues: {
      weekdays: '',
      foodType: '',
      foodDescription: ''
    },
    validationSchema: weeklyFoodValidationSchema,
    onSubmit: async (values) => {
      if (loading) return;
      isLoading(true);
      console.log('Form is valid ====>', values);

      try {
        let response;
        if (editFoodItem) {
          console.log('URL=>', `${REACT_APP_BACKEND_URL}/weeklyfoodmenu/edit/${editFoodItem._id}`);
          response = await updateApi(`${url.weeklyFoodMenu.edit}${editFoodItem._id}`, values);
        } else {
          response = await postApi(`${url.weeklyFoodMenu.add}${hostelId}`, values);
        }

        console.log('response==>', response);

        if (response.status === 201 || response.status === 200) {
          console.log('Notice Add Successfully !!');
          handleClose();
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log('Found Error =>', error);
      } finally {
        isLoading(false);
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editFoodItem) {
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
          <Typography variant="h6">{t('Weekly Food Menu')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Weekdays')}</FormLabel>
                <Select id="weekdays" name="weekdays" size="small" fullWidth value={formik.values.weekdays} onChange={formik.handleChange}>
                  <MenuItem value="Monday">{t('Monday')}</MenuItem>
                  <MenuItem value="Tuesday">{t('Tuesday')}</MenuItem>
                  <MenuItem value="Wednesday">{t('Wednesday')}</MenuItem>
                  <MenuItem value="Thursday">{t('Thursday')}</MenuItem>
                  <MenuItem value="Friday">{t('Friday')}</MenuItem>
                  <MenuItem value="Saturday">{t('Saturday')}</MenuItem>
                  <MenuItem value="Sunday">{t('Sunday')}</MenuItem>
                </Select>
                {formik.touched.weekdays && formik.errors.weekdays ? <FormHelperText error>{formik.errors.weekdays}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Food Type')}</FormLabel>
                <Select id="foodType" name="foodType" size="small" fullWidth value={formik.values.foodType} onChange={formik.handleChange}>
                  <MenuItem value="Breakfast">{t('Breakfast')}</MenuItem>
                  <MenuItem value="Lunch">{t('Lunch')}</MenuItem>
                  <MenuItem value="Dinner">{t('Dinner')}</MenuItem>
                </Select>
                {formik.touched.foodType && formik.errors.foodType ? <FormHelperText error>{formik.errors.foodType}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <FormLabel>{t('Food Description')}</FormLabel>
                <TextField
                  id="foodDescription"
                  name="foodDescription"
                  size="small"
                  multiline
                  fullWidth
                  rows={3}
                  value={formik.values.foodDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.foodDescription && !!formik.errors.foodDescription}
                  helperText={formik.touched.foodDescription && formik.errors.foodDescription}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit" disabled={loading}>
            {t('Save')}
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

export default FoodMenu;
