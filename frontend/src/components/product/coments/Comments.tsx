import './styles.css';
import CommentItem from './../CommentItem/CommentItem'; // Asegúrate de que la ruta de importación sea 
import { Box, Button, Modal, Rating, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { send_review, bring_reviews } from './../../../api/products'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import NotfoundPage from '../../../global/NotfoundPage';

// JSON de prueba con comentarios

const Comments = ({ productId }) => {
    const [commentsData, setCommentsData] = useState([])
    const [open, setOpen] = useState(false);
    const [opinion, setOpinion] = useState('');
    const [rating, setRating] = useState(0);

    const handleOpen = () => setOpen(true);

    const handleOpinionChange = (event) => setOpinion(event.target.value);
    const handleRatingChange = (event, newRating) => setRating(newRating);

    // Simulación de obtención de datos del token
    const getUserDataFromToken = () => {
        // Supongamos que tienes una función que devuelve el token decodificado
        const token = { id: '6', avatar: '/path/to/user-avatar.jpg' }; // Esto debería venir de la autenticación real
        return token;
    };

    function tiempoTranscurrido(fecha) {
        const fechaParsed = parseISO(fecha);
        const resultado = formatDistanceToNow(fechaParsed, { addSuffix: true, locale: es });
        return resultado;
    }

    const bring_all_coments_product = async () => {
        try {
            const response = await bring_reviews(productId)
            setCommentsData(response.data)

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        bring_all_coments_product()
    }, [productId])

    const handleClose = async () => {
        const { id } = getUserDataFromToken();

        const data = {
            userId: id,
            rating: rating,
            opinion: opinion,
        };

        try {
            await send_review(data, productId);
            toast.success("Se ha registrado la reseña del producto correctamente 😊")
            bring_all_coments_product()
            // Aquí puedes manejar la respuesta si es necesario
        } catch (e) {
            toast.warning("Ya has opinado sobre este producto");
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
                                    <div className={commentsData.length > 0 ? "card py-3 coments-section2 card-bordered" :  commentsData.length > 1 ? "card py-3 coments-section card-bordered" : "card py-3 coments-section3 card-bordered"}>
                                        <h2 className='titulo-sala-compra-light'>Centro de opiniones</h2>
                                        <h4 className='sub-titulo-sala-compra-light'>
                                            Conocer lo que opina la gente del producto quizá te pueda ayudar a tomar una buena decisión
                                        </h4>
                                        <div className='w-11/12 mx-auto mt-5 ratingContainer'>
                                            {
                                                commentsData.length > 0 ? (
                                                    <>
                                                        {commentsData.map((comment, index) => (
                                                            <CommentItem
                                                                key={index}
                                                                profileImage={comment.user.avatar}
                                                                name={comment.user.name}
                                                                date={tiempoTranscurrido(comment.created)}
                                                                commentText={comment.comment}
                                                                ratingValue={comment.rating}
                                                            />
                                                        ))}

                                                    </>
                                                ) : (
                                                    <>
                                                        <p className='text-center  texto my-10'>
                                                            No hay opiniones para este producto
                                                        </p>
                                                    </>
                                                )
                                            }
                                                </div>
                                            <Button
                                                variant="contained"
                                                className='flex w-2/12 my-5 mx-auto focus:outline-none border-none'
                                                onClick={handleOpen}
                                            >
                                                Añadir opinión
                                            </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
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
