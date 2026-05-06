import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ServerUrl } from "../App";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Pricing = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      credits: 100,
      description: "Perfect for casual users.",
      features: ["100 AI Interview Credits", "Basic Report", "Voice Interview Access"],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "$9.99",
      credits: 150,
      description: "Great for practice.",
      features: ["150 Credits", "Detailed Report", "Full History"],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "$19.99",
      credits: 650,
      description: "Best value plan.",
      features: ["650 Credits", "Advanced Feedback", "Priority Processing"],
      badge: "Best Value",
    },
  ];
  

  const handlePayment = async (plan) => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN =>", token); // debug

      const res = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: plan.id === "basic" ? 9.99 : 19.99,
          credits: plan.credits,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      window.location.href = res.data.url;

    } catch (error) {
      console.log("ERROR =>", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
        <button
          onClick={() => navigate("/")}
          className="mt-2 p-3 rounded-full bg-white shadow"
        >
          <FaArrowLeft />
        </button>

        <div className="text-center w-full">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-gray-500 mt-2">
            Flexible pricing for your interview prep
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default ? { scale: 1.03 } : {}}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`p-8 rounded-3xl border bg-white shadow-md
                ${isSelected ? "border-emerald-600" : "border-gray-200"}
              `}
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>

              <p className="text-3xl font-bold text-emerald-600 mt-3">
                {plan.price}
              </p>

              <p className="text-gray-500">{plan.credits} credits</p>

              <p className="mt-3 text-sm text-gray-600">
                {plan.description}
              </p>

              <div className="mt-5 space-y-2">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold
                    ${isSelected
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100"
                    }
                  `}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;