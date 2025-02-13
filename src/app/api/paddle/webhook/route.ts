import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ Парсим JSON, а не formData
    const body = await req.json();

    // ✅ Paddle отправляет `event_type`, а не `alert_name`
    const event = body.event_type; 

    if (event === "transaction.paid") {
      const email = body.data.customer_id; // Пример: получаем ID клиента
      const productId = body.data.items?.[0]?.price?.product_id; // ID продукта
      
      console.log(`💰 Payment received from Customer ID: ${email} for Product ID: ${productId}`);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid event" }, { status: 400 });

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
