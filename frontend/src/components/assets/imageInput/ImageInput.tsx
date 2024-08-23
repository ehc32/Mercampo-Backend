import React, { useState } from 'react';
import { Grid } from '@mui/material';

const ImageInput = () => {
    const [images, setImages] = useState<string[]>([]);

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
            <Grid container spacing={2}>
                {images.map((image, index) => (
                    <Grid item xs={4} sm={3} md={2} key={index}>
                        <img src={image} alt="" style={{ width: '100%' }} />
                    </Grid>
                ))}
            </Grid>
            <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
    );
};

export default ImageInput;