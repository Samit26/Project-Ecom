import PageContent from "../models/PageContent.js";
import ContactForm from "../models/ContactForm.js";
import {
  sendContactFormNotification,
  sendContactFormAutoReply,
} from "../utils/emailHelper.js";

// @desc    Get page content by type
// @route   GET /api/pages/:pageType
// @access  Public
export const getPageContent = async (req, res) => {
  try {
    const { pageType } = req.params;
    const pageContent = await PageContent.findOne({ pageType, isActive: true });

    if (!pageContent) {
      return res.status(404).json({
        success: false,
        message: "Page content not found",
      });
    }

    res.json({
      success: true,
      data: pageContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching page content",
      error: error.message,
    });
  }
};

// @desc    Get all pages
// @route   GET /api/pages
// @access  Private/Admin
export const getAllPages = async (req, res) => {
  try {
    const pages = await PageContent.find();

    res.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pages",
      error: error.message,
    });
  }
};

// @desc    Update page content
// @route   PUT /api/pages/:pageType
// @access  Private/Admin
export const updatePageContent = async (req, res) => {
  try {
    const { pageType } = req.params;
    const updateData = req.body;

    let pageContent = await PageContent.findOne({ pageType });

    if (!pageContent) {
      // Create new page if doesn't exist
      pageContent = await PageContent.create({
        pageType,
        ...updateData,
      });
    } else {
      // Update existing page
      pageContent = await PageContent.findOneAndUpdate(
        { pageType },
        updateData,
        { new: true, runValidators: true },
      );
    }

    res.json({
      success: true,
      message: "Page content updated successfully",
      data: pageContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating page content",
      error: error.message,
    });
  }
};

// @desc    Submit contact form
// @route   POST /api/pages/contact/submit
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Remove hyphens and formatting from phone number if provided
    const cleanedPhone = phone ? phone.replace(/[-\s()]/g, "") : "";

    // Save to database
    const contactSubmission = await ContactForm.create({
      name,
      email,
      phone: cleanedPhone,
      subject,
      message,
    });

    console.log("Contact form submitted:", contactSubmission);

    // Send email notification to admin
    const emailResult = await sendContactFormNotification({
      name,
      email,
      phone: cleanedPhone,
      subject,
      message,
    });

    // Send auto-reply to customer
    await sendContactFormAutoReply({
      name,
      email,
      phone: cleanedPhone,
      subject,
      message,
    });

    if (emailResult.success) {
      console.log("Admin notification email sent successfully");
    } else {
      console.error("Failed to send admin notification email");
    }

    res.json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: contactSubmission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting contact form",
      error: error.message,
    });
  }
};

// @desc    Get all contact form submissions
// @route   GET /api/pages/contact/submissions
// @access  Private/Admin
export const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactForm.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contact submissions",
      error: error.message,
    });
  }
};

// @desc    Update contact submission status
// @route   PUT /api/pages/contact/submissions/:id
// @access  Private/Admin
export const updateContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await ContactForm.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      message: "Submission status updated",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating submission",
      error: error.message,
    });
  }
};
