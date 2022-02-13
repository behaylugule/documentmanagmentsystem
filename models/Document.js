const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    parent:{type:String,required:true},
    documentName:{type:String, required:true},
    documentUrl:{type:String, required:true},
    description:{type:String, required:true},
    type:{type:String, default:"pdf"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("document", documentSchema);
