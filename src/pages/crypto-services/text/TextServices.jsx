import { useNavigate } from 'react-router-dom';

const TextServices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2F3F4D] to-[#B2D0D9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Text Security Services
          </h1>
          <p className="text-xl text-gray-200">
            Encrypt, decrypt, and hash your sensitive text with military-grade security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Text Encryption Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Text Encryption
            </h3>
            <p className="text-gray-600 mb-6">
              Encrypt and decrypt text using various algorithms including AES, 
              ChaCha20, and more. Perfect for securing messages and sensitive data.
            </p>
            <button
              onClick={() => navigate('/crypto-services/text/encryption')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Encrypt Text
            </button>
          </div>

          {/* Text Hashing Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🔑</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Text Hashing
            </h3>
            <p className="text-gray-600 mb-6">
              Generate and verify text hashes using multiple algorithms (MD5, SHA-256, 
              SHA-512, etc.). Ensure message integrity and create digital fingerprints.
            </p>
            <button
              onClick={() => navigate('/crypto-services/text/hashing')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Hash Text
            </button>
          </div>

          {/* Base64 Encoding Card */}
          <div onClick={() => navigate('/crypto-services/text/base64')} className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Base64 Encoding
            </h3>
            <p className="text-gray-600 mb-6">
              Convert text to and from Base64 format. Useful for encoding binary data
              into ASCII text format for safe transmission.
            </p>
            <button
              onClick={() => navigate('/crypto-services/text/base64')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300"
            >
              Encode/Decode
            </button>
          </div>

          {/* URL Encoding Card */}
          <div onClick={() => navigate('/crypto-services/text/URLEncoding')} className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              URL Encoding
            </h3>
            <p className="text-gray-600 mb-6">
              Encode and decode text for safe URL transmission. Handle special characters
              and ensure proper URL formatting.
            </p>
            <button
              onClick={() => navigate('/crypto-services/text/url')}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all duration-300"
            >
              URL Tools
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/crypto-services')}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            Back to Crypto Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextServices; 