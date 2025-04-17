import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box, TextField, Button, Grid, CircularProgress, Alert, Input, Typography, Avatar
} from '@mui/material';

function CollectibleForm({ initialData = {}, onSubmit, isSaving = false, error = '' }) {
    const { control, handleSubmit, reset, register, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            image: null, // Store the File object here
            ...initialData, // Spread initial data
            // Don't set image default from initialData.imageUrl, only for preview
        }
    });

    // Watch the image field to update preview
    const imageFile = watch('image');
    const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || null);

    useEffect(() => {
        // Reset form when initialData changes (e.g., loading existing data)
        reset({
            name: initialData.name || '',
            image: null, // Always reset file input
        });
        setPreviewUrl(initialData?.imageUrl || null); // Update preview on initial load/change
    }, [initialData, reset]);

    useEffect(() => {
        // Create object URL for preview when imageFile changes
        let objectUrl = null;
        if (imageFile && imageFile[0]) { // imageFile is a FileList
            objectUrl = URL.createObjectURL(imageFile[0]);
            setPreviewUrl(objectUrl);
        }

        // Clean up the object URL when component unmounts or file changes
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageFile]); // Depend on the watched imageFile

    const handleFormSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image && data.image[0]) { // Make sure there's a file selected
            formData.append('image', data.image[0]);
        }
        // If editing, the backend needs to know if the image is being replaced or kept.
        // Your API might need an additional flag, or handle it based on whether 'image' is present in FormData.
        // If you only send 'name' when image is not changed, backend PUT/PATCH should only update name.

        onSubmit(formData); // Pass FormData to the parent
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Collectible name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                label="Collectible Name"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />

                    <Typography variant="subtitle1" gutterBottom>Upload Image</Typography>
                    <Input
                        type="file"
                        id="collectible-image"
                        accept="image/png, image/jpeg, image/gif, image/webp" // Specify acceptable formats
                        {...register('image', {
                            // Add validation if needed (e.g., file size, required on create)
                            validate: {
                                // Example: required only if not editing OR if editing and no initial image
                                // required: value => (!!initialData?.id && !!initialData?.imageUrl) ? true : (value && value.length > 0) || 'Image is required for new collectibles',
                                // Example: File size validation (e.g., max 2MB)
                                // fileSize: value => (!value || !value[0] || value[0].size <= 2 * 1024 * 1024) || 'File size should be less than 2MB',
                            }
                        })}
                        sx={{ display: 'block', mb: 1 }} // Simple file input
                    />
                    {errors.image && <FormHelperText error>{errors.image.message}</FormHelperText>}
                    <Typography variant="caption" display="block" gutterBottom>
                        Recommended: Square image (e.g., 512x512px), PNG/WEBP preferred. Max 2MB.
                    </Typography>

                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                     <Typography variant="subtitle2" gutterBottom>Preview</Typography>
                     <Avatar
                        src={previewUrl} // Use state variable for preview
                        alt={initialData?.name || 'Preview'}
                        variant="rounded"
                        sx={{ width: 150, height: 150, margin: 'auto' }}
                    >
                        {/* Placeholder if no image */}
                        {!previewUrl && '?'}
                    </Avatar>
                     {previewUrl && previewUrl !== initialData?.imageUrl && (
                         <Typography variant="caption" display="block" sx={{mt: 1}}>(New image)</Typography>
                     )}
                </Grid>
            </Grid>


            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSaving}
            >
                {isSaving ? <CircularProgress size={24} /> : (initialData?.id ? 'Save Changes' : 'Create Collectible')}
            </Button>
        </Box>
    );
}

export default CollectibleForm;
