import mongoose from "mongoose";
import dotenv from "dotenv";
import PageContent from "./models/PageContent.js";
import connectDB from "./config/database.js";

dotenv.config();

const pagesData = [
  {
    pageType: "contact",
    title: "Contact Us",
    content:
      "<p>We'd love to hear from you! Get in touch with us for any queries or support.</p>",
    contactInfo: {
      email: "info@ajeetlights.com",
      phone: "+91 98765 43210",
      address:
        "123 Light Street, Electronics Market, New Delhi, India - 110001",
      workingHours: "Monday - Saturday: 10:00 AM - 8:00 PM",
    },
  },
  {
    pageType: "faq",
    title: "Frequently Asked Questions",
    content:
      "<p>Find answers to common questions about our products and services.</p>",
    faqs: [
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
    ],
  },
  {
    pageType: "shipping",
    title: "Shipping Policy",
    content: `
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
    `,
  },
  {
    pageType: "returns",
    title: "Return & Exchange Policy",
    content: `
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
    `,
  },
  {
    pageType: "privacy",
    title: "Privacy Policy",
    content: `
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
    `,
  },
];

const seedPages = async () => {
  try {
    await connectDB();

    // Clear existing pages
    await PageContent.deleteMany({});
    console.log("Existing pages cleared");

    // Insert new pages
    await PageContent.insertMany(pagesData);
    console.log("Pages seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Error seeding pages:", error);
    process.exit(1);
  }
};

seedPages();
