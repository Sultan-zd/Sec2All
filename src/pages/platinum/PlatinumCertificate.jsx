import React from 'react';
import { useNavigate } from "react-router-dom";

const PlatinumCertificate = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#0d1b2a] to-[#1b4332] text-white py-16">
      <div className="max-w-screen-lg mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4af5f5] to-[#38c2bd] mb-4">
            Platinum Wildcard Certificate
          </h2>
          <p className="text-xl text-gray-300">
            The ultimate solution for maximum security and unmatched trust.
          </p>
        </div>

        {/* Certificate Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-gradient-to-r from-[#142f43] to-[#1e5648] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#4af5f5] mb-4">Why Choose the Platinum Certificate?</h3>
            <p className="text-gray-200">
              The Platinum Certificate is designed for the most critical applications, offering unparalleled security and trust for high-value domains.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#142f43] to-[#1e5648] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#4af5f5] mb-4">Maximum Protection for Unlimited Subdomains</h3>
            <p className="text-gray-200">
              With the Platinum Wildcard Certificate, secure unlimited subdomains with the highest level of encryption, ensuring absolute confidence for your users.
            </p>
          </div>
        </div>

        {/* More Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-gradient-to-r from-[#142f43] to-[#1e5648] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#4af5f5] mb-4">Simplified Management</h3>
            <p className="text-gray-200">
              Manage all your subdomains with one Platinum Certificate, eliminating complexity while ensuring top-notch protection.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#142f43] to-[#1e5648] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#4af5f5] mb-4">Ultimate Encryption Standards</h3>
            <p className="text-gray-200">
              Platinum Wildcard Certificates utilize cutting-edge encryption technologies, trusted by browsers worldwide.
            </p>
          </div>
        </div>

        {/* Validity & Browser Compatibility Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-gradient-to-r from-[#142f43] to-[#1e5648] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#4af5f5] mb-4">Extended Validity</h3>
            <p className="text-gray-200">
              Enjoy peace of mind with a validity period of up to 5 years, minimizing the hassle of renewals.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#142f43] to-[#1e5648] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#4af5f5] mb-4">Browser Compatibility</h3>
            <p className="text-gray-200">
              Trusted by all major browsers, the Platinum Certificate ensures seamless and secure connections for all users.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4af5f5] to-[#38c2bd] mb-4">
            Get Your Platinum Certificate Now
          </h3>
          <p className="text-lg mb-8 text-gray-300">
            Invest in the highest level of protection and trust for your domains.
          </p>
          <button
            className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:from-[#005f8d] hover:to-[#0095c8] transition duration-300"
            onClick={() => navigate("/customer-form2")}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlatinumCertificate;
