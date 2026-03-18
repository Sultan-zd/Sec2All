import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess3 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#c0c0c0] to-[#dcdcdc]">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full sm:w-96 text-center">
        {/* Message de confirmation */}
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a0a0a0] to-[#bfbfbf] mb-4">
          🎉 Payment Successful! 🎉
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for purchasing our <strong>Silver Certificate</strong>! Your certificate is being processed and will be ready soon.
        </p>

        {/* Cadeau pour le premier achat */}
        <div className="bg-gradient-to-r from-[#b0b0b0] to-[#d3d3d3] p-4 rounded-lg text-white mb-6">
          <h3 className="text-xl font-bold"> <strong>Special gift for you! 🎁</strong></h3>
          <p className="text-md mt-2 font-semibold">
            As a thank you for your first subscription, enjoy a <strong>10% Discount</strong> on your next purchase!
          </p>
          <p className="text-md mt-2">
            Use code: <span className="text-[#d3d3d3] bg-[#808080] px-2 py-1 rounded-lg font-bold">WELCOME10</span>
          </p>
        </div>

        {/* Message de remerciement et code de suivi */}
        <div className="bg-gradient-to-r from-[#e0e0e0] to-[#f5f5f5] p-4 rounded-lg text-gray-800 mb-6">
          <h3 className="text-xl font-bold">Your Transaction ID</h3>
          <p className="text-md mt-2 font-semibold">TRX-1234567890</p>
          <p className="text-sm mt-2">Keep this ID for future reference.</p>
        </div>

        {/* Boutons pour les actions suivantes */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-[#a0a0a0] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#8c8c8c] transition duration-300"
          >
            Return to Home
          </button>
          <button
            onClick={() => navigate('/track-application3')}
            className="bg-[#d3d3d3] text-gray-800 font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#c0c0c0] transition duration-300"
          >
            Track Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess3;
