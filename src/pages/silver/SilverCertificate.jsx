import React from 'react';
import { useNavigate } from "react-router-dom";

const SilverCertificate = () => {
  const navigate = useNavigate(); // Initialiser useNavigate

  const handleBuyNowClick = () => {
    // Rediriger vers une autre page
    navigate('/customer-form3'); // Remplacez '/checkout' par l'URL de votre page cible
  };

  return (
    <div className="bg-gradient-to-b from-[#8e9b9b] to-[#adb7b7] text-white py-16">
      <div className="max-w-screen-lg mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#333333] to-[#1a1a1a] mb-4">
            Silver Wildcard Certificate
          </h2>
          <p className="text-xl text-gray-200">
            Secure your domains with affordability and reliable protection.
          </p>
        </div>

        {/* Certificate Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#b3b3b3] mb-4">Why Choose a Wildcard Certificate?</h3>
            <p className="text-gray-800">
              Silver Wildcard certificates offer essential protection for your subdomains, ideal for small to medium-sized businesses.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#b3b3b3] mb-4">Security for Unlimited Subdomains</h3>
            <p className="text-gray-800">
              With the Silver Wildcard, you can secure multiple subdomains under one certificate. It's affordable and secure.
            </p>
          </div>
        </div>

        {/* More Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#b3b3b3] mb-4">Single Certificate for Multiple Subdomains</h3>
            <p className="text-gray-800">
              Manage all your subdomains with a single Silver Wildcard certificate. Simplified SSL management made easy.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#b3b3b3] mb-4">Encryption & Trust</h3>
            <p className="text-gray-800">
              Enjoy secure connections with the Silver Wildcard's encryption, trusted by most major browsers.
            </p>
          </div>
        </div>

        {/* Validity & Browser Compatibility Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#b3b3b3] mb-4">Validity Period</h3>
            <p className="text-gray-800">
              Valid for 2-3 years, offering peace of mind with fewer renewals needed.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#b3b3b3] mb-4">Compatible with Most Browsers</h3>
            <p className="text-gray-800">
              Silver Wildcard certificates are widely accepted by major browsers, ensuring secure browsing for your users.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#333333] to-[#1a1a1a] mb-4">Get Your Silver Certificate Now</h3>
          <p className="text-lg mb-8 text-gray-200">Affordable and reliable SSL protection for your domains with the Silver Wildcard certificate.</p>
          <button
            
            className="bg-[#b3b3b3] text-black font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#999999] transition duration-300"
            onClick={() => {
              navigate("/customer-form3");
            }}
          
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SilverCertificate;
