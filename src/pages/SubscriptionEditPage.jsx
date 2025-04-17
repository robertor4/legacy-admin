import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionEditPage = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const { getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    planId: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api-prod.explorerslive.com/api/v1/subscriptions/${subscriptionId}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          userId: data.userId,
          planId: data.planId,
          status: data.status,
          startDate: data.startDate.split('T')[0],
          endDate: data.endDate.split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = subscriptionId
        ? `https://api-prod.explorerslive.com/api/v1/subscriptions/${subscriptionId}`
        : 'https://api-prod.explorerslive.com/api/v1/subscriptions';
      
      const method = subscriptionId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/subscriptions');
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {subscriptionId ? 'Edit Subscription' : 'Create New Subscription'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          fullWidth
          label="User ID"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Plan ID"
          name="planId"
          value={formData.planId}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          fullWidth
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
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
            onClick={() => navigate('/subscriptions')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionEditPage; 