import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl,
    FormHelperText, CircularProgress, Alert, Stack, Input, Typography, Avatar
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { fetchCollectibles } from '../api/apiService'; // Placeholder

function QuestForm({ initialData = {}, onSubmit, isSaving = false, error = '' }) {
    const { control, handleSubmit, reset, register, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            difficulty: 'Easy',
            rewardCollectibleId: '',
            startDate: null,
            endDate: null,
            icon: null,
            ...initialData,
            startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
            endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
        }
    });

    const [collectibles, setCollectibles] = useState([]);
    const [loadingCollectibles, setLoadingCollectibles] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(initialData?.iconUrl || null);

    // Watch the icon field to update preview
    const iconFile = watch('icon');

    useEffect(() => {
        // Reset form when initialData changes
        reset({
            ...initialData,
            icon: null,
            startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
            endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
        });
        setPreviewUrl(initialData?.iconUrl || null);
    }, [initialData, reset]);

    useEffect(() => {
        // Create object URL for preview when iconFile changes
        let objectUrl = null;
        if (iconFile && iconFile[0]) {
            objectUrl = URL.createObjectURL(iconFile[0]);
            setPreviewUrl(objectUrl);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [iconFile]);

    useEffect(() => {
        const loadCollectibles = async () => {
            setLoadingCollectibles(true);
            try {
                const response = await fetchCollectibles();
                setCollectibles(response.data || []);
            } catch (err) {
                console.error("Failed to load collectibles:", err);
            } finally {
                setLoadingCollectibles(false);
            }
        };
        loadCollectibles();
    }, []);

    const handleFormSubmit = (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('difficulty', data.difficulty);
        formData.append('rewardCollectibleId', data.rewardCollectibleId);
        formData.append('startDate', data.startDate ? data.startDate.toISOString() : null);
        formData.append('endDate', data.endDate ? data.endDate.toISOString() : null);
        if (data.icon && data.icon[0]) {
            formData.append('icon', data.icon[0]);
        }
        onSubmit(formData);
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit(handleFormSubmit)} 
            noValidate 
            sx={{ 
                mt: 8,
                maxWidth: 'md',
            }}
        >
            <Stack spacing={3}>
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

                <Box>
                    <Typography variant="subtitle1" gutterBottom>Quest Icon</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        {previewUrl && (
                            <Avatar
                                src={previewUrl}
                                sx={{ width: 64, height: 64 }}
                            />
                        )}
                        <Input
                            type="file"
                            id="quest-icon"
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            {...register('icon')}
                            sx={{ flex: 1 }}
                        />
                    </Box>
                    <Typography variant="caption" display="block" gutterBottom>
                        Recommended: Square image (e.g., 512x512px), PNG/WEBP preferred. Max 2MB.
                    </Typography>
                </Box>

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

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    sx={{ mt: 2 }}
                >
                    {isSaving ? <CircularProgress size={24} /> : (initialData.id ? 'Save Changes' : 'Create Quest')}
                </Button>
            </Stack>
        </Box>
    );
}

export default QuestForm;
