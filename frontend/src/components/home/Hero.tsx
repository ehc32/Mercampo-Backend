import { Link } from "react-router-dom";
import "./Style.css";

interface CarrouselLast12Props {
  darkMode: boolean;
}

const Hero: React.FC<CarrouselLast12Props> = () => {
  const handleScroll = () => {
    const swiperElement = document.getElementById("swiperNewProducts");
    if (swiperElement) {
      swiperElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="w-full h-[65vh] bg-cover bg-center flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: "url('/public/campesino.jpeg')",
        animation: "expandImage 1.5s ease-in-out forwards",
      }}
    >
      <div className="container mx-auto px-6 lg:px-12 text-left">
        <div className="max-w-lg">
          <h1 className="text-white text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Descubre las mejores ofertas
          </h1>
          <p className="text-white text-lg lg:text-xl mb-8">
            En nuestra tienda online encontrarás los productos que necesitas
          </p>
          <Link to="/store">
            <button className="bg-[#39A900] hover:bg-green hover:blur-sm text-white text-lg font-bold py-3 px-6 rounded-full">
              ¡Compra ahora!
            </button>
          </Link>
        </div>
      </div>
      <button
        onClick={handleScroll}
        className="absolute bottom-4 transform translate-y-1/2 text-white p-2 bg-transparent border-none hover:text-red-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
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
