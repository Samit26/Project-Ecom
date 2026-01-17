import { useState, useEffect } from "react";
import { pageService } from "../../services/apiService";
import "./FAQ.css";

const FAQ = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await pageService.getPageContent("faq");
      if (response.success) {
        setPageContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching FAQ page:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  const defaultFAQs = [
    {
      question: "What types of lighting products do you offer?",
      answer:
        "We offer a wide range of lighting products including LED lights, smart lighting solutions, decorative lights, outdoor lighting, and more. Our collection is designed to meet both residential and commercial lighting needs.",
    },
    {
      question: "Do you provide warranty on your products?",
      answer:
        "Yes, all our products come with a manufacturer's warranty. The warranty period varies by product type, typically ranging from 1 to 5 years. Please check the product details for specific warranty information.",
    },
    {
      question: "What are your shipping charges?",
      answer:
        "We offer free shipping on orders above ₹2000. For orders below ₹2000, a nominal shipping charge of ₹99 applies. Express delivery is available at additional cost.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 5-7 business days. Metro cities typically receive orders within 3-5 business days. Express delivery is available for 1-2 day delivery in select locations.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods including Credit/Debit Cards, Net Banking, UPI, and Cash on Delivery (COD). COD is available for orders below ₹50,000.",
    },
    {
      question: "Can I return or exchange a product?",
      answer:
        "Yes, we have a 7-day return and exchange policy. Products must be unused and in original packaging. Please refer to our Return & Exchange policy for detailed information.",
    },
    {
      question: "Do you provide installation services?",
      answer:
        "Yes, we offer professional installation services for all our products. Installation charges vary based on product type and location. Contact us for more details.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking ID via email and SMS. You can track your order using this ID on our website or the courier partner's website.",
    },
  ];

  const faqs = pageContent?.faqs?.length > 0 ? pageContent.faqs : defaultFAQs;

  return (
    <div className="page faq-page">
      <div className="faq-header">
        <h1>{pageContent?.title || "Frequently Asked Questions"}</h1>
        <p>Find answers to common questions about our products and services</p>
      </div>

      <div className="faq-content">
        {pageContent?.content && (
          <div
            className="faq-description"
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        )}

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <i
                  className={`fas fa-chevron-${
                    activeIndex === index ? "up" : "down"
                  }`}
                ></i>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
