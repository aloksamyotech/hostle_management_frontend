import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import * as yup from 'yup';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { ArrowRightAlt } from '@mui/icons-material';
import { useState } from 'react';
import { t } from 'i18next';
import urll from '../../constant/url.js';
import { getApi, postApi, updateApi } from 'constant/api.js';
const roomValidationSchema = yup.object().shape({
  roomNumber: yup
    .string()
    .matches(/^[a-zA-Z0-9]{1,4}$/, t('Room number must be 1 to 4 characters (letters or numbers)'))
    .max(4, t('Room number cannot exceed 4 characters'))
    .required(t('Room number is required'))
});

const AddRoom = ({ open, handleClose, hostelId, editRoom }) => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      roomNumber: '',
      roomType: '',
      roomphoto: ''
    },
    validationSchema: roomValidationSchema,
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === 'roomphoto') {
          values.roomphoto.forEach((file) => formData.append('roomphoto', file));
        } else {
          formData.append(key, values[key]);
        }
      });

      try {
        const url = editRoom ? `${urll.room.edit}${editRoom._id}` : `${urll.room.add}${hostelId}`;
        const response = editRoom
          ? await updateApi(url, formData, {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`,
              'Content-Type': 'multipart/form-data'
            })
          : await postApi(url, formData, {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`,
              'Content-Type': 'multipart/form-data'
            });

        if (response?.status === 201 || response?.status === 200) {
          toast.success('Room added successfully!');
          handleClose();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error('This room number already exists.');
        } else {
          toast.error('An error occurred while adding the room.');
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const Fetchtype = async () => {
    try {
      const response = await getApi(`${urll.room.gettype}${hostelId}`);
      if (response) {
        setType(response?.data);
      }
    } catch (error) {
      console.log('something rong', error);
    }
  };
  useEffect(() => {
    Fetchtype();
    if (open) {
      if (editRoom) {
        formik.setValues({
          roomNumber: editRoom.roomNumber || '',
          roomType: editRoom.roomType || '',
          roomphoto: ''
        });
      } else {
        formik.resetForm();
      }
    }
  }, [open, editRoom]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Room Basic Details</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Room Number')}</FormLabel>
              <TextField
                id="roomNumber"
                name="roomNumber"
                size="small"
                fullWidth
                value={formik.values.roomNumber}
                onChange={formik.handleChange}
                error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                helperText={formik.touched.roomNumber && formik.errors.roomNumber}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Room Type')}</FormLabel>
              <Select id="roomType" name="roomType" size="small" fullWidth value={formik.values.roomType} onChange={formik.handleChange}>
                <MenuItem value="">{t('Select Room Type')}</MenuItem>
                {type.map((type) => (
                  <MenuItem key={type._id} value={type.Roomtypee}>
                    {type.Roomtypee}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.roomType && formik.errors.roomType && <FormHelperText error>{formik.errors.roomType}</FormHelperText>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Select Room Photos')}</FormLabel>
              <input
                id="roomphoto"
                name="roomphoto"
                type="file"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files);
                  formik.setFieldValue('roomphoto', files);
                }}
              />
              {formik.touched.roomphoto && formik.errors.roomphoto && <FormHelperText error>{formik.errors.roomphoto}</FormHelperText>}
            </Grid>
          </Grid>

          <DialogActions sx={{ mt: 2 }}>
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>

            <Button onClick={handleClose} variant="outlined" color="error">
              {t(' Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoom;
