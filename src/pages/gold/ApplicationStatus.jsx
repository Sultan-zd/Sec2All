import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ApplicationStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    trackingId, 
    status, 
    statusReason, 
    submissionDate, 
    lastUpdated,
    certificatePath,
    files 
  } = location.state || {};

  const downloadFile = async (fileType) => {
    try {
      const response = await fetch(`http://localhost:5000/download-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingId,
          fileType,
          filePath: files[fileType]
        })
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${trackingId}.${fileType}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9c74f] to-[#f2a900] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Application Status</h1>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">Tracking ID:</p>
            <p className="text-gray-700">{trackingId}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">Status:</p>
            <p className={`font-bold ${
              status === 'completed' ? 'text-green-600' : 
              status === 'failed' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {status?.toUpperCase()}
            </p>
          </div>

          {statusReason && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Status Details:</p>
              <p className="text-gray-700">{statusReason}</p>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">Submission Date:</p>
            <p className="text-gray-700">{submissionDate}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">Last Updated:</p>
            <p className="text-gray-700">{lastUpdated}</p>
          </div>
        </div>

        {status === 'completed' && files && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">Download Certificates</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => downloadFile('crt')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Download CRT
              </button>
              <button
                onClick={() => downloadFile('pem')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Download PEM
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
