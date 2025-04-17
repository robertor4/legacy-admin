import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import QuestForm from '../components/QuestForm';
import { fetchQuestById, createQuest, updateQuest } from '../api/apiService'; // Placeholder

function QuestEditPage() {
    const { questId } = useParams(); // Get questId from URL if present
    const navigate = useNavigate();
    const isEditing = Boolean(questId);

    const [questData, setQuestData] = useState(null);
    const [loading, setLoading] = useState(isEditing); // Only load if editing
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            const loadQuest = async () => {
                setLoading(true);
                setError('');
                try {
                    const data = await fetchQuestById(questId);
                    setQuestData(data);
                } catch (err) {
                    setError(`Failed to load quest details for ID: ${questId}.`);
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            loadQuest();
        }
    }, [questId, isEditing]);

    const handleFormSubmit = async (formData) => {
        setSaving(true);
        setError('');
        try {
            if (isEditing) {
                await updateQuest(questId, formData);
                // Optionally show success message
            } else {
                await createQuest(formData);
                 // Optionally show success message
            }
             navigate('/quests'); // Redirect back to list after save/create
        } catch (err) {
            setError(`Failed to ${isEditing ? 'update' : 'create'} quest.`);
             console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    if (error && !questData) { // Show error only if loading failed completely
        return <Alert severity="error">{error}</Alert>;
    }

    // If editing and questData is null after loading (shouldn't happen if error is caught), show error
     if (isEditing && !questData) {
         return <Alert severity="error">Quest data could not be loaded.</Alert>;
     }


    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {isEditing ? 'Edit Quest' : 'Create New Quest'}
            </Typography>

            <QuestForm
                initialData={isEditing ? questData : {}} // Pass initial data if editing
                onSubmit={handleFormSubmit}
                isSaving={saving}
                error={error} // Pass save error to the form
            />
        </Paper>
    );
}

export default QuestEditPage;
