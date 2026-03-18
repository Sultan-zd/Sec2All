import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmissionConfirmation3 = () => {
  const navigate = useNavigate();

  const handleTrackClick = () => {
    navigate("/track-application3");
  };

  const handlePaymentClick = () => {
    navigate("/silver-payment3");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d3d3d3] to-[#b0c4de] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a9a9a9] to-[#778899] mb-6">
            Thank You for Your Submission!
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Your application for the <strong>Silver Certificate</strong> has been successfully submitted.
          </p>
          <p className="text-gray-600 mb-6">
            To complete your registration, you need to proceed with the payment. Please click the button below to finalize your application.
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="my-8 border-t-2 border-gray-300"></div>

        {/* Next Steps */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#778899] mb-4">What’s Next?</h2>
          <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
            <li>We will verify your uploaded CSR and domain ownership.</li>
            <li>If required, we may contact you for additional details.</li>
            <li>Once approved, your certificate will be issued and emailed to you.</li>
          </ul>
        </div>

        {/* Payment Call-to-Action */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-[#778899] mb-4">Complete Your Payment</h2>
          <p className="text-lg text-gray-700 mb-6">
            To proceed, please complete the payment process. Once payment is made, your certificate will be processed and delivered.
          </p>
          <button
            className="bg-[#c0c0c0] text-black font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#a9a9a9] transition duration-300"
            onClick={handlePaymentClick}
          >
            Proceed to Payment
          </button>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <button
            className="bg-[#778899] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#6a6e79] transition duration-300"
            onClick={handleTrackClick}
          >
            Track Your Application
          </button>
          <button
            className="bg-gray-800 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
            onClick={() => {
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

export default SubmissionConfirmation3;
