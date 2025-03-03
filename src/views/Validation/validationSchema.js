// validationSchemas.js
import * as Yup from 'yup';
import { t } from 'i18next';
const FILE_SIZE = 1024 * 1024; // 1 MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

export const administratorValidationSchema = Yup.object({
  hostelId: Yup.string().required(t('Hostel Id is required')),
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, t('First name must contain only letters'))
    .required(t('First name is required')),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, t('Last name must contain only letters'))
    .required(t('Last name is required')),
  dateOfBirth: Yup.date().required(t('Date of Birth is required')),
  gender: Yup.string().required(t('Gender is required')),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  aadharCard: Yup.string()
    .matches(/^\d{12}$/, t('Aadhar Card ID must be exactly 12 digits'))
    .required(t('Aadhar Card ID is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  photo: Yup.string().required(t('Photo is required'))
});

export const addAdminValidationSchema = Yup.object({
  hostelId: Yup.string().required(t('Hostel is required')),
  firstName: Yup.string().required(t('First name is required')),
  lastName: Yup.string().required(t('Last name is required')),
  email: Yup.string().email(t('Invalid email format')).required(t('Email is required')),
  password: Yup.string().required(t('Password is required')),
  dateOfBirth: Yup.string().required(t('Date of birth is required')),
  gender: Yup.string().required(t('Gender is required')),
  phoneNumber: Yup.string().required(t('Phone number is required')),
  aadharCard: Yup.string().required(t('Aadhar card is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  photo: Yup.mixed().required(t('Photo is required'))
});

export const editAdminValidationSchema = Yup.object({
  hostelId: Yup.string().required(t('Hostel is required')),
  firstName: Yup.string().required(t('First name is required')),
  lastName: Yup.string().required(t('Last name is required')),
  dateOfBirth: Yup.string().required(t('Date of birth is required')),
  gender: Yup.string().required(t('Gender is required')),
  phoneNumber: Yup.string().required(t('Phone number is required')),
  aadharCard: Yup.string().required(t('Aadhar card is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required'))
});

// export const addStudentValidationSchema = Yup.object({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   email: Yup.string().email('Invalid email format').required('Email is required'),
//   password: Yup.string().required('Password is required'),
//   dateOfBirth: Yup.string().required('Date of birth is required'),
//   gender: Yup.string().required('Gender is required'),
//   phoneNumber: Yup.string().required('Phone number is required'),
//   aadharCardId: Yup.string().required('Aadhar card is required'),
//   state: Yup.string().required('State is required'),
//   city: Yup.string().required('City is required'),
//   address: Yup.string().required('Address is required'),
//   photo: Yup.mixed().required('Photo is required'),
//   studentHosId: Yup.mixed().required('Student Hostel Id is required'),
// });

// export const editStudentValidationSchema = Yup.object({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   dateOfBirth: Yup.string().required('Date of birth is required'),
//   gender: Yup.string().required('Gender is required'),
//   phoneNumber: Yup.string().required('Phone number is required'),
//   aadharCardId: Yup.string().required('Aadhar card is required'),
//   state: Yup.string().required('State is required'),
//   city: Yup.string().required('City is required'),
//   address: Yup.string().required('Address is required'),
//   studentHosId: Yup.mixed().required('Student Hostel Id is required'),
// });

export const studentValidationSchema = Yup.object({
  // hostelName:  Yup.string().required('hostelName is required'),
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, t('First name must contain only letters'))
    .required(t('First name is required')),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, t('Last name must contain only letters'))
    .required(t('Last name is required')),
  dateOfBirth: Yup.date().required(t('Date of Birth is required')),
  gender: Yup.string().required(t('Gender is required')),
  email: Yup.string().email(t('Invalid email')).required(t('Email is required')),
  password: Yup.string()
    .required(t('Password is required'))
    .min(8, t('Password must be at least 8 characters'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      t('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number')
    ),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  aadharCardId: Yup.string()
    .matches(/^\d{12}$/, t('Aadhar Card ID must be exactly 12 digits'))
    .required(t('Aadhar Card ID is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  photo: Yup.string().required(t('Photo is required')),
  studentHosId: Yup.string().required(t('Student Hostel Id is required'))
});

export const hostelValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, t('Name must contain only letters'))
    .required(t('Name is required')),
  email: Yup.string().email(t('Invalid email')).required(t('Email is required')),
  // password: Yup.string().required(t('Password is required')).min(8, t('Password must be at least 8 characters'))
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, t('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number')),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  uniqueCode: Yup.string().required(t('UniqueCode is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  photo: Yup.string().required(t('Photo is required')),
  noOfRoom: Yup.string().required(t('No of Room is required'))
});

export const hostelNewValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, t('Name must contain only letters'))
    .required(t('Hostel Name is required'))
    .max(30, 'can not accept more than 30 latters'),
  hostelPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, t('Name must contain only letters'))
    .required(t('Owner Name is required'))
    .max(30, 'not accept more than 30 words'),
  ownerPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  email: Yup.string().email(t('Invalid email')).required(t('Email is required')),
  password: Yup.string()
    .required(t('Password is required'))
    .min(8, t('Password must be at least 8 characters'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      t('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number')
    ),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  hostelphoto: Yup.string().required(t('Photo is required')),
  aadharphoto: Yup.string().required(t('Photo is required'))
});

