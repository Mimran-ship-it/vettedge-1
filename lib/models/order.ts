import mongoose, { Schema, Document } from "mongoose";

// Define a sub-schema for billing information
const billingInfoSchema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, default: "" },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  country: { type: String, default: "" }
}, { _id: false });

// Define the billing info interface
interface IBillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  sessionId: string;
  customerEmail: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
  createdAt: Date; 
  billingInfo: IBillingInfo;
  domainTransfer: string; // Added domainTransfer field
}

// Helper function to parse billingInfo string
function parseBillingInfoString(value: string): IBillingInfo {
  try {
    // If it's already an object, return it
    if (typeof value !== 'string') return value as IBillingInfo;
    
    // Remove the double braces at the beginning and end
    let jsonString = value.trim();
    
    // Handle the case with double braces: {{...}}
    if (jsonString.startsWith('{{') && jsonString.endsWith('}}')) {
      // Remove the outer braces
      jsonString = jsonString.substring(2, jsonString.length - 2);
      // Now we have: "firstName":"Admin",...
      // Add braces to make it valid JSON
      jsonString = `{${jsonString}}`;
    }
    
    // Parse the JSON string
    const parsed = JSON.parse(jsonString) as IBillingInfo;
    return parsed;
  } catch (error) {
    console.error('Error parsing billingInfo string:', error);
    console.log('Original value:', value);
    // Return a default object if parsing fails
    return {
      firstName: "Unknown",
      lastName: "",
      email: "unknown@example.com",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    };
  }
}

const OrderSchema = new Schema<IOrder>(
  {
    sessionId: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["open", "Completed"], required: true },
    billingInfo: {
      type: billingInfoSchema,
      required: true,
      // Custom setter to handle string input and convert to object
      set: function(value: IBillingInfo | string): IBillingInfo {
        if (typeof value === 'string') {
          return parseBillingInfoString(value);
        }
        return value;
      }
    },
    domainTransfer: { type: String, enum: ["pending", "Completed"], default: "pending" } // Added domainTransfer field
  },
  { timestamps: true }
);

// Add a pre-save hook to ensure billingInfo is properly formatted
OrderSchema.pre('save', function(next) {
  const order = this as IOrder;
  
  if (order.isModified('billingInfo') && typeof order.billingInfo === 'string') {
    order.billingInfo = parseBillingInfoString(order.billingInfo as string);
  }
  next();
});

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);