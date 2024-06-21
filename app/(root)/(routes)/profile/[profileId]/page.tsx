"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import Image from "next/image";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
}

const ProfilePage = ({ params }: ProfileIdPageProps) => {
  let profileIdParam = params.profileId;

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
              <p className="text-sm text-muted-foreground">Investor profile</p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          {/* <div className="border-2 border-rose-500">Hello</div> */}
          <div className="flex flex-col lg:flex-row items-center md:gap-3 p-4 ">
            <Image
              src={userProfileData.image}
              alt={userProfileData.username}
              width={400}
              height={400}
              objectFit="cover"
              className="rounded-2xl"
            />
            <div className="flex flex-col md:flex-row md:items-center mt-2 md:mt-0 mx-4">
              <p className="text-lg text-foreground font-base md:mr-2">
                {userProfileData.userText
                  ? userProfileData.userText
                  : "User profile text is empty, please update it 🙂"}
              </p>
            </div>
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
