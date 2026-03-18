import React from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/securite.webp.jpg";
//import heroZd from "../assets/sercurite2.avif";

const CertificatesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-cover bg-center h-screen border-[rgba(178, 208, 217, 0.5)] mb-0" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="max-w-screen-xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100 text-center mb-12">
          Explore Our Certificates
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Silver Certificate */}
          <div className="p-8 bg-gradient-to-b from-gray-300 to-gray-600 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Silver Certificate</h2>
            <p className="text-gray-600 mb-6">
              Perfect for small businesses and individuals. Provides basic encryption and trust.
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-6">Starting at $50/year</p>
            <button
              className="px-6 py-3 bg-gray-500 hover:bg-gray-400 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => navigate('/silver-certificate')}
            >
              Buy Now
            </button>
          </div>

          {/* Gold Certificate */}
          <div className="p-8 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-yellow-100 mb-4">Gold Certificate</h2>
            <p className="text-yellow-200 mb-6">
              Ideal for medium businesses and organizations. Offers enhanced encryption and validation.
            </p>
            <p className="text-lg font-semibold text-yellow-100 mb-6">Starting at $150/year</p>
            <button
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => navigate('/gold-certificate')}
            >
              Buy Now
            </button>
          </div>

          {/* Platinum Certificate */}
          <div className="p-8 bg-gradient-to-b from-gray-900 to-gray-700 rounded-lg shadow-xl text-center transition transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Platinum Certificate</h2>
            <p className="text-gray-300 mb-6">
              Designed for enterprises and critical infrastructures. Maximum encryption and validation.
            </p>
            <p className="text-lg font-semibold text-white mb-6">Starting at $500/year</p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-600 hover:to-gray-400 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => navigate('/platinum-certificate')}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
