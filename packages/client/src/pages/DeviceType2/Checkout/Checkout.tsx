import { ReactNode } from "react";
import CheckoutBox from "./CheckoutBox";
import "./Checkout.sass";
import CheckoutSkeleton from "./CheckoutSkeleton";

function Checkout({ children }: { children: ReactNode }) {
  return <div className="device-checkout-container">{children}</div>;
}

Checkout.Box = CheckoutBox;
Checkout.Skeleton = CheckoutSkeleton;

export default Checkout;
