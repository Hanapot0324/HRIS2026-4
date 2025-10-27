import API_BASE_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Container, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Card, CardContent, CardHeader, Avatar,
  Fade, Backdrop, CircularProgress, Chip, Tooltip,
  IconButton, styled, alpha, Breadcrumbs, Link,
  Grid, InputAdornment, FormHelperText, Paper
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  Announcement as AnnouncementIcon, Reorder as ReorderIcon,
  Search as SearchIcon, Close as CloseIcon, Home,
  Image as ImageIcon, FilterList, Refresh, CheckCircle,
  Error, Info, Warning
} from "@mui/icons-material";

// Professional styled components matching PagesList.jsx
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

const PremiumTableContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(109, 35, 35, 0.06)',
  border: '1px solid rgba(109, 35, 35, 0.08)',
  background: 'rgba(255, 255, 255, 0.9)',
  width: '100%',
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

const AnnouncementForm = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    about: "",
    date: "",
    image: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Color scheme matching PagesList.jsx
  const primaryColor = '#FEF9E1';
  const secondaryColor = '#FFF8E7';
  const accentColor = '#6d2323';
  const accentDark = '#8B3333';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await axios.get(`${API_BASE_URL}/api/announcements`);
      setAnnouncements(response.data);
      
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
        
        if (refreshing && announcements.length > 0) {
          setSuccessMessage('Announcements refreshed successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }, 1000);
    } catch (err) {
      console.error("Error fetching announcements", err.message);
      setLoading(false);
      setRefreshing(false);
      setError("Failed to fetch announcements");
    }
  };

  const handleNewChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewAnnouncement({ ...newAnnouncement, image: files[0] });
    } else {
      setNewAnnouncement({ ...newAnnouncement, [name]: value });
    }
  };

  const handleAdd = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setLoading(true);
      
      if (!newAnnouncement.title || !newAnnouncement.about || !newAnnouncement.date) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", newAnnouncement.title);
      formData.append("about", newAnnouncement.about);
      formData.append("date", newAnnouncement.date);
      if (newAnnouncement.image) formData.append("image", newAnnouncement.image);

      await axios.post(`${API_BASE_URL}/api/announcements`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchAnnouncements();
      setNewAnnouncement({ title: "", about: "", date: "", image: null });
      setSuccessMessage("Announcement added successfully");
      setTimeout(() => setSuccessMessage(''), 3000);
      setLoading(false);
    } catch (error) {
      console.error("Error adding announcement", error);
      setError("Failed to add announcement");
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      about: item.about,
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      image: item.image || null,
    });
    setOpenEditModal(true);
    setError("");
  };

  const handleSaveEdit = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setLoading(true);

      if (!editingId) {
        setError("No announcement selected for editing.");
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append("title", editForm.title || "");
      payload.append("about", editForm.about || "");
      payload.append("date", editForm.date || "");

      if (editForm.image && editForm.image instanceof File) {
        payload.append("image", editForm.image);
      }

      await axios.put(
        `${API_BASE_URL}/api/announcements/${editingId}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOpenEditModal(false);
      setEditingId(null);
      setEditForm({});
      fetchAnnouncements();
      setSuccessMessage("Announcement updated successfully");
      setTimeout(() => setSuccessMessage(''), 3000);
      setLoading(false);
    } catch (err) {
      console.error("Error updating announcement:", err);
      setError("Failed to update announcement");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/api/announcements/${id}`);
        fetchAnnouncements();
        setSuccessMessage("Announcement deleted successfully");
        setTimeout(() => setSuccessMessage(''), 3000);
        setLoading(false);
      } catch (error) {
        console.error("Error deleting announcement", error);
        setError("Failed to delete announcement");
        setLoading(false);
      }
    }
  };

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.about.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

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
                <AnnouncementIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Announcement Management
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
                      <AnnouncementIcon sx={{ fontSize: 32, color: accentColor }} />
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
                        Announcement Management
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 0.8,
                          fontWeight: 400,
                          color: accentDark,
                        }}
                      >
                        Post and manage employee announcements
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={`${announcements.length} Announcements`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(109,35,35,0.15)',
                        color: accentColor,
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                    <Tooltip title="Refresh Announcements">
                      <IconButton
                        onClick={fetchAnnouncements}
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

        {error && (
          <Fade in timeout={300}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                '& .MuiAlert-message': { fontWeight: 500 },
              }}
              icon={<Error />}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Add Form */}
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
                    <AddIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: 600, color: accentColor }}
                    >
                      Create New Announcement
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: accentDark }}
                    >
                      Add a new announcement for employees
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
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={newAnnouncement.title}
                    onChange={handleNewChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={newAnnouncement.date}
                    onChange={handleNewChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <ModernTextField
                    fullWidth
                    label="About"
                    name="about"
                    value={newAnnouncement.about}
                    onChange={handleNewChange}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ProfessionalButton
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      sx={{
                        borderColor: accentColor,
                        color: accentColor,
                        '&:hover': {
                          borderColor: accentDark,
                          bgcolor: alpha(accentColor, 0.05),
                        },
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        name="image"
                        onChange={handleNewChange}
                      />
                    </ProfessionalButton>
                    {newAnnouncement.image && (
                      <Typography variant="body2" sx={{ color: accentColor }}>
                        {newAnnouncement.image.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <ProfessionalButton
                    onClick={handleAdd}
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={loading}
                    fullWidth
                    sx={{
                      bgcolor: accentColor,
                      color: primaryColor,
                      '&:hover': { bgcolor: accentDark },
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Announcement'}
                  </ProfessionalButton>
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
              Processing announcement...
            </Typography>
          </Box>
        </Backdrop>

        {/* Announcements Table */}
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
                    Announcement Records
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, color: accentDark }}
                  >
                    {searchQuery
                      ? `Showing ${filteredAnnouncements.length} of ${announcements.length} announcements matching "${searchQuery}"`
                      : `Total: ${announcements.length} announcements`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ModernTextField
                    size="small"
                    variant="outlined"
                    placeholder="Search by Title or About"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: '300px' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: accentColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ width: '100%' }}>
                <PremiumTableContainer elevation={0}>
                  <Table sx={{ minWidth: 800, width: '100%' }}>
                    <TableHead sx={{ bgcolor: alpha(primaryColor, 0.7) }}>
                      <TableRow>
                        <PremiumTableCell isHeader sx={{ color: accentColor, width: '10%' }}>
                          No.
                        </PremiumTableCell>
                        <PremiumTableCell isHeader sx={{ color: accentColor, width: '25%' }}>
                          Title
                        </PremiumTableCell>
                        <PremiumTableCell isHeader sx={{ color: accentColor, width: '35%' }}>
                          About
                        </PremiumTableCell>
                        <PremiumTableCell isHeader sx={{ color: accentColor, width: '15%' }}>
                          Date
                        </PremiumTableCell>
                        <PremiumTableCell isHeader sx={{ color: accentColor, width: '15%', textAlign: 'center' }}>
                          Actions
                        </PremiumTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAnnouncements.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
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
                                No Announcements Found
                              </Typography>
                              <Typography
                                variant="body1"
                                color={alpha(accentColor, 0.4)}
                              >
                                {searchQuery
                                  ? 'Try adjusting your search criteria'
                                  : 'No announcements available'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAnnouncements.map((item, index) => (
                          <TableRow
                            key={item.id}
                            sx={{
                              '&:nth-of-type(even)': {
                                bgcolor: alpha(primaryColor, 0.3),
                              },
                              '&:hover': { bgcolor: alpha(accentColor, 0.05) },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <PremiumTableCell sx={{ fontWeight: 600, color: accentColor, width: '10%' }}>
                              {index + 1}
                            </PremiumTableCell>
                            <PremiumTableCell sx={{ color: accentDark, width: '25%' }}>
                              {item.title}
                            </PremiumTableCell>
                            <PremiumTableCell sx={{ color: accentDark, width: '35%' }}>
                              {item.about}
                            </PremiumTableCell>
                            <PremiumTableCell sx={{ color: accentDark, width: '15%' }}>
                              {formatDateForDisplay(item.date)}
                            </PremiumTableCell>
                            <PremiumTableCell sx={{ textAlign: 'center', width: '15%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Tooltip title="Edit Announcement">
                                  <ProfessionalButton
                                    onClick={() => handleEdit(item)}
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    sx={{
                                      bgcolor: accentColor,
                                      color: primaryColor,
                                      '&:hover': { bgcolor: accentDark },
                                    }}
                                  >
                                    Edit
                                  </ProfessionalButton>
                                </Tooltip>
                                <Tooltip title="Delete Announcement">
                                  <ProfessionalButton
                                    onClick={() => handleDelete(item.id)}
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    sx={{
                                      bgcolor: '#000000',
                                      color: '#ffffff',
                                      '&:hover': { bgcolor: '#333333' },
                                    }}
                                  >
                                    Delete
                                  </ProfessionalButton>
                                </Tooltip>
                              </Box>
                            </PremiumTableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </PremiumTableContainer>
              </Box>
            </GlassCard>
          </Fade>
        )}

        {/* Edit Modal */}
        <Dialog
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
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
              <EditIcon sx={{ fontSize: 30 }} />
              Edit Announcement
            </Box>
            <IconButton onClick={() => setOpenEditModal(false)} sx={{ color: primaryColor }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ModernTextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <ModernTextField
                  fullWidth
                  label="About"
                  name="about"
                  value={editForm.about || ""}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <ModernTextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={editForm.date || ""}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                {editForm.image && typeof editForm.image === "string" && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: accentColor }}>
                      Current Image:
                    </Typography>
                    <img
                      src={editForm.image}
                      alt="current"
                      style={{ maxWidth: 160, maxHeight: 90, borderRadius: 4 }}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ProfessionalButton
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    sx={{
                      borderColor: accentColor,
                      color: accentColor,
                      '&:hover': {
                        borderColor: accentDark,
                        bgcolor: alpha(accentColor, 0.05),
                      },
                    }}
                  >
                    Replace Image
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        setEditForm({ ...editForm, image: e.target.files ? e.target.files[0] : null })
                      }
                    />
                  </ProfessionalButton>
                  {editForm.image && editForm.image instanceof File && (
                    <Typography variant="body2" sx={{ color: accentColor }}>
                      {editForm.image.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: alpha(primaryColor, 0.5) }}>
            <ProfessionalButton
              onClick={handleSaveEdit}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{
                bgcolor: accentColor,
                color: primaryColor,
                '&:hover': { bgcolor: accentDark },
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </ProfessionalButton>
            <ProfessionalButton
              onClick={() => setOpenEditModal(false)}
              variant="outlined"
              startIcon={<CancelIcon />}
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
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AnnouncementForm;