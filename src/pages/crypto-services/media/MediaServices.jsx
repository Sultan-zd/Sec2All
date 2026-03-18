import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/crypto/media';

const MediaServices = () => {
    const [file, setFile] = useState(null);
    const [operation, setOperation] = useState('watermark');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    // Watermark settings
    const [watermarkText, setWatermarkText] = useState('');
    const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');
    const [watermarkOpacity, setWatermarkOpacity] = useState(50);

    // Metadata settings
    const [metadataAction, setMetadataAction] = useState('view');
    const [customMetadata, setCustomMetadata] = useState('');

    // Compression settings
    const [compressionQuality, setCompressionQuality] = useState(80);
    const [maintainMetadata, setMaintainMetadata] = useState(true);

    // Conversion settings
    const [targetFormat, setTargetFormat] = useState('jpeg');

    const operations = [
        {
            id: 'watermark',
            label: 'Add Watermark',
            description: 'Add text or image watermark to your media'
        },
        {
            id: 'metadata',
            label: 'Metadata Management',
            description: 'View, add, or remove metadata from media files'
        },
        {
            id: 'compress',
            label: 'Compress Media',
            description: 'Reduce file size while maintaining quality'
        },
        {
            id: 'convert',
            label: 'Convert Format',
            description: 'Convert media files between different formats'
        }
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setError('');
            setResult(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        switch (operation) {
            case 'watermark':
                if (!watermarkText) {
                    setError('Please enter watermark text');
                    setLoading(false);
                    return;
                }
                formData.append('text', watermarkText);
                formData.append('position', watermarkPosition);
                formData.append('opacity', watermarkOpacity);
                break;

            case 'metadata':
                formData.append('action', metadataAction);
                if (metadataAction === 'add' && !customMetadata) {
                    setError('Please enter metadata');
                    setLoading(false);
                    return;
                }
                formData.append('metadata', customMetadata);
                break;

            case 'compress':
                formData.append('quality', compressionQuality);
                formData.append('maintain_metadata', maintainMetadata);
                break;

            case 'convert':
                formData.append('target_format', targetFormat);
                break;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/${operation}`,
                formData,
                {
                    responseType: operation === 'metadata' ? 'json' : 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (operation === 'metadata') {
                setResult({
                    type: 'metadata',
                    data: response.data
                });
            } else {
                const url = URL.createObjectURL(response.data);
                setResult({
                    type: 'file',
                    url: url,
                    filename: `processed_${file.name}`
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
                            Media Services
                        </h1>
                        <p className="text-gray-600">
                            Process and transform your media files securely
                        </p>
                    </div>

                    {/* Operation Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {operations.map((op) => (
                            <button
                                key={op.id}
                                onClick={() => {
                                    setOperation(op.id);
                                    setResult(null);
                                    setError('');
                                }}
                                className={`p-4 rounded-lg border-2 text-left ${
                                    operation === op.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <h3 className="font-medium text-gray-800">{op.label}</h3>
                                <p className="text-sm text-gray-600 mt-1">{op.description}</p>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Media File
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept={operation === 'convert' ? '*/*' : 'image/*,video/*'}
                                className="w-full border-2 border-gray-300 rounded-lg p-4"
                            />
                        </div>

                        {/* Operation-specific Settings */}
                        {operation === 'watermark' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Watermark Text
                                    </label>
                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        placeholder="Enter watermark text..."
                                        className="w-full border-2 border-gray-300 rounded-lg p-4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Position
                                    </label>
                                    <select
                                        value={watermarkPosition}
                                        onChange={(e) => setWatermarkPosition(e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-lg p-4"
                                    >
                                        <option value="top-left">Top Left</option>
                                        <option value="top-right">Top Right</option>
                                        <option value="bottom-left">Bottom Left</option>
                                        <option value="bottom-right">Bottom Right</option>
                                        <option value="center">Center</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Opacity: {watermarkOpacity}%
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={watermarkOpacity}
                                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {operation === 'metadata' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Action
                                    </label>
                                    <select
                                        value={metadataAction}
                                        onChange={(e) => setMetadataAction(e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-lg p-4"
                                    >
                                        <option value="view">View Metadata</option>
                                        <option value="add">Add/Update Metadata</option>
                                        <option value="remove">Remove All Metadata</option>
                                    </select>
                                </div>
                                {metadataAction === 'add' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Custom Metadata (JSON)
                                        </label>
                                        <textarea
                                            value={customMetadata}
                                            onChange={(e) => setCustomMetadata(e.target.value)}
                                            placeholder='{"title": "My Image", "author": "John Doe"}'
                                            rows={4}
                                            className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {operation === 'compress' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quality: {compressionQuality}%
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={compressionQuality}
                                        onChange={(e) => setCompressionQuality(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={maintainMetadata}
                                            onChange={(e) => setMaintainMetadata(e.target.checked)}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Maintain metadata
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {operation === 'convert' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Format
                                </label>
                                <select
                                    value={targetFormat}
                                    onChange={(e) => setTargetFormat(e.target.value)}
                                    className="w-full border-2 border-gray-300 rounded-lg p-4"
                                >
                                    <option value="jpeg">JPEG</option>
                                    <option value="png">PNG</option>
                                    <option value="webp">WebP</option>
                                    <option value="gif">GIF</option>
                                    <option value="mp4">MP4</option>
                                    <option value="webm">WebM</option>
                                </select>
                            </div>
                        )}

                        {/* Result Display */}
                        {result && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {result.type === 'metadata' ? (
                                    <>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            File Metadata:
                                        </h4>
                                        <pre className="bg-white p-4 rounded border border-gray-300 overflow-auto text-sm">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Processed File:
                                        </h4>
                                        {result.url.startsWith('data:image') ? (
                                            <img
                                                src={result.url}
                                                alt="Processed"
                                                className="max-w-full h-auto rounded border border-gray-300"
                                            />
                                        ) : (
                                            <video
                                                src={result.url}
                                                controls
                                                className="max-w-full rounded border border-gray-300"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <a
                                            href={result.url}
                                            download={result.filename}
                                            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Download File
                                        </a>
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
                                {loading ? 'Processing...' : 'Process File'}
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

export default MediaServices; 