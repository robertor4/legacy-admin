import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl,
    FormHelperText, CircularProgress, Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { fetchCollectibles } from '../api/apiService'; // Placeholder

function QuestForm({ initialData = {}, onSubmit, isSaving = false, error = '' }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            difficulty: 'Easy',
            rewardCollectibleId: '',
            startDate: null, // Use null for date pickers
            endDate: null,
             ...initialData, // Spread initial data
             // Ensure dates are Dayjs objects for the picker
             startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
             endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
        }
    });

    const [collectibles, setCollectibles] = useState([]);
    const [loadingCollectibles, setLoadingCollectibles] = useState(true);

    useEffect(() => {
        // Reset form when initialData changes (e.g., when switching from New to Edit)
        reset({
             ...initialData,
             startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
             endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
        });
    }, [initialData, reset]);

     useEffect(() => {
        const loadCollectibles = async () => {
            setLoadingCollectibles(true);
            try {
                const response = await fetchCollectibles();
                setCollectibles(response.data || []);
            } catch (err) {
                console.error("Failed to load collectibles:", err);
                // Handle error state if needed
            } finally {
                 setLoadingCollectibles(false);
            }
        };
        loadCollectibles();
    }, []);

    const handleFormSubmit = (data) => {
       // Convert Dayjs objects back to ISO strings or desired format for API
        const apiData = {
            ...data,
            startDate: data.startDate ? data.startDate.toISOString() : null,
            endDate: data.endDate ? data.endDate.toISOString() : null,
        };
        onSubmit(apiData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'Title is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                label="Quest Title"
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />
                </Grid>
                 <Grid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </Grid>
                 <Grid item xs={12} sm={6}>
                     <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: 'Start date is required' }}
                        render={({ field }) => (
                            <DateTimePicker
                                {...field}
                                label="Start Date & Time"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                     />
                                )}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                     <Controller
                        name="endDate"
                        control={control}
                        rules={{
                           required: 'End date is required',
                            validate: (value, formValues) => {
                               return !formValues.startDate || !value || value.isAfter(formValues.startDate) || 'End date must be after start date';
                           }
                        }}
                        render={({ field }) => (
                            <DateTimePicker
                                {...field}
                                label="End Date & Time"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        error={!!errors.endDate}
                                        helperText={errors.endDate?.message}
                                     />
                                )}
                             />
                         )}
                     />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.difficulty}>
                        <InputLabel id="difficulty-label">Difficulty</InputLabel>
                        <Controller
                            name="difficulty"
                            control={control}
                            rules={{ required: 'Difficulty is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="difficulty-label"
                                    label="Difficulty"
                                >
                                    <MenuItem value="Easy">Easy</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="Hard">Hard</MenuItem>
                                </Select>
                             )}
                        />
                         {errors.difficulty && <FormHelperText>{errors.difficulty.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                 <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.rewardCollectibleId}>
                        <InputLabel id="collectible-label">Reward Collectible</InputLabel>
                        <Controller
                            name="rewardCollectibleId"
                            control={control}
                            rules={{ required: 'Reward is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="collectible-label"
                                    label="Reward Collectible"
                                    disabled={loadingCollectibles}
                                >
                                     {loadingCollectibles && <MenuItem value=""><CircularProgress size={20} /></MenuItem>}
                                    {!loadingCollectibles && collectibles.length === 0 && <MenuItem value="" disabled>No collectibles available</MenuItem>}
                                    {!loadingCollectibles && collectibles.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>
                                            {c.name} (ID: {c.id})
                                        </MenuItem>
                                    ))}
                                </Select>
                             )}
                        />
                         {errors.rewardCollectibleId && <FormHelperText>{errors.rewardCollectibleId.message}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSaving}
            >
                {isSaving ? <CircularProgress size={24} /> : (initialData.id ? 'Save Changes' : 'Create Quest')}
            </Button>
        </Box>
    );
}

export default QuestForm;
