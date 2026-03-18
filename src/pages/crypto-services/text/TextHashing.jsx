import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/text';

const TextHashing = () => {
    const [text, setText] = useState('');
    const [hashMethod, setHashMethod] = useState('SHA256');
    const [hashResult, setHashResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verifyMode, setVerifyMode] = useState(false);
    const [hashToVerify, setHashToVerify] = useState('');
    const navigate = useNavigate();

    const hashMethods = [
        {
            value: 'MD5',
            label: 'MD5',
            description: '128-bit hash (Not recommended for security)',
            security: 'Low'
        },
        {
            value: 'SHA1',
            label: 'SHA-1',
            description: '160-bit hash (Legacy)',
            security: 'Medium-Low'
        },
        {
            value: 'SHA256',
            label: 'SHA-256',
            description: '256-bit hash (Recommended)',
            security: 'High'
        },
        {
            value: 'SHA384',
            label: 'SHA-384',
            description: '384-bit hash',
            security: 'Very High'
        },
        {
            value: 'SHA512',
            label: 'SHA-512',
            description: '512-bit hash (Highest Security)',
            security: 'Very High'
        },
        {
            value: 'RIPEMD160',
            label: 'RIPEMD160',
            description: '160-bit RACE Message Digest',
            security: 'Medium-High'
        },
        {
            value: 'WHIRLPOOL',
            label: 'Whirlpool',
            description: '512-bit cryptographic hash',
            security: 'Very High'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) {
            setError('Please enter text to hash');
            return;
        }

        if (verifyMode && !hashToVerify) {
            setError('Please enter a hash to verify');
            return;
        }

        setLoading(true);
        setError('');
        setHashResult(null);

        try {
            const endpoint = verifyMode ? '/verify-hash' : '/hash';
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
                text: text,
                method: hashMethod,
                ...(verifyMode && { hash_to_verify: hashToVerify })
            });

            if (verifyMode) {
                setHashResult({
                    match: response.data.match,
                    calculatedHash: response.data.calculated_hash,
                    providedHash: hashToVerify
                });
            } else {
                setHashResult({
                    hash: response.data.hash,
                    method: hashMethod
                });
            }
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
                            Text Hashing
                        </h1>
                        <p className="text-gray-600">
                            Generate or verify text hashes using various algorithms
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-200 rounded-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    !verifyMode ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setVerifyMode(false);
                                    setHashResult(null);
                                    setError('');
                                }}
                            >
                                Generate Hash
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    verifyMode ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setVerifyMode(true);
                                    setHashResult(null);
                                    setError('');
                                }}
                            >
                                Verify Hash
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text to Hash
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text..."
                                rows={5}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Hash Method Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hash Method
                            </label>
                            <select
                                value={hashMethod}
                                onChange={(e) => setHashMethod(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {hashMethods.map((method) => (
                                    <option key={method.value} value={method.value}>
                                        {method.label} - {method.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Hash Input for Verification */}
                        {verifyMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hash to Verify
                                </label>
                                <input
                                    type="text"
                                    value={hashToVerify}
                                    onChange={(e) => setHashToVerify(e.target.value)}
                                    placeholder="Enter hash to verify..."
                                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {/* Hash Result */}
                        {hashResult && (
                            <div className={`p-4 rounded-lg ${
                                verifyMode 
                                    ? hashResult.match 
                                        ? 'bg-green-50 border border-green-200' 
                                        : 'bg-red-50 border border-red-200'
                                    : 'bg-blue-50 border border-blue-200'
                            }`}>
                                {verifyMode ? (
                                    <>
                                        <h4 className={`font-medium ${
                                            hashResult.match ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                            {hashResult.match ? 'Hash Verified ✓' : 'Hash Mismatch ✗'}
                                        </h4>
                                        <p className="text-sm mt-2">
                                            <span className="font-medium">Calculated Hash: </span>
                                            {hashResult.calculatedHash}
                                        </p>
                                        <p className="text-sm mt-1">
                                            <span className="font-medium">Provided Hash: </span>
                                            {hashResult.providedHash}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="font-medium text-blue-800">Hash Generated</h4>
                                        <p className="text-sm mt-2">
                                            <span className="font-medium">Method: </span>
                                            {hashResult.method}
                                        </p>
                                        <p className="text-sm mt-1 break-all">
                                            <span className="font-medium">Hash: </span>
                                            {hashResult.hash}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(hashResult.hash);
                                                alert('Hash copied to clipboard!');
                                            }}
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Copy to Clipboard
                                        </button>
                                    </>
                                )}
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
                                    : verifyMode 
                                        ? 'Verify Hash' 
                                        : 'Generate Hash'}
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

export default TextHashing; 