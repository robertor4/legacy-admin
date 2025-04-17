import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { fetchDashboardStats } from '../api/apiService'; // Placeholder
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CollectionsIcon from '@mui/icons-material/Collections';

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
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Dashboard Overview
            </Typography>
            {stats ? (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', height: '100%', minWidth: '200px', width: '100%' }}>
                            <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1, wordBreak: 'break-word' }}>Total Sign-ups</Typography>
                            <Typography variant="h3">{stats.totalSignups ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', height: '100%', minWidth: '200px', width: '100%' }}>
                            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1, wordBreak: 'break-word' }}>Daily Active Users</Typography>
                            <Typography variant="h3">{stats.dailyActiveUsers ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', height: '100%', minWidth: '200px', width: '100%' }}>
                            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1, wordBreak: 'break-word' }}>Active Quests</Typography>
                            <Typography variant="h3">{stats.activeQuests ?? 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', height: '100%', minWidth: '200px', width: '100%' }}>
                            <CollectionsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1, wordBreak: 'break-word' }}>Total Collectibles</Typography>
                            <Typography variant="h3">{stats.totalCollectibles ?? 'N/A'}</Typography>
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
