import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId } = body; // Удалил email

    if (!productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const vendorId = process.env.PADDLE_VENDOR_ID;
    const authCode = process.env.PADDLE_API_KEY;

    const price = "4,99"; // Фиксированная цена

    const params = new URLSearchParams({
      vendor_id: vendorId || '',
      vendor_auth_code: authCode || '',
      title: "LoverTest AI Premium",
      prices: `USD:${price}`, // Цена в USD
      quantity: "1",
      recurring: "false", // Разовая оплата
      tax_included: "true", // Включает налоги (если надо)
      return_url: "https://lovertest.xyz/payment-paid-314159265358979",
      webhook_url: "https://lovertest.xyz/api/paddle/webhook",
    });

    const paddleResponse = await fetch("https://vendors.paddle.com/api/2.0/product/generate_pay_link", {
      method: "POST",
      body: params,
    });

    if (!paddleResponse.ok) {
      return NextResponse.json({ error: "Paddle API error" }, { status: 500 });
    }

    const paddleData = await paddleResponse.json();

    if (!paddleData.success) {
      return NextResponse.json({ error: "Failed to generate Paddle link" }, { status: 500 });
    }

    return NextResponse.json({ url: paddleData.response.url });
  } catch (error) {
    console.error("Error in Paddle Checkout:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
