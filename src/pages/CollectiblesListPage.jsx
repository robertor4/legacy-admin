import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Button, Box, CircularProgress, Alert, Paper, IconButton, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, MenuItem, Grid, Pagination
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Using DataGrid for better features
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchCollectibles, deleteCollectible } from '../api/apiService';

function CollectiblesListPage() {
    const [collectibles, setCollectibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [collectibleToDelete, setCollectibleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Pagination and filtering state
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    
    // Filter state
    const [filters, setFilters] = useState({
        collectionId: '',
        key: '',
        filter: '',
        operator: '',
        order: '',
        direction: ''
    });

    const loadCollectibles = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                pageNumber: pageNumber - 1, // API expects 0-based index
                pageSize,
                ...filters
            };
            
            const response = await fetchCollectibles(params);
            setCollectibles(response.items || []);
            setTotalPages(response.totalPages || 1);
            setTotalCount(response.totalCount || 0);
        } catch (err) {
            setError('Failed to load collectibles.');
            console.error(err);
            setCollectibles([]); // Ensure it's an array on error
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize, filters]);

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
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFilterChange = (field) => (event) => {
        setFilters({
            ...filters,
            [field]: event.target.value
        });
        setPageNumber(1); // Reset to first page when filter changes
    };

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    const columns = [
        {
            field: 'imageUrl_1',
            headerName: 'Image',
            width: 100,
            flex: 0.5,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Avatar src={params.value} variant="rounded">
                        {/* Fallback Icon or Initials */}
                    </Avatar>
                </Box>
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'name', headerName: 'Name', flex: 2, minWidth: 200 },
        { field: 'countryIso3', headerName: 'Country', flex: 1, minWidth: 100 },
        { field: 'artist', headerName: 'Artist', flex: 1.5, minWidth: 150 },
        { field: 'rarity', headerName: 'Rarity', flex: 1, minWidth: 120 },
        { field: 'type', headerName: 'Type', flex: 1, minWidth: 120 },
        { field: 'ownershipStatus', headerName: 'Status', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 180,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="view"
                        component={RouterLink}
                        to={`/collectibles/${params.id}`}
                        size="small"
                        sx={{ mr: 1 }}
                    >
                        <VisibilityIcon />
                    </IconButton>
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
                    Manage Collectibles ({totalCount})
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

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Collection ID"
                            value={filters.collectionId}
                            onChange={handleFilterChange('collectionId')}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Search Key"
                            value={filters.key}
                            onChange={handleFilterChange('key')}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Filter"
                            value={filters.filter}
                            onChange={handleFilterChange('filter')}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Operator"
                            value={filters.operator}
                            onChange={handleFilterChange('operator')}
                            size="small"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="equals">Equals</MenuItem>
                            <MenuItem value="contains">Contains</MenuItem>
                            <MenuItem value="startsWith">Starts With</MenuItem>
                            <MenuItem value="endsWith">Ends With</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Order By"
                            value={filters.order}
                            onChange={handleFilterChange('order')}
                            size="small"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="rarity">Rarity</MenuItem>
                            <MenuItem value="type">Type</MenuItem>
                            <MenuItem value="ownershipStatus">Status</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Direction"
                            value={filters.direction}
                            onChange={handleFilterChange('direction')}
                            size="small"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={collectibles}
                    columns={columns}
                    paginationModel={{ page: pageNumber - 1, pageSize }}
                    pageSizeOptions={[10, 25, 50]}
                    rowCount={totalCount}
                    loading={loading}
                    paginationMode="server"
                    onPaginationModelChange={(model) => {
                        setPageNumber(model.page + 1);
                        setPageSize(model.pageSize);
                    }}
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
