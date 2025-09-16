import { Stripe } from "stripe";

export const apikey=process.env.STRIPE_SECRET_KEY as string
// Throw early if the env variable is missing
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(apikey)