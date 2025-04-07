// /netlify/functions/stripe/create-payment-intent.ts
import { Handler } from "@netlify/functions";
import Stripe from "stripe";

// Ensure you have your Stripe secret key in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion:"2025-02-24.acacia",
});

interface PaymentIntentRequest {
  amount: number; // in dollars, we'll convert to cents
  currency?: string;
}

export const handler: Handler = async (event, context) => {
  try {
    // Parse the body from the client (assumed to be JSON)
    const body: PaymentIntentRequest = JSON.parse(event.body || "{}");
    const { amount, currency = "usd" } = body;

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid amount" }),
      };
    }

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars to cents
      currency,
    });

 // console.log("Returned payment intent : ", paymentIntent);
    return {
      statusCode: 200,
      body: JSON.stringify(paymentIntent),
    };
  } catch (error: any) {
    console.error("Error creating PaymentIntent:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