export const editHostelValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, t('Name must contain only letters'))
    .required(t('Hostel Name is required')),
  hostelPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, t('Name must contain only letters'))
    .required(t('Owner Name is required')),
  ownerPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone number is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  hostelphoto: Yup.string().required(t('Photo is required')),
  aadharphoto: Yup.string().required(t('Photo is required'))
});

export const roomValidationSchema = Yup.object({
  roomNumber: Yup.string().required(t('Room number is required')),
  roomType: Yup.string().required(t('Select Room Type is required')),
  roomphoto: Yup.array()
    .of(
      Yup.mixed()
        .test('fileSize', t('File size too large'), (value) => !value || value.size <= FILE_SIZE)
        .test('fileFormat', t('Unsupported Format'), (value) => !value || SUPPORTED_FORMATS.includes(value.type))
    )
    .required(t('Room Photos is required'))
});

export const addStudentValidationSchema = Yup.object({
  studentName: Yup.string()
    .required(t('Student Name is required'))
    .min(3, t('Name should be at least three words'))
    .max(40, t('Cannot be taken more than 40')),
  studentPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone Number is required'))
    .min(10, t('Phone Number must be exactly 10 digits'))
    .max(10, t('Phone Number must be exactly 10 digits')),
  fathersName: Yup.string()
    .required(t('Father’s Name is required'))
    .min(3, t('Name should be at least three words'))
    .max(40, t('Cannot be taken more than 40')),
  fathersPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone Number is required'))
    .min(10, t('Phone Number must be exactly 10 digits'))
    .max(10, t('Phone Number must be exactly 10 digits')),
  dateOfBirth: Yup.date().required(t('Date of Birth is required')),
  gender: Yup.string().required(t('Gender is required')),
  email: Yup.string().email(t('Invalid email')).required(t('Email is required')),
  studentphoto: Yup.string().required(t('Student Photo is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  aadharcardphoto: Yup.string().required(t('Student AadharCard Photo is required')),
  roomNumber: Yup.string().required(t('Select Room is required')),
  startDate: Yup.date().required(t('Start Date is required')),
  endDate: Yup.date().required(t('End Date is required')).min(Yup.ref('startDate'), t('End Date must be after Start Date')),
  isLibrary: Yup.string(),
  isFood: Yup.string(),
  libraryAmount: Yup.number().nullable().integer(t('Library Amount must be an integer')),
  foodAmount: Yup.number().nullable().integer(t('Food Amount must be an integer')),
  hostelRent: Yup.number().required(t('Hostel Rent is required')).integer(t('Hostel Rent must be an integer')),
  advancePayment: Yup.number().required(t('Advance Payment is required')).integer(t('Advance Payment must be an integer'))
});

export const editStudentValidationSchema = Yup.object({
  studentName: Yup.string().required(t('Student Name is required')),
  studentPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone Number is required')),
  fathersName: Yup.string().required(t('Father’s Name is required')),
  fathersPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone Number is required')),
  dateOfBirth: Yup.date().required(t('Date of Birth is required')),
  gender: Yup.string().required(t('Gender is required')),
  email: Yup.string().email(t('Invalid email')).required(t('Email is required')),
  state: Yup.string().required(t('State is required')),
  city: Yup.string().required(t('City is required')),
  address: Yup.string().required(t('Address is required')),
  roomNumber: Yup.string().required(t('Select Room is required')),
  startDate: Yup.date().required(t('Start Date is required')),
  endDate: Yup.date().required(t('End Date is required')).min(Yup.ref('startDate'), t('End Date must be after Start Date')),
  isLibrary: Yup.string(),
  isFood: Yup.string(),
  libraryAmount: Yup.number().nullable().integer(t('Library Amount must be an integer')),
  foodAmount: Yup.number().nullable().integer(t('Food Amount must be an integer')).positive(t('Price must be a positive number')),
  hostelRent: Yup.number()
    .required(t('Hostel Rent is required'))
    .integer(t('Hostel Rent must be an integer'))
    .positive(t('Price must be a positive number')),
  advancePayment: Yup.number().required(t('Advance Payment is required')).integer(t('Advance Payment must be an integer'))
});

export const studentComplaintValidationSchema = Yup.object({
  datetime: Yup.date().min(new Date(), t('Date must be today or later')).required(t('Date and time are required')),
  problemDescription: Yup.string().required(t('Problem Description is required')),
  status: Yup.string().required(t('Status is required')),
  studentName: Yup.string().required('please  select the user')
});

export const visitorValidationSchema = Yup.object({
  visitorName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, t('Name must contain only letters'))
    .max(40, t('Can not be taken more than 40'))
    .required(t('Visitor Name is required')),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, t('Invalid phone number'))
    .required(t('Phone Number is required')),
  dateTime: Yup.string().required(t('Date Time is required'))
});

