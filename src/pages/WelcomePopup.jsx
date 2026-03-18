import React, { useState, useEffect } from 'react';

const WelcomePopup = () => {
  const [isPopupVisible, setPopupVisible] = useState(true); // Par défaut, afficher le pop-up
  const [promoCode, setPromoCode] = useState("WELCOME20"); // Code promo initial

  // Fonction pour générer un nouveau code promo aléatoire
  const generatePromoCode = () => {
    const codes = ["WELCOME20", "WELCOME10", "FIRSTBUY15", "THANKYOU25"];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    setPromoCode(randomCode);
  };

  const closePopup = () => {
    setPopupVisible(false); // Cacher le pop-up lorsqu'on clique sur "Close"
  };

  // Utilisation de useEffect pour générer un nouveau code promo à chaque réouverture
  useEffect(() => {
    if (isPopupVisible) {
      generatePromoCode(); // Générer un nouveau code promo chaque fois que le pop-up est affiché
    }
  }, [isPopupVisible]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#a1c4fd]">
      <div className="relative">
        {isPopupVisible && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] p-8 rounded-lg shadow-xl w-80 text-center animate__animated animate__fadeIn animate__delay-1s">
              {/* Message de félicitations */}
              <h2 className="text-3xl font-extrabold text-white mb-4">🎉 Congratulations! 🎉</h2>
              <p className="text-lg text-gray-900 mb-4">
                You've made your first subscription! <br />
                Thank you for trusting us with your security. You're now part of our trusted community!
              </p>

              {/* Offre de réduction - Gift */}
              <div className="bg-[#f0a500] p-4 rounded-lg text-white my-6">
                <h3 className="text-xl font-bold mb-2"> Special Gift for You! 🎁</h3>
                <p className="text-lg">
                  As a thank you for your first subscription, enjoy a <strong>20% OFF</strong> on your next purchase!
                </p>
                <p className="text-md font-semibold mt-2">Use Code: <span className="text-[#ff5c8d]">{promoCode}</span></p>
              </div>
              
              {/* Bouton de fermeture */}
              <button
                onClick={closePopup}
                className="bg-[#6c63ff] text-white font-semibold text-lg px-6 py-3 rounded-lg hover:bg-[#3f3cbb] transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="p-8 bg-white rounded-lg shadow-lg w-full sm:w-96 mx-auto mt-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#333333] to-[#1a1a1a] mb-4">
            Checkout Page
          </h1>
          <p className="mt-4 text-lg text-center">You're on the checkout page. Your certificate is almost ready!</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;
