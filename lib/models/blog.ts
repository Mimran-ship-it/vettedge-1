import mongoose, { Schema, Document, Model } from "mongoose";

export interface Blog extends Document {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name?: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: Date;
  category: string;
  tags: string[];
  readTime: string; // e.g., "4 min read"
  featured: boolean;
  image: string;
  readingTime: number; // numeric value in minutes
  slug: string;
  updatedAt: Date;
}

const BlogSchema = new Schema<Blog>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      name: { type: String },
      avatar: { type: String },
      bio: { type: String },
    },
    publishedAt: { type: Date, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    readTime: { type: String },
    featured: { type: Boolean, default: false },
    image: { type: String, required: true },
    readingTime: { type: Number },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const BlogModel: Model<Blog> =
  mongoose.models.Blog || mongoose.model<Blog>("Blog", BlogSchema);

export default BlogModel;
