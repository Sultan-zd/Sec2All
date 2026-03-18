import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const SubmissionConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trackingId = location.state?.trackingId || localStorage.getItem('certTrackingId');

  const handleTrackClick = () => {
    navigate("/track-application");
  };
  
  const handlePaymentClick = () => {
    navigate("/gold-payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9c74f] to-[#f2a900] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-2xl">
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#cc7a00] to-[#b36b00] mb-6">
            Thank You for Your Submission!
          </h1>

          {/* Email Notification Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-3">
              <FaEnvelope className="text-2xl text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-blue-800">Email Confirmation Sent</h2>
            </div>
            <p className="text-blue-700">
              We've sent a confirmation email to your registered email address with your tracking ID:
              <span className="font-mono font-bold block mt-2 text-lg">{trackingId}</span>
            </p>
          </div>

          <p className="text-lg text-gray-700 mb-4">
            Your application for the <strong>Gold Certificate</strong> has been successfully submitted.
          </p>
          <p className="text-gray-600 mb-6">
            To complete your registration, you need to proceed with the payment. Please click the button below to finalize your application.
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="my-8 border-t-2 border-gray-300"></div>

        {/* Next Steps */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#b36b00] mb-4">What's Next?</h2>
          <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
            <li>Check your email for the confirmation and tracking details</li>
            <li>We will verify your uploaded CSR and domain ownership</li>
            <li>If required, we may contact you for additional details</li>
            <li>Once approved, your certificate will be issued and emailed to you</li>
          </ul>
        </div>

        {/* Payment Call-to-Action */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-[#b36b00] mb-4">Complete Your Payment</h2>
          <p className="text-lg text-gray-700 mb-6">
            To proceed, please complete the payment process. Once payment is made, your certificate will be processed and delivered.
          </p>
          <button
            className="bg-[#f7b500] text-black font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#e5a000] transition duration-300"
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
              navigate("/");
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
