import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrackApplication = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fonction pour vérifier et valider le statut
  const checkStatus = async () => {
    if (!trackingId || !email) {
      setError('Please enter both tracking ID and email.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/track-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingId,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch status');
      }

      // Redirect to status page with the data
      navigate('/application-status', { 
        state: { 
          trackingId,
          email,
          status: data.status,
          statusReason: data.statusReason,
          submissionDate: data.submissionDate,
          lastUpdated: data.lastUpdated,
          certificatePath: data.certificatePath,
          files: data.files
        } 
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9c74f] to-[#f2a900] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#cc7a00] to-[#b36b00] mb-6">
            Track Your Application
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Enter your tracking ID and email to check the status of your request.
          </p>
        </div>

        {/* Form for tracking details */}
        <div className="space-y-4 mb-6">
          <div>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Tracking ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] transition duration-300"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7b500] transition duration-300"
            />
          </div>
        </div>

        {/* Check Status Button */}
        <div className="flex justify-center mb-6">
          <button
            className="bg-[#f7b500] text-black font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#e5a000] transition duration-300 disabled:opacity-50"
            onClick={checkStatus}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Return to Home Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;



