import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Visibility as ViewIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchPassports, deletePassport } from '../api/apiService';

const PassportsListPage = () => {
  const [passports, setPassports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const fetchPassportsData = async () => {
    try {
      setLoading(true);
      const response = await fetchPassports();
      if (response && response.data) {
        setPassports(response.data);
      }
    } catch (error) {
      console.error('Error fetching passports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassportsData();
  }, []);

  const handleDelete = async (passport) => {
    setSelectedPassport(passport);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePassport(selectedPassport.id);
      fetchPassportsData();
    } catch (error) {
      console.error('Error deleting passport:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleView = (passport) => {
    setSelectedPassport(passport);
    setViewDialogOpen(true);
  };

  const handleEdit = (passport) => {
    navigate(`/passports/${passport.id}/edit`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString();
  };

  const columns = [
    { 
      field: 'profilePictureThumbnailUrl', 
      headerName: 'Profile', 
      width: 100,
      renderCell: (params) => (
        <Avatar 
          src={params.value} 
          alt={`${params.row.firstName} ${params.row.lastName}`}
        >
          {params.row.firstName?.[0]}{params.row.lastName?.[0]}
        </Avatar>
      )
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      valueGetter: (params) => {
        if (!params?.row) return 'N/A';
        const firstName = params.row.firstName || '';
        const lastName = params.row.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      }
    },
    { field: 'passportNumber', headerName: 'Passport Number', width: 150 },
    { field: 'countryOfOrigin', headerName: 'Country', width: 130 },
    { 
      field: 'subscriptionPlanId', 
      headerName: 'Plan', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'Free'}
          color={params.value === 'premium' ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    { 
      field: 'coins', 
      headerName: 'Coins', 
      width: 100,
      valueFormatter: (params) => formatNumber(params.value)
    },
    { 
      field: 'countriesCount', 
      headerName: 'Countries', 
      width: 100,
      valueFormatter: (params) => formatNumber(params.value)
    },
    { 
      field: 'municipalitiesCount', 
      headerName: 'Municipalities', 
      width: 130,
      valueFormatter: (params) => formatNumber(params.value)
    },
    { 
      field: 'kilometersTravelled', 
      headerName: 'Distance (km)', 
      width: 130,
      valueFormatter: (params) => formatNumber(params.value)
    },
    { 
      field: 'lastVisitedCountry', 
      headerName: 'Last Country', 
      width: 130 
    },
    { 
      field: 'createdDate', 
      headerName: 'Created', 
      width: 180,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleView(params.row)}>
            <ViewIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          User Passports ({passports.length})
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/passports/new')}
        >
          Create New Passport
        </Button>
      </Box>
      
      <Paper sx={{ height: 'calc(100% - 100px)', width: '100%' }}>
        <DataGrid
          rows={passports}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Paper>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>View Passport</DialogTitle>
        <DialogContent>
          {selectedPassport && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={selectedPassport.profilePictureUrl}
                    alt={`${selectedPassport.firstName} ${selectedPassport.lastName}`}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Box>
                    <Typography variant="h5">{`${selectedPassport.firstName} ${selectedPassport.lastName}`}</Typography>
                    <Typography color="textSecondary">{selectedPassport.description}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  <Typography><strong>Passport Number:</strong> {selectedPassport.passportNumber}</Typography>
                  <Typography><strong>Country of Origin:</strong> {selectedPassport.countryOfOrigin}</Typography>
                  <Typography><strong>Subscription Plan:</strong> {selectedPassport.subscriptionPlanId || 'Free'}</Typography>
                  <Typography><strong>Last Visited Country:</strong> {selectedPassport.lastVisitedCountry}</Typography>
                  <Typography><strong>Timezone:</strong> {selectedPassport.ianaTimezone}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Statistics</Typography>
                  <Typography><strong>Total Coins:</strong> {formatNumber(selectedPassport.coins)}</Typography>
                  <Typography><strong>Countries Visited:</strong> {formatNumber(selectedPassport.countriesCount)}</Typography>
                  <Typography><strong>Municipalities Visited:</strong> {formatNumber(selectedPassport.municipalitiesCount)}</Typography>
                  <Typography><strong>Distance Travelled:</strong> {formatNumber(selectedPassport.kilometersTravelled)} km</Typography>
                  <Typography><strong>Square Kilometers Discovered:</strong> {formatNumber(selectedPassport.sqKilometersDiscovered)} km²</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                  <Typography><strong>Coins Today:</strong> {formatNumber(selectedPassport.coinsToday)}</Typography>
                  <Typography><strong>Coins This Week:</strong> {formatNumber(selectedPassport.coinsThisWeek)}</Typography>
                  <Typography><strong>Coins This Month:</strong> {formatNumber(selectedPassport.coinsThisMonth)}</Typography>
                  <Typography><strong>Countries This Month:</strong> {formatNumber(selectedPassport.countriesCountThisMonth)}</Typography>
                  <Typography><strong>Municipalities This Month:</strong> {formatNumber(selectedPassport.municipalitiesCountThisMonth)}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>System Information</Typography>
                  <Typography><strong>User ID:</strong> {selectedPassport.userId}</Typography>
                  <Typography><strong>Created:</strong> {formatDate(selectedPassport.createdDate)}</Typography>
                  <Typography><strong>Last Modified:</strong> {formatDate(selectedPassport.lastModifiedDate)}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Passport</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this passport? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PassportsListPage; 