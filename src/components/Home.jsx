import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Slider from "react-slick"; // Ensure you install react-slick and slick-carousel
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import heroBg from "../assets/securite.webp.jpg";
// import heroZd from "../assets/sercurite2.avif";
import Header from "./Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Home = () => {
  const navigate = useNavigate();
  

  //  const sliderSettings = {
  //    infinite: true,
  //    speed: 500,
  //    slidesToShow: 4,
  //    slidesToScroll: 1,
  //    responsive: [
  //      { breakpoint: 1024, settings: { slidesToShow: 3 } },
  //      { breakpoint: 768, settings: { slidesToShow: 2 } },
  //      { breakpoint: 480, settings: { slidesToShow: 1 } },
  //    ],
  //    prevArrow: (
  //      <button className="slick-prev absolute left-0 top-1/2 transform -translate-y-1/2 text-6xl text-white bg-blue-900 p-8 rounded-full shadow-xl hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out">
  //        &lt;
  //      </button>
  //    ),
  //    nextArrow: (
  //      <button className="slick-next absolute right-0 top-1/2 transform -translate-y-1/2 text-6xl text-white bg-blue-900 p-8 rounded-full shadow-xl hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out">
  //        &gt;
  //      </button>
  //    ),
  //  };

  return (
    <div>
      <Header />

      {/* Smooth Scrolling */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
      `}</style>

      {/* Hero Section */}
      <section id="home" className="relative bg-cover bg-center h-screen border-[rgba(178, 208, 217, 0.5)] mb-0" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full">
          <h2 className="text-sm uppercase text-red-400 tracking-widest mb-4 animate_animated animate_fadeIn">Up To 60% Off Now</h2>
          <h1 className="text-5xl font-extrabold mb-6 animate_animated animatefadeIn animate_delay-1s">
          Shield your data now <br></br><span className="text-red-400">40%</span> OFF!
          </h1>
          <p className="text-lg mb-8 animate_animated animatefadeIn animate_delay-2s">Final Clearance: Take 20% off Sale Must-Haves</p>
          <div>
            <button
              className="bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 text-white px-4 py-2 mr-5 rounded transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-teal-400 after:transition-all after:duration-300 after:mx-auto focus:after:w-full"
              onClick={() => {
                navigate("/certificates-page");
              }}
            >
              Explore Our Certificates →
            </button>
            <button
              className="bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-teal-400 after:transition-all after:duration-300 after:mx-auto focus:after:w-full"
              onClick={() => {
                navigate("/certificates-page");
              }}
            >
              Explore Our Services →
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="h-screen bg-gradient-to-b from-[#2F3F4D] to-[#B2D0D9] flex items-center justify-center animate_animated animatefadeIn animate_delay-4s mt-0">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We <span className="text-red-400">Are</span></h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Security To All is the Number 1 certificate authority in Africa and the trusly cybersecurity partner to many international enterprises all around the world.<br></br> At S2AL we provide you with a variety of offers, from one time use certificates to 3 different monthly subscriptions, each giving you access to unique offers that far exceeds the price tag.
          </p>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="products" className="h-screen bg-gradient-to-b from-[#B2D0D9] to-white flex items-center justify-center animate_animated animatefadeIn animate_delay-4s">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-12">Our Certificates</h2>
          <p className="text-lg text-gray-600 mb-10">
          Explore a curated selection of premium security certificates designed to safeguard your digital assets.
          </p>



          {/* Grid of certificates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
      
            {/* Silver Certificate */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Silver Certificate</h3>
              <p className="text-gray-600 mb-6">
                A reliable and affordable certificate for basic digital protection.
              </p>
              <button className="bg-gray-100 border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 hover:border-gray-400"
              onClick={() => {
              navigate("/silver-certificate");
            }}>
                  
                Learn More
              </button>
            </div>

            {/* Gold Certificate */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Gold Certificate</h3>
              <p className="text-gray-600 mb-6">
                Premium security with advanced encryption for businesses and professionals.
              </p>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded-md hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-700"
              onClick={() => {
                navigate("/gold-certificate");  // Navigue vers la page GoldCertificate
              }}>
                Learn More
              </button>
            </div>

            {/* Platinum Certificate */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Platinum Certificate</h3>
              <p className="text-gray-600 mb-6">
                The ultimate protection with top-tier encryption and exclusive features.
              </p>
              <button className="bg-gradient-to-r from-[#0d1b2a] to-[#1b4332] text-white px-6 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#0d1b2a] to-[#1b4332]"
              onClick={() => {
                navigate("/platinum-certificate");  // Navigue vers la page PlatinumCertificate
              }}>
                Learn More
              </button>
            </div>

          </div>

      
         
          
            {/* <Slider {...sliderSettings}>
              {products.map((product, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded-lg" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{product.name}</h3>
                  <p className="text-gray-500 mb-4">{product.description}</p>
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition duration-300" 
                  onClick={()=>{navigate("/products")}}
                  >
                    View Product
                  </button>
                </div>
              ))}
            </Slider> */}
          
        </div>
      </section>

      {/* New Cryptographic Services Section */}
      <section id="crypto-services" className="h-screen bg-gradient-to-b from-white to-[#2F3F4D] flex items-center justify-center animate_animated animatefadeIn animate_delay-4s">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            Cryptographic <span className="text-red-400">Services</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Secure your data with our comprehensive suite of cryptographic tools. 
            From file encryption to digital signatures, we provide enterprise-grade security solutions.
          </p>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {/* File Services Card */}
            <div 
              onClick={() => navigate('/crypto-services/file')}
              className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl text-red-400 mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">File Services</h3>
              <p className="text-gray-600 mb-4">
                Encrypt, decrypt, and hash your files with military-grade security.
              </p>
            </div>

            {/* Text Services Card */}
            <div 
              onClick={() => navigate('/crypto-services/text')}
              className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl text-red-400 mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Text Services</h3>
              <p className="text-gray-600 mb-4">
                Secure your messages with advanced encryption algorithms.
              </p>
            </div>

            {/* Media Services Card */}
            <div onClick={() => navigate("/crypto-services/media")} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl text-red-400 mb-4">🎬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Media Services</h3>
              <p className="text-gray-600 mb-4">
                Protect your images and audio files with secure encryption.
              </p>
            </div>

            {/* Digital Signatures Card */}
            <div onClick={() => navigate("/crypto-services/signature")}
                className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl text-red-400 mb-4">✍️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Digital Signatures</h3>
              <p className="text-gray-600 mb-4">
                Sign and verify documents with cryptographic signatures.
              </p>
            </div>

            {/* Timestamp Services Card */}
            <div onClick={() => navigate('/crypto-services/timestamp')}
                 className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl text-red-400 mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Timestamp Services</h3>
              <p className="text-gray-600 mb-4">
                Add trusted timestamps to your documents.
              </p>
            </div>

            {/* QR Services Card */}
            <div onClick={() => navigate("/crypto-services/qr")}
            className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl text-red-400 mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">QR Services</h3>
              <p className="text-gray-600 mb-4">
                Generate secure QR codes for your data.
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="mt-12">
            <button 
              onClick={() => navigate('/crypto-services')}
              className="bg-red-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-500 transition-all duration-300"
            >
              Explore Services →
            </button>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="h-screen bg-gradient-to-b from-[#2F3F4D] to-[#B2D0D9] flex items-center justify-center animate_animated animatefadeIn animate_delay-4s">
        <div className="text-center max-w-lg px-6">
          <h2 className="text-4xl font-bold mb-6">We Value Your <span className="text-red-400">Feedback</span></h2>
          <p className="text-lg leading-relaxed mb-8">
            Your thoughts and suggestions are important to us. Let us know how we can improve your experience. Were here to listen and make things better.
          </p>
          <button
            className="bg-red-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-300 transition"
            onClick={() => navigate("/feedback")}
          >
            Share Feedback →
          </button>
        </div>
      </section>

      {/* Footer with Smooth Animations */}
      



      <footer id="contact" className="bg-gradient-to-b from-[#B2D0D9] to-[#003D56] flex items-center justify-center animate_animated animatefadeIn animate_delay-4s pb-12">
  <div className="max-w-screen-xl mx-auto px-6 ">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-36">
      <div >
        <h3 className="font-semibold text-lg mb-6">ABOUT US</h3>
        <ul className="space-y-3">
          <li>
            <a href="#" className="hover:text-gray-400">
              Our Story
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Affiliate Program
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Wholesale Program
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Press Inquiries
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Careers
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-6">CUSTOMER SUPPORT</h3>
        <ul className="space-y-3">
          <li>
            <a href="#" className="hover:text-gray-400">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Activation Process
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Track Your Order
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Certificate Validation
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-6">CONNECT WITH US</h3>
        <div className="flex space-x-6 mb-6">
          <FontAwesomeIcon icon={faFacebookF} className="text-2xl" />
          <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
          <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
          <FontAwesomeIcon icon={faLinkedinIn} className="text-2xl" />
        </div>
        <p className="text-sm text-gray-400 mt-10">
          &copy; 2024 S2Al All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>






    </div>
  );
};

export default Home;