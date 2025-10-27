import API_BASE_URL from "../../apiConfig";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Avatar, Typography, Box, CircularProgress, Paper,
  Grid, Container, Button,
  Modal, TextField, Chip, IconButton,
  Card, CardContent, Tooltip,
  useTheme, alpha, Backdrop,
  Tabs, Tab,
  useMediaQuery,
  Fab,
  Snackbar, SnackbarContent, useScrollTrigger,
  Menu, MenuItem, ListItemIcon,
  ListItemText,
  ToggleButton, ToggleButtonGroup,
  Breadcrumbs, Link,
  Fade,
  CardHeader,
  Stack,
  Divider,
  InputAdornment,
  Badge,
  LinearProgress,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import CallIcon from '@mui/icons-material/Call';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { ExitToApp } from "@mui/icons-material";
import { Home as HomeIcon2, Assessment, People, AccountCircle, Info, Camera, VerifiedUser } from "@mui/icons-material";

// Soft, Eye-Friendly Color Palette
const colors = {
  primary: '#f8f9fa',      // Very light gray
  secondary: '#495057',    // Soft dark gray
  accent: '#6c63ff',       // Soft purple
  accentLight: '#e7e5ff',  // Very light purple
  textPrimary: '#212529',  // Dark text
  textSecondary: '#6c757d', // Medium gray
  textLight: '#ffffff',    // White text
  background: '#ffffff',   // Clean white
  surface: '#ffffff',      // White surface
  border: '#dee2e6',       // Light border
  success: '#28a745',      // Soft green
  warning: '#ffc107',      // Soft yellow
  error: '#dc3545',        // Soft red
  info: '#17a2b8',         // Soft blue
  gradientPrimary: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  gradientAccent: 'linear-gradient(135deg, #6c63ff 0%, #8b82ff 100%)',
  gradientSoft: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
};

const shadows = {
  light: '0 2px 8px rgba(0,0,0,0.04)',
  medium: '0 4px 16px rgba(0,0,0,0.08)',
  heavy: '0 8px 24px rgba(0,0,0,0.12)',
  soft: '0 1px 4px rgba(0,0,0,0.04)',
  colored: '0 4px 16px rgba(108, 99, 255, 0.15)'
};

// Clean Container
const ProfileContainer = styled(Box)(({ theme }) => ({
  background: colors.background,
  minHeight: '100vh',
  py: 4,
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  px: 3,
}));

// Clean Breadcrumbs
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  '& .MuiBreadcrumbs-separator': {
    color: colors.textSecondary,
  },
  marginBottom: theme.spacing(3),
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.textSecondary,
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: colors.accent,
  },
}));

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.textPrimary,
  fontWeight: 600,
  fontSize: '0.9rem',
}));

// Clean Profile Header
const ProfileHeader = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  background: colors.gradientSoft,
  boxShadow: shadows.light,
  border: `1px solid ${colors.border}`,
}));

const ProfileHeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
  }
}));

const ProfileAvatarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  border: `3px solid ${colors.surface}`,
  boxShadow: shadows.medium,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: shadows.colored,
  }
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.8rem',
  color: colors.textPrimary,
  marginBottom: theme.spacing(0.5),
  lineHeight: 1.3,
}));

const ProfileSubtitle = styled(Typography)(({ theme }) => ({
  color: colors.textSecondary,
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 400,
}));

const ProfileActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  }
}));

// Clean Section Card
const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: 0,
  marginBottom: theme.spacing(3),
  background: colors.surface,
  boxShadow: shadows.light,
  border: `1px solid ${colors.border}`,
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 2, 3),
  borderBottom: `1px solid ${colors.border}`,
  background: colors.gradientSoft,
}));

const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Clean Tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: colors.primary,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: colors.textLight,
    backgroundColor: colors.accent,
  },
  '&:not(.Mui-selected)': {
    color: colors.textSecondary,
    '&:hover': {
      backgroundColor: colors.accentLight,
      color: colors.accent,
    }
  }
}));

// Clean View Toggle
const ViewToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const ViewToggleLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: colors.textSecondary,
  fontWeight: 500,
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: colors.primary,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.25),
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.75, 1.5),
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  '&.Mui-selected': {
    backgroundColor: colors.accent,
    color: colors.textLight,
  }
}));

