import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ApplicationStatus2 = () => {
  const location = useLocation(); // Permet de récupérer les données passées via `navigate`
  const navigate = useNavigate();
  const { requestId, status } = location.state || {}; // Récupération des données envoyées

  // Si aucun ID ou statut n'est passé, redirige vers la page d'accueil
  if (!requestId || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#003366] to-[#00cc66]">
        <div className="p-8 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-4">No application details were found. Please try again.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-[#00b3b3] text-white rounded-lg shadow-md hover:bg-[#00cc66]"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003366] to-[#00cc66] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Application Status
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Here are the details for your application:
        </p>
        <div className="mb-6">
          <strong>Request ID:</strong> {requestId}
        </div>
        <div className="mb-6">
          <strong>Status:</strong> {status}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-[#00b3b3] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#00cc66] transition duration-300"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ApplicationStatus2;
