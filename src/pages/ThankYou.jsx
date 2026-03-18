import React from "react";

function ThankYou() {
  return (
    <div className="h-screen bg-gradient-to-r from-blue-200 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md text-center animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-500 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          We appreciate your trust in us. Your certificate has been successfully purchased and is being processed. 
        </p>
        <p className="text-gray-600 mb-6">
          You will receive an email with the details shortly. If you have any questions, feel free to contact us.
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default ThankYou;
