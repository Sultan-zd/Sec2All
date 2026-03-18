import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5174/api/crypto/file';

const FileEncryption = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [encryptionMethod, setEncryptionMethod] = useState('AES-256-CBC');

  const encryptionMethods = [
    {
      value: 'AES-256-CBC',
      label: 'AES-256 (CBC)',
      description: 'Advanced Encryption Standard with 256-bit key - Strongest symmetric encryption'
    },
    {
      value: 'AES-256-GCM',
      label: 'AES-256 (GCM)',
      description: 'AES with Galois/Counter Mode - Provides authentication and encryption'
    },
    {
      value: 'AES-256-CTR',
      label: 'AES-256 (CTR)',
      description: 'AES with Counter Mode - Good for parallel processing'
    },
    {
      value: 'CHACHA20-POLY1305',
      label: 'ChaCha20-Poly1305',
      description: 'Modern stream cipher with authentication - Excellent for high-speed encryption'
    },
    {
      value: 'CAMELLIA-256-CBC',
      label: 'Camellia-256 (CBC)',
      description: 'Strong block cipher - Alternative to AES'
    },
    {
      value: '3DES',
      label: 'Triple DES',
      description: 'Legacy encryption - Compatible with older systems'
    },
    {
      value: 'BLOWFISH',
      label: 'Blowfish',
      description: 'Fast block cipher - Good for smaller files'
    },
    {
      value: 'RSA-OAEP',
      label: 'RSA (OAEP)',
      description: 'Public key encryption - Best for small, highly sensitive data'
    }
  ];

  const getMethodWarning = (method) => {
    switch(method) {
      case '3DES':
        return 'Warning: 3DES is considered legacy encryption. Use only for compatibility.';
      case 'BLOWFISH':
        return 'Note: Blowfish is best suited for smaller files.';
      case 'RSA-OAEP':
        return 'Warning: RSA encryption is limited to small files only.';
      default:
        return '';
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !password) {
        setError('Please select a file and enter a password');
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('method', encryptionMethod);

    try {
        const endpoint = `${API_BASE_URL}/${isEncrypting ? 'encrypt' : 'decrypt'}`;
        const response = await axios.post(endpoint, formData, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const fileName = isEncrypting 
            ? `${file.name}.${encryptionMethod.toLowerCase()}`
            : file.name.replace(new RegExp(`\\.${encryptionMethod.toLowerCase()}$`), '');
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Clear form after successful operation
        setFile(null);
        setPassword('');
        setError('');
        
        // Show success message
        alert(`File ${isEncrypting ? 'encrypted' : 'decrypted'} successfully!`);
    } catch (err) {
        console.error('Error:', err);
        setError(`Failed to ${isEncrypting ? 'encrypt' : 'decrypt'} file. ${err.response?.data?.detail || 'Please try again.'}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2F3F4D] to-[#B2D0D9] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              File {isEncrypting ? 'Encryption' : 'Decryption'}
            </h1>
            <p className="text-gray-600">
              {isEncrypting 
                ? 'Secure your files with strong encryption'
                : 'Decrypt your previously encrypted files'}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md ${
                  isEncrypting 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700'
                }`}
                onClick={() => setIsEncrypting(true)}
              >
                Encrypt
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  !isEncrypting 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700'
                }`}
                onClick={() => setIsEncrypting(false)}
              >
                Decrypt
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File to {isEncrypting ? 'Encrypt' : 'Decrypt'}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Encryption/Decryption Method Selection - Now shown for both modes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEncrypting ? 'Encryption' : 'Decryption'} Method
                </label>
                <select
                    value={encryptionMethod}
                    onChange={(e) => setEncryptionMethod(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {encryptionMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                            {method.label} - {method.description}
                        </option>
                    ))}
                </select>
                {getMethodWarning(encryptionMethod) && (
                    <p className="mt-2 text-sm text-amber-600">
                        {getMethodWarning(encryptionMethod)}
                    </p>
                )}
                
                {/* Add help text for decryption */}
                {!isEncrypting && (
                    <p className="mt-2 text-sm text-gray-600">
                        Select the same method that was used to encrypt the file
                    </p>
                )}
            </div>

            {/* Password Input with Strength Meter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEncrypting ? 'Encryption' : 'Decryption'} Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isEncrypting && password && (
                  <div className="mt-2">
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${
                          password.length < 8
                            ? 'bg-red-500 w-1/4'
                            : password.length < 12
                            ? 'bg-yellow-500 w-2/4'
                            : password.length < 16
                            ? 'bg-blue-500 w-3/4'
                            : 'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password strength: {
                        password.length < 8
                          ? 'Weak'
                          : password.length < 12
                          ? 'Medium'
                          : password.length < 16
                          ? 'Strong'
                          : 'Very Strong'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message with more specific details */}
            {error && (
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                    <p className="font-medium">{error}</p>
                    {!isEncrypting && error.includes('Failed') && (
                        <p className="text-sm mt-2">
                            This might be due to incorrect password or encryption method.
                        </p>
                    )}
                </div>
            )}

            {/* Information Box - Updated for both modes */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-blue-800 font-medium mb-2">
                    {isEncrypting ? 'Encryption' : 'Decryption'} Information
                </h4>
                <ul className="text-sm text-blue-700 list-disc list-inside">
                    {isEncrypting ? (
                        <>
                            <li>Files are encrypted locally in your browser</li>
                            <li>Use a strong password with at least 12 characters</li>
                            <li>Store your password safely - files cannot be recovered without it</li>
                            <li>Selected method: {encryptionMethods.find(m => m.value === encryptionMethod)?.description}</li>
                        </>
                    ) : (
                        <>
                            <li>Make sure to select the same encryption method used to encrypt the file</li>
                            <li>Enter the same password used during encryption</li>
                            <li>The file must be in its original encrypted format</li>
                            <li>Selected method: {encryptionMethods.find(m => m.value === encryptionMethod)?.description}</li>
                        </>
                    )}
                </ul>
            </div>

            {/* Submit and Back Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg text-white font-medium ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading 
                  ? 'Processing...' 
                  : isEncrypting 
                    ? 'Encrypt File' 
                    : 'Decrypt File'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/crypto-services/file')}
                className="px-8 py-3 rounded-lg text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileEncryption; 