const today = new Date().toISOString().split('T')[0];

export const attendenceValidationSchema = Yup.object({
  studentHosId: Yup.string().required(t('Student-Hostel ID is required')),
  date: Yup.string()
    .required(t('Date is required'))
    .test('is-today', t('Date must be today'), function (value) {
      return value === today;
    }),
  outTime: Yup.string().required(t('Out Time is required'))

  // inTime: Yup.string().required('In Time is required'),
});

export const productValidationSchema = Yup.object({
  productName: Yup.string().required(t('Product Name is required')).max(30, t('Can not take more than 30 words')),
  mesurment: Yup.string().required(t('Measurement is required'))
});

export const productPurchesValidationSchema = Yup.object().shape({
  productName: Yup.string().required(t('Product is required')),
  quantity: Yup.number()
    .typeError(t('Quantity must be a number'))
    .required(t('Quantity is required'))
    .positive(t('Quantity must be a positive number')),
  price: Yup.number()
    .typeError(t('Price must be a number'))
    .required(t('Price is required'))
    .positive(t('Price must be a positive number')),
  date: Yup.date().required(t('Date is required'))
});

export const productConsumeValidationSchema = Yup.object().shape({
  productName: Yup.string().required(t('Product List is required')),
  quantity: Yup.number()
    .typeError(t('Quantity must be a number'))
    .required(t('Quantity is required'))
    .positive(t('Quantity must be a positive number')),
  date: Yup.date().required(t('Date is required'))
});

export const addExpenseValidationSchema = Yup.object().shape({
  expenseTitle: Yup.string().required(t('Expense Title is required')).max(40, t('can not be greater than 40 words')),
  price: Yup.number().required(t('Price is required')).positive(t('Price must be a positive number')),
  date: Yup.date().required(t('Date is required')),
  billPhoto: Yup.mixed().required(t('Bill Photo is required'))
});

export const editExpenseValidationSchema = Yup.object().shape({
  expenseTitle: Yup.string().required(t('Expense Title is required')),
  price: Yup.number().required(t('Price is required')).positive(t('Price must be a positive number')),
  date: Yup.date().required(t('Date is required'))
});

export const noticeValidationSchema = Yup.object().shape({
  noticeTitle: Yup.string().required(t('is required')),
  dateTime: Yup.date().required(t('Date Time is required')),
  description: Yup.string().required(t('Description is required'))
});

export const weeklyFoodValidationSchema = Yup.object().shape({
  weekdays: Yup.string().required(t('Weekdays is required')),
  foodType: Yup.string().required(t('Food Type is required')),
  foodDescription: Yup.string().required(t('Food Description is required'))
});

export const paymentValidationSchema = Yup.object({
  // studentName: Yup.string().required('Student Name is required'),
  month: Yup.string().required(t('Month is required')),
  paymentDate: Yup.date().required(t('Date is required')),
  paymentType: Yup.string().required(t('Payment Method is required')),
  paymentAmount: Yup.number().positive(t('Amount must be positive')).required(t('Payment Amount is required')),
  paymentAttachment: Yup.mixed().nullable()
});
