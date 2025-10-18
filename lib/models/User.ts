import mongoose, { Schema, Document, model, models } from "mongoose"
import bcrypt from "bcrypt"

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // optional for OAuth users
  oauthProvider?: "google"; // track how user signed up
  image?: string; // profile picture URL from OAuth or uploaded
  role: "admin" | "customer";
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  createdAt?: Date;
  lastLogin?: Date;
  pushSubscription?: any;
  comparePassword(candidatePassword: string): Promise<boolean>
}


const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      // only required if not using OAuth
      return !this.oauthProvider;
    },
    minlength: 6,
    select: false,
  },
  oauthProvider: {
    type: String,
    enum: ["google"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  pushSubscription: {
    type: Schema.Types.Mixed,
  },
  billingAddress: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    phone: { type: String },
  },
});

// ✅ Password comparison method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

const UserModel = models.User || model<IUser>("User", UserSchema)

export default UserModel
