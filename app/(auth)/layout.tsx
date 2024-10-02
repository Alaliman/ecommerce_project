import { FC } from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-3 md:p-24">
      <div className="rounded-none bg-slate-100 p-10 ">{children}</div>
    </div>
  );
};

export default AuthLayout;
