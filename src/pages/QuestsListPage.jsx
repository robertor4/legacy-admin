import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Button, Box, CircularProgress, Alert,
  Paper, IconButton, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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

    const columns = [
        { field: 'title', headerName: 'Title', width: 250 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => getStatusChip(params.value)
        },
        { field: 'difficulty', headerName: 'Difficulty', width: 120 },
        {
            field: 'startDate',
            headerName: 'Start Date',
            width: 180,
            valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm')
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            width: 180,
            valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm')
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="toggle status"
                        color={params.row.status === 'active' ? 'success' : 'default'}
                        onClick={() => handleToggleStatus(params.row.id, params.row.status)}
                        title={params.row.status === 'active' ? 'Deactivate' : 'Activate'}
                        size="small"
                        sx={{ mr: 1 }}
                    >
                        {params.row.status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        component={RouterLink}
                        to={`/quests/${params.row.id}/edit`}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                </>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Quests ({quests.length})
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

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={quests}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    components={{
                        NoRowsOverlay: () => (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography>No quests found.</Typography>
                            </Box>
                        ),
                        LoadingOverlay: () => (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        )
                    }}
                />
            </Paper>
        </Box>
    );
}

export default QuestsListPage;
