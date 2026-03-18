import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrackApplication2 = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages
  const handleBuyNowClick = () => {
    navigate('/application-status2');
  }

  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const checkStatus = () => {
    if (!requestId) {
      setError('Please enter your request ID.');
      return;
    }

    // Logique fictive pour déterminer le statut de la demande
    let status = null;

    if (requestId === '12345') {
      status = 'In progress';
    } else if (requestId === '67890') {
      status = 'Approved';
    } else {
      setError('Request ID not found. Please check your ID and try again.');
      return;
    }

    // Rediriger vers la page ApplicationStatus avec les données
    navigate('/application-status2', { state: { requestId, status } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003366] to-[#00cc66] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#004d99] to-[#00b3b3] mb-6">
            Track Your Application
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Enter your application ID to check the status of your request.
          </p>
        </div>

        {/* Formulaire pour entrer l'ID de demande */}
        <div className="mb-6">
          <input
            type="text"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            placeholder="Enter Request ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b3b3] transition duration-300"
          />
        </div>

        {/* Bouton pour vérifier le statut */}
        <div className="flex justify-center mb-6">
          <button
            className="bg-[#00b3b3] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#00cc66] transition duration-300"
            onClick={checkStatus} // Appelle la fonction pour valider et naviguer
          >
            Check Status
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Lien de retour à la page d'accueil */}
        <div className="flex justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#003366] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#004d66] transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication2;



