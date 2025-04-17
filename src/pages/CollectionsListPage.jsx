import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Delete as DeleteIcon, 
  Visibility as ViewIcon, 
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchCollections, deleteCollection } from '../api/apiService';

const COLLECTION_TYPES = [
  'Stamps',
  'Coins',
  'Badges',
  'Cards',
  'Other'
];

const CollectionsListPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    key: '',
    filter: '',
    operator: '',
    order: 'name',
    direction: 'asc'
  });
  
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const fetchCollectionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...filters,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize
      };
      
      const response = await fetchCollections(params);
      
      if (response && response.items) {
        setCollections(response.items);
        setPagination({
          pageNumber: response.pageNumber,
          pageSize: pagination.pageSize,
          totalCount: response.totalCount,
          totalPages: response.totalPages
        });
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      setError('Failed to load collections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchCollectionsData();
    }
  }, [authToken, pagination.pageNumber, pagination.pageSize, filters]);

  const handleDelete = (collection) => {
    setSelectedCollection(collection);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCollection(selectedCollection.id);
      fetchCollectionsData();
    } catch (error) {
      console.error('Error deleting collection:', error);
      setError('Failed to delete collection. Please try again later.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleView = (collection) => {
    navigate(`/collections/${collection.id}`);
  };

  const handleEdit = (collection) => {
    navigate(`/collections/${collection.id}/edit`);
  };

  const handleAdd = () => {
    navigate('/collections/new');
  };

  const handlePageChange = (event, newPage) => {
    setPagination({
      ...pagination,
      pageNumber: newPage - 1 // API uses 0-based indexing
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
    setPagination({
      ...pagination,
      pageNumber: 0 // Reset to first page when filter changes
    });
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 150
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ 
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%'
        }}>
          {params.value}
        </Box>
      )
    },
    { 
      field: 'collectionType', 
      headerName: 'Type', 
      flex: 0.8,
      minWidth: 120
    },
    { 
      field: 'collectedCount', 
      headerName: 'Collected', 
      flex: 0.5,
      minWidth: 100,
      type: 'number'
    },
    { 
      field: 'totalInCollectionCount', 
      headerName: 'Total', 
      flex: 0.5,
      minWidth: 100,
      type: 'number'
    },
    { 
      field: 'totalCollectionCollectorPoints', 
      headerName: 'Points', 
      flex: 0.5,
      minWidth: 100,
      type: 'number'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            color="primary" 
            onClick={() => handleView(params.row)}
            size="small"
          >
            <ViewIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(params.row)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Collections
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Collection
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              size="small"
              value={filters.key}
              onChange={(e) => handleFilterChange('key', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type"
              variant="outlined"
              size="small"
              value={filters.filter}
              onChange={(e) => handleFilterChange('filter', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              {COLLECTION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Sort By"
              variant="outlined"
              size="small"
              value={filters.order}
              onChange={(e) => handleFilterChange('order', e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="collectionType">Type</MenuItem>
              <MenuItem value="collectedCount">Collected</MenuItem>
              <MenuItem value="totalInCollectionCount">Total</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Direction"
              variant="outlined"
              size="small"
              value={filters.direction}
              onChange={(e) => handleFilterChange('direction', e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 'calc(100vh - 300px)', width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DataGrid
              rows={collections}
              columns={columns}
              pageSize={pagination.pageSize}
              rowCount={pagination.totalCount}
              paginationMode="server"
              pagination
              disableSelectionOnClick
              disableColumnMenu
              getRowId={(row) => row.id}
              components={{
                Pagination: () => (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.pageNumber + 1}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                ),
              }}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Collection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the collection "{selectedCollection?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionsListPage; 