// Clean Info Cards
const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  height: '100%',
  borderRadius: theme.spacing(1.5),
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: shadows.medium,
    borderColor: colors.accentLight,
  }
}));

const InfoCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
}));

const InfoCardIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  borderRadius: theme.spacing(1),
  backgroundColor: colors.accentLight,
  color: colors.accent,
  marginRight: theme.spacing(1.5),
}));

const InfoCardLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: colors.textSecondary,
  fontWeight: 500,
}));

const InfoCardValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: colors.textPrimary,
  fontWeight: 400,
  wordBreak: 'break-word',
}));

// Clean List Item
const ListItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.2s ease',
  backgroundColor: colors.primary,
  '&:hover': {
    backgroundColor: colors.accentLight,
  }
}));

const ListItemIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  borderRadius: theme.spacing(1),
  backgroundColor: colors.accentLight,
  color: colors.accent,
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const ListItemContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const ListItemLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: colors.textSecondary,
  fontWeight: 500,
  marginBottom: theme.spacing(0.25),
}));

const ListItemValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: colors.textPrimary,
  fontWeight: 400,
}));

// Clean Button
const CleanButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 500,
  padding: theme.spacing(1, 2.5),
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  boxShadow: 'none',
  ...(variant === 'contained' && {
    background: colors.accent,
    color: colors.textLight,
    '&:hover': {
      background: '#5a52d5',
      boxShadow: shadows.soft,
    }
  }),
  ...(variant === 'outlined' && {
    color: colors.accent,
    borderColor: colors.accent,
    '&:hover': {
      backgroundColor: colors.accentLight,
      borderColor: colors.accent,
    }
  }),
  ...(variant === 'text' && {
    color: colors.textSecondary,
    '&:hover': {
      backgroundColor: colors.primary,
      color: colors.accent,
    }
  })
}));

// Clean Modal
const StyledModal = styled(Modal)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
}));

const ModalContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '800px',
  backgroundColor: colors.surface,
  borderRadius: theme.spacing(2),
  boxShadow: shadows.heavy,
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: colors.gradientSoft,
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.3rem',
  color: colors.textPrimary,
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowY: 'auto',
  flex: 1,
}));

// Clean Form Field
const CleanTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    backgroundColor: colors.surface,
    '& fieldset': {
      borderColor: colors.border,
    },
    '&:hover fieldset': {
      borderColor: colors.accentLight,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.accent,
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: colors.textSecondary,
    '&.Mui-focused': {
      color: colors.accent,
    }
  }
}));

// Clean Image Preview
const ImagePreviewModal = styled(Modal)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
}));

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '80vh',
  borderRadius: theme.spacing(1),
  boxShadow: shadows.heavy,
  objectFit: 'contain',
}));

const ImagePreviewActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
}));

const ImagePreviewButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: colors.surface,
  color: colors.textPrimary,
  '&:hover': {
    backgroundColor: colors.accent,
    color: colors.textLight,
  }
}));

// Clean Edit Picture Section
const EditPictureSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: colors.primary,
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
  }
}));

const EditAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  border: `3px solid ${colors.surface}`,
  boxShadow: shadows.medium,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const EditPictureInfo = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const EditPictureActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

