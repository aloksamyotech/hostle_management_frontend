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
import { FormControl, FormHelperText, FormLabel, MenuItem, Select, IconButton, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import { addStudentValidationSchema, editStudentValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';
import { State, City } from 'country-state-city';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import url from 'constant/url';

const AddNewReservation = (props) => {
  const { open, handleClose, hostelId, editStudent } = props;
  console.log('props=====>', props);

  const [roomList, setRoomList] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const [existingStudentPhoto, setExistingStudentPhoto] = useState(null);
  const [existingAadharCardPhoto, setExistingAadharCardPhoto] = useState(null);

  const [roomDetails, setRoomDetails] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //When Found editStudent Data
  useEffect(() => {
    if (open && editStudent) {
      const formatteddateOfBirth = moment(editStudent.dateOfBirth).format('YYYY-MM-DD');
      const formattedstartDate = moment(editStudent.startDate).format('YYYY-MM-DD');
      const formattedendDate = moment(editStudent.endDate).format('YYYY-MM-DD');
      const formattedpaymentDateTime = moment(editStudent.paymentDateTime).format('YYYY-MM-DD');

      formik.setValues({
        studentName: editStudent.studentName || '',
        studentPhoneNo: editStudent.studentPhoneNo || '',
        fathersName: editStudent.fathersName || '',
        fathersPhoneNo: editStudent.fathersPhoneNo || '',
        dateOfBirth: formatteddateOfBirth || '',
        gender: editStudent.gender || '',
        email: editStudent.email || '',
        state: editStudent.state || '',
        city: editStudent.city || '',
        address: editStudent.address || '',
        roomNumber: editStudent.roomNumber || '',
        startDate: formattedstartDate || '',
        endDate: formattedendDate || '',
        isLibrary: editStudent.isLibrary || '',
        isFood: editStudent.isFood || '',
        libraryAmount: editStudent.libraryAmount || '',
        foodAmount: editStudent.foodAmount || '',
        hostelRent: editStudent.hostelRent || '',
        advancePayment: editStudent.advancePayment || ''
      });
      setSelectedState(editStudent.state || '');
      setExistingStudentPhoto(editStudent.studentphoto);
      setExistingAadharCardPhoto(editStudent.aadharcardphoto);
    }
  }, [open, editStudent]);

  useEffect(() => {
    if (open && hostelId) {
      console.log('Fetching rooms URL:', `${REACT_APP_BACKEND_URL}/room/index/${hostelId}`);
      axios
        .get(`${url.room.index}${hostelId}`)
        .then((response) => {
          setRoomDetails(response.data.result);
          console.log('Room response:', response.data.result);
          const roomNumbers = response.data.result.map((room) => room.roomNumber);
          setRoomList(roomNumbers);
        })
        .catch((error) => {
          console.log('Error fetching rooms:', error);
        });
    }
  }, [open, hostelId]);

  const formik = useFormik({
    initialValues: {
      studentName: '',
      studentPhoneNo: '',
      fathersName: '',
      fathersPhoneNo: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      studentphoto: '',
      state: '',
      city: '',
      address: '',
      aadharcardphoto: '',
      roomNumber: '',
      startDate: '',
      endDate: '',
      isLibrary: 'No',
      isFood: 'No',
      libraryAmount: 0,
      foodAmount: 0,
      hostelRent: '',
      advancePayment: ''
    },
    validationSchema: editStudent ? editStudentValidationSchema : addStudentValidationSchema,
    onSubmit: async (values) => {
      console.log('Form values==>', values);

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === 'studentphoto') {
          formData.append('studentphoto', values.studentphoto);
        } else if (key === 'aadharcardphoto') {
          formData.append('aadharcardphoto', values.aadharcardphoto);
        } else {
          formData.append(key, values[key]);
        }
      });

      for (let [key, value] of formData.entries()) {
        console.log(`formData==> ${key}: ${value}`);
      }

      try {
        let response;
        if (editStudent) {
          console.log('URL =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/edit/${editStudent._id}`);
          response = await axios.put(`${url.studentReservation.edit}${editStudent._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          console.log('URL =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/add/${hostelId}`);
          response = await axios.post(`${url.studentReservation.add}${hostelId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        console.log('response=========>', response);

        if (response.status === 201 || response.status === 200) {
          console.log('Student Reserve Successfully !!');
          toast.success('student reservation successfully done');
          handleClose();
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log('Found Error =>', error);
      }
    }
  });

  useEffect(() => {
    const countryCode = 'IN';
    const fetchAllStates = async () => {
      const allStates = State.getStatesOfCountry(countryCode);
      setStates(allStates);
    };
    fetchAllStates();
  }, []);

  const handleStateChange = (e) => {
    const getSelectedState = e.target.value;
    formik.handleChange(e);
    setSelectedState(getSelectedState);
  };

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        const allCities = City.getCitiesOfState('IN', selectedState);
        setCities(allCities);
      };
      fetchCities();
    }
  }, [selectedState]);

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editStudent) {
      formik.resetForm();
      setSelectedState('');
      setCities([]);
      setExistingStudentPhoto('');
      setExistingAadharCardPhoto('');
    }
  }, [open]);

  const handleRoomChange = (event) => {
    const selectedRoom = event.target.value;
    formik.setFieldValue('roomNumber', selectedRoom);

    // Find the room's available bed IDs
    const roomData = roomDetails.find((room) => room.roomNumber === selectedRoom);
    setAvailableBeds(roomData?.bedIDs || []);

    // Reset Bed ID when room changes
    formik.setFieldValue('bedId', '');
  };

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
          <Typography variant="h6">{t('Student Reservation')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              {/*----------------------- student basic credentials ----------------------  */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Student Name')}</FormLabel>
                <TextField
                  id="studentName"
                  name="studentName"
                  size="small"
                  fullWidth
                  value={formik.values.studentName}
                  onChange={formik.handleChange}
                  error={formik.touched.studentName && !!formik.errors.studentName}
                  helperText={formik.touched.studentName && formik.errors.studentName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Student Phone No')}.</FormLabel>
                <TextField
                  id="studentPhoneNo"
                  name="studentPhoneNo"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.studentPhoneNo}
                  onChange={formik.handleChange}
                  error={formik.touched.studentPhoneNo && Boolean(formik.errors.studentPhoneNo)}
                  helperText={formik.touched.studentPhoneNo && formik.errors.studentPhoneNo}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Fathers Name')}</FormLabel>
                <TextField
                  id="fathersName"
                  name="fathersName"
                  size="small"
                  fullWidth
                  value={formik.values.fathersName}
                  onChange={formik.handleChange}
                  error={formik.touched.fathersName && !!formik.errors.fathersName}
                  helperText={formik.touched.fathersName && formik.errors.fathersName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Fathers Phone No')}.</FormLabel>
                <TextField
                  id="fathersPhoneNo"
                  name="fathersPhoneNo"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.fathersPhoneNo}
                  onChange={formik.handleChange}
                  error={formik.touched.fathersPhoneNo && Boolean(formik.errors.fathersPhoneNo)}
                  helperText={formik.touched.fathersPhoneNo && formik.errors.fathersPhoneNo}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Date Of Birth')}</FormLabel>
                <TextField
                  name="dateOfBirth"
                  type="date"
                  size="small"
                  fullWidth
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <FormLabel>{t('Gender')}</FormLabel>
                  <RadioGroup row name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                    <FormControlLabel value="Male" control={<Radio />} label={t('Male')} />
                    <FormControlLabel value="Female" control={<Radio />} label={t('Female')} />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Email ID')}</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  size="small"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && !!formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Photo')}</FormLabel>
                <input
                  id="studentphoto"
                  name="studentphoto"
                  type="file"
                  size="small"
                  onChange={(event) => {
                    formik.setFieldValue('studentphoto', event.currentTarget.files[0]);
                    setExistingStudentPhoto(null);
                  }}
                />
                {existingStudentPhoto && !formik.values.studentphoto && <Typography>Current file: {existingStudentPhoto}</Typography>}
                {formik.values.studentphoto && formik.values.studentphoto.name && (
                  <Typography>Selected file: {formik.values.studentphoto.name}</Typography>
                )}
                {formik.touched.studentphoto && formik.errors.studentphoto && (
                  <FormHelperText error>{formik.errors.studentphoto}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('State')}</FormLabel>
                <Select id="state" name="state" size="small" fullWidth value={formik.values.state} onChange={handleStateChange}>
                  <MenuItem value="">{t('Select State')}</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.state && formik.errors.state ? <FormHelperText error>{formik.errors.state}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('City')}</FormLabel>
                <Select id="city" name="city" size="small" fullWidth value={formik.values.city} onChange={formik.handleChange}>
                  <MenuItem value="">{t('Select City')}</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.city && formik.errors.city ? <FormHelperText error>{formik.errors.city}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormLabel>{t('Address')}</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  size="small"
                  multiline
                  fullWidth
                  rows={4}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && !!formik.errors.address}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('AadharCard Photo')}</FormLabel>
                <input
                  id="aadharcardphoto"
                  name="aadharcardphoto"
                  type="file"
                  size="small"
                  onChange={(event) => {
                    formik.setFieldValue('aadharcardphoto', event.currentTarget.files[0]);
                    setExistingAadharCardPhoto(null);
                  }}
                />
                {existingAadharCardPhoto && !formik.values.aadharcardphoto && (
                  <Typography>Current file: {existingAadharCardPhoto}</Typography>
                )}
                {formik.values.aadharcardphoto && formik.values.aadharcardphoto.name && (
                  <Typography>Selected file: {formik.values.aadharcardphoto.name}</Typography>
                )}
                {formik.touched.aadharcardphoto && formik.errors.aadharcardphoto && (
                  <FormHelperText error>{formik.errors.aadharcardphoto}</FormHelperText>
                )}
              </Grid>
              {/*----------------------- student basic credentials ----------------------  */}

              {/* Room Number Selection */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Room Number')}</FormLabel>
                <Select
                  id="roomNumber"
                  name="roomNumber"
                  size="small"
                  fullWidth
                  value={formik.values.roomNumber}
                  onChange={handleRoomChange}
                  error={formik.touched.roomNumber && !!formik.errors.roomNumber}
                >
                  <MenuItem value="">Select Room Number</MenuItem>
                  {roomList.map((room) => (
                    <MenuItem key={room} value={room}>
                      {room}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.roomNumber && formik.errors.roomNumber && <FormHelperText error>{formik.errors.roomNumber}</FormHelperText>}
              </Grid>

              {/* Bed ID Selection (Only shown when a room is selected) */}
              {formik.values.roomNumber && availableBeds.length > 0 && (
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Bed ID')}</FormLabel>
                  <Select
                    id="bedId"
                    name="bedId"
                    size="small"
                    fullWidth
                    value={formik.values.bedId}
                    onChange={formik.handleChange}
                    error={formik.touched.bedId && !!formik.errors.bedId}
                  >
                    <MenuItem value="">Select Bed ID</MenuItem>
                    {availableBeds.map((bedId) => (
                      <MenuItem key={bedId} value={bedId}>
                        {bedId}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.bedId && formik.errors.bedId && <FormHelperText error>{formik.errors.bedId}</FormHelperText>}
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Start Date')}</FormLabel>
                <TextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  size="small"
                  fullWidth
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  error={formik.touched.startDate && !!formik.errors.startDate}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('End Date')}</FormLabel>
                <TextField
                  id="endDate"
                  name="endDate"
                  type="date"
                  size="small"
                  fullWidth
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  error={formik.touched.endDate && !!formik.errors.endDate}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Library Facility')}</FormLabel>
                <Select
                  id="isLibrary"
                  name="isLibrary"
                  size="small"
                  fullWidth
                  value={formik.values.isLibrary}
                  onChange={formik.handleChange}
                  error={formik.touched.isLibrary && !!formik.errors.isLibrary}
                  helperText={formik.touched.isLibrary && formik.errors.isLibrary}
                >
                  <MenuItem value={true}>{t('Yes')}</MenuItem>
                  <MenuItem value={false}>{t('No')}</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Food Facility')}</FormLabel>
                <Select
                  id="isFood"
                  name="isFood"
                  size="small"
                  fullWidth
                  value={formik.values.isFood}
                  onChange={formik.handleChange}
                  error={formik.touched.isFood && !!formik.errors.isFood}
                  helperText={formik.touched.isFood && formik.errors.isFood}
                >
                  <MenuItem value={true}>{t('Yes')}</MenuItem>
                  <MenuItem value={false}>{t('No')}</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Library Amount')}</FormLabel>
                <TextField
                  id="libraryAmount"
                  name="libraryAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.libraryAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.libraryAmount && !!formik.errors.libraryAmount}
                  helperText={formik.touched.libraryAmount && formik.errors.libraryAmount}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Food Amount')}</FormLabel>
                <TextField
                  id="foodAmount"
                  name="foodAmount"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.foodAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.foodAmount && !!formik.errors.foodAmount}
                  helperText={formik.touched.foodAmount && formik.errors.foodAmount}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Hostel Rent / Per Bed Rent')}</FormLabel>
                <TextField
                  id="hostelRent"
                  name="hostelRent"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.hostelRent}
                  onChange={formik.handleChange}
                  error={formik.touched.hostelRent && !!formik.errors.hostelRent}
                  helperText={formik.touched.hostelRent && formik.errors.hostelRent}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>{t('Advance Payment')}</FormLabel>
                <TextField
                  id="advancePayment"
                  name="advancePayment"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.advancePayment}
                  onChange={formik.handleChange}
                  error={formik.touched.advancePayment && !!formik.errors.advancePayment}
                  helperText={formik.touched.advancePayment && formik.errors.advancePayment}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            {t('Save')}
          </Button>
          <Button onClick={handleClose} variant="outlined" color="error">
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddNewReservation;
