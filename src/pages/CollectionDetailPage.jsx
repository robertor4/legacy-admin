import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchCollectionById } from '../api/apiService';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authToken) {
      fetchCollectionData();
    }
  }, [authToken, collectionId]);

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchCollectionById(collectionId);
      
      if (response) {
        setCollection(response);
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      setError('Failed to load collection. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/collections/${collectionId}/edit`);
  };

  const handleBack = () => {
    navigate('/collections');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Collections
        </Button>
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Collection not found
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Collections
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Collection Details
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {collection.name}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {collection.description || 'No description provided'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Chip 
                label={collection.collectionType} 
                color="primary" 
                variant="outlined" 
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Collection Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {collection.collectedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Collected
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {collection.totalInCollectionCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {collection.totalCollectionCollectorPoints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Points
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Images
            </Typography>
          </Grid>
          
          {collection.badgeImageUrl && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Badge Image
                </Typography>
                <Box 
                  component="img" 
                  src={collection.badgeImageUrl} 
                  alt="Badge" 
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    objectFit: 'contain' 
                  }} 
                />
              </Paper>
            </Grid>
          )}
          
          {collection.boxImageUrl && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Box Image
                </Typography>
                <Box 
                  component="img" 
                  src={collection.boxImageUrl} 
                  alt="Box" 
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    objectFit: 'contain' 
                  }} 
                />
              </Paper>
            </Grid>
          )}
          
          {collection.backgroundImageUrl && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Background Image
                </Typography>
                <Box 
                  component="img" 
                  src={collection.backgroundImageUrl} 
                  alt="Background" 
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    objectFit: 'contain' 
                  }} 
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CollectionDetailPage; 