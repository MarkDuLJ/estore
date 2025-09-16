import { NextRequest, NextResponse } from "next/server";

// import { stripe } from "@/app/(toTustomer)/stripe/stripe_instance";
import Stripe from "stripe";
import { db } from "@/db/db";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * use resend for email confirmation
 */

const resend = new Resend(process.env.RESEND_API_KEY)



/**
 * Create user after order is paid
 * @param req 
 * @returns 
 */

export async function  POST  (req: NextRequest) {
  // 1️⃣ Get the raw body and Stripe signature
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET env var");

  // 2️⃣ Verify and construct the event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  // 3️⃣ Handle the charge.succeeded event
  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;

    const productId = charge.metadata?.productId;
    const email = charge.billing_details?.email;
    const pricePaidInCents = charge.amount;

    if (!productId || !email) {
      return new NextResponse("Missing productId or email", { status: 400 });
    }

    // Make sure the product exists
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return new NextResponse("No such product", { status: 400 });
    }

    // 4️⃣ Create user if needed
    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({ data: { email } });
    }

    // 5️⃣ Always create a new order for this charge
    const order = await db.order.create({
      data: {
        userId: user.id,
        productId,
        pricePaidInCents,
      },
    });
console.log("ORDER: ", order);

    // 6️⃣ Create a download verification token
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h expiry
      },
    });
console.log("++++++++++++++++++++++++sending email.....+++++++++");

    // 7️⃣ Send confirmation email
    await resend.emails.send({
      from: `Customer Service <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order confirmation",
      react: <h1>Thank you for your order!</h1>,
    });

    console.log("User:", user.email, "Order ID:", order.id);
  }

  // Respond quickly so Stripe knows we received the event
  return new NextResponse(null, { status: 200 });
};