import { UserButton } from "@clerk/nextjs";
import { SearchInput } from "@/components/search-input";
import { CryptoForm } from "@/components/crypto-form";

const RootPage = () => {
  // TODO: run the user creation as soon as user logs in, post to mongoDB.
  return (
    <div className="h-full p-4 space-y-2">
      {/* <SearchInput /> */}
      {/* <CryptoForm /> */}
    </div>
  );
};

export default RootPage;
