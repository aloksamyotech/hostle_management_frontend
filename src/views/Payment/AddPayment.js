import React, { useState, useEffect } from 'react';
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
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  List,
  ListItem
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { paymentValidationSchema } from 'views/Validation/validationSchema';
import moment from 'moment';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import url from '../../constant/url.js';
import { getApi, postApi } from 'constant/api.js';

const AddPayment = (props) => {
  const { open, handleClose, hostelId, currentStudent } = props;

  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getApi(`${url.payments.index}${hostelId}`)
        .then((response) => {
          const studentData = response.data.result.map((student) => ({
            studentName: student.studentName,
            studentPhoneNo: student.studentPhoneNo,
            startDate: new Date(student.startDate),
            endDate: new Date(student.endDate)
          }));
          setStudentList(studentData);
        })
        .catch((error) => {
          console.log('Error fetching student data', error);
        });
    }
  }, [open, hostelId]);

  const getMonthsInRange = (startDate, endDate) => {
    const months = [];
    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();

    while (currentYear < endDate.getFullYear() || (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth())) {
      months.push(new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }));
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    return months;
  };

  useEffect(() => {
    if (inputValue) {
      const filteredStudents = studentList.filter((student) => {
        const phoneNo = student.studentPhoneNo?.toString();
        return phoneNo.includes(inputValue);
      });
      setFilteredStudentList(filteredStudents);
    } else {
      setFilteredStudentList([]);
    }
  }, [inputValue, studentList]);

  const handleStudentSelect = (name, startDate, endDate) => {
    setSelectedStudentName(name);
    setInputValue(name);

    const availableMonths = getMonthsInRange(new Date(startDate), new Date(endDate));
    setAvailableMonths(availableMonths);
    setFilteredStudentList([]);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setSelectedStudentName('');
  };

  const formik = useFormik({
    initialValues: {
      studentName: '',
      month: '',
      paymentDate: '',
      paymentType: '',
      paymentAmount: '',
      paymentAttachment: '',
      startDate: '',
      endDate: ''
    },
    validationSchema: paymentValidationSchema,
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);

      const formData = new FormData();
      formData.append('studentName', selectedStudentName);

      Object.keys(values).forEach((key) => {
        if (key !== 'studentName') {
          formData.append(key, values[key]);
        }
      });

      try {
        let response;
        if (currentStudent) {
          console.log('in if');
        } else {
          response = await postApi(`${url.payments.add}${hostelId}`, formData);
        }

        if (response?.status === 201 || response?.status === 200) {
          toast.success('Payment successfully done');
          setLoading(false);
          handleClose();
        } else {
          toast.error('Failed to save data');
        }
      } catch (error) {
        console.log('Error while submitting the form', error);
      }
    }
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setInputValue('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="add-payment-dialog-title">
      <DialogTitle id="add-payment-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Add Payment')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel>{t('Student Name')}</FormLabel>
              <TextField
                id="studentName"
                name="studentName"
                size="small"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                placeholder={t('Enter Phone Number')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setInputValue('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={formik.touched.studentName && !!formik.errors.studentName}
                helperText={formik.touched.studentName && formik.errors.studentName}
              />
              {filteredStudentList.length > 0 && (
                <List
                  style={{
                    border: '1px solid #ddd',
                    marginTop: 4,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    borderRadius: '4px'
                  }}
                >
                  {filteredStudentList.map((student) => (
                    <ListItem
                      key={student.studentPhoneNo}
                      onClick={() => handleStudentSelect(student.studentName, student.startDate, student.endDate)}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        transition: 'background-color 0.3s ease',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                      }}
                    >
                      <Typography variant="body1" style={{ fontWeight: '500' }}>
                        {student.studentName}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Month')}</FormLabel>
              <TextField
                id="month"
                name="month"
                size="small"
                select
                fullWidth
                value={formik.values.month}
                onChange={formik.handleChange}
                error={formik.touched.month && !!formik.errors.month}
              >
                <MenuItem value="">
                  <em>{t('Select Month')}</em>
                </MenuItem>
                {availableMonths.length > 0 ? (
                  availableMonths.map((month, index) => (
                    <MenuItem key={index} value={month}>
                      {t(month)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t('No available months')}</MenuItem>
                )}
              </TextField>
              {formik.touched.month && formik.errors.month && <FormHelperText error>{formik.errors.month}</FormHelperText>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Date')}</FormLabel>
              <TextField
                id="paymentDate"
                name="paymentDate"
                size="small"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formik.values.paymentDate}
                onChange={formik.handleChange}
                error={formik.touched.paymentDate && !!formik.errors.paymentDate}
                helperText={formik.touched.paymentDate && formik.errors.paymentDate}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>{t('Payment Method')}</FormLabel>
              <TextField
                id="paymentType"
                name="paymentType"
                size="small"
                select
                fullWidth
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                error={formik.touched.paymentType && !!formik.errors.paymentType}
              >
                <MenuItem value="">
                  <em>{t('Select Payment Method')}</em>
                </MenuItem>
                <MenuItem value="Cash">{t('Cash')}</MenuItem>
                <MenuItem value="Online Payment">{t('Online Payment')}</MenuItem>
                <MenuItem value="Bank Transfer">{t('Bank Transfer')}</MenuItem>
              </TextField>
              {formik.touched.paymentType && formik.errors.paymentType && (
                <FormHelperText error>{formik.errors.paymentType}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormLabel>{t('Payment Amount')}</FormLabel>
              <TextField
                id="paymentAmount"
                name="paymentAmount"
                size="small"
                type="number"
                fullWidth
                value={formik.values.paymentAmount}
                onChange={formik.handleChange}
                error={formik.touched.paymentAmount && !!formik.errors.paymentAmount}
                helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>{t('Payment Attachment (Optional)')}</FormLabel>
              <TextField
                id="paymentAttachment"
                name="paymentAttachment"
                size="small"
                type="file"
                fullWidth
                onChange={(e) => formik.setFieldValue('paymentAttachment', e.target.files[0])}
                error={formik.touched.paymentAttachment && !!formik.errors.paymentAttachment}
                helperText={formik.touched.paymentAttachment && formik.errors.paymentAttachment}
              />
            </Grid>

            <input type="hidden" name="startDate" value={formik.values.startDate} onChange={formik.handleChange} />
            <input type="hidden" name="endDate" value={formik.values.endDate} onChange={formik.handleChange} />
          </Grid>

          <DialogActions>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : t('Save')}
            </Button>

            <Button onClick={handleClose} variant="outlined" color="error">
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayment;
