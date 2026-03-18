import { useNavigate } from 'react-router-dom';

const FileServices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2F3F4D] to-[#B2D0D9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            File Security Services
          </h1>
          <p className="text-xl text-gray-200">
            Protect your files with military-grade encryption and verify their integrity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* File Encryption Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              File Encryption
            </h3>
            <p className="text-gray-600 mb-6">
              Encrypt your sensitive files with AES-256 encryption. Protect documents, 
              archives, and any other file type with secure encryption.
            </p>
            <button
              onClick={() => navigate('/crypto-services/file/encryption')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Encrypt Files
            </button>
          </div>

          {/* File Hashing Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              File Hashing
            </h3>
            <p className="text-gray-600 mb-6">
              Generate and verify file hashes using multiple algorithms (MD5, SHA-1, 
              SHA-256, SHA-512). Ensure file integrity and authenticity.
            </p>
            <button
              onClick={() => navigate('/crypto-services/file/hashing')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Hash Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileServices; 