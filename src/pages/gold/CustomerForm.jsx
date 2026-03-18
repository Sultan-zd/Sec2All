import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const GoldCertificateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    domainName: "",
    additionalDomains: "",
    orgName: "",
    businessRegNum: "",
    registeredAddress: "",
    city: "",
    country: "",
    contactName: "",
    jobTitle: "",
    contactEmail: "",
    contactPhone: "",
    csrFile: null,
    subscription: "gold",
  });

  const [errors, setErrors] = useState({});

  const countryCodes = [
    { code: "+33", country: "France" },
    { code: "+1", country: "USA" },
    { code: "+49", country: "Germany" },
    { code: "+44", country: "United Kingdom" },
    { code: "+91", country: "India" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
    { code: "+86", country: "China" },
    { code: "+55", country: "Brazil" },
    { code: "+27", country: "South Africa" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      csrFile: e.target.files[0],
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    // Required fields
    if (!formData.fullName?.trim()) newErrors.fullName = "Full Name is required.";
    if (!formData.organization?.trim()) newErrors.organization = "Organization is required.";
    if (!formData.domainName?.trim()) newErrors.domainName = "Domain Name is required.";
    if (!formData.country?.trim()) newErrors.country = "Country is required.";
    if (!formData.contactName?.trim()) newErrors.contactName = "Person of Contact is required.";
    
    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Contact Email validation
    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = "Professional Email is required.";
    } else if (!emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address.";
    }

    // Phone validation
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone Number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    // Contact Phone validation
    if (!formData.contactPhone?.trim()) {
      newErrors.contactPhone = "Contact Phone is required.";
    } else if (!phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number.";
    }

    // CSR File validation
    if (!formData.csrFile) {
      newErrors.csrFile = "CSR file is required.";
    } else {
      const validExtensions = ['.csr', '.pem'];
      const fileExtension = formData.csrFile.name.toLowerCase().slice(-4);
      if (!validExtensions.includes(fileExtension)) {
        newErrors.csrFile = "Please upload a valid .csr or .pem file.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (validateForm()) {
      setLoading(true);
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/submit",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        localStorage.setItem('certTrackingId', response.data.trackingId);
        navigate("/submission-confirmation", { 
          state: { 
            trackingId: response.data.trackingId,
            message: "Your application has been submitted successfully!" 
          }
        });
      } catch (error) {
        console.error("Error submitting application:", error);
        setSubmitError(
          error.response?.data?.error || 
          "An error occurred while submitting your application. Please try again."
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f9c74f] to-[#f2a900] text-white py-16">
      <div className="max-w-screen-lg mx-auto p-8 bg-white rounded-lg shadow-2xl">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#cc8f00] to-[#9d7b00] text-center mb-12">
          Gold Certificate Application Form
        </h2>

        {submitError && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-6">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`border ${errors.fullName ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.fullName && <p className="absolute text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`border ${errors.email ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.email && <p className="absolute text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`border ${errors.phone ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.phone && <p className="absolute text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization (optional)"
                className="border border-[#f7b500] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full"
              />
            </div>
          </div>

          {/* Certificate Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-6">Certificate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="domainName"
                  value={formData.domainName}
                  onChange={handleChange}
                  placeholder="Domain Name"
                  className={`border ${errors.domainName ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.domainName && <p className="absolute text-red-500 text-sm mt-1">{errors.domainName}</p>}
              </div>
              
              <input
                type="text"
                name="additionalDomains"
                value={formData.additionalDomains}
                onChange={handleChange}
                placeholder="Additional Domains (optional)"
                className="border border-[#f7b500] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full"
              />
            </div>
          </div>

          {/* Organization Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-6">Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                placeholder="Organization Name"
                className="border border-[#f7b500] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full"
              />
              <input
                type="text"
                name="businessRegNum"
                value={formData.businessRegNum}
                onChange={handleChange}
                placeholder="Business Registration Number"
                className="border border-[#f7b500] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full"
              />
              <input
                type="text"
                name="registeredAddress"
                value={formData.registeredAddress}
                onChange={handleChange}
                placeholder="Registered Address"
                className="border border-[#f7b500] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border border-[#f7b500] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full"
              />
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`border ${errors.country ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                >
                  <option value="">Select Country</option>
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={country}>
                      {country} ({code})
                    </option>
                  ))}
                </select>
                {errors.country && <p className="absolute text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Person of Contact"
                  className={`border ${errors.contactName ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.contactName && <p className="absolute text-red-500 text-sm mt-1">{errors.contactName}</p>}
              </div>
              
              <div className="relative">
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Professional Email"
                  className={`border ${errors.contactEmail ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.contactEmail && <p className="absolute text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Contact Phone"
                  className={`border ${errors.contactPhone ? "border-red-500" : "border-[#f7b500]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#f9c74f] text-black w-full`}
                />
                {errors.contactPhone && <p className="absolute text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>
            </div>
          </div>

          {/* CSR File Upload */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#f7b500] mb-6">Upload CSR File</h3>
            <div className="relative">
              <input
                type="file"
                name="csrFile"
                onChange={handleFileChange}
                className="border border-[#f7b500] p-3 rounded-lg shadow-md w-full focus:ring-2 focus:ring-[#f9c74f] text-black"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-[#f7b500] to-[#e5a000] text-black font-semibold 
                text-lg px-8 py-4 rounded-lg shadow-lg hover:scale-105 transform transition duration-300
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ClipLoader size={20} color="#000000" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoldCertificateForm;
