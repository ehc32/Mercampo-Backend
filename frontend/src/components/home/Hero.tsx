import { Link } from "react-router-dom";
import "./Style.css";

interface CarrouselLast12Props {
  darkMode: boolean;
}

const Hero: React.FC<CarrouselLast12Props> = () => {

  return (
    <section
      className="w-full  h-[80vh] bg-center flex flex-col justify-center items-center relative bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/public/campo2.webp')"
      }}>
      <div className="container mx-auto px-6 lg:px-12 text-left">
        <div className="max-w-lg">
          <h1 className="text-white text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Descubre las mejores ofertas
          </h1>
          <p className="text-white text-lg lg:text-xl mb-8">
            En nuestra tienda online encontrarás los productos que necesitas
          </p>
          <Link to="/store">
            <button className="bg-[#39A900] hover:bg-green hover:bg-lime-700 text-white text-lg font-bold py-3 px-6 rounded-full">
              ¡Compra ahora!
            </button>
          </Link>
        </div>
      </div>
      <style>
        {`
    @keyframes expandImage {
      0% {
        background-size: 90% 90%;
        transform: scale(0.9);
      }
      100% {
        background-size: 100% 100%;
        transform: scale(1);
      }
    }
  `}
      </style>
    </section>
  );
};

export default Hero;
