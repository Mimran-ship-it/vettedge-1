import mongoose, { Schema, models, model } from "mongoose";

const DomainSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: [String], default: [] }, // Image array
    price: { type: Number, required: true },
    Actualprice: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    isHot: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    type: { type: String, enum: ["traffic", "aged"], required: true },
    metrics: {
      domainRank: Number,
      referringDomains: Number,
      authorityLinks: [String], // now array of links
      avgAuthorityDR: Number,
      domainAuthority: Number,
      score: Number,
      trustFlow: Number,
      citationFlow: Number,
      monthlyTraffic: Number,
      year: Number,
      language: String,
      age: Number,
    },
    registrar: { type: String, required: true },
    
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Domain || model("Domain", DomainSchema);
