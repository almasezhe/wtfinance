import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

export default function Payment() {
    const [paddle, setPaddle] = useState<Paddle | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (!clientToken) {
            console.error("PADDLE_CLIENT_TOKEN is missing!");
            setLoading(false);
            return;
        }

        initializePaddle({
            environment: "sandbox",
            token: clientToken, 
        }).then((paddle) => {
            if (paddle) {
                setPaddle(paddle);
                setLoading(false);
            } else {
                console.error("Failed to initialize Paddle!");
                setLoading(false);
            }
        });
    }, []);

    const handleCheckout = () => {
        if (!paddle) return alert("Paddle is not initialized!");

        paddle.Checkout.open({
            items: [
                { priceId: 'pri_01jkx004aw53k1apst7dn9xdcz', quantity: 1 }
            ],
            settings: {
                displayMode: 'overlay',
                theme: 'dark',
                successUrl: 'http://localhost:3000/payment-paid-314159265358979'
            }
        });
    };

    return (
        <button
            onClick={handleCheckout}
            className="btn bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110"
            disabled={!paddle || loading}
        >
            {loading ? "Loading..." : (
                <>
                    <span className="text-xl font-bold text-gray-200">$4.99</span>
                    <span className="text-sm text-gray-200 ml-2 line-through">$10</span>
                </>
            )}
        </button>
    );
}
