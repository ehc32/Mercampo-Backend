import React, { useState } from 'react';
import { Grid, IconButton, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const ImageInput = ({ setImages, images }) => {

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                setImages((prevImages) => [...prevImages, reader.result as string]);
            }
        };
        const files = event.target.files;
        if (files && files[0]) {
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <div>
            <Grid container spacing={2} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {images.map((image, index) => (
                    <Grid item xs={4} sm={3} md={2} key={index}>
                        <img src={image} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                    </Grid>
                ))}
                {images.length < 4 && (
                    <Grid item xs={4} sm={3} md={2}>
                        <Button
                            variant="contained"
                            component="label"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#39A900'
                            }}
                        >
                            <AddPhotoAlternateIcon />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </Button>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default ImageInput;