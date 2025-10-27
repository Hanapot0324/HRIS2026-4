import API_BASE_URL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Tooltip,
  Avatar,
  Fade,
  Backdrop,
  styled,
  alpha,
  Breadcrumbs,
  Link,
  CardHeader,
  TablePagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Pages,
  Security,
  Group,
  Description,
  Warning,
  CheckCircle,
  Error,
  Home,
  Person,
  ViewList,
  FilterList,
  Refresh,
  SupervisorAccount,
  AdminPanelSettings,
  Work,
  Info,
  Category,
  Assignment,
  Assessment,
  Payment,
  Description as FormIcon,
  Folder,
  FolderSpecial,
} from '@mui/icons-material';
import AccessDenied from './AccessDenied';

// Professional styled components matching UsersList.jsx
const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: 'rgba(254, 249, 225, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 40px rgba(109, 35, 35, 0.08)',
  border: '1px solid rgba(109, 35, 35, 0.1)',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(109, 35, 35, 0.15)',
    transform: 'translateY(-4px)',
  },
}));

const ProfessionalButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  fontWeight: 600,
  padding: '12px 24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textTransform: 'none',
  fontSize: '0.95rem',
  letterSpacing: '0.025em',
  boxShadow:
    variant === 'contained' ? '0 4px 14px rgba(109, 35, 35, 0.25)' : 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow:
      variant === 'contained' ? '0 6px 20px rgba(109, 35, 35, 0.35)' : 'none',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      transform: 'translateY(-1px)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 20px rgba(109, 35, 35, 0.25)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },
}));

const PremiumTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(109, 35, 35, 0.06)',
  border: '1px solid rgba(109, 35, 35, 0.08)',
}));

