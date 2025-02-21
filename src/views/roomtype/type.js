import React, { useState, useCallback } from 'react';
import { Button, TextField, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { postApi } from 'constant/api.js';
const roomTypeValidationSchema = Yup.object({
  Roomtypee: Yup.string()
    .required('Room type name is required')
    .min(3, 'Room type name must be at least 3 characters long')
    .max(50, 'Room type name must be less than 50 characters')
});

const AddRoomTypeForm = ({ hostelId, open, handleClose }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { Roomtypee: '' },
    validationSchema: roomTypeValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await postApi(`${url.roomtype.addType}${hostelId}`, values);

        if (response.status === 201) {
          toast.success('Room type added successfully!');
          handleClose();
        } else {
          toast.error('Failed to add room type');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred while adding the room type.');
      } finally {
        setLoading(false);
      }
    }
  });

  const debouncedSubmit = useCallback(
    debounce(() => {
      if (formik.isValid && !formik.isSubmitting) {
        console.log('debauncing is working or not');

        formik.handleSubmit();
      }
    }, 500),
    [formik]
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('Add Room Type')}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormLabel htmlFor="Roomtypee">{t('Room Type Name')}</FormLabel>
          <TextField
            id="Roomtypee"
            name="Roomtypee"
            value={formik.values.Roomtypee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Roomtypee && Boolean(formik.errors.Roomtypee)}
            helperText={formik.touched.Roomtypee && formik.errors.Roomtypee}
            fullWidth
            size="small"
            margin="normal"
            required
            autoFocus
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          {t('Cancel')}
        </Button>
        <Button type="submit" onClick={debouncedSubmit} color="primary" disabled={loading || !formik.isValid}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoomTypeForm;
