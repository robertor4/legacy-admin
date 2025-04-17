import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../contexts/AuthContext';
import { fetchSubscriptions, fetchSubscriptionById } from '../api/apiService';

const SubscriptionsListPage = () => {
    const navigate = useNavigate();
    const { authToken, isLoading } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    useEffect(() => {
        if (!authToken && !isLoading) {
            navigate('/login');
            return;
        }
        if (authToken) {
            fetchSubscriptionsData();
        }
    }, [authToken, isLoading, navigate]);

    const fetchSubscriptionsData = async () => {
        try {
            setLoading(true);
            const response = await fetchSubscriptions();
            if (response && Array.isArray(response)) {
                setSubscriptions(response);
            } else {
                setSubscriptions([]);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const handleView = async (subscription) => {
        try {
            const subscriptionDetails = await fetchSubscriptionById(subscription.id);
            setSelectedSubscription(subscriptionDetails);
            setViewDialogOpen(true);
        } catch (error) {
            console.error('Error fetching subscription details:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, flex: 0.5 },
        { field: 'name', headerName: 'Name', width: 200, flex: 1.5 },
        { 
            field: 'price', 
            headerName: 'Price', 
            width: 120,
            flex: 1,
            valueFormatter: (params) => params.value ? `$${params.value.toFixed(2)}` : 'N/A'
        },
        { 
            field: 'startDate', 
            headerName: 'Start Date', 
            width: 180,
            flex: 1,
            valueFormatter: (params) => formatDate(params?.value)
        },
        { 
            field: 'endDate', 
            headerName: 'End Date', 
            width: 180,
            flex: 1,
            valueFormatter: (params) => formatDate(params?.value)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 0.5,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View Details">
                        <IconButton onClick={() => handleView(params.row)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Subscriptions ({subscriptions.length})
                </Typography>
            </Box>
            <Paper sx={{ height: 'calc(100% - 100px)', width: '100%' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid
                        rows={subscriptions}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                    />
                )}
            </Paper>

            {/* View Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5">Subscription Details</Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedSubscription && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>{selectedSubscription.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{selectedSubscription.description}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                                    <Typography variant="body1">{selectedSubscription.id || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Product ID</Typography>
                                    <Typography variant="body1">{selectedSubscription.productId || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                                    <Typography variant="body1">
                                        {selectedSubscription.price ? `$${selectedSubscription.price.toFixed(2)}` : 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Parent Plan</Typography>
                                    <Typography variant="body1">{selectedSubscription.parentPlan || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Store</Typography>
                                    <Typography variant="body1">{selectedSubscription.store || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                    <Typography variant="body1">{formatDate(selectedSubscription.startDate)}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                    <Typography variant="body1">{formatDate(selectedSubscription.endDate)}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SubscriptionsListPage; 