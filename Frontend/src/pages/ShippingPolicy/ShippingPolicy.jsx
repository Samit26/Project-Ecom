import { useState, useEffect } from "react";
import { pageService } from "../../services/apiService";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await pageService.getPageContent("shipping");
      if (response.success) {
        setPageContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching shipping policy:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  const defaultContent = `
    <h2>Shipping Information</h2>
    <p>At Ajeet Lights, we strive to deliver your orders as quickly and efficiently as possible.</p>
    
    <h3>Shipping Charges</h3>
    <ul>
      <li>Free shipping on orders above ₹2,000</li>
      <li>₹99 flat shipping charge for orders below ₹2,000</li>
      <li>Express delivery available at additional cost</li>
    </ul>
    
    <h3>Delivery Time</h3>
    <ul>
      <li>Metro Cities: 3-5 business days</li>
      <li>Other Cities: 5-7 business days</li>
      <li>Express Delivery: 1-2 business days (select locations)</li>
    </ul>
    
    <h3>Shipping Partners</h3>
    <p>We partner with leading courier services including Blue Dart, Delhivery, and India Post to ensure safe and timely delivery.</p>
    
    <h3>Order Tracking</h3>
    <p>Once your order is shipped, you will receive a tracking ID via email and SMS. You can track your order status on our website or the courier partner's website.</p>
    
    <h3>Shipping Restrictions</h3>
    <p>Currently, we ship only within India. International shipping is not available at this time.</p>
    
    <h3>Damaged or Lost Packages</h3>
    <p>In case of damaged or lost packages, please contact our customer support within 48 hours of delivery. We will investigate and provide a suitable resolution.</p>
  `;

  return (
    <div className="page policy-page">
      <div className="policy-header">
        <h1>{pageContent?.title || "Shipping Policy"}</h1>
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

export default ShippingPolicy;
