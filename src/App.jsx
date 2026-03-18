// import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import SilverCertificate from "./pages/silver/SilverCertificate";
import GoldCertificate from "./pages/gold/GoldCertificate";
import PlatinumCertificate from "./pages/platinum/PlatinumCertificate";

import Feedback from "./pages/Feedback";
import ThankYou from "./pages/Thankyou";
import WelcomePopup from "./pages/WelcomePopup";

import CustomerForm from "./pages/gold/CustomerForm";
import CustomerForm2 from "./pages/platinum/CustomerForm2";
import CustomerForm3 from "./pages/silver/CustomerForm3";

import SubmissionConfirmation from "./pages/gold/SubmissionConfirmation";
import SubmissionConfirmation2 from "./pages/platinum/SubmissionConfirmation2";
import SubmissionConfirmation3 from "./pages/silver/SubmissionConfirmation3";

import TrackApplication from "./pages/gold/TrackApplication";
import TrackApplication2 from "./pages/platinum/TrackApplication2";
import TrackApplication3 from "./pages/silver/TrackApplication3";

import CheckStatus from "./pages/gold/TrackApplication";

import GoldPayment from "./pages/gold/GoldPayment";
import PlatinumPayment2 from "./pages/platinum/PlatinumPayment2";
import SilverPayment3 from "./pages/silver/SilverPayment3";

import PaymentSuccess from "./pages/gold/PaymentSuccess";
import PaymentSuccess2 from "./pages/platinum/PaymentSuccess2";
import PaymentSuccess3 from "./pages/silver/PaymentSuccess3";

import ApplicationStatus from "./pages/gold/ApplicationStatus";
import ApplicationStatus2 from "./pages/platinum/ApplicationStatus2";
import ApplicationStatus3 from "./pages/silver/ApplicationStatus3";

import CertificatesPage from "./pages/CertificatesPage";
import FileServices from "./pages/crypto-services/file/FileServices";
import FileEncryption from "./pages/crypto-services/file/FileEncryption";
import FileHashing from "./pages/crypto-services/file/FileHashing";
import TextServices from "./pages/crypto-services/text/TextServices";
import TextEncryption from "./pages/crypto-services/text/TextEncryption";
import TextHashing from "./pages/crypto-services/text/TextHashing";
import Base64Encoding from "./pages/crypto-services/text/Base64Encoding";
import MediaServices from "./pages/crypto-services/media/MediaServices";
import DigitalSignature from "./pages/crypto-services/signature/DigitalSignature";
import TimestampService from "./pages/crypto-services/timestamp/Timestamp";
import QRGenerator from "./pages/crypto-services/qr/SecureQR";
import URLEncoding1 from "./pages/crypto-services/text/URLEncoding";

// import CartPage from "./pages/CartController";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/silver-certificate" element={<SilverCertificate />} />
      <Route path="/gold-certificate" element={<GoldCertificate />} />
      <Route path="/platinum-certificate" element={<PlatinumCertificate />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/thank-you" element={<ThankYou/>} />
      <Route path="/welcome-popup" element={<WelcomePopup/>} />
      
      <Route path="/customer-form" element={<CustomerForm/>} />
      <Route path="/customer-form2" element={<CustomerForm2/>} />
      <Route path="/customer-form3" element={<CustomerForm3/>} />
   
      
      <Route path="/submission-confirmation" element={<SubmissionConfirmation/>} />
      <Route path="/submission-confirmation2" element={<SubmissionConfirmation2/>} />
      <Route path="/submission-confirmation3" element={<SubmissionConfirmation3/>} />
    
      
      <Route path="/track-application" element={<TrackApplication/>} />
      <Route path="/track-application2" element={<TrackApplication2/>} />
      <Route path="/track-application3" element={<TrackApplication3/>} />
  
      
      <Route path="/check-status" element={<CheckStatus/>} />
      
      <Route path="/gold-payment" element={<GoldPayment/>} />
      <Route path="/platinum-payment2" element={<PlatinumPayment2/>} />
      <Route path="/silver-payment3" element={<SilverPayment3/>} />
    
      
      <Route path="/payment-success" element={<PaymentSuccess/>} />
      <Route path="/payment-success2" element={<PaymentSuccess2/>} />
      <Route path="/payment-success3" element={<PaymentSuccess3/>} />
     

      <Route path="/application-status" element={<ApplicationStatus/>} />
      <Route path="/application-status2" element={<ApplicationStatus2/>} />
      <Route path="/application-status3" element={<ApplicationStatus3/>} />

      <Route path="/certificates-page" element={<CertificatesPage/>} />
      <Route path="/crypto-services/file" element={<FileServices />} />
      <Route path="/crypto-services/file/encryption" element={<FileEncryption />} />
      <Route path="/crypto-services/file/hashing" element={<FileHashing />} />
      
       
      <Route path="/crypto-services/text" element={<TextServices />} />
      <Route path="/crypto-services/text/encryption" element={<TextEncryption />} />
      <Route path="/crypto-services/text/hashing" element={<TextHashing />} />
      <Route path="/crypto-services/text/base64" element={<Base64Encoding />} />
      <Route path="/crypto-services/text/URLEncoding" element={<URLEncoding1 />} />
      <Route path="/crypto-services/timestamp" element={<TimestampService />} />
      <Route path="/crypto-services/signature" element={<DigitalSignature />} />
      <Route path="/crypto-services/qr" element={<QRGenerator />} />
      <Route path="/crypto-services/media" element={<MediaServices />} />
    </Routes>
  );
}

export default App;
