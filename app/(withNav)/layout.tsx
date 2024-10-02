import { FC } from "react";
import CartProvider from "../context/CartContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ViewedProvider from "../context/ViewedContext";
import RecommendedProvider from "../context/RecommendedContext";
import ModalProvider from "../context/ModalContext";
import LoadingModal from "@/components/LoadingModal";
import RemoveModal from "@/components/RemoveModal";

type WithNavProps = {
  children: React.ReactNode;
};

const AuthLayout: FC<WithNavProps> = ({ children }) => {
  return (
    <ModalProvider>
      <CartProvider>
        <ViewedProvider>
          <RecommendedProvider>
            <LoadingModal />
            <RemoveModal />
            <NavBar />
            <div>{children}</div>
            <Footer />
          </RecommendedProvider>
        </ViewedProvider>
      </CartProvider>
    </ModalProvider>
  );
};

export default AuthLayout;
