import React from "react";
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css';
import "./styles.css";

interface Producto {
  nombre?: string;
  foto?: string;
  price?: number;
  description?: string;
  locate?: string;
  categoria?: string;
  fecha?: string;
  first_image?: string;
  slug?: string;
  name?: string;
  category?: string;
}

interface SwiperPropsP {
  width: string;
  height: string;
  isUpSwiper?: boolean;
  loader: boolean;
  datos: Producto[];
}

const SwiperNewProducts: React.FC<SwiperPropsP> = ({ datos }) => {
  const images = datos.map(product => ({
    original: product.first_image || "https://via.placeholder.com/1000x600",
    thumbnail: product.first_image || "https://via.placeholder.com/250x150",
    description: (
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>$ {product.price}</p>
        <p>{product.locate}</p>
      </div>
    )
  }));
  const renderItem = (item: any) => (
    <div className="custom-image-container">
      <img
        src={item.original}
        alt={item.description}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
      <div className="custom-image-description">
        <h3>{item.description.props.children[0].props.children}</h3>
        <div>
          <p>{item.description.props.children[1].props.children}</p>
          <span>{item.description.props.children[2].props.children}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col mb-12">
        <h4 className={'card-name-light'}>Descubre lo mejor</h4>
        <h6 className={'card-subname-light'}>Explora nuestra selección de productos de alta calidad</h6>
      </div>
      <div style={{ width: "85vw", margin: "auto", objectFit: "contain" }}>
        <ImageGallery
          items={images}
          showPlayButton={false}
          showThumbnail={true}
          showNav={false}
          showFullscreenButton={false}
          autoPlay={true}
          showBullets={true}
          slideInterval={2000}
          renderItem={renderItem}
        />
      </div>
    </>
  );
};

export default SwiperNewProducts;
