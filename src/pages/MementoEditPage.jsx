import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { fetchMementoById, createMemento, updateMemento } from '../api/apiService';

const MementoEditPage = () => {
  const { mementoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [memento, setMemento] = useState({
    type: '',
    location: { x: 0, y: 0 },
    url: '',
    thumbnailUrl: '',
    isRoyalExplorerOnTimeOfDiscovery: false,
    captureDate: new Date().toISOString(),
    isMementoLocked: false,
  });

  useEffect(() => {
    if (mementoId) {
      fetchMemento();
    }
  }, [mementoId]);

  const fetchMemento = async () => {
    setLoading(true);
    try {
      const data = await fetchMementoById(mementoId);
      setMemento({
        type: data.type || '',
        location: data.location || { x: 0, y: 0 },
        url: data.url || '',
        thumbnailUrl: data.thumbnailUrl || '',
        isRoyalExplorerOnTimeOfDiscovery: data.isRoyalExplorerOnTimeOfDiscovery || false,
        captureDate: data.captureDate || new Date().toISOString(),
        isMementoLocked: data.isMementoLocked || false,
      });
    } catch (error) {
      console.error('Error fetching memento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (mementoId) {
        await updateMemento(mementoId, memento);
      } else {
        await createMemento(memento);
      }
      navigate('/mementos');
    } catch (error) {
      console.error('Error saving memento:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'locationX' || name === 'locationY') {
      setMemento(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name === 'locationX' ? 'x' : 'y']: parseFloat(value) || 0,
        },
      }));
    } else if (name === 'isRoyalExplorerOnTimeOfDiscovery' || name === 'isMementoLocked') {
      setMemento(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setMemento(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {mementoId ? 'Edit Memento' : 'Create New Memento'}
      </Typography>
      
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={memento.type}
              onChange={handleChange}
              label="Type"
              required
            >
              <MenuItem value="Image">Image</MenuItem>
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
              <MenuItem value="Text">Text</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Location</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="X Coordinate"
                name="locationX"
                type="number"
                value={memento.location.x}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Y Coordinate"
                name="locationY"
                type="number"
                value={memento.location.y}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>
          
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={memento.url}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Thumbnail URL"
            name="thumbnailUrl"
            value={memento.thumbnailUrl}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Capture Date"
            name="captureDate"
            type="datetime-local"
            value={memento.captureDate ? memento.captureDate.slice(0, 16) : ''}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={memento.isRoyalExplorerOnTimeOfDiscovery}
                onChange={handleChange}
                name="isRoyalExplorerOnTimeOfDiscovery"
              />
            }
            label="Royal Explorer on Time of Discovery"
            sx={{ mt: 2 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={memento.isMementoLocked}
                onChange={handleChange}
                name="isMementoLocked"
              />
            }
            label="Memento Locked"
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/mementos')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MementoEditPage; 