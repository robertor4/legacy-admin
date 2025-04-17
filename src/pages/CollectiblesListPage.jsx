import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Button, Box, CircularProgress, Alert, Paper, IconButton, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Using DataGrid for better features
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchCollectibles, deleteCollectible } from '../api/apiService'; // Placeholder

function CollectiblesListPage() {
    const [collectibles, setCollectibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [collectibleToDelete, setCollectibleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadCollectibles = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchCollectibles();
            // Add a check in case response.data is not an array
            setCollectibles(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to load collectibles.');
            console.error(err);
            setCollectibles([]); // Ensure it's an array on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCollectibles();
    }, [loadCollectibles]);

    const handleOpenDeleteConfirm = (id) => {
        setCollectibleToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setCollectibleToDelete(null);
        setDeleteConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (!collectibleToDelete) return;
        setIsDeleting(true);
        setError(''); // Clear previous errors
        try {
            await deleteCollectible(collectibleToDelete);
            handleCloseDeleteConfirm();
            // Refresh the list after delete
            await loadCollectibles();
        } catch (err) {
            setError(`Failed to delete collectible (ID: ${collectibleToDelete}). It might be linked to active Quests.`);
            console.error(err);
            // Keep dialog open on error to show message? Or close and show alert.
            // handleCloseDeleteConfirm(); // Option: Close dialog even on error
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            field: 'imageUrl',
            headerName: 'Image',
            width: 100,
            renderCell: (params) => (
                <Avatar src={params.value} variant="rounded">
                    {/* Fallback Icon or Initials */}
                </Avatar>
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'id', headerName: 'ID', width: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="edit"
                        component={RouterLink}
                        to={`/collectibles/${params.id}/edit`}
                        size="small"
                        sx={{ mr: 1 }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleOpenDeleteConfirm(params.id)}
                        size="small"
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Collectibles
                </Typography>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/collectibles/new"
                    startIcon={<AddIcon />}
                >
                    Create Collectible
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={collectibles}
                    columns={columns}
                    pageSize={10} // DEPRECATED: Use paginationModel
                    // paginationModel={{ page: 0, pageSize: 10 }} // Preferred way
                    rowsPerPageOptions={[10, 25, 50]} // DEPRECATED: Use pageSizeOptions
                    // pageSizeOptions={[10, 25, 50]} // Preferred way
                    loading={loading}
                    // Add checkboxSelection if needed
                />
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this collectible (ID: {collectibleToDelete})? This action cannot be undone.
                        <br/>
                        {error && <Alert severity="error" sx={{mt: 1}}>{error}</Alert>}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm} disabled={isDeleting}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus disabled={isDeleting}>
                         {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CollectiblesListPage;
