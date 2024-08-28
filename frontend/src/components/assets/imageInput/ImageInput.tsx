import React, { useState } from 'react';
import { Grid, IconButton, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

interface ImageInputProps {
    setImages: (images: string[]) => void;
    images: string[];
}

const ImageInput = ({ setImages, images }: ImageInputProps) => {

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 400; // Ancho deseado
                    canvas.height = 500; // Alto deseado
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const base64 = canvas.toDataURL('image/jpeg', 0.5); // Calidad 50%
                    setImages((prevImages) => [...prevImages, base64]);
                };
                img.src = reader.result as string;
            }
        };
        const files = event.target.files;
        if (files && files[0]) {
            reader.readAsDataURL(files[0]);
        }
    };

    const handleImageRemove = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className='w-full flex flex-wrap'>
            <Grid container spacing={2} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {images.map((image, index) => (
                    <Grid item xs={4} sm={3} md={2} key={index}>
                        <div style={{ position: 'relative' }}>
                            <img src={image} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                            <IconButton
                                onClick={() => handleImageRemove(index)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
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