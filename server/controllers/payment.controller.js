
/*
export const createOrder = async (req, res) => {
    try {
        const {planId, amount, credits} = req.body;
        if(!amount || !credits) {
            return res.status(400).json({message: "Invalid plan data"})
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }
        const order = await stripeClient.orders.create(options);
       
        await Payment.create({
            userId: req.user._id,
            planId,
            amount,
            credits,
            stripepayOrderId: order.id,
            status: "created"
        });
        res.status(201).json({message: "Order created successfully", order});

    } catch (error) {
        console.error("Error creating order:", error);
    }
}


export const verifyPayment = async (req, res) => {
    try {
        const {stripe_order_id, stripe_payment_id, stripe_signature} = req.body;
         const body = stripe_order_id + "|" + stripe_payment_id;
         const expectedSignature = crypto.createHmac("sha256", process.env.STRIPE_KEY_SECRET)
         .update(body.toString())
         .digest("hex");

         if(expectedSignature !== stripe_signature) {
            return res.status(400).json({message: "Invalid signature"});
         }

         const payment = await Payment.findOne({stripepayOrderId: stripe_order_id});

         if (!payment) {
            return res.status(404).json({message: "Payment not found"});
         
        }
        if(payment.status === "paid") {
            return res.status(400).json({message: "Payment already verified"});;
        }

        //uplaod payment details to db
        payment.status ="paid";
        payment.stripePaymentId = stripe_payment_id;
        await payment.save();

        //add credits to user account
        const updatedUser = await User.findByIdAndUpdate(payment.userId, {$inc: {credits: payment.credits}}, {new: true});
        res.json({message: "Payment verified successfully", user: updatedUser});
       
        

    } catch (error) {
        console.error("Error verifying payment:", error);
    }
}*/

import Stripe from "stripe";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";

// Debug (optional)

// ✅ Create Stripe instance ONLY ONCE
//const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe key missing in env");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// CREATE ORDER (Stripe Checkout Session)
/*
export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;

        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: `${planId} Plan` },
                        unit_amount: Math.round(Number(amount) * 100), // ✅ FIXED
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        const payment = await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            stripeSessionId: session.id,
            status: "created",
        });

        res.status(201).json({
            message: "Order created successfully",
            sessionId: session.id,
            url: session.url, // ✅ important for redirect
            payment,
        });

    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(500).json({ message: err.message });
    }
};
*/
export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;

        const stripeClient = getStripe(); // ✅ ADD THIS LINE


        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: `${planId} Plan` },
                        unit_amount: Math.round(Number(amount) * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cancel",
            //success_url: "http://localhost:5173/success",
            //cancel_url: "http://localhost:5173/cancel",
        });

        const payment = await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            stripeSessionId: session.id,
            status: "created",
        });
        console.log("💾 PAYMENT SAVED =>", payment);

        res.status(201).json({
            message: "Order created successfully",
            sessionId: session.id,
            url: session.url,
            payment,
        });

    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// VERIFY PAYMENT
/*
export const verifyPayment = async (req, res) => {

    console.log("🔥 VERIFY ROUTE HIT");           // 👈 ADD
    console.log("📦 req.body:", req.body);         // 👈 ADD  
    console.log("📦 Content-Type:", req.headers['content-type']);  // 👈 ADD

    try {
        const { sessionId } = req.body;
        const stripeClient = getStripe();

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID required" });
        }

        const session = await stripeClient.checkout.sessions.retrieve(sessionId);

        if (!session || session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        const payment = await Payment.findOneAndUpdate(
            { stripeSessionId: sessionId },
            { status: "paid" },
            { new: true }
        );

        console.log("USER ID IN VERIFY:", req.userId);
        console.log("SESSION ID RECEIVED:", sessionId);

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.status === "paid") {
            return res.status(400).json({ message: "Already verified" });
        }

        payment.status = "paid";
        await payment.save();

        // Add credits to user
        const user = await User.findByIdAndUpdate(
            payment.userId,
            { $inc: { credits: payment.credits } },
            { new: true }
        );

        res.json({
            message: "Payment verified successfully",
            user,
        });

    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ message: error.message });
    }
};*/


export const verifyPayment = async (req, res) => {
  console.log("🔥 VERIFY ROUTE HIT");
  console.log("📦 req.body:", req.body);
  console.log("👤 USER ID:", req.userId);

  try {
    const { sessionId } = req.body;
    const stripeClient = getStripe();

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID required" });
    }

    console.log("🔍 SESSION FROM FRONTEND:", sessionId);

    // ✅ Step 1: Verify with Stripe
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // ✅ Step 2: Find payment in DB (NO update yet)
    const payment = await Payment.findOne({ stripeSessionId: sessionId });

    console.log("🔍 PAYMENT FOUND:", payment);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // ✅ Step 3: Prevent duplicate verification
    if (payment.status === "paid") {
      return res.json({ message: "Already verified" });
    }

    // ✅ Step 4: Update payment
    payment.status = "paid";
    await payment.save();

    // ✅ Step 5: Add credits to user
    const user = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { credits: payment.credits } },
      { new: true }
    );

    res.json({
      message: "Payment verified successfully",
      user,
    });

  } catch (error) {
    console.error("❌ Verify Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};