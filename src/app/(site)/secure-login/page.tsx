import { Suspense } from "react";
import SecureLogin from "./_components/SecureLogin";

const SecureLoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SecureLogin />
    </Suspense>
  );
};

export default SecureLoginPage;
