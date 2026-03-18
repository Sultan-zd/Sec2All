import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/text';

const URLEncoding = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) {
            setError('Please enter text');
            return;
        }

        setLoading(true);
        setError('');
        setResult('');

        try {
            const response = await axios.post(`${API_BASE_URL}/url/${mode}`, {
                text: text
            });
            setResult(response.data.result);
        } catch (err) {
            setError(err.response?.data?.detail || 'Operation failed');
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
                            URL Encoding Tool
                        </h1>
                        <p className="text-gray-600">
                            Encode or decode text for safe URL transmission
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-200 rounded-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'encode' ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('encode');
                                    setResult('');
                                    setError('');
                                }}
                            >
                                Encode
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'decode' ? 'bg-green-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('decode');
                                    setResult('');
                                    setError('');
                                }}
                            >
                                Decode
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {mode === 'encode' ? 'Text to Encode' : 'Text to Decode'}
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={`Enter text to ${mode}...`}
                                rows={4}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
                                        : mode === 'encode'
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {loading 
                                    ? 'Processing...' 
                                    : mode === 'encode'
                                        ? 'Encode Text'
                                        : 'Decode Text'}
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

export default URLEncoding; 