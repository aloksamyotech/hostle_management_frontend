import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LanguageSwitcher from 'views/switchLanguage/LanguageSwitcher';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';

import Cookies from 'js-cookie';
import axios from 'axios';
import Login from 'views/pages/authentication/authentication3/Login3';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const [adminId, setAdminId] = useState(null);

  const [hostelId, setHostelId] = useState(null);

  const [adminData, setAdminData] = useState(null);

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchAdminData(HosId);
  }, []);
  console.log('profile login id =>', hostelId);

  const anchorRef = useRef(null);
  const handleLogout = async () => {
    console.log('User Logout');

    Cookies.remove('Token');
    Cookies.remove('_Id');
    Cookies.remove('Role');

    navigate('/login');
    window.location.reload();
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const fetchAdminData = async (hostelId) => {
    try {
      if (!hostelId) {
        console.error('Hostel ID is missing.');
        return;
      }

      // Get role from cookies
      const userRole = Cookies.get('Role');
      console.log('User Role:', userRole);

      let response;

      if (userRole === 'SuperAdmin') {
        console.log('Fetching data from SuperAdmin model');

        response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/SuperAdmin/${hostelId}`);
      } else {
        console.log('Fetching data from Hostel model');

        response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/view/${hostelId}`);
      }

      console.log('Response from API:', response);

      if (response.data && response.data.result) {
        console.log('Data found');
        setAdminData(response.data.result);
      } else {
        console.error('Data not found for hostel ID:', hostelId);
        setAdminData(null);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setAdminData(null);
    }
  };

  console.log('adminData==>', adminData);

  return (
    <>
      <LanguageSwitcher icon={false} sx={{ padding: '0' }} />

      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Good Morning,</Typography>
                        {adminData ? (
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {adminData.ownerName || adminData.name}
                          </Typography>
                        ) : (
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            Loading...
                          </Typography>
                        )}
                      </Stack>
                      {adminData ? (
                        <Typography variant="subtitle2">Admin of {adminData.hostelName || 'SuperAdmin'}</Typography>
                      ) : (
                        <Typography variant="subtitle2">Fetching data...</Typography>
                      )}
                    </Stack>
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