const PremiumTableCell = styled(TableCell)(({ theme, isHeader = false }) => ({
  fontWeight: isHeader ? 600 : 500,
  padding: '18px 20px',
  borderBottom: isHeader
    ? '2px solid rgba(109, 35, 35, 0.3)'
    : '1px solid rgba(109, 35, 35, 0.06)',
  fontSize: '0.95rem',
  letterSpacing: '0.025em',
}));

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [pageDescription, setPageDescription] = useState('');
  const [pageGroups, setPageGroups] = useState([]);
  const [pageName, setPageName] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletePageId, setDeletePageId] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [addDialog, setAddDialog] = useState(false);

  const navigate = useNavigate();

  // Page access control states
  const [hasAccess, setHasAccess] = useState(null);

  // Color scheme matching UsersList.jsx
  const primaryColor = '#FEF9E1';
  const secondaryColor = '#FFF8E7';
  const accentColor = '#6d2323';
  const accentDark = '#8B3333';

  // Page description options for dropdown
  const descriptionOptions = [
    'General',
    'Registration',
    'Information management',
    'Attendance management',
    'Payroll management',
    'Form',
    'Pages management',
    'Personal Data Sheets'
  ];

  // Access group options for multi-select
  const accessGroupOptions = [
    'superadmin',
    'administrator',
    'staff'
  ];

  // Page access control
  useEffect(() => {
    const userId = localStorage.getItem('employeeNumber');
    const pageId = 1;

    if (!userId) {
      setHasAccess(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setHasAccess(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/page_access/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const accessData = await response.json();
          const hasPageAccess = accessData.some(
            (access) =>
              access.page_id === pageId && String(access.page_privilege) === '1'
          );
          setHasAccess(hasPageAccess);
        } else if (response.status === 401 || response.status === 403) {
          console.log('Token expired or invalid');
          localStorage.clear();
          window.location.href = '/';
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, []);

  useEffect(() => {
    if (hasAccess) {
      fetchPages();
    }
  }, [hasAccess]);

  useEffect(() => {
    const filtered = pages.filter((pg) => {
      const matchesSearch =
        (pg.page_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pg.page_description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pg.page_url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pg.id || '').includes(searchTerm);

      const matchesDescription = descriptionFilter
        ? (pg.page_description || '').toLowerCase() === descriptionFilter.toLowerCase()
        : true;

      return matchesSearch && matchesDescription;
    });

    setFilteredPages(filtered);
    setPage(0);
  }, [searchTerm, descriptionFilter, pages]);

  const fetchPages = async () => {
    setLoading(true);
    setRefreshing(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/pages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const sortedPages = data.sort((a, b) => a.id - b.id);
        setPages(sortedPages);
        setFilteredPages(sortedPages);

        if (refreshing && pages.length > 0) {
          setSuccessMessage('Pages list refreshed successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to fetch pages');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setErrorMessage('Error fetching pages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!pageName.trim() || !pageDescription.trim() || pageGroups.length === 0) {
      setErrorMessage('Page name, description, and at least one access group are required');
      setLoading(false);
      return;
    }

    const pageData = {
      page_name: pageName.trim(),
      page_description: pageDescription.trim(),
      page_url: pageUrl.trim() || null,
      page_group: pageGroups.join(','), // Join array into comma-separated string
    };

    try {
      const url = currentPageId
        ? `${API_BASE_URL}/pages/${currentPageId}`
        : `${API_BASE_URL}/pages`;

      const method = currentPageId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage(
          currentPageId
            ? 'Page updated successfully!'
            : 'Page created successfully!'
        );
        await fetchPages();
        if (currentPageId) {
          setEditDialog(false);
        } else {
          setAddDialog(false);
        }
        resetForm();
      } else {
        setErrorMessage(
          responseData.error ||
            `Failed to ${currentPageId ? 'update' : 'create'} page`
        );
      }
    } catch (error) {
      console.error('Error saving page:', error);
      setErrorMessage('Network error occurred while saving page');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPageId(null);
    setPageName('');
    setPageDescription('');
    setPageUrl('');
    setPageGroups([]);
  };

  const cancelEdit = () => {
    resetForm();
    setEditDialog(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const cancelAdd = () => {
    resetForm();
    setAddDialog(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEdit = (pg) => {
    setCurrentPageId(pg.id);
    setPageName(pg.page_name || '');
    setPageDescription(pg.page_description || '');
    setPageUrl(pg.page_url || '');
    // Split the comma-separated groups into an array
    const groups = pg.page_group ? pg.page_group.split(',').map(g => g.trim()) : [];
    setPageGroups(groups);
    setEditDialog(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDeleteConfirm = (id) => {
    setDeletePageId(id);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${deletePageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setSuccessMessage('Page deleted successfully!');
        await fetchPages();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      setErrorMessage('Error deleting page');
    } finally {
      setLoading(false);
      setDeleteDialog(false);
      setDeletePageId(null);
    }
  };

  const getDescriptionColor = (description) => {
    switch (description?.toLowerCase()) {
      case 'general':
        return {
          sx: { bgcolor: alpha(accentColor, 0.15), color: accentColor },
          icon: <Category />,
        };
      case 'registration':
        return {
          sx: { bgcolor: alpha(accentDark, 0.15), color: accentDark },
          icon: <Assignment />,
        };
      case 'information management':
        return {
          sx: { bgcolor: alpha(accentColor, 0.1), color: accentColor },
          icon: <Info />,
        };
      case 'attendance management':
        return {
          sx: { bgcolor: alpha(accentColor, 0.12), color: accentColor },
          icon: <Assessment />,
        };
      case 'payroll management':
        return {
          sx: { bgcolor: alpha(accentDark, 0.12), color: accentDark },
          icon: <Payment />,
        };
      case 'form':
        return {
          sx: { bgcolor: alpha(accentColor, 0.08), color: accentColor },
          icon: <FormIcon />,
        };
      case 'pages management':
        return {
          sx: { bgcolor: alpha(accentColor, 0.18), color: accentColor },
          icon: <FolderSpecial />,
        };
      case 'personal data sheets':
        return {
          sx: { bgcolor: alpha(accentDark, 0.18), color: accentDark },
          icon: <Folder />,
        };
      default:
        return {
          sx: { bgcolor: alpha(accentColor, 0.1), color: accentColor },
          icon: <Description />,
        };
    }
  };

  const getGroupColor = (group) => {
    switch (group?.toLowerCase()) {
      case 'superadmin':
        return {
          sx: { bgcolor: alpha(accentColor, 0.15), color: accentColor },
          icon: <SupervisorAccount />,
        };
      case 'administrator':
        return {
          sx: { bgcolor: alpha(accentDark, 0.15), color: accentDark },
          icon: <AdminPanelSettings />,
        };
      case 'staff':
        return {
          sx: { bgcolor: alpha(accentColor, 0.1), color: accentColor },
          icon: <Work />,
        };
      default:
        return {
          sx: { bgcolor: alpha(accentColor, 0.1), color: accentColor },
          icon: <Person />,
        };
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPages = filteredPages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Loading state
  if (hasAccess === null) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: accentColor, mb: 2 }} />
          <Typography variant="h6" sx={{ color: accentColor }}>
            Loading access information...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Access denied state
  if (!hasAccess) {
    return (
      <AccessDenied
        title="Access Denied"
        message="You do not have permission to access Page Management. Contact your administrator to request access."
        returnPath="/admin-home"
        returnButtonText="Return to Home"
      />
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 50%, ${accentColor} 100%)`,
        py: 4,
        borderRadius: '14px',
        width: '100vw',
        mx: 'auto',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        minHeight: '92vh',
      }}
    >
      <Box sx={{ px: 6, mx: 'auto', maxWidth: '1600px' }}>
        {/* Breadcrumbs */}
        <Fade in timeout={300}>
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.9rem' }}>
              <Link
                underline="hover"
                color="inherit"
                href="/dashboard"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: primaryColor,
                }}
              >
                <Home sx={{ mr: 0.5, fontSize: 20 }} />
                Dashboard
              </Link>
              <Typography
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  color: primaryColor,
                }}
              >
                <Pages sx={{ mr: 0.5, fontSize: 20 }} />
                Page Management
              </Typography>
            </Breadcrumbs>
          </Box>
        </Fade>

        {/* Header */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <GlassCard>
              <Box
                sx={{
                  p: 5,
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  color: accentColor,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background:
                      'radial-gradient(circle, rgba(109,35,35,0.1) 0%, rgba(109,35,35,0) 70%)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: '30%',
                    width: 150,
                    height: 150,
                    background:
                      'radial-gradient(circle, rgba(109,35,35,0.08) 0%, rgba(109,35,35,0) 70%)',
                  }}
                />

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  position="relative"
                  zIndex={1}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(109,35,35,0.15)',
                        mr: 4,
                        width: 64,
                        height: 64,
                        boxShadow: '0 8px 24px rgba(109,35,35,0.15)',
                      }}
                    >
                      <Pages sx={{ fontSize: 32, color: accentColor }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          lineHeight: 1.2,
                          color: accentColor,
                        }}
                      >
                        Page Management
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 0.8,
                          fontWeight: 400,
                          color: accentDark,
                        }}
                      >
                        Manage system pages and access groups
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={`${pages.length} Pages`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(109,35,35,0.15)',
                        color: accentColor,
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                    <Tooltip title="Refresh Pages">
                      <IconButton
                        onClick={fetchPages}
                        disabled={loading}
                        sx={{
                          bgcolor: 'rgba(109,35,35,0.1)',
                          '&:hover': { bgcolor: 'rgba(109,35,35,0.2)' },
                          color: accentColor,
                          width: 48,
                          height: 48,
                          '&:disabled': {
                            bgcolor: 'rgba(109,35,35,0.05)',
                            color: 'rgba(109,35,35,0.3)',
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: accentColor }}
                          />
                        ) : (
                          <Refresh />
                        )}
                      </IconButton>
                    </Tooltip>

                    <ProfessionalButton
                      variant="contained"
                      startIcon={<Group />}
                      onClick={() => navigate('/users-list')}
                      sx={{
                        bgcolor: accentColor,
                        color: primaryColor,
                        '&:hover': {
                          bgcolor: accentDark,
                        },
                      }}
                    >
                      User Access
                    </ProfessionalButton>
                  </Box>
                </Box>
              </Box>
            </GlassCard>
          </Box>
        </Fade>

        {/* Success/Error Messages */}
        {successMessage && (
          <Fade in timeout={300}>
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 3,
                '& .MuiAlert-message': { fontWeight: 500 },
              }}
              icon={<CheckCircle />}
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </Alert>
          </Fade>
        )}

        {errorMessage && (
          <Fade in timeout={300}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                '& .MuiAlert-message': { fontWeight: 500 },
              }}
              icon={<Error />}
              onClose={() => setErrorMessage('')}
            >
              {errorMessage}
            </Alert>
          </Fade>
        )}

        {/* Search & Filter */}
        <Fade in timeout={700}>
          <GlassCard sx={{ mb: 4 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(primaryColor, 0.8),
                      color: accentColor,
                    }}
                  >
                    <FilterList />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: 600, color: accentColor }}
                    >
                      Search & Filter
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: accentDark }}
                    >
                      Find and filter pages by various criteria
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{
                bgcolor: alpha(primaryColor, 0.5),
                pb: 2,
                borderBottom: '1px solid rgba(109,35,35,0.1)',
              }}
            />
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <ModernTextField
                    fullWidth
                    label="Search Pages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, description, URL, or ID"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Filter by Description"
                    value={descriptionFilter}
                    onChange={(e) => setDescriptionFilter(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(109, 35, 35, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">All Descriptions</option>
                    {descriptionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </GlassCard>
        </Fade>

        {/* Loading Backdrop */}
        <Backdrop
          sx={{
            color: primaryColor,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading && !refreshing}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, color: primaryColor }}>
              Loading pages...
            </Typography>
          </Box>
        </Backdrop>

        {/* Pages Table */}
        {!loading && (
          <Fade in timeout={900}>
            <GlassCard>
              <Box
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  color: accentColor,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(109,35,35,0.1)',
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: accentColor }}
                  >
                    Pages List
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, color: accentDark }}
                  >
                    {searchTerm
                      ? `Showing ${filteredPages.length} of ${pages.length} pages matching "${searchTerm}"`
                      : `Total: ${pages.length} registered pages`}
                  </Typography>
                </Box>
                <ProfessionalButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddDialog(true)}
                  sx={{
                    bgcolor: accentColor,
                    color: primaryColor,
                    '&:hover': {
                      bgcolor: accentDark,
                    },
                  }}
                >
                  Add New Page
                </ProfessionalButton>
              </Box>

              <PremiumTableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead sx={{ bgcolor: alpha(primaryColor, 0.7) }}>
                    <TableRow>
                      <PremiumTableCell isHeader sx={{ color: accentColor }}>
                        ID
                      </PremiumTableCell>
                      <PremiumTableCell isHeader sx={{ color: accentColor }}>
                        <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Page Name
                      </PremiumTableCell>
                      <PremiumTableCell isHeader sx={{ color: accentColor }}>
                        Page Description
                      </PremiumTableCell>
                      <PremiumTableCell isHeader sx={{ color: accentColor }}>
                        URL
                      </PremiumTableCell>
                      <PremiumTableCell isHeader sx={{ color: accentColor }}>
                        <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Access Groups
                      </PremiumTableCell>
                      <PremiumTableCell
                        isHeader
                        sx={{ color: accentColor, textAlign: 'center' }}
                      >
                        Actions
                      </PremiumTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPages.length > 0 ? (
                      paginatedPages.map((pg) => (
                        <TableRow
                          key={pg.id}
                          sx={{
                            '&:nth-of-type(even)': {
                              bgcolor: alpha(primaryColor, 0.3),
                            },
                            '&:hover': { bgcolor: alpha(accentColor, 0.05) },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <PremiumTableCell
                            sx={{ fontWeight: 600, color: accentColor }}
                          >
                            {pg.id}
                          </PremiumTableCell>

                          <PremiumTableCell>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: accentColor }}
                            >
                              {pg.page_name}
                            </Typography>
                          </PremiumTableCell>

                          <PremiumTableCell sx={{ color: accentDark }}>
                            <Chip
                              label={pg.page_description}
                              size="small"
                              icon={getDescriptionColor(pg.page_description).icon}
                              sx={{
                                ...getDescriptionColor(pg.page_description).sx,
                                fontWeight: 600,
                                padding: '4px 8px',
                              }}
                            />
                          </PremiumTableCell>

                          <PremiumTableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                color: accentDark,
                                bgcolor: alpha(accentColor, 0.05),
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                display: 'inline-block',
                              }}
                            >
                              {pg.page_url || 'N/A'}
                            </Typography>
                          </PremiumTableCell>

                          <PremiumTableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {pg.page_group && pg.page_group.split(',').map((group, index) => (
                                <Chip
                                  key={index}
                                  label={group.trim().toUpperCase()}
                                  size="small"
                                  icon={getGroupColor(group.trim()).icon}
                                  sx={{
                                    ...getGroupColor(group.trim()).sx,
                                    fontWeight: 600,
                                    padding: '2px 6px',
                                    fontSize: '0.75rem',
                                  }}
                                />
                              ))}
                            </Box>
                          </PremiumTableCell>

                          <PremiumTableCell sx={{ textAlign: 'center' }}>
                            <Tooltip title="Edit Page">
                              <IconButton
                                onClick={() => handleEdit(pg)}
                                sx={{
                                  color: accentColor,
                                  mr: 1,
                                  '&:hover': {
                                    bgcolor: alpha(accentColor, 0.1),
                                  },
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Page">
                              <IconButton
                                onClick={() => handleDeleteConfirm(pg.id)}
                                sx={{
                                  color: '#000000',
                                  '&:hover': {
                                    bgcolor: alpha('#000000', 0.1),
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </PremiumTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{ textAlign: 'center', py: 8 }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Info
                              sx={{
                                fontSize: 80,
                                color: alpha(accentColor, 0.3),
                                mb: 3,
                              }}
                            />
                            <Typography
                              variant="h5"
                              color={alpha(accentColor, 0.6)}
                              gutterBottom
                              sx={{ fontWeight: 600 }}
                            >
                              No Pages Found
                            </Typography>
                            <Typography
                              variant="body1"
                              color={alpha(accentColor, 0.4)}
                            >
                              {searchTerm
                                ? 'Try adjusting your search criteria'
                                : 'No pages registered yet'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </PremiumTableContainer>

              {/* Pagination */}
              {filteredPages.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <TablePagination
                    component="div"
                    count={filteredPages.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    sx={{
                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
                        {
                          color: accentColor,
                          fontWeight: 600,
                        },
                    }}
                  />
                </Box>
              )}
            </GlassCard>
          </Fade>
        )}

        {/* Edit Page Dialog */}
        <Dialog
          open={editDialog}
          onClose={cancelEdit}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: primaryColor,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%)`,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              fontWeight: 700,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Edit sx={{ fontSize: 30 }} />
              Edit Page
            </Box>
            <IconButton onClick={cancelEdit} sx={{ color: primaryColor }}>
              <Cancel />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Page Name"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="e.g., dashboard, users, reports"
                    sx={{ mt: 2 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Page Description"
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(109, 35, 35, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {descriptionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Page URL"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    placeholder="e.g., /dashboard, /users"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        fontWeight: 500,
                        color: accentColor,
                        '&.Mui-focused': { color: accentColor },
                      }}
                    >
                      Access Groups
                    </InputLabel>
                    <Select
                      multiple
                      value={pageGroups}
                      onChange={(e) => setPageGroups(e.target.value)}
                      label="Access Groups"
                      sx={{
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(109, 35, 35, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(accentColor, 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(accentColor, 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: accentColor,
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: alpha(accentColor, 0.15),
                                color: accentColor,
                                fontWeight: 600,
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {accessGroupOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: alpha(accentColor, 0.7), fontSize: '0.8rem' }}>
                      You can select multiple access groups
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: alpha(primaryColor, 0.5) }}>
            <ProfessionalButton
              onClick={cancelEdit}
              startIcon={<Cancel />}
              variant="outlined"
              sx={{
                borderColor: accentColor,
                color: accentColor,
                '&:hover': {
                  borderColor: accentDark,
                  bgcolor: alpha(accentColor, 0.05),
                },
              }}
            >
              Cancel
            </ProfessionalButton>
            <ProfessionalButton
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
              sx={{
                bgcolor: accentColor,
                color: primaryColor,
                '&:hover': {
                  bgcolor: accentDark,
                },
              }}
            >
              {loading ? 'Updating...' : 'Update Page'}
            </ProfessionalButton>
          </DialogActions>
        </Dialog>

        {/* Add Page Dialog */}
        <Dialog
          open={addDialog}
          onClose={cancelAdd}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: primaryColor,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%)`,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              fontWeight: 700,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Add sx={{ fontSize: 30 }} />
              Add New Page
            </Box>
            <IconButton onClick={cancelAdd} sx={{ color: primaryColor }}>
              <Cancel />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Page Name"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="e.g., dashboard, users, reports"
                    sx={{ mt: 2 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Page Description"
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(109, 35, 35, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {descriptionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Page URL"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    placeholder="e.g., /dashboard, /users"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        fontWeight: 500,
                        color: accentColor,
                        '&.Mui-focused': { color: accentColor },
                      }}
                    >
                      Access Groups
                    </InputLabel>
                    <Select
                      multiple
                      value={pageGroups}
                      onChange={(e) => setPageGroups(e.target.value)}
                      label="Access Groups"
                      sx={{
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(109, 35, 35, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(accentColor, 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(accentColor, 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: accentColor,
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: alpha(accentColor, 0.15),
                                color: accentColor,
                                fontWeight: 600,
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {accessGroupOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: alpha(accentColor, 0.7), fontSize: '0.8rem' }}>
                      You can select multiple access groups
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: alpha(primaryColor, 0.5) }}>
            <ProfessionalButton
              onClick={cancelAdd}
              startIcon={<Cancel />}
              variant="outlined"
              sx={{
                borderColor: accentColor,
                color: accentColor,
                '&:hover': {
                  borderColor: accentDark,
                  bgcolor: alpha(accentColor, 0.05),
                },
              }}
            >
              Cancel
            </ProfessionalButton>
            <ProfessionalButton
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
              sx={{
                bgcolor: accentColor,
                color: primaryColor,
                '&:hover': {
                  bgcolor: accentDark,
                },
              }}
            >
              {loading ? 'Creating...' : 'Create Page'}
            </ProfessionalButton>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: primaryColor,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%)`,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 3,
              fontWeight: 700,
            }}
          >
            <Warning sx={{ fontSize: 30 }} />
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Typography sx={{ color: accentColor, fontSize: '1.1rem' }}>
              Are you sure you want to delete this page? This action cannot be
              undone and will also remove all associated user access
              permissions.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: alpha(primaryColor, 0.5) }}>
            <ProfessionalButton
              onClick={() => setDeleteDialog(false)}
              variant="outlined"
              sx={{
                borderColor: accentColor,
                color: accentColor,
                '&:hover': {
                  borderColor: accentDark,
                  bgcolor: alpha(accentColor, 0.05),
                },
              }}
            >
              Cancel
            </ProfessionalButton>
            <ProfessionalButton
              onClick={handleDelete}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                '&:hover': {
                  bgcolor: '#333333',
                },
              }}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </ProfessionalButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PagesList;