import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { FormLabel, InputAdornment, IconButton, List, ListItem } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { visitorValidationSchema } from 'views/Validation/validationSchema';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import url from 'constant/url';
import { getApi, postApi } from 'constant/api';

const AddVisotor = (props) => {
  const { open, handleClose, hostelId } = props;
  console.log('props===>', props);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);

  const [inputValue, setInputValue] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [selectedStudentPhoneNo, setSelectedStudentPhoneNo] = useState('');
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    if (open) {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
      getApi(`${url.dashboard.studentReservation}${hostelId}`)
        .then((response) => {
          console.log('in hook =>', response);
          const studentData = response.data.result
            .filter((student) => student.status !== 'deactive')
            .map((student) => ({
              studentName: student.studentName,
              studentPhoneNo: student.studentPhoneNo
            }));
          setStudentList(studentData);
        })
        .catch((error) => {
          console.log('Error fetching student data', error);
        });
    }
  }, [open, hostelId]);
  console.log('studentList== ==>', studentList);

  useEffect(() => {
    console.log('Filtering students with phone number input:', inputValue);
    if (inputValue) {
      console.log('inputValue======>', inputValue);
      const filteredStudents = studentList.filter((student) => {
        const phoneNo = student.studentPhoneNo?.toString();
        return phoneNo.includes(inputValue);
      });
      console.log('Filtered students:', filteredStudents);
      setFilteredStudentList(filteredStudents);
    } else {
      setFilteredStudentList([]);
    }
  }, [inputValue, studentList]);

  // Reset fields when dialog is closed
  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setInputValue('');
      setSelectedStudentName('');
      setSelectedStudentPhoneNo('');
    }
  }, [open]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setSelectedStudentName('');
    setSelectedStudentPhoneNo('');
  };

  const handleStudentSelect = (name, phoneNo) => {
    setSelectedStudentName(name);
    setSelectedStudentPhoneNo(phoneNo);
    setInputValue(name);
    formik.setFieldValue('studentName', name);
    formik.setFieldValue('studentPhoneNo', phoneNo);
    setFilteredStudentList([]);
  };

  const formik = useFormik({
    initialValues: {
      studentName: '',
      studentPhoneNo: '',
      visitorName: '',
      phoneNumber: '',
      dateTime: ''
    },
    validationSchema: visitorValidationSchema,
    onSubmit: async (values) => {
      if (loading) return;
      isLoading(true);

      // Handle form submission here
      console.log('Form values:==>', values);

      try {
        let response;
        response = await postApi(`${url.visitor.add}${hostelId}`, values);
        console.log('response ====rohitt>', response);
        if (response.status === 201) {
          toast.success('visits successfuly');
          handleClose();
        }
      } catch (error) {
        console.log('Found Error =>', error);
      } finally {
        isLoading(false);
      }
    }
  });

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
          <Typography variant="h6">{t('Visitor Basic Information')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Student List')}</FormLabel>
                <TextField
                  id="studentName"
                  name="studentName"
                  size="small"
                  fullWidth
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number"
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
                  <List style={{ border: '1px solid #ddd', marginTop: 4 }}>
                    {filteredStudentList.map((student) => (
                      <ListItem
                        key={student.studentPhoneNo}
                        onClick={() => handleStudentSelect(student.studentName, student.studentPhoneNo)}
                        style={{ cursor: 'pointer' }}
                      >
                        {student.studentName} - {student.studentPhoneNo}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Visitor Name')}</FormLabel>
                <TextField
                  id="visitorName"
                  name="visitorName"
                  size="small"
                  fullWidth
                  value={formik.values.visitorName}
                  onChange={formik.handleChange}
                  error={formik.touched.visitorName && !!formik.errors.visitorName}
                  helperText={formik.touched.visitorName && formik.errors.visitorName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Contact No')}</FormLabel>
                <TextField
                  id="phoneNumber"
                  name="phoneNumber"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Date & Time')}</FormLabel>
                <TextField
                  id="dateTime"
                  name="dateTime"
                  size="small"
                  type="datetime-local"
                  fullWidth
                  value={formik.values.dateTime}
                  onChange={formik.handleChange}
                  error={formik.touched.dateTime && !!formik.errors.dateTime}
                  helperText={formik.touched.dateTime && formik.errors.dateTime}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            {' '}
            {t('Save')}{' '}
          </Button>
          <Button onClick={handleClose} variant="outlined" color="error" disabled={loading}>
            {' '}
            {t('Cancel')}{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddVisotor;
