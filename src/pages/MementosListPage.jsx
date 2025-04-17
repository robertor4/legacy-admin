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
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Visibility as ViewIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchMementos, deleteMemento } from '../api/apiService';

const MementosListPage = () => {
  const [mementos, setMementos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemento, setSelectedMemento] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const loadMementos = async () => {
    try {
      setLoading(true);
      const params = {
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1, // API uses 1-based indexing
      };
      const data = await fetchMementos(params);
      setMementos(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching mementos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMementos();
  }, [paginationModel]);

  const handleDelete = async (memento) => {
    setSelectedMemento(memento);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMemento(selectedMemento.id);
      loadMementos();
    } catch (error) {
      console.error('Error deleting memento:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleView = (memento) => {
    setSelectedMemento(memento);
    setViewDialogOpen(true);
  };

  const handleEdit = (memento) => {
    navigate(`/mementos/${memento.id}/edit`);
  };

  const columns = [
    { 
      field: 'thumbnailUrl', 
      headerName: 'Thumbnail', 
      width: 120,
      renderCell: (params) => {
        if (!params.value) return 'No Image';
        return (
          <Box
            component="img"
            src={params.value}
            alt="Memento thumbnail"
            sx={{
              width: 50,
              height: 50,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        );
      }
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 200,
      valueGetter: (params) => {
        if (!params.row || !params.row.location) return 'N/A';
        return `${params.row.location.x || 0}, ${params.row.location.y || 0}`;
      }
    },
    { 
      field: 'isRoyalExplorerOnTimeOfDiscovery', 
      headerName: 'Royal Explorer', 
      width: 180,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    { 
      field: 'captureDate', 
      headerName: 'Capture Date', 
      width: 250, 
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : 'N/A' 
    },
    { 
      field: 'isMementoLocked', 
      headerName: 'Locked', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'error' : 'success'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleView(params.row)}>
            <ViewIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Mementos ({totalCount})
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/mementos/new')}
        >
          Create New Memento
        </Button>
      </Box>
      
      <Paper sx={{ height: 'calc(100% - 100px)', width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={mementos}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          rowCount={totalCount}
          paginationMode="server"
          disableSelectionOnClick
          disableColumnMenu
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: 'normal',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-row': {
              minHeight: '60px !important',
            },
            '& .MuiDataGrid-footerContainer': {
              marginTop: '8px',
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              paddingTop: '8px',
            },
            '& .MuiDataGrid-virtualScroller': {
              marginBottom: '50px',
            },
          }}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>View Memento</DialogTitle>
        <DialogContent>
          {selectedMemento && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Memento Details</Typography>
              
              {selectedMemento.thumbnailUrl && (
                <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box
                    component="img"
                    src={selectedMemento.thumbnailUrl}
                    alt="Memento thumbnail"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 1,
                      border: '1px solid #ddd',
                    }}
                  />
                </Box>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Typography><strong>ID:</strong> {selectedMemento.id || 'N/A'}</Typography>
                <Typography><strong>Type:</strong> {selectedMemento.type || 'N/A'}</Typography>
                <Typography>
                  <strong>Location:</strong> {selectedMemento.location ? 
                    `${selectedMemento.location.x || 0}, ${selectedMemento.location.y || 0}` : 'N/A'}
                </Typography>
                <Typography><strong>URL:</strong> {selectedMemento.url || 'N/A'}</Typography>
                <Typography><strong>Thumbnail URL:</strong> {selectedMemento.thumbnailUrl || 'N/A'}</Typography>
                <Typography>
                  <strong>Royal Explorer:</strong> {selectedMemento.isRoyalExplorerOnTimeOfDiscovery ? 'Yes' : 'No'}
                </Typography>
                <Typography>
                  <strong>Capture Date:</strong> {selectedMemento.captureDate ? 
                    new Date(selectedMemento.captureDate).toLocaleString() : 'N/A'}
                </Typography>
                <Typography>
                  <strong>Locked:</strong> {selectedMemento.isMementoLocked ? 'Yes' : 'No'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Memento</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this memento? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MementosListPage; 