import { useState, useEffect } from "react";
import { pageService } from "../../services/apiService";
import "./Policy.css";

const PrivacyPolicy = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await pageService.getPageContent("privacy");
      if (response.success) {
        setPageContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  const defaultContent = `
    <h2>Privacy Policy</h2>
    <p>Last updated: January 17, 2026</p>
    <p>At Ajeet Lights, we respect your privacy and are committed to protecting your personal data.</p>
    
    <h3>Information We Collect</h3>
    <ul>
      <li>Personal identification information (Name, email, phone number, address)</li>
      <li>Payment information (processed securely through payment gateways)</li>
      <li>Order history and preferences</li>
      <li>Website usage data and cookies</li>
    </ul>
    
    <h3>How We Use Your Information</h3>
    <ul>
      <li>Process and fulfill your orders</li>
      <li>Communicate about orders, products, and services</li>
      <li>Improve our website and customer service</li>
      <li>Send promotional offers (with your consent)</li>
      <li>Prevent fraudulent transactions</li>
    </ul>
    
    <h3>Data Security</h3>
    <p>We implement appropriate security measures to protect your personal information. All payment transactions are encrypted using SSL technology.</p>
    
    <h3>Information Sharing</h3>
    <p>We do not sell, trade, or rent your personal information to third parties. We may share data with:</p>
    <ul>
      <li>Shipping partners for order delivery</li>
      <li>Payment processors for transaction processing</li>
      <li>Service providers who assist in our operations</li>
      <li>Legal authorities when required by law</li>
    </ul>
    
    <h3>Cookies</h3>
    <p>Our website uses cookies to enhance user experience. You can choose to disable cookies in your browser settings, but this may affect website functionality.</p>
    
    <h3>Your Rights</h3>
    <ul>
      <li>Access your personal data</li>
      <li>Correct inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Opt-out of marketing communications</li>
      <li>Withdraw consent at any time</li>
    </ul>
    
    <h3>Third-Party Links</h3>
    <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>
    
    <h3>Children's Privacy</h3>
    <p>Our services are not directed to individuals under 18. We do not knowingly collect data from children.</p>
    
    <h3>Changes to Privacy Policy</h3>
    <p>We may update this privacy policy periodically. Changes will be posted on this page with an updated revision date.</p>
    
    <h3>Contact Us</h3>
    <p>For any privacy-related questions, contact us at privacy@ajeetlights.com or call +91 98765 43210.</p>
  `;

  return (
    <div className="page policy-page">
      <div className="policy-header">
        <h1>{pageContent?.title || "Privacy Policy"}</h1>
      </div>

      <div className="policy-content">
        <div
          dangerouslySetInnerHTML={{
            __html: pageContent?.content || defaultContent,
          }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
