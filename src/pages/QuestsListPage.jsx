import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Button, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { fetchQuests, updateQuestStatus } from '../api/apiService'; // Placeholder

function QuestsListPage() {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadQuests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchQuests();
            setQuests(response.data || []); // Adjust based on actual API response
        } catch (err) {
            setError('Failed to load quests.');
            console.error(err);
            setQuests([]); // Ensure quests is an array even on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadQuests();
    }, [loadQuests]);

     const handleToggleStatus = async (questId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const originalQuests = [...quests]; // Store original state for potential rollback
        try {
            // Optimistic UI update
             setQuests(prevQuests =>
                prevQuests.map(q =>
                    q.id === questId ? { ...q, status: newStatus } : q
                )
            );
            await updateQuestStatus(questId, newStatus);
            // If API call succeeds, the state is already updated.
            // Optionally: Could re-fetch the specific quest or the whole list for consistency
            // loadQuests(); // Re-fetch to confirm, or rely on optimistic update
             console.log(`Quest ${questId} status toggled to ${newStatus}`);
        } catch (err) {
            setError(`Failed to update status for quest ${questId}.`);
             console.error(err);
             // Rollback UI on error
             setQuests(originalQuests);
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'active': return <Chip label="Active" color="success" size="small" />;
            case 'inactive': return <Chip label="Inactive" color="default" size="small" />;
             case 'draft': return <Chip label="Draft" color="warning" size="small" />;
             case 'expired': return <Chip label="Expired" color="error" size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Quests
                </Typography>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/quests/new"
                    startIcon={<AddIcon />}
                >
                    Create Quest
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No quests found.</TableCell>
                                </TableRow>
                            ) : (
                                quests.map((quest) => (
                                    <TableRow key={quest.id}>
                                        <TableCell component="th" scope="row">{quest.title}</TableCell>
                                        <TableCell>{getStatusChip(quest.status)}</TableCell>
                                        <TableCell>{quest.difficulty}</TableCell>
                                        <TableCell>{dayjs(quest.startDate).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>{dayjs(quest.endDate).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="toggle status"
                                                color={quest.status === 'active' ? 'success' : 'default'}
                                                onClick={() => handleToggleStatus(quest.id, quest.status)}
                                                title={quest.status === 'active' ? 'Deactivate' : 'Activate'}
                                            >
                                                {quest.status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                            </IconButton>
                                            <IconButton
                                                aria-label="edit"
                                                component={RouterLink}
                                                to={`/quests/${quest.id}/edit`}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {/* Add Delete button if needed */}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* TODO: Add Pagination controls if API supports it */}
        </Box>
    );
}

export default QuestsListPage;
