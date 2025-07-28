import mongoose, { Schema, models, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string; // Make password optional for OAuth users
  bio?: string;
  phone?: string;
  avatar?: string; // Add avatar field
  provider?: string; // Add provider field for OAuth
  providerId?: string; // Add provider ID field
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: { 
      type: String, 
      required: false, // We'll handle validation in the application logic
      minlength: [6, 'Password must be at least 6 characters']
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    avatar: {
      type: String,
      trim: true
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local'
    },
    providerId: {
      type: String,
      trim: true
    }
  },
  { 
    timestamps: true 
  }
);

// Add index for email for faster lookups
userSchema.index({ email: 1 });

const User = models.User || mongoose.model<IUser>("User", userSchema);
export default User;