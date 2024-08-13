import './Card.css'

interface Producto {
    nombre?: string;
    foto?: string;
    precio?: number;
    description?: string;
    locate?: string;
    id?: number;

}

interface CarrouselLast12Props {
    producto: Producto[];
    darkMode: boolean;
}

const Card:  React.FC<CarrouselLast12Props> = ({ producto, darkMode }) => {
    return (
        <>
            <div className="nft">
                <div className='main'>
                    <img className='tokenImage' src={producto.foto} alt="NFT" />
                    <h2>{producto.nombre}</h2>
                    <p className='description'>{producto.description.slice(0, 100)}</p>
                    <div className='tokenInfo'>
                        <div className="price">
                            <ins>$</ins>
                            <p>{producto.precio}</p>
                        </div>
                        <div className="duration">
                            <ins>◷</ins>
                            <p>Fecha</p>
                        </div>
                    </div>
                    <hr />
                    <div className='creator'>
                        <div className='wrapper'>
                            <img src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80" alt="Creator" />
                        </div>
                        <p><ins>Publicado por</ins> Kiberbash</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card;