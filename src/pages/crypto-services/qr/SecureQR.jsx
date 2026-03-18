import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/qr';

const SecureQR = () => {
    const [text, setText] = useState('');
    const [encryptionKey, setEncryptionKey] = useState('');
    const [qrSize, setQrSize] = useState(300);
    const [errorCorrection, setErrorCorrection] = useState('M');
    const [qrResult, setQrResult] = useState(null);
    const [mode, setMode] = useState('generate'); // 'generate' or 'decrypt'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [scannedData, setScannedData] = useState('');
    const navigate = useNavigate();

    const errorCorrectionLevels = [
        { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
        { value: 'M', label: 'Medium (15%)', description: 'Balanced choice (Recommended)' },
        { value: 'Q', label: 'Quartile (25%)', description: 'For poor lighting conditions' },
        { value: 'H', label: 'High (30%)', description: 'For damaged or obscured codes' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) {
            setError('Please enter text to encode');
            return;
        }

        if (!encryptionKey) {
            setError('Please enter an encryption key');
            return;
        }

        setLoading(true);
        setError('');
        setQrResult(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/generate`, {
                text: text,
                encryption_key: encryptionKey,
                size: qrSize,
                error_correction: errorCorrection
            });

            setQrResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate QR code');
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async () => {
        if (!scannedData) {
            setError('Please enter encrypted QR data');
            return;
        }

        if (!encryptionKey) {
            setError('Please enter the decryption key');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/decrypt`, {
                encrypted_data: scannedData,
                encryption_key: encryptionKey
            });

            setText(response.data.decrypted_text);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to decrypt data');
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
                            Secure QR Code Generator
                        </h1>
                        <p className="text-gray-600">
                            Generate encrypted QR codes for secure data sharing
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-200 rounded-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'generate' ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('generate');
                                    setError('');
                                }}
                            >
                                Generate QR
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'decrypt' ? 'bg-green-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('decrypt');
                                    setError('');
                                }}
                            >
                                Decrypt QR
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'generate' ? (
                            <>
                                {/* Text Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Text to Encode
                                    </label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter text to encode in QR..."
                                        rows={4}
                                        className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* QR Size Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        QR Code Size: {qrSize}x{qrSize} pixels
                                    </label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="1000"
                                        step="50"
                                        value={qrSize}
                                        onChange={(e) => setQrSize(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                {/* Error Correction Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Error Correction Level
                                    </label>
                                    <select
                                        value={errorCorrection}
                                        onChange={(e) => setErrorCorrection(e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {errorCorrectionLevels.map((level) => (
                                            <option key={level.value} value={level.value}>
                                                {level.label} - {level.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Encrypted QR Data
                                </label>
                                <textarea
                                    value={scannedData}
                                    onChange={(e) => setScannedData(e.target.value)}
                                    placeholder="Paste encrypted QR data here..."
                                    rows={4}
                                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                />
                            </div>
                        )}

                        {/* Encryption Key */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {mode === 'generate' ? 'Encryption' : 'Decryption'} Key
                            </label>
                            <input
                                type="password"
                                value={encryptionKey}
                                onChange={(e) => setEncryptionKey(e.target.value)}
                                placeholder={`Enter ${mode === 'generate' ? 'encryption' : 'decryption'} key...`}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* QR Result */}
                        {qrResult && mode === 'generate' && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={qrResult.qr_image}
                                        alt="Generated QR Code"
                                        className="border-2 border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = qrResult.qr_image;
                                            link.download = 'secure-qr.png';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Download QR Code
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Encrypted Data:</p>
                                    <textarea
                                        readOnly
                                        value={qrResult.encrypted_data}
                                        rows={3}
                                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(qrResult.encrypted_data);
                                            alert('Encrypted data copied to clipboard!');
                                        }}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Copy Encrypted Data
                                    </button>
                                </div>
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
                                type={mode === 'generate' ? 'submit' : 'button'}
                                onClick={mode === 'decrypt' ? handleDecrypt : undefined}
                                disabled={loading}
                                className={`px-8 py-3 rounded-lg text-white font-medium ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : mode === 'generate'
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {loading 
                                    ? 'Processing...' 
                                    : mode === 'generate'
                                        ? 'Generate QR Code'
                                        : 'Decrypt Data'}
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

export default SecureQR; 