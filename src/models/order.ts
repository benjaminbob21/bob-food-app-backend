import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isGroupOrder: { type: Boolean, default: false },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
  },
  cartItems: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalAmount: Number,
  numberOfPeople: { type: Number, default: 1 },
  amountPerPerson: { type: Number, default: 0 },
  paidParticipants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      paymentIntentId: String,
    },
  ],
  paymentIntents: [String],
  status: {
    type: String,
    enum: [
      "placed",
      "paid",
      "inProgress",
      "outForDelivery",
      "delivered",
      "pending",
      "completed",
      "failed",
      "cancelled",
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  if (this.isGroupOrder && !this.status) {
    this.status = "pending";
  } else if (!this.status) {
    this.status = "placed";
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
