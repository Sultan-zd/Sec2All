import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/signature';

const DigitalSignature = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [privateKey, setPrivateKey] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [signature, setSignature] = useState('');
    const [mode, setMode] = useState('sign'); // 'sign', 'verify', 'generate'
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGenerateKeys = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_BASE_URL}/generate-keys`);
            setPrivateKey(response.data.private_key);
            setPublicKey(response.data.public_key);
            setResult({
                type: 'keys',
                publicKey: response.data.public_key,
                privateKey: response.data.private_key
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate keys');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text && !file) {
            setError('Please enter text or upload a file');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        if (text) formData.append('text', text);
        if (file) formData.append('file', file);

        try {
            if (mode === 'sign') {
                if (!privateKey) {
                    setError('Private key is required for signing');
                    return;
                }
                formData.append('private_key', privateKey);
                const response = await axios.post(`${API_BASE_URL}/sign`, formData);
                setResult({
                    type: 'signature',
                    signature: response.data.signature,
                    hash: response.data.hash
                });
            } else if (mode === 'verify') {
                if (!publicKey || !signature) {
                    setError('Public key and signature are required for verification');
                    return;
                }
                formData.append('public_key', publicKey);
                formData.append('signature', signature);
                const response = await axios.post(`${API_BASE_URL}/verify`, formData);
                setResult({
                    type: 'verification',
                    valid: response.data.valid,
                    hash: response.data.hash
                });
            }
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
                            Digital Signature Service
                        </h1>
                        <p className="text-gray-600">
                            Sign and verify your documents with cryptographic signatures
                        </p>
                    </div>

                    {/* Mode Selection */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-200 rounded-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'generate' ? 'bg-green-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('generate');
                                    setResult(null);
                                    setError('');
                                }}
                            >
                                Generate Keys
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'sign' ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('sign');
                                    setResult(null);
                                    setError('');
                                }}
                            >
                                Sign
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${
                                    mode === 'verify' ? 'bg-purple-600 text-white' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                    setMode('verify');
                                    setResult(null);
                                    setError('');
                                }}
                            >
                                Verify
                            </button>
                        </div>
                    </div>

                    {mode === 'generate' ? (
                        <div className="text-center">
                            <button
                                onClick={handleGenerateKeys}
                                disabled={loading}
                                className={`px-8 py-3 rounded-lg text-white font-medium ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {loading ? 'Generating...' : 'Generate New Key Pair'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Text Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Text (Optional)
                                </label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Enter text..."
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

                            {/* Key Inputs */}
                            {mode === 'sign' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Private Key
                                    </label>
                                    <textarea
                                        value={privateKey}
                                        onChange={(e) => setPrivateKey(e.target.value)}
                                        placeholder="Paste your private key here..."
                                        rows={3}
                                        className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Public Key
                                        </label>
                                        <textarea
                                            value={publicKey}
                                            onChange={(e) => setPublicKey(e.target.value)}
                                            placeholder="Paste the public key here..."
                                            rows={3}
                                            className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Signature
                                        </label>
                                        <textarea
                                            value={signature}
                                            onChange={(e) => setSignature(e.target.value)}
                                            placeholder="Paste the signature here..."
                                            rows={3}
                                            className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Result Display */}
                            {result && (
                                <div className={`p-4 rounded-lg ${
                                    result.type === 'keys' 
                                        ? 'bg-green-50 border border-green-200'
                                        : result.type === 'verification'
                                            ? (result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')
                                            : 'bg-blue-50 border border-blue-200'
                                }`}>
                                    {result.type === 'keys' ? (
                                        <>
                                            <h4 className="font-medium text-green-800 mb-4">
                                                Key Pair Generated Successfully
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="font-medium mb-2">Private Key:</p>
                                                    <textarea
                                                        readOnly
                                                        value={result.privateKey}
                                                        rows={5}
                                                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-mono"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium mb-2">Public Key:</p>
                                                    <textarea
                                                        readOnly
                                                        value={result.publicKey}
                                                        rows={5}
                                                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-mono"
                                                    />
                                                </div>
                                                <p className="text-sm text-red-600 font-medium">
                                                    Important: Save your private key securely. It cannot be recovered if lost!
                                                </p>
                                            </div>
                                        </>
                                    ) : result.type === 'signature' ? (
                                        <>
                                            <h4 className="font-medium text-blue-800">
                                                Signature Generated Successfully
                                            </h4>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-sm">
                                                    <span className="font-medium">Document Hash: </span>
                                                    {result.hash}
                                                </p>
                                                <div>
                                                    <p className="font-medium mb-2">Signature:</p>
                                                    <textarea
                                                        readOnly
                                                        value={result.signature}
                                                        rows={3}
                                                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-mono"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(result.signature);
                                                            alert('Signature copied to clipboard!');
                                                        }}
                                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        Copy Signature
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className={`font-medium ${
                                                result.valid ? 'text-green-800' : 'text-red-800'
                                            }`}>
                                                {result.valid 
                                                    ? 'Signature Valid ✓' 
                                                    : 'Signature Invalid ✗'}
                                            </h4>
                                            <div className="mt-2">
                                                <p className="text-sm">
                                                    <span className="font-medium">Document Hash: </span>
                                                    {result.hash}
                                                </p>
                                                {result.valid && (
                                                    <p className="text-sm text-green-700 mt-2">
                                                        The signature is valid and the document has not been modified.
                                                    </p>
                                                )}
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
                            {mode !== 'generate' && (
                                <div className="flex justify-center space-x-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-8 py-3 rounded-lg text-white font-medium ${
                                            loading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : mode === 'sign'
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'bg-purple-600 hover:bg-purple-700'
                                        }`}
                                    >
                                        {loading 
                                            ? 'Processing...' 
                                            : mode === 'sign'
                                                ? 'Sign Document'
                                                : 'Verify Signature'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/crypto-services')}
                                        className="px-8 py-3 rounded-lg text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
                                    >
                                        Back
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DigitalSignature; 