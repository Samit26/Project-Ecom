import { useState, useEffect } from "react";
import { pageService } from "../../services/apiService";
import "./ReturnExchange.css";

const ReturnExchange = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await pageService.getPageContent("returns");
      if (response.success) {
        setPageContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching return policy:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  const defaultContent = `
    <h2>Return & Exchange Policy</h2>
    <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.</p>
    
    <h3>Return Period</h3>
    <p>You have 7 days from the date of delivery to return an item. Products must be unused, in original packaging, and with all tags and labels intact.</p>
    
    <h3>Eligible Items</h3>
    <ul>
      <li>Unused products in original packaging</li>
      <li>Products with all accessories and manuals</li>
      <li>Products with original purchase invoice</li>
    </ul>
    
    <h3>Non-Returnable Items</h3>
    <ul>
      <li>Used or installed products</li>
      <li>Products without original packaging</li>
      <li>Custom-made or personalized items</li>
      <li>Products damaged due to misuse</li>
    </ul>
    
    <h3>Exchange Process</h3>
    <p>If you wish to exchange an item for a different model or size, please contact our customer support. Exchange is subject to product availability.</p>
    
    <h3>Return Process</h3>
    <ol>
      <li>Contact our customer support with your order details</li>
      <li>Our team will verify the return eligibility</li>
      <li>Pack the product securely in original packaging</li>
      <li>Our courier partner will pick up the product</li>
      <li>Refund will be processed within 7-10 business days</li>
    </ol>
    
    <h3>Refund Method</h3>
    <p>Refunds will be processed to the original payment method. For COD orders, refund will be processed via bank transfer.</p>
    
    <h3>Return Shipping</h3>
    <p>Return shipping is free for defective or damaged products. For other returns, shipping charges may apply.</p>
    
    <h3>Contact Us</h3>
    <p>For any questions about returns or exchanges, please contact our customer support at info@ajeetlights.com or call +91 98765 43210.</p>
  `;

  return (
    <div className="page policy-page">
      <div className="policy-header">
        <h1>{pageContent?.title || "Return & Exchange Policy"}</h1>
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

export default ReturnExchange;
