import mongoose, { Schema, models, model } from "mongoose";

const SavedFilterSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    filters: {
      priceRange: { type: [Number], default: [0, 100000] },
      tlds: { type: [String], default: [] },
      availability: { type: String, enum: ["all", "available", "sold"], default: "all" },
      type: { type: String, enum: ["all", "aged", "traffic"], default: "all" },
      domainRankRange: { type: [Number], default: [0, 100] },
      domainAuthorityRange: { type: [Number], default: [0, 100] },
      scoresRange: { type: [Number], default: [0, 100] },
      trustFlowRange: { type: [Number], default: [0, 100] },
      citationFlowRange: { type: [Number], default: [0, 100] },
      ageMin: { type: Number, default: null },
      referringDomainsMin: { type: Number, default: null },
      authorityLinksMin: { type: Number, default: null },
      monthlyTrafficMin: { type: Number, default: null },
      tags: { type: [String], default: [] },
      isHot: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Compound index for userId and name to ensure unique filter names per user
SavedFilterSchema.index({ userId: 1, name: 1 }, { unique: true });

export const SavedFilter = models.SavedFilter || model("SavedFilter", SavedFilterSchema);
