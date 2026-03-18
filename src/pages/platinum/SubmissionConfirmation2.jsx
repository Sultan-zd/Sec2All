import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmissionConfirmation = () => {
  const navigate = useNavigate();

  const handleTrackClick = () => {
    // Redirige vers la page de suivi de la demande
    navigate("/track-application2");
  };

  const handlePaymentClick = () => {
    // Redirige vers la page de paiement
    navigate("/platinum-payment2");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004e6f] to-[#00c8c8] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#004e6f] to-[#00c8c8] mb-6">
            Thank You for Your Submission!
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Your application for the <strong>Platinum Certificate</strong> has been successfully submitted.
          </p>
          <p className="text-gray-600 mb-6">
            To complete your registration, you need to proceed with the payment. Please click the button below to finalize your application.
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="my-8 border-t-2 border-[#00c8c8]"></div>

        {/* Next Steps */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#00c8c8] mb-4">What’s Next?</h2>
          <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
            <li>We will verify your uploaded CSR and domain ownership.</li>
            <li>If required, we may contact you for additional details.</li>
            <li>Once approved, your Platinum certificate will be issued and emailed to you.</li>
          </ul>
        </div>

        {/* Payment Call-to-Action */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-[#00c8c8] mb-4">Complete Your Payment</h2>
          <p className="text-lg text-gray-700 mb-6">
            To proceed, please complete the payment process. Once payment is made, your Platinum certificate will be processed and delivered.
          </p>
          <button
            className="bg-[#00c8c8] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#004e6f] transition duration-300"
            onClick={handlePaymentClick}
          >
            Proceed to Payment
          </button>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <button
            className="bg-[#4b5563] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#374151] transition duration-300"
            onClick={handleTrackClick}
          >
            Track Your Application
          </button>
          <button
            className="bg-gray-800 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
            onClick={() => {
              // Add logic to redirect to home page
              window.location.href = "/"; // Replace with actual home page URL
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;
