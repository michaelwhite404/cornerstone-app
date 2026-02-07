import { ReactNode } from "react";
import CheckoutBox from "./CheckoutBox";
import CheckoutSkeleton from "./CheckoutSkeleton";

function Checkout({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap">{children}</div>;
}

Checkout.Box = CheckoutBox;
Checkout.Skeleton = CheckoutSkeleton;

export default Checkout;
