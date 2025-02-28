import React from 'react';
import { Container, Typography, Box, Card, Grid, ImageList, ImageListItem } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import url from '../../constant/url.js';
import { useNavigate } from 'react-router-dom';
import { getApi } from 'constant/api.js';
const ViewRoom = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [roomDetail, setRoomDetails] = useState(null);
  const [beddetails, setbedDetails] = useState([]);
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    console.log('roomdatilas are coming or not =========================', roomDetail);
    console.log('bedDatils are  navigate  ======================>', roomDetail);
    console.log('_id==>', id);
    navigate(`/dashboard/student_reservation/view_profile/${id}`, {
      state: { from: `/dashboard/room/view/${roomDetail._id}` }
    });
  };

  const fetchRoomDetails = async () => {
    try {
      const { data } = await getApi(`${url.room.view}${id}`);
      setRoomDetails(data?.result || {});
      setbedDetails(data?.result.bedBookings || []);
      console.log('data=========================>rohit malviya', data?.result.bedBookings || []);
    } catch (err) {
      setError('Failed to fetch room details. Please try again.');
    }
  };
  console.log('bedDatils are ======================>', roomDetail);
  console.log('bed details are ========================================>', beddetails);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);
  console.log('roomDetail==>', roomDetail);

  return (
    <>
      <Container>
        <Box mb={2} display="flex" alignItems="center">
          <Link to="/dashboard/room" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ArrowBack style={{ marginRight: '8px' }} />
          </Link>
          <Typography variant="h4">View Room Details</Typography>
        </Box>
        <Card sx={{ mt: 3 }}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Room Information:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1">
                  <strong>Room Number:</strong> {roomDetail?.roomNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1">
                  <strong>Room Type:</strong> {roomDetail?.roomType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1">
                  <strong>Total No. of Beds:</strong> {roomDetail?.numOfBeds}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1">
                  <strong>Occupied Beds:</strong> {roomDetail?.occupiedBeds}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1">
                  <strong>Available Beds:</strong> {roomDetail?.availableBeds}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Card sx={{ mt: 3 }}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Bed Details:
            </Typography>
            <Grid container spacing={2}>
              {beddetails?.map((bed, index) => (
                <Grid item xs={12} sm={6} md={4} key={bed.bedId?.bedId || index}>
                  <Card sx={{ padding: 2, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Bed {index + 1}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        cursor: bed.studentName ? 'pointer' : 'default',
                        textDecoration: bed.studentName ? 'underline' : 'none',
                        color: bed.studentName ? 'blue' : 'inherit'
                      }}
                      onClick={bed.studentName ? () => handleNavigate(bed.id) : undefined}
                    >
                      {bed.studentName || 'Not Booked'}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>

        <Box mt={3}>
          <Card>
            <Box p={3}>
              <Typography variant="body1" gutterBottom>
                <strong>Room Images</strong>
              </Typography>
              <ImageList cols={3} rowHeight={164} gap={8}>
                {roomDetail?.roomphoto.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={`${REACT_APP_BACKEND_URL}/uploads/RoomImages/${roomDetail.roomphoto[index]}`}
                      alt={`Room ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default ViewRoom;
