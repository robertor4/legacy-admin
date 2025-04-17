import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { fetchDashboardStats } from '../api/apiService'; // Placeholder

function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

     useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (err) {
                setError('Failed to load dashboard statistics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard Overview
            </Typography>
            {stats ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Total Sign-ups</Typography>
                            <Typography variant="h4">{stats.totalSignups ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                     <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Daily Active Users</Typography>
                            <Typography variant="h4">{stats.dailyActiveUsers ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                     <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Active Quests</Typography>
                            <Typography variant="h4">{stats.activeQuests ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Total Collectibles</Typography>
                            <Typography variant="h4">{stats.totalCollectibles ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                    {/* Add more stat cards or charts here */}
                </Grid>
            ) : (
                 <Typography>No statistics available.</Typography>
            )}
        </Box>
    );
}

export default DashboardPage;