// Clean Loading State
const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60vh',
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 500,
  color: colors.textSecondary,
}));

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [person, setPerson] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [editImageZoomOpen, setEditImageZoomOpen] = useState(false);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const employeeNumber = localStorage.getItem('employeeNumber');
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/personalinfo/person_table`);
        const match = response.data.find(p => p.agencyEmployeeNum === employeeNumber);
        setPerson(match);

        if (match) {
          setProfilePicture(match.profile_picture);
          const formattedData = { ...match };
          if (match.birthDate) {
            const date = new Date(match.birthDate);
            if (!isNaN(date.getTime())) {
              formattedData.birthDate = date.toISOString().split('T')[0];
            }
          }
          setFormData(formattedData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setUploadStatus({ message: 'Failed to load profile data', type: 'error' });
        setNotificationOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [employeeNumber]);

  const handleEditOpen = () => {
    setEditOpen(true);
  };
  
  const handleEditClose = () => setEditOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/personalinfo/person_table/by-employee/${employeeNumber}`, formData);
      setPerson(formData);
      setEditOpen(false);
      setUploadStatus({ message: 'Profile updated successfully!', type: 'success' });
      setNotificationOpen(true);
    } catch (err) {
      console.error("Update failed:", err);
      setUploadStatus({ message: 'Failed to update profile', type: 'error' });
      setNotificationOpen(true);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !employeeNumber) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({ message: 'Please upload a valid image file (JPEG, PNG, GIF)', type: 'error' });
      setNotificationOpen(true);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus({ message: 'File size must be less than 5MB', type: 'error' });
      setNotificationOpen(true);
      return;
    }

    const fd = new FormData();
    fd.append('profile', file);

    try {
      setUploadStatus({ message: 'Uploading...', type: 'info' });
      setNotificationOpen(true);

      const res = await axios.post(
        `${API_BASE_URL}/upload-profile-picture/${employeeNumber}`,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );

      const newPicturePath = res.data.filePath;
      setProfilePicture(newPicturePath);

      if (person) {
        setPerson(prev => ({ ...prev, profile_picture: newPicturePath }));
      }

      setUploadStatus({ message: 'Profile picture updated successfully!', type: 'success' });
      setNotificationOpen(true);

    } catch (err) {
      console.error('Image upload failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload image. Please try again.';
      setUploadStatus({ message: errorMessage, type: 'error' });
      setNotificationOpen(true);
    }
  };

  const handleRemovePicture = () => {
    if (!person?.id) return;

    try {
      axios.delete(`${API_BASE_URL}/personalinfo/remove-profile-picture/${person.id}`);
      setProfilePicture(null);
      setPerson(prev => ({ ...prev, profile_picture: null }));
      setUploadStatus({ message: 'Profile picture removed successfully!', type: 'success' });
      setNotificationOpen(true);
    } catch (err) {
      console.error('Remove picture failed:', err);
      setUploadStatus({ message: 'Failed to remove picture.', type: 'error' });
      setNotificationOpen(true);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageZoom = () => {
    setImageZoomOpen(true);
  };

  const handleImageZoomClose = () => {
    setImageZoomOpen(false);
  };

  const handleEditImageZoom = () => {
    setEditImageZoomOpen(true);
  };

  const handleEditImageZoomClose = () => {
    setEditImageZoomOpen(false);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  const scrollToTop = () => {
    profileRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs = [
    { key: 0, label: 'Personal', icon: <PersonIcon /> },
    { key: 1, label: 'Gov. IDs', icon: <BadgeIcon /> },
    { key: 2, label: 'Addresses', icon: <HomeIcon /> },
    { key: 3, label: 'Contact', icon: <CallIcon /> },
    { key: 4, label: 'Family', icon: <GroupIcon /> },
    { key: 5, label: 'Education', icon: <SchoolIcon /> },
  ];

  const formFields = {
    0: [
      { label: "First Name", name: "firstName", icon: <PersonIcon fontSize="small" /> },
      { label: "Middle Name", name: "middleName", icon: <PersonIcon fontSize="small" /> },
      { label: "Last Name", name: "lastName", icon: <PersonIcon fontSize="small" /> },
      { label: "Name Extension", name: "nameExtension", icon: <PersonIcon fontSize="small" /> },
      { label: "Date of Birth", name: "birthDate", type: "date", icon: <CakeIcon fontSize="small" /> },
      { label: "Place of Birth", name: "placeOfBirth", icon: <LocationOnIcon fontSize="small" /> }
    ],
    1: [
      { label: "GSIS Number", name: "gsisNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "Pag-IBIG Number", name: "pagibigNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "PhilHealth Number", name: "philhealthNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "SSS Number", name: "sssNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "TIN Number", name: "tinNum", disabled: true, icon: <BadgeIcon fontSize="small" /> },
      { label: "Agency Employee Number", name: "agencyEmployeeNum", disabled: true, icon: <BadgeIcon fontSize="small" /> }
    ],
    2: [
      { label: "House & Lot Number", name: "permanent_houseBlockLotNum", icon: <HomeIcon fontSize="small" /> },
      { label: "Street", name: "permanent_streetName", icon: <HomeIcon fontSize="small" /> },
      { label: "Subdivision", name: "permanent_subdivisionOrVillage", icon: <HomeIcon fontSize="small" /> },
      { label: "Barangay", name: "permanent_barangay", icon: <HomeIcon fontSize="small" /> },
      { label: "City/Municipality", name: "permanent_cityOrMunicipality", icon: <HomeIcon fontSize="small" /> },
      { label: "Province", name: "permanent_provinceName", icon: <HomeIcon fontSize="small" /> },
      { label: "Zip Code", name: "permanent_zipcode", icon: <HomeIcon fontSize="small" /> }
    ],
    3: [
      { label: "Telephone", name: "telephone", icon: <CallIcon fontSize="small" /> },
      { label: "Mobile", name: "mobileNum", icon: <PhoneIcon fontSize="small" /> },
      { label: "Email", name: "emailAddress", icon: <EmailIcon fontSize="small" /> }
    ],
    4: [
      { label: "Spouse First Name", name: "spouseFirstName", icon: <GroupIcon fontSize="small" /> },
      { label: "Spouse Middle Name", name: "spouseMiddleName", icon: <GroupIcon fontSize="small" /> },
      { label: "Spouse Last Name", name: "spouseLastName", icon: <GroupIcon fontSize="small" /> },
      { label: "Spouse Occupation", name: "spouseOccupation", icon: <WorkIcon fontSize="small" /> }
    ],
    5: [
      { label: "Elementary School", name: "elementaryNameOfSchool", icon: <SchoolIcon fontSize="small" /> },
      { label: "Elementary Degree", name: "elementaryDegree", icon: <SchoolIcon fontSize="small" /> },
      { label: "Secondary School", name: "secondaryNameOfSchool", icon: <SchoolIcon fontSize="small" /> },
      { label: "Secondary Degree", name: "secondaryDegree", icon: <SchoolIcon fontSize="small" /> }
    ]
  };

  if (loading) {
    return (
      <ProfileContainer ref={profileRef}>
        <ContentWrapper>
          <LoadingContainer>
            <CircularProgress size={48} thickness={4} sx={{ color: colors.accent }} />
            <LoadingText variant="h6">Loading Profile...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </ProfileContainer>
    );
  }

  const renderTabContentGrid = (tabIndex) => {
    const fields = formFields[tabIndex] || [];
    
    return (
      <Grid container spacing={2}>
        {fields.map((field, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <InfoCard>
              <InfoCardHeader>
                <InfoCardIcon>
                  {field.icon}
                </InfoCardIcon>
                <InfoCardLabel variant="body2">
                  {field.label}
                </InfoCardLabel>
              </InfoCardHeader>
              <InfoCardValue variant="body1">
                {person?.[field.name] || '—'}
              </InfoCardValue>
            </InfoCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTabContentList = (tabIndex) => {
    const fields = formFields[tabIndex] || [];
    
    return (
      <Box>
        {fields.map((field, idx) => (
          <ListItemContainer key={idx}>
            <ListItemIconContainer>
              {field.icon}
            </ListItemIconContainer>
            <ListItemContent>
              <ListItemLabel variant="body2">
                {field.label}
              </ListItemLabel>
              <ListItemValue variant="body1">
                {person?.[field.name] || '—'}
              </ListItemValue>
            </ListItemContent>
          </ListItemContainer>
        ))}
      </Box>
    );
  };

  const renderFormFields = () => {
    const fields = formFields[tabValue] || [];
    
    return (
      <Grid container spacing={2}>
        {fields.map((field, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <CleanTextField
              fullWidth
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleFormChange}
              variant="outlined"
              disabled={field.disabled}
              type={field.type || 'text'}
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {field.icon}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <ProfileContainer ref={profileRef}>
      <ContentWrapper>
        {/* Breadcrumbs */}
        <Fade in timeout={300}>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink href="/dashboard">
              <HomeIcon2 sx={{ mr: 0.5, fontSize: 18 }} />
              Dashboard
            </BreadcrumbLink>
            <BreadcrumbText>
              <People sx={{ mr: 0.5, fontSize: 18 }} />
              Profile
            </BreadcrumbText>
          </StyledBreadcrumbs>
        </Fade>

        {/* Profile Header */}
        <Fade in timeout={500}>
          <ProfileHeader>
            <ProfileHeaderContent>
              <ProfileAvatarContainer>
                <ProfileAvatar
                  src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                  alt="Profile Picture"
                  onClick={handleImageZoom}
                >
                  {!profilePicture && <AccountCircle sx={{ fontSize: 60 }} />}
                </ProfileAvatar>
              </ProfileAvatarContainer>
              <ProfileInfo>
                <ProfileName>
                  {person ? `${person.firstName} ${person.middleName} ${person.lastName} ${person.nameExtension || ''}`.trim() : 'Employee Profile'}
                </ProfileName>
                <ProfileSubtitle>
                  <BadgeIcon fontSize="small" />
                  Employee No.: {person?.agencyEmployeeNum || '—'}
                </ProfileSubtitle>
              </ProfileInfo>
              <ProfileActions>
                <Tooltip title="Refresh profile">
                  <IconButton 
                    onClick={handleRefresh}
                    sx={{
                      backgroundColor: colors.primary,
                      color: colors.textSecondary,
                      '&:hover': {
                        backgroundColor: colors.accentLight,
                        color: colors.accent,
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <CleanButton
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditOpen}
                >
                  Edit Profile
                </CleanButton>
              </ProfileActions>
            </ProfileHeaderContent>
          </ProfileHeader>
        </Fade>

        {/* Employee Details Section */}
        <Fade in timeout={700}>
          <SectionCard>
            <SectionHeader>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                Employee Details
              </Typography>
              <Typography variant="body2" color={colors.textSecondary}>
                View and manage your personal information
              </Typography>
            </SectionHeader>
            <SectionContent>
              <ViewToggleContainer>
                <ViewToggleLabel>View Mode:</ViewToggleLabel>
                <StyledToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  aria-label="view mode"
                  size="small"
                >
                  <StyledToggleButton value="grid" aria-label="grid view">
                    <GridViewIcon />
                  </StyledToggleButton>
                  <StyledToggleButton value="list" aria-label="list view">
                    <ViewListIcon />
                  </StyledToggleButton>
                </StyledToggleButtonGroup>
              </ViewToggleContainer>

              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
              >
                {tabs.map((tab) => (
                  <StyledTab
                    key={tab.key}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                  />
                ))}
              </StyledTabs>

              {viewMode === 'grid' ? renderTabContentGrid(tabValue) : renderTabContentList(tabValue)}
            </SectionContent>
          </SectionCard>
        </Fade>

        {/* Edit Modal */}
        <StyledModal
          open={editOpen}
          onClose={handleEditClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={editOpen}>
            <ModalContainer>
              <ModalHeader>
                <ModalTitle>Edit Profile</ModalTitle>
                <IconButton onClick={handleEditClose} sx={{ color: colors.textSecondary }}>
                  <CloseIcon />
                </IconButton>
              </ModalHeader>

              <EditPictureSection>
                <EditAvatar
                  src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                  alt="Profile Picture"
                  onClick={handleEditImageZoom}
                >
                  {!profilePicture && <AccountCircle sx={{ fontSize: 50 }} />}
                </EditAvatar>
                <EditPictureInfo>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}>
                    Profile Picture
                  </Typography>
                  <Typography variant="body2" color={colors.textSecondary} sx={{ mb: 2 }}>
                    Click on the image to preview. Upload a professional headshot (max 5MB, JPEG/PNG)
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip 
                      icon={<PhotoSizeSelectActualIcon fontSize="small" />}
                      label="High Quality" 
                      size="small" 
                      sx={{ 
                        backgroundColor: colors.accentLight,
                        color: colors.accent,
                        fontWeight: 500
                      }} 
                    />
                    <Chip 
                      icon={<CropOriginalIcon fontSize="small" />}
                      label="Recommended: 400x400px" 
                      size="small" 
                      sx={{ 
                        backgroundColor: colors.primary,
                        color: colors.textSecondary,
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                </EditPictureInfo>
                <EditPictureActions>
                  <input
                    accept="image/*"
                    id="profile-picture-upload-modal"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handlePictureChange}
                  />
                  <label htmlFor="profile-picture-upload-modal">
                    <CleanButton
                      component="span"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Upload Photo
                    </CleanButton>
                  </label>
                  <CleanButton
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemovePicture}
                    fullWidth
                  >
                    Remove Photo
                  </CleanButton>
                </EditPictureActions>
              </EditPictureSection>

              <ModalBody>
                <Box sx={{ mb: 3 }}>
                  <StyledTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {tabs.map((tab) => (
                      <StyledTab
                        key={tab.key}
                        label={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                      />
                    ))}
                  </StyledTabs>
                </Box>

                {renderFormFields()}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <CleanButton
                    variant="text"
                    onClick={handleEditClose}
                  >
                    Cancel
                  </CleanButton>
                  <CleanButton
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </CleanButton>
                </Box>
              </ModalBody>
            </ModalContainer>
          </Fade>
        </StyledModal>

        {/* Image Preview Modal */}
        <ImagePreviewModal
          open={imageZoomOpen}
          onClose={handleImageZoomClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={imageZoomOpen}>
            <ImagePreviewContainer onClick={(e) => e.stopPropagation()}>
              <PreviewImage
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture Preview"
              />
              <ImagePreviewActions>
                <ImagePreviewButton
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : '';
                    link.download = 'profile-picture.jpg';
                    link.click();
                  }}
                  title="Download"
                >
                  <DownloadIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Profile Picture',
                        url: profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : ''
                      });
                    }
                  }}
                  title="Share"
                >
                  <ShareIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={handleImageZoomClose}
                  title="Close"
                >
                  <CloseIcon />
                </ImagePreviewButton>
              </ImagePreviewActions>
            </ImagePreviewContainer>
          </Fade>
        </ImagePreviewModal>

        {/* Edit Image Preview Modal */}
        <ImagePreviewModal
          open={editImageZoomOpen}
          onClose={handleEditImageZoomClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={editImageZoomOpen}>
            <ImagePreviewContainer onClick={(e) => e.stopPropagation()}>
              <PreviewImage
                src={profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : undefined}
                alt="Profile Picture Preview"
              />
              <ImagePreviewActions>
                <ImagePreviewButton
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : '';
                    link.download = 'profile-picture.jpg';
                    link.click();
                  }}
                  title="Download"
                >
                  <DownloadIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Profile Picture',
                        url: profilePicture ? `${API_BASE_URL}${profilePicture}?t=${Date.now()}` : ''
                      });
                    }
                  }}
                  title="Share"
                >
                  <ShareIcon />
                </ImagePreviewButton>
                <ImagePreviewButton
                  onClick={handleEditImageZoomClose}
                  title="Close"
                >
                  <CloseIcon />
                </ImagePreviewButton>
              </ImagePreviewActions>
            </ImagePreviewContainer>
          </Fade>
        </ImagePreviewModal>

        {/* Notification Snackbar */}
        <Snackbar
          open={notificationOpen}
          autoHideDuration={4000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <SnackbarContent
            sx={{
              backgroundColor: 
                uploadStatus.type === 'success' ? colors.success : 
                uploadStatus.type === 'error' ? colors.error : 
                uploadStatus.type === 'warning' ? colors.warning : colors.info,
              color: colors.textLight,
              fontWeight: 500,
              borderRadius: 1,
            }}
            message={uploadStatus.message}
            action={
              <IconButton size="small" color="inherit" onClick={handleNotificationClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Snackbar>

        {/* Scroll to Top Button */}
        {trigger && (
          <Fab 
            onClick={scrollToTop} 
            aria-label="scroll back to top"
            sx={{
              position: 'fixed',
              bottom: theme.spacing(3),
              right: theme.spacing(3),
              background: colors.accent,
              color: colors.textLight,
              boxShadow: shadows.medium,
              '&:hover': {
                background: '#5a52d5',
              }
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        )}
      </ContentWrapper>
    </ProfileContainer>
  );
};

export default Profile;