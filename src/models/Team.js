let mongoose = require("mongoose");

let TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  { id: false }
);

TeamSchema.virtual("squad", {
  ref: "Player",
  localField: "_id",
  foreignField: "teamId",
});

TeamSchema.set("toObject", { virtuals: true });
TeamSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Team", TeamSchema);
