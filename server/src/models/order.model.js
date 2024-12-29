import  mongoose  from 'mongoose';


const OrderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "please enter shipping address"],
      },
      city: {
        type: String,
        required: [true, "please enter shipping city"],
      },
      state: {
        type: String,
        required: [true, "please enter shipping state"],
      },
      country: {
        type: String,
        required: [true, "please enter shipping country"],
      },
      pincode: {
        type: Number,
        required: [true, "please enter shipping pincode"],
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "shipped", "Out for Delivery", "Delivered"],
      default: "Processing",
    },
    OrderItems: [
      {
        name: String,
        photo: String,
        quantity: String,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", OrderSchema);

export default Order;