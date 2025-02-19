import { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tab,
  Tabs,
  Grid,
  CardMedia,
  Breadcrumbs
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Transgender as TransgenderIcon,
  FamilyRestroom as FamilyRestroomIcon,
  CalendarToday as CalendarTodayIcon,
  MeetingRoom as MeetingRoomIcon,
  LibraryBooks as LibraryBooksIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';

import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import TableStyle from '../../ui-component/TableStyle';
import { Avatar } from '@mui/material';
// import Cover from '../../../public/cover.jpg';
import HomeIcon from '@mui/icons-material/Home';
import Coverr from './cover.jpg';
import url from '../../constant/url.js';
const ProfileDetails = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [profileData, setProfileData] = useState(null);

  const [paymentData, setPaymentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [visitorData, setVisitorData] = useState([]);
  const [totalVisitorCount, setTotalVisitorCount] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [studentName, setStudentName] = useState('');

  const location = useLocation();
  console.log('location=>', location);
  const pathname = location.pathname;
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(location.state?.from || '/dashboard/student_reservation');
  };
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  console.log('id in profile componenet  ==>', id);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchStudentDetails();
    fetchStudentPaymentData();
    fetchVisitorData();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      console.log('Making API With This URL==>', `${REACT_APP_BACKEND_URL}/sudent_reservation/view/${id}`);
      const response = await axios.get(`${url.studentReservation.view}${id}`);
      console.log('API fetch StudentDetails response=>', response);
      setProfileData(response.data.result);

      setStudentName(response.data.result.studentName);
    } catch (error) {
      console.error('Error fetching reserved student details:', error);
    }
  };
  console.log('profileData===>', profileData);

  const fetchStudentPaymentData = async () => {
    try {
      console.log('Making API With This URL==>', `${REACT_APP_BACKEND_URL}/student_payment/paymenthistory/${id}`);
      const response = await axios.get(`${url.studentReservation.paymenthistory}${id}`);
      console.log('API Payment Data response=>', response);
      setPaymentData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching student payment details:', error);
    }
  };

  const fetchVisitorData = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/visitor/list/${id}`);
      const response = await axios.get(`${url.studentReservation.visitorlist}${id}`);
      console.log(' fetchVisitorData response===>', response);
      setVisitorData(response.data.result);
      setTotalVisitorCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching visitors data:', error);
    }
  };

  console.log('visitorData===>', visitorData);
  console.log('paymentData===>', paymentData);
  console.log('studentName===>', studentName);

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
      Dashboard
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      List
    </Typography>
  ];

  return (
    <>
      <Container>
        <Box sx={{ boxShadow: 3, borderRadius: '12px', maxWidth: '1200px', margin: 'auto', mb: 2, position: 'relative' }}>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ position: 'absolute', top: '10px', left: '20px', zIndex: 1000 }}
            onClick={handleBack}
          >
            <ArrowBack />
          </IconButton>
          <Box display="flex" justifyContent="center" width="100%">
            <img src={Coverr} alt="Aadhar Card" width="100%" height="200px" style={{ objectFit: 'cover', borderRadius: '1%' }} />
          </Box>

          <Grid container direction="row" alignItems="center" sx={{ padding: '20px', marginTop: '-50px' }} spacing={2}>
            <Grid item>
              <Avatar
                src={
                  profileData?.studentphoto
                    ? `${process.env.REACT_APP_BACKEND_URL}/uploads/students/${profileData.studentphoto}`
                    : 'path/to/placeholder.jpg'
                }
                alt="Student"
                sx={{
                  height: '150px',
                  width: '150px',
                  border: '4px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
            </Grid>

            <Grid item>
              <Typography variant="h5" fontSize="25px" sx={{ fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
                {profileData?.studentName || 'Student Name'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '0px' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Profile Details" />
              <Tab label="Payment History" />
              <Tab label="Visitor History" />
            </Tabs>
          </Box>
        </Box>

        {activeTab === 0 && (
          <>
            <Card
              style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
                marginTop: '10px',
                background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease-in-out',
                ':hover': {
                  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <Box p={3}>
                <Typography
                  variant="h4"
                  style={{
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '20px',
                    textAlign: 'center',
                    background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Profile Details
                </Typography>
                {profileData && (
                  <Grid container spacing={4} style={{ marginTop: '1vh' }}>
                    {/* Left Column */}
                    <Grid item xs={12} sm={4}>
                      <Card
                        style={{
                          padding: '16px',
                          background: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {[
                          { label: 'Student Name', value: profileData.studentName, icon: <PersonIcon /> },
                          { label: 'Student PhoneNo', value: profileData.studentPhoneNo, icon: <PhoneIcon /> },
                          { label: 'Email Id', value: profileData.email, icon: <EmailIcon /> },
                          { label: 'Date Of Birth', value: moment(profileData.dateOfBirth).format('DD-MM-YYYY'), icon: <CakeIcon /> },
                          { label: 'Gender', value: profileData.gender, icon: <TransgenderIcon /> },
                          { label: 'Fathers Name', value: profileData.fathersName, icon: <FamilyRestroomIcon /> },
                          { label: 'Fathers PhoneNo', value: profileData.fathersPhoneNo, icon: <PhoneIcon /> },
                          {
                            label: 'Address',
                            value: profileData.address + '   ' + profileData.city + ' ' + profileData.state,
                            icon: <HomeIcon />
                          },
                          { label: 'Start Date', value: moment(profileData.startDate).format('DD-MM-YYYY'), icon: <CalendarTodayIcon /> },
                          { label: 'End Date', value: moment(profileData.endDate).format('DD-MM-YYYY'), icon: <CalendarTodayIcon /> }
                        ].map((info, index) => (
                          <Box key={index} mb={2}>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: '600', color: '#34495e', display: 'flex', alignItems: 'center' }}
                            >
                              <span style={{ marginRight: '8px' }}>{info.icon}</span>
                              {info.label}:
                            </Typography>
                            <Typography variant="body2" style={{ color: '#7f8c8d', marginLeft: '24px' }}>
                              {info.value || '--'}
                            </Typography>
                          </Box>
                        ))}
                      </Card>
                    </Grid>

                    {/* Middle Column */}
                    <Grid item xs={12} sm={4}>
                      <Card
                        style={{
                          padding: '16px',
                          background: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {[
                          { label: 'Room Number', value: profileData.roomNumber, icon: <MeetingRoomIcon /> },
                          { label: 'Library Facility', value: profileData.isLibrary, icon: <LibraryBooksIcon /> },
                          { label: 'Food Facility', value: profileData.isFood, icon: <RestaurantIcon /> },
                          { label: 'Library Amount', value: profileData.libraryAmount, icon: <AttachMoneyIcon /> },
                          { label: 'Food Amount', value: profileData.foodAmount, icon: <AttachMoneyIcon /> },
                          { label: 'Hostel Monthly Rent:', value: profileData.hostelRent, icon: <AttachMoneyIcon /> },
                          { label: 'Advance Payment', value: profileData.advancePayment, icon: <CreditCardIcon /> },
                          { label: 'Monthly Total Rent', value: profileData.MonthlyTotalAmmount, icon: <AttachMoneyIcon /> },
                          { label: 'Total Rent till EndMonth', value: profileData.totalAmount, icon: <AttachMoneyIcon /> }
                        ].map((info, index) => (
                          <Box key={index} mb={2}>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: '600', color: '#34495e', display: 'flex', alignItems: 'center' }}
                            >
                              <span style={{ marginRight: '8px' }}>{info.icon}</span>
                              {info.label}:
                            </Typography>
                            <Typography variant="body2" style={{ color: '#7f8c8d', marginLeft: '24px' }}>
                              {info.value || '--'}
                            </Typography>
                          </Box>
                        ))}
                      </Card>
                    </Grid>

                    {/* Right Column - Aadhar Card Photo */}
                    <Grid item xs={12} sm={4}>
                      <Card
                        style={{
                          padding: '16px',
                          background: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            marginBottom: '10px',
                            textAlign: 'center'
                          }}
                        >
                          Student AadharCard Photo
                        </Typography>
                        {profileData.aadharcardphoto && (
                          <a
                            href={`${REACT_APP_BACKEND_URL}/uploads/students/${profileData.aadharcardphoto}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <CardMedia
                              component="img"
                              image={`${REACT_APP_BACKEND_URL}/uploads/students/${profileData.aadharcardphoto}`}
                              alt="aadharcardphoto"
                              style={{
                                width: '100%',
                                maxWidth: '200px',
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease-in-out',
                                ':hover': {
                                  transform: 'scale(1.05)'
                                }
                              }}
                              onError={(e) => {
                                console.error('Image failed to load:', e.target.src);
                                e.target.src = 'path/to/placeholder.jpg';
                              }}
                            />
                          </a>
                        )}
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Card>
          </>
        )}

        {activeTab === 1 && (
          <>
            <TableStyle>
              <Box width="100%" sx={{ mt: '10px' }}>
                <Card>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Monthly Paid Amount</TableCell>
                          <TableCell>Monthly Pending Amount</TableCell>
                          <TableCell>Total Amount</TableCell>
                          <TableCell>Total Pending Amount</TableCell>
                          <TableCell>Payment Method</TableCell>
                          <TableCell>Attachment</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {paymentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>{moment(row.paymentDate).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>{row.paidAmount}</TableCell>
                            {row.monthlyPending > 0 ? (
                              <>
                                <TableCell sx={{ color: 'red' }}>{row.monthlyPending}</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{row.monthlyPending}</TableCell>
                              </>
                            )}
                            <TableCell>{row.totalAmmount}</TableCell>
                            <TableCell>{row.totalPending}</TableCell>
                            <TableCell>{row.paymentType}</TableCell>
                            <TableCell>
                              {row.paymentAttachment && (
                                <a
                                  href={`${REACT_APP_BACKEND_URL}/uploads/payment/${row.paymentAttachment}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.paymentAttachment}
                                </a>
                              )}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center">
                                {row.monthlyPending > 0 ? (
                                  <Typography variant="body2" color="red">
                                    Pending
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" color="green">
                                    Complete
                                  </Typography>
                                )}
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
          </>
        )}

        {activeTab === 2 && (
          <>
            <TableStyle>
              <Box width="100%" sx={{ mt: '10px' }}>
                <Card>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Phone No.</TableCell>
                          <TableCell>Date & Time</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {visitorData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.visitorName}</TableCell>
                            <TableCell>{row.phoneNumber}</TableCell>
                            <TableCell>{moment(row.dateTime).format('DD-MM-YYYY HH:mm')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
                </Card>
              </Box>
            </TableStyle>
          </>
        )}
      </Container>
    </>
  );
};
export default ProfileDetails;
