import  mongoose  from 'mongoose';


const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "please enter coupon code"],
      unique: true,
      uppercase: true,
    },
    amount: {
      type: Number,
      required: [true, "please enter Discount amount"],
    },
    validTill: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
  },
  { timestamps: true }
);


const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;