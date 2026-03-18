import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";  
const CustomerForm2 = () => {
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
    csrFile: null,
    orgName: "",
    businessRegNum: "",
    registeredAddress: "",
    city: "",
    country: "",
    contactName: "",
    jobTitle: "",
    contactEmail: "",
    contactPhone: "",
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
    // Validation des champs obligatoires
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email Address is required.";
    if (!formData.phone) newErrors.phone = "Phone Number is required.";
    if (!formData.domainName) newErrors.domainName = "Domain Name is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.contactName) newErrors.contactName = "Person of Contact is required.";
    if (!formData.contactEmail) newErrors.contactEmail = "Professional Email is required.";
    if (!formData.contactPhone) newErrors.contactPhone = "Contact Phone is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si pas d'erreurs
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/submission-confirmation2");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#004e6f] via-[#006f4b] to-[#00c8c8] text-white py-16">
      <div className="max-w-screen-lg mx-auto p-8 bg-white rounded-lg shadow-2xl">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#004e6f] to-[#00c8c8] text-center mb-12">
          Platinum Certificate Application Form
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#00c8c8] mb-6">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`border ${errors.fullName ? "border-red-500" : "border-[#00c8c8]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
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
                  className={`border ${errors.email ? "border-red-500" : "border-[#00c8c8]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
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
                  className={`border ${errors.phone ? "border-red-500" : "border-[#00c8c8]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
                />
                {errors.phone && <p className="absolute text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization (optional)"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
            </div>
          </div>

          {/* Certificate Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#00bcd4] mb-6">Certificate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="domainName"
                  value={formData.domainName}
                  onChange={handleChange}
                  placeholder="Domain Name"
                  className={`border ${errors.domainName ? "border-red-500" : "border-[#00bcd4]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
                />
                {errors.domainName && <p className="absolute text-red-500 text-sm mt-1">{errors.domainName}</p>}
              </div>
              
              <input
                type="text"
                name="additionalDomains"
                value={formData.additionalDomains}
                onChange={handleChange}
                placeholder="Additional Domains (optional)"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
              
              <div className="md:col-span-2 relative">
                <label className="block text-[#00bcd4] mb-2">Upload CSR File</label>
                <input
                  type="file"
                  name="csrFile"
                  onChange={handleFileChange}
                  className="border border-[#00bcd4] p-3 rounded-lg shadow-md w-full focus:ring-2 focus:ring-[#00bcd4] text-black"
                />
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#00bcd4] mb-6">Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                placeholder="Organization Name"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
              <input
                type="text"
                name="businessRegNum"
                value={formData.businessRegNum}
                onChange={handleChange}
                placeholder="Business Registration Number"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
              <input
                type="text"
                name="registeredAddress"
                value={formData.registeredAddress}
                onChange={handleChange}
                placeholder="Registered Address"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`border ${errors.country ? "border-red-500" : "border-[#00bcd4]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
                >
                  <option value="">Select Country</option>
                  {countryCodes.map((code) => (
                    <option key={code.code} value={code.country}>
                      {code.country}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="absolute text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Contact Person Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#00bcd4] mb-6">Person of Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Person of Contact"
                className={`border ${errors.contactName ? "border-red-500" : "border-[#00bcd4]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
              />
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Job Title (optional)"
                className="border border-[#00bcd4] p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full"
              />
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Professional Email"
                className={`border ${errors.contactEmail ? "border-red-500" : "border-[#00bcd4]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
              />
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Contact Phone"
                className={`border ${errors.contactPhone ? "border-red-500" : "border-[#00bcd4]"} p-3 rounded-lg shadow-md focus:ring-2 focus:ring-[#00bcd4] text-black w-full`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#00bcd4] text-white p-4 rounded-lg shadow-md hover:bg-[#006d77] focus:ring-2 focus:ring-[#00bcd4] w-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm2;
