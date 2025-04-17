import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import CollectibleForm from '../components/CollectibleForm';
import { fetchCollectibleById, createCollectible, updateCollectible } from '../api/apiService'; // Placeholder

function CollectibleEditPage() {
    const { collectibleId } = useParams(); // Get collectibleId from URL if present
    const navigate = useNavigate();
    const isEditing = Boolean(collectibleId);

    const [collectibleData, setCollectibleData] = useState(null);
    const [loading, setLoading] = useState(isEditing); // Only load if editing
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            const loadCollectible = async () => {
                setLoading(true);
                setError('');
                try {
                    const data = await fetchCollectibleById(collectibleId);
                    setCollectibleData(data);
                } catch (err) {
                    setError(`Failed to load collectible details for ID: ${collectibleId}.`);
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            loadCollectible();
        }
    }, [collectibleId, isEditing]);

    const handleFormSubmit = async (formData) => { // Receives FormData
        setSaving(true);
        setError('');
        try {
            if (isEditing) {
                // If image is not changed, the 'image' field in formData might be empty or null.
                // Your backend should handle this (e.g., ignore image update if field not present).
                await updateCollectible(collectibleId, formData);
                // Optionally show success message
            } else {
                 // Check if image file is present (required for create)
                 if (!formData.has('image') || !formData.get('image')) {
                    setError('An image file is required to create a collectible.');
                    setSaving(false);
                    return;
                 }
                await createCollectible(formData);
                 // Optionally show success message
            }
             navigate('/collectibles'); // Redirect back to list after save/create
        } catch (err) {
             const message = err.message || `Failed to ${isEditing ? 'update' : 'create'} collectible.`;
             setError(message);
             console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    // Show error if loading failed and we don't have data (especially in edit mode)
     if (error && !collectibleData && isEditing) {
         return <Alert severity="error">{error}</Alert>;
     }

    // If editing and data is still null after load attempt (should be covered by above)
     if (isEditing && !collectibleData && !loading) {
         return <Alert severity="error">Collectible data could not be loaded or not found.</Alert>;
     }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {isEditing ? 'Edit Collectible' : 'Create New Collectible'}
            </Typography>

             {/* Display loading error here as well, but allow form rendering if editing */}
             {error && !saving && <Alert severity="warning" sx={{mb: 2}}>{error}</Alert>}

            <CollectibleForm
                // Pass empty object {} for create, or loaded data for edit
                initialData={isEditing ? collectibleData : {}}
                onSubmit={handleFormSubmit}
                isSaving={saving}
                error={error} // Pass save error to the form
            />
        </Paper>
    );
}

export default CollectibleEditPage;
