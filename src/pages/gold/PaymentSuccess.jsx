import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d4af37] to-[#e6c200]">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full sm:w-96 text-center">
        {/* Message de confirmation */}
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#b08d57] to-[#e6be8a] mb-4">
          🎉 Payment Successful! 🎉
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for purchasing our <strong>Gold Certificate</strong>! Your certificate is being processed and will be ready soon.
        </p>

        {/* Cadeau pour le premier achat */}
        <div className="bg-gradient-to-r from-[#e8b923] to-[#ffd700] p-4 rounded-lg text-white mb-6">
          <h3 className="text-xl font-bold"> <strong>Special gift for you! 🎁</strong></h3>
          <p className="text-md mt-2 font-semibold">
            As a thank you for your first subscription, enjoy a  <strong>10% Discount</strong> on your next purchase!
          </p>
          <p className="text-md mt-2">
            Use code: <span className="text-[#ffd700] bg-[#4b3621] px-2 py-1 rounded-lg font-bold">WELCOME10</span>
          </p>
        </div>

        {/* Message de remerciement et code de suivi */}
        <div className="bg-gradient-to-r from-[#f0c27b] to-[#e6a356] p-4 rounded-lg text-white mb-6">
          <h3 className="text-xl font-bold">Your Transaction ID</h3>
          <p className="text-md mt-2 font-semibold">TRX-1234567890</p>
          <p className="text-sm mt-2">Keep this ID for future reference.</p>
        </div>

        {/* Boutons pour les actions suivantes */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-[#b08d57] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#89673d] transition duration-300"
          >
            Return to Home
          </button>
          <button
            onClick={() => navigate('/track-application')}
            className="bg-[#e6a356] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#cc8e47] transition duration-300"
          >
            Track Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
