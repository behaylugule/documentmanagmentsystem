const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname:{type:String, required: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone:{type:String,required:true},
    address:{type:String},
    gender:{type:String},
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVarify: {
      type: Boolean,
      default: false,
    },
    role:[
      {depId:{type:String},depName:{type:String}}
    ],
    avater:{type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
