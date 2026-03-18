import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/text';

const Base64Encoding = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
    const [variant, setVariant] = useState('standard'); // 'standard' or 'urlsafe'
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
            const endpoint = variant === 'standard' ? 'base64' : 'base64url';
            const response = await axios.post(`${API_BASE_URL}/${endpoint}/${mode}`, {
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
                            Base64 Encoding Tool
                        </h1>
                        <p className="text-gray-600">
                            Encode or decode text using Base64 encoding
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

                    {/* Variant Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base64 Variant
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="standard"
                                    checked={variant === 'standard'}
                                    onChange={(e) => setVariant(e.target.value)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Standard Base64</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="urlsafe"
                                    checked={variant === 'urlsafe'}
                                    onChange={(e) => setVariant(e.target.value)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">URL-safe Base64</span>
                            </label>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {variant === 'standard' 
                                ? 'Standard Base64 uses "+/" characters which may need to be escaped in URLs'
                                : 'URL-safe Base64 uses "-_" instead of "+/" for better URL compatibility'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={mode === 'encode' 
                                    ? 'Enter text to encode...'
                                    : 'Enter Base64 string to decode...'}
                                rows={4}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
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

export default Base64Encoding; 