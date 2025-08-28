"use client";

import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ChatProvider } from "@/components/providers/chat-provider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ChatProvider>
          <Elements stripe={stripePromise}>
            {children}
          </Elements>
        </ChatProvider>
      </CartProvider>
    </AuthProvider>
  );
}
