import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/timestamp';

const Timestamp = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [timestampResult, setTimestampResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verifyMode, setVerifyMode] = useState(false);
    const [timestampToVerify, setTimestampToVerify] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text && !file) {
            setError('Please enter text or upload a file');
            return;
        }

        setLoading(true);
        setError('');
        setTimestampResult(null);

        const formData = new FormData();
        if (text) formData.append('text', text);
        if (file) formData.append('file', file);
        if (verifyMode) formData.append('timestamp', timestampToVerify);

        try {
            const endpoint = verifyMode ? '/verify' : '/create';
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setTimestampResult(response.data);
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
                            Digital Timestamp Service
                        </h1>
                        <p className="text-gray-600">
                            {verifyMode 
                                ? 'Verify the timestamp and integrity of your data'
                                : 'Create tamper-proof timestamps for your data'}
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
                                    setTimestampResult(null);
                                    setError('');
                                }}
                            >
                                Create Timestamp
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    verifyMode ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setVerifyMode(true);
                                    setTimestampResult(null);
                                    setError('');
                                }}
                            >
                                Verify Timestamp
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text (Optional)
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text to timestamp..."
                                rows={4}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                File (Optional)
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Timestamp Input for Verification */}
                        {verifyMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timestamp to Verify
                                </label>
                                <textarea
                                    value={timestampToVerify}
                                    onChange={(e) => setTimestampToVerify(e.target.value)}
                                    placeholder="Paste the timestamp token here..."
                                    rows={3}
                                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {/* Result Display */}
                        {timestampResult && (
                            <div className={`p-4 rounded-lg ${
                                verifyMode 
                                    ? timestampResult.valid 
                                        ? 'bg-green-50 border border-green-200' 
                                        : 'bg-red-50 border border-red-200'
                                    : 'bg-blue-50 border border-blue-200'
                            }`}>
                                {verifyMode ? (
                                    <>
                                        <h4 className={`font-medium ${
                                            timestampResult.valid ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                            {timestampResult.valid 
                                                ? 'Timestamp Verified ✓' 
                                                : 'Timestamp Invalid ✗'}
                                        </h4>
                                        <div className="mt-2 space-y-2 text-sm">
                                            <p><span className="font-medium">Timestamp: </span>
                                                {new Date(timestampResult.timestamp).toLocaleString()}
                                            </p>
                                            <p><span className="font-medium">Hash: </span>
                                                {timestampResult.hash}
                                            </p>
                                            {timestampResult.valid && (
                                                <p className="text-green-700">
                                                    Data integrity verified. Content has not been modified.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="font-medium text-blue-800">
                                            Timestamp Created Successfully
                                        </h4>
                                        <div className="mt-2 space-y-2 text-sm">
                                            <p><span className="font-medium">Timestamp: </span>
                                                {new Date(timestampResult.timestamp).toLocaleString()}
                                            </p>
                                            <p><span className="font-medium">Hash: </span>
                                                {timestampResult.hash}
                                            </p>
                                            <div className="mt-4">
                                                <p className="font-medium mb-2">Timestamp Token:</p>
                                                <textarea
                                                    readOnly
                                                    value={timestampResult.token}
                                                    rows={3}
                                                    className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-mono"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(timestampResult.token);
                                                        alert('Timestamp token copied to clipboard!');
                                                    }}
                                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Copy Token to Clipboard
                                                </button>
                                            </div>
                                        </div>
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
                                        ? 'Verify Timestamp' 
                                        : 'Create Timestamp'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/crypto-services')}
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

export default Timestamp; 