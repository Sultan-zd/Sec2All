import React from 'react';
import { useNavigate } from "react-router-dom";

const GoldCertificate = () => {
  const navigate = useNavigate();

  const handleBuyNowClick =() => {
    navigate('/customer-form');
  };
  return (
    <div className="bg-gradient-to-b from-[#f9c74f] to-[#f2a900] text-white py-16">
      <div className="max-w-screen-lg mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f7b500] to-[#9d7b00] mb-4">
            Gold Wildcard Certificate
          </h2>
          <p className="text-xl text-gray-200">
            Robust protection for valuable domains with premium security and trust.
          </p>
        </div>

        {/* Certificate Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-4">Why Choose a Wildcard Certificate?</h3>
            <p className="text-gray-800">
              Wildcard certificates provide an easy way to secure multiple subdomains with a single certificate. Ideal for growing businesses with expanding web needs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-4">Security for Unlimited Subdomains</h3>
            <p className="text-gray-800">
              With Gold Wildcard, you can secure unlimited subdomains with a single certificate. It's perfect for websites with many subdomains, ensuring comprehensive protection.
            </p>
          </div>
        </div>

        {/* More Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-4">Single Certificate for Multiple Subdomains</h3>
            <p className="text-gray-800">
              Simplify your SSL management with the Gold Wildcard certificate. No need for individual certificates for each subdomain. One certificate covers all.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-4">Encryption & Trust</h3>
            <p className="text-gray-800">
              The Gold Wildcard certificate uses strong encryption to ensure your subdomains are secure and trusted by major browsers.
            </p>
          </div>
        </div>

        {/* Validity & Browser Compatibility Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-4">Validity Period</h3>
            <p className="text-gray-800">
              Valid for up to 5 years, saving you time on renewals and giving you long-term peace of mind for your subdomains.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-4">Compatible with Most Browsers</h3>
            <p className="text-gray-800">
              The Gold Wildcard certificate is compatible with almost every browser, ensuring a seamless experience for your users.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#cc7a00] to-[#b36b00] mb-4">Get Your Gold Certificate Now</h3>
          <p className="text-lg mb-8 text-gray-200">Ensure the highest level of security for your domains with the Gold Wildcard certificate.</p>
          <button className="bg-[#f7b500] text-black font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#e5a000] transition duration-300"
          onClick={() => {
            navigate("/customer-form");
          }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoldCertificate;
