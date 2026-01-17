import { useState, useEffect } from "react";
import { pageService } from "../../services/apiService";
import "./Contact.css";

const Contact = () => {
  const [pageContent, setPageContent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await pageService.getPageContent("contact");
      if (response.success) {
        setPageContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching contact page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await pageService.submitContactForm(formData);
      if (response.success) {
        setSubmitMessage(
          "Thank you for contacting us! We'll get back to you soon."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      setSubmitMessage("Failed to send message. Please try again.");
      console.error("Error submitting contact form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  const contactInfo = pageContent?.contactInfo || {
    email: "info@ajeetlights.com",
    phone: "+91 98765 43210",
    address: "123 Light Street, Electronics Market, New Delhi, India - 110001",
    workingHours: "Monday - Saturday: 10:00 AM - 8:00 PM",
  };

  return (
    <div className="page contact-page">
      <div className="contact-header">
        <h1>{pageContent?.title || "Contact Us"}</h1>
        <p>We'd love to hear from you. Get in touch with us!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <h2>Get In Touch</h2>
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <i className="fas fa-envelope"></i>
              <h3>Email</h3>
              <p>{contactInfo.email}</p>
            </div>
            <div className="contact-info-card">
              <i className="fas fa-phone"></i>
              <h3>Phone</h3>
              <p>{contactInfo.phone}</p>
            </div>
            <div className="contact-info-card">
              <i className="fas fa-map-marker-alt"></i>
              <h3>Address</h3>
              <p>{contactInfo.address}</p>
            </div>
            <div className="contact-info-card">
              <i className="fas fa-clock"></i>
              <h3>Working Hours</h3>
              <p>{contactInfo.workingHours}</p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          {submitMessage && (
            <div
              className={`submit-message ${
                submitMessage.includes("Thank") ? "success" : "error"
              }`}
            >
              {submitMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
