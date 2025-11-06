import { Schema, models, model } from "mongoose"

const DomainFrequencySchema = new Schema(
  {
    domainId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

export default models.DomainFrequency || model("DomainFrequency", DomainFrequencySchema)
