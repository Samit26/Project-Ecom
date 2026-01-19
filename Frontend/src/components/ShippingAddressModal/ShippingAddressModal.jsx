import { useState, useEffect } from "react";
import "./ShippingAddressModal.css";

const ShippingAddressModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialAddress,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialAddress) {
      setFormData(initialAddress);
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Remove hyphens and formatting from phone number before confirming
      const cleanedData = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/[-\s()]/g, ""),
      };
      onConfirm(cleanedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Shipping Address</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="shipping-form">
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? "error" : ""}
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.phoneNumber && (
              <span className="error-msg">{errors.phoneNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Address <span className="required">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "error" : ""}
              placeholder="House No., Building Name, Street, Area"
              rows="3"
            />
            {errors.address && (
              <span className="error-msg">{errors.address}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? "error" : ""}
                placeholder="City"
              />
              {errors.city && <span className="error-msg">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? "error" : ""}
                placeholder="State"
              />
              {errors.state && (
                <span className="error-msg">{errors.state}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="pincode">
                Pincode <span className="required">*</span>
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={errors.pincode ? "error" : ""}
                placeholder="6-digit pincode"
                maxLength="6"
              />
              {errors.pincode && (
                <span className="error-msg">{errors.pincode}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-confirm">
              Confirm & Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddressModal;
