import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const contactInfoSchema = new mongoose.Schema({
  email: String,
  phone: String,
  address: String,
  workingHours: String,
});

const pageContentSchema = new mongoose.Schema(
  {
    pageType: {
      type: String,
      required: true,
      unique: true,
      enum: ["contact", "faq", "shipping", "returns", "privacy"],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    // For FAQ page
    faqs: [faqItemSchema],
    // For Contact page
    contactInfo: contactInfoSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PageContent = mongoose.model("PageContent", pageContentSchema);

export default PageContent;
