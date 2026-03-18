import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/text';

const TextEncryption = () => {
    const [text, setText] = useState('');
    const [password, setPassword] = useState('');
    const [encryptionMethod, setEncryptionMethod] = useState('AES-256-CBC');
    const [isEncrypting, setIsEncrypting] = useState(true);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const encryptionMethods = [
        {
            value: 'AES-256-CBC',
            label: 'AES-256 (CBC)',
            description: 'Advanced Encryption Standard with 256-bit key',
            details: {
                strength: 'Very High',
                speed: 'Fast',
                recommended: true
            }
        },
        {
            value: 'AES-256-GCM',
            label: 'AES-256 (GCM)',
            description: 'AES with Galois/Counter Mode - Authenticated Encryption',
            details: {
                strength: 'Very High',
                speed: 'Very Fast',
                recommended: true
            }
        },
        {
            value: 'CHACHA20-POLY1305',
            label: 'ChaCha20-Poly1305',
            description: 'Modern stream cipher with authentication',
            details: {
                strength: 'Very High',
                speed: 'Extremely Fast',
                recommended: true
            }
        },
        {
            value: 'CAMELLIA-256-CBC',
            label: 'Camellia-256 (CBC)',
            description: 'Strong block cipher - Alternative to AES',
            details: {
                strength: 'Very High',
                speed: 'Fast',
                recommended: true
            }
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !password) {
            setError('Please enter both text and password');
            return;
        }

        setLoading(true);
        setError('');
        setResult('');

        try {
            const response = await axios.post(`${API_BASE_URL}/${isEncrypting ? 'encrypt' : 'decrypt'}`, {
                text: text,
                password: password,
                method: encryptionMethod
            });

            setResult(response.data.result);
        } catch (err) {
            setError(err.response?.data?.detail || 'Operation failed');
            console.error('Error:', err);
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
                            Text {isEncrypting ? 'Encryption' : 'Decryption'}
                        </h1>
                        <p className="text-gray-600">
                            {isEncrypting 
                                ? 'Encrypt your sensitive text using strong cryptographic algorithms' 
                                : 'Decrypt your encrypted text using the correct password and method'}
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-200 rounded-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    isEncrypting ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setIsEncrypting(true);
                                    setResult('');
                                    setError('');
                                }}
                            >
                                Encrypt
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    !isEncrypting ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setIsEncrypting(false);
                                    setResult('');
                                    setError('');
                                }}
                            >
                                Decrypt
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isEncrypting ? 'Text to Encrypt' : 'Text to Decrypt'}
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={isEncrypting 
                                    ? 'Enter text to encrypt...' 
                                    : 'Enter encrypted text...'}
                                rows={5}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Encryption Method */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Encryption Method
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
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
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

                        {/* Result */}
                        {result && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-700 mb-2">Result:</h4>
                                <div className="bg-white p-4 rounded border border-gray-300">
                                    <p className="text-gray-800 break-all font-mono">{result}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(result);
                                        alert('Copied to clipboard!');
                                    }}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Copy to Clipboard
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
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
                                        ? 'Encrypt Text' 
                                        : 'Decrypt Text'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/crypto-services/text')}
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

export default TextEncryption; 