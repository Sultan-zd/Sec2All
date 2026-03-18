import React, { useState, useEffect } from 'react';

const CheckStatus = ({ match }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);

  // Simuler la récupération des données avec un ID fictif
  useEffect(() => {
    // Logic for fetching the status based on the request ID (mocked for now)
    const requestId = match.params.id;

    // Simulation de données basées sur l'ID
    const data = {
      '12345': {
        status: 'In Progress',
        details: 'We are reviewing your CSR and domain ownership.',
      },
      '67890': {
        status: 'Approved',
        details: 'Your certificate has been issued and is ready for download.',
      },
    };

    if (data[requestId]) {
      setStatus(data[requestId].status);
      setDetails(data[requestId].details);
    } else {
      setError('Request ID not found.');
    }
  }, [match.params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9c74f] to-[#f2a900] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#cc7a00] to-[#b36b00] mb-6">
            Check Your Application Status
          </h1>

          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-200 text-red-800 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Affichage du statut */}
          {status && !error && (
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Your application ID: <strong>{match.params.id}</strong>
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Status:</strong> {status}
              </p>
              <p className="text-gray-600">
                <strong>Details:</strong> {details}
              </p>
            </div>
          )}

          {/* Bouton retour */}
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-800 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;
