"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
}

const ProfilePage = ({ params }: ProfileIdPageProps) => {
  let profileIdParam = params.profileId;

  console.log("Profile id received: ", profileIdParam);
  //   const [tradesTableData, setTradesTableData] = useState([]);

  const [userProfileData, setUserProfileData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileResponse = await fetch(
          `/api/trade/profile/${profileIdParam}`
        );
        if (!userProfileResponse.ok) {
          setErrorMessage("Failed to obtain user profile");
        }
        // Fetch user's trades
        const userProfileJsonData = await userProfileResponse.json();
        setUserProfileData(userProfileJsonData);
        console.log(userProfileData);
      } catch (error) {
        setErrorMessage(`Error fetching data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading === false && Object.keys(userProfileData).length > 0 ? (
        <div className="h-full p-4 space-y-2 max-w-[100rem] mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">
                {userProfileData.username}
              </h3>
              <p className="text-sm text-muted-foreground">
                View investor profile
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
        </div>
      ) : errorMessage.length > 0 ? (
        <Header title="Empty Dashboard" message={errorMessage} />
      ) : (
        <Header title="Loading..." message="Please wait" />
      )}
    </>
  );
};

export default ProfilePage;
