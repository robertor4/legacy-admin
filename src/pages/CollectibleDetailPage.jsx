import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Alert, Paper, Button, Grid, Avatar, Chip, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { fetchCollectibleById } from '../api/apiService';

function CollectibleDetailPage() {
  const { collectibleId } = useParams();
  const navigate = useNavigate();
  const [collectible, setCollectible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCollectible = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchCollectibleById(collectibleId);
        setCollectible(data);
      } catch (err) {
        setError(`Failed to load collectible details for ID: ${collectibleId}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (collectibleId) {
      loadCollectible();
    }
  }, [collectibleId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!collectible) {
    return <Alert severity="error">Collectible not found.</Alert>;
  }

  const DetailItem = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="body1">{value || 'N/A'}</Typography>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/collectibles')}
        >
          Back to Collectibles
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/collectibles/${collectibleId}/edit`)}
        >
          Edit Collectible
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={collectible.imageUrl_1}
                variant="rounded"
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              {collectible.imageUrl_2 && (
                <Avatar
                  src={collectible.imageUrl_2}
                  variant="rounded"
                  sx={{ width: 200, height: 200, mb: 2 }}
                />
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip label={collectible.rarity} color="primary" />
                <Chip label={collectible.type} color="secondary" />
                <Chip label={collectible.ownershipStatus} color={collectible.ownershipStatus === 'Unclaimed' ? 'default' : 'success'} />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>{collectible.name}</Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Country" value={collectible.countryIso3} />
                <DetailItem label="Artist" value={collectible.artist} />
                <DetailItem label="Description" value={collectible.description} />
                <DetailItem label="Collector Points" value={collectible.collectorPoints} />
                <DetailItem label="Price to Claim (Coins)" value={collectible.priceToClaimInCoins} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DetailItem label="Position in Collection" value={collectible.positionInCollection} />
                <DetailItem label="Location Description 1" value={collectible.locationDescription_1} />
                <DetailItem label="Location Description 2" value={collectible.locationDescription_2} />
                <DetailItem label="Rating" value={collectible.rating} />
                <DetailItem label="Certificate Number" value={collectible.certificateNumber} />
              </Grid>
              
              <Grid item xs={12}>
                <DetailItem label="Collection ID" value={collectible.collectionId} />
                <DetailItem label="ID" value={collectible.id} />
                <DetailItem 
                  label="Collection Time" 
                  value={collectible.collectionTime ? new Date(collectible.collectionTime).toLocaleString() : 'N/A'} 
                />
                <DetailItem 
                  label="Collection Place" 
                  value={collectible.collectionPlace ? `(${collectible.collectionPlace.x}, ${collectible.collectionPlace.y})` : 'N/A'} 
                />
                <DetailItem 
                  label="Collectible Location" 
                  value={collectible.collectibleLocation ? `(${collectible.collectibleLocation.x}, ${collectible.collectibleLocation.y})` : 'N/A'} 
                />
                <DetailItem label="Collector Number" value={collectible.collectorNumber} />
                <DetailItem 
                  label="Royal Explorer at Discovery" 
                  value={collectible.isRoyalExplorerOnTimeOfDiscovery ? 'Yes' : 'No'} 
                />
                <DetailItem 
                  label="Has Custom Coin" 
                  value={collectible.hasCustomCoin ? 'Yes' : 'No'} 
                />
                <DetailItem 
                  label="Notification Read" 
                  value={collectible.notificationRead ? 'Yes' : 'No'} 
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default CollectibleDetailPage; 