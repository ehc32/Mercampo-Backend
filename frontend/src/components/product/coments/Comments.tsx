import './styles.css';
import CommentItem from './../CommentItem/CommentItem'; // Asegúrate de que la ruta de importación sea 
import { Box, Button, Modal, Rating, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { send_review } from './../../../api/products'

// JSON de prueba con comentarios
const commentsData = [
    {
        profileImage: '/path/to/user1.jpg',
        name: 'John Doe',
        date: '2 days ago',
        commentText: 'Este producto es asombroso, lo recomiendo a todos!',
        ratingValue: 4.5,
    },
    {
        profileImage: '/path/to/user2.jpg',
        name: 'Jane Smith',
        date: '1 week ago',
        commentText: 'Encontré este producto muy útil en mi día a día.',
        ratingValue: 4.0,
    },
    {
        profileImage: '/path/to/user3.jpg',
        name: 'Alice Johnson',
        date: '3 days ago',
        commentText: 'El producto tiene un diseño elegante y es muy funcional.',
        ratingValue: 5.0,
    },
    {
        profileImage: '/path/to/user4.jpg',
        name: 'Bob Brown',
        date: '5 days ago',
        commentText: 'La calidad es buena, pero podría mejorar en algunos aspectos.',
        ratingValue: 3.5,
    },
];

const Comments = ({productId}) => {
    const [open, setOpen] = useState(false);
    const [opinion, setOpinion] = useState('');
    const [rating, setRating] = useState(0);

    const handleOpen = () => setOpen(true);

    const handleOpinionChange = (event) => setOpinion(event.target.value);
    const handleRatingChange = (event, newRating) => setRating(newRating);

    // Simulación de obtención de datos del token
    const getUserDataFromToken = () => {
        // Supongamos que tienes una función que devuelve el token decodificado
        const token = { id: '1', avatar: '/path/to/user-avatar.jpg' }; // Esto debería venir de la autenticación real
        return token;
    };

    const handleClose = async () => {
        const { id, avatar } = getUserDataFromToken();

        const data = {
            userId: id,
            userAvatar: avatar,
            rating: rating,
            opinion: opinion,
        };

        try {
            const response = await send_review(data, productId);
            console.log(response)
            toast.success("Se ha registrado la reseña del producto correctamente 😊")
            // Aquí puedes manejar la respuesta si es necesario
        } catch (e) {
            toast.warning("Ha ocurrido un error al enviar tu reseña del producto 😢");
        }

        setOpen(false);
    };

    return (
        <>
            <div className="nk-main main-detail-product">
                <div className="nk-wrap">
                    <div className="nk-content">
                        <div className="container-fluid">
                            <div className="nk-content-body">
                                <div className="nk-block">
                                    <div className="card py-3 coments-section card-bordered">
                                        <h2 className='titulo-sala-compra-light'>Centro de opiniones</h2>
                                        <h4 className='sub-titulo-sala-compra-light'>
                                            Conocer lo que opina la gente del producto quizá te pueda ayudar a tomar una buena decisión
                                        </h4>
                                        <div className='w-11/12 mx-auto mt-5 ratingContainer'>
                                            {commentsData.map((comment, index) => (
                                                <CommentItem
                                                    key={index}
                                                    profileImage={comment.profileImage}
                                                    name={comment.name}
                                                    date={comment.date}
                                                    commentText={comment.commentText}
                                                    ratingValue={comment.ratingValue}
                                                />
                                            ))}
                                        </div>
                                        <Button variant="contained" className='flex w-2/12 my-5 mx-auto focus:outline-none border-none' onClick={handleOpen}>Añadir opinión</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Añadir Opinión
                    </Typography>
                    <TextField
                        label="Tu opinión"
                        fullWidth
                        multiline
                        rows={4}
                        value={opinion}
                        onChange={handleOpinionChange}
                        inputProps={{ maxLength: 150 }}
                        sx={{ mt: 2 }}
                    />
                    <div className='ratingContainer'>
                        <Typography component="legend" sx={{ mt: 2 }}>Tu Rating</Typography>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={handleRatingChange}
                        />
                    </div>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        sx={{ mt: 2 }}
                    >
                        Enviar opinión
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Comments;
