import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchCollectionById, 
  createCollection, 
  updateCollection 
} from '../api/apiService';

const COLLECTION_TYPES = [
  'Stamps',
  'Landmarks',
];

const CollectionEditPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const isEditMode = collectionId !== 'new';
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collectionType: 'Stamps',
    badgeImageUrl: '',
    boxImageUrl: '',
    backgroundImageUrl: ''
  });

  useEffect(() => {
    if (isEditMode && authToken) {
      fetchCollectionData();
    } else {
      setLoading(false);
    }
  }, [isEditMode, authToken, collectionId]);

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchCollectionById(collectionId);
      
      if (response) {
        setFormData({
          name: response.name || '',
          description: response.description || '',
          collectionType: response.collectionType || 'Stamps',
          badgeImageUrl: response.badgeImageUrl || '',
          boxImageUrl: response.boxImageUrl || '',
          backgroundImageUrl: response.backgroundImageUrl || ''
        });
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      setError('Failed to load collection. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      if (isEditMode) {
        await updateCollection(collectionId, formData);
      } else {
        await createCollection(formData);
      }
      
      setSuccess(true);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/collections');
      }, 1500);
    } catch (error) {
      console.error('Error saving collection:', error);
      setError(error.message || 'Failed to save collection. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/collections');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, ml: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit Collection' : 'Add New Collection'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Collection {isEditMode ? 'updated' : 'created'} successfully!
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <TextField
                required
                fullWidth
                label="Collection Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
              />
            </Grid>
            
            <Grid item>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={saving}
              />
            </Grid>
            
            <Grid item>
              <TextField
                required
                fullWidth
                select
                label="Collection Type"
                name="collectionType"
                value={formData.collectionType}
                onChange={handleChange}
                disabled={saving}
              >
                {COLLECTION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Images
              </Typography>
            </Grid>
            
            <Grid item>
              <TextField
                fullWidth
                label="Badge Image URL"
                name="badgeImageUrl"
                value={formData.badgeImageUrl}
                onChange={handleChange}
                disabled={saving}
                helperText="URL for the collection badge image"
              />
              {formData.badgeImageUrl && (
                <Box sx={{ mt: 2, maxWidth: 200 }}>
                  <img 
                    src={formData.badgeImageUrl} 
                    alt="Badge preview" 
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </Box>
              )}
            </Grid>
            
            <Grid item>
              <TextField
                fullWidth
                label="Box Image URL"
                name="boxImageUrl"
                value={formData.boxImageUrl}
                onChange={handleChange}
                disabled={saving}
                helperText="URL for the collection box image"
              />
              {formData.boxImageUrl && (
                <Box sx={{ mt: 2, maxWidth: 200 }}>
                  <img 
                    src={formData.boxImageUrl} 
                    alt="Box preview" 
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </Box>
              )}
            </Grid>
            
            <Grid item>
              <TextField
                fullWidth
                label="Background Image URL"
                name="backgroundImageUrl"
                value={formData.backgroundImageUrl}
                onChange={handleChange}
                disabled={saving}
                helperText="URL for the collection background image"
              />
              {formData.backgroundImageUrl && (
                <Box sx={{ mt: 2, maxWidth: 200 }}>
                  <img 
                    src={formData.backgroundImageUrl} 
                    alt="Background preview" 
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </Box>
              )}
            </Grid>
            
            <Grid item sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Saving...' : isEditMode ? 'Update Collection' : 'Create Collection'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CollectionEditPage; 