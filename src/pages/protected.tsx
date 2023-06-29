import { UserButton } from "@clerk/nextjs";
import { FormEvent, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useUser } from "@clerk/nextjs";
import { Header } from "../components/header";
import { type NextPage } from "next";

type Chat = {
  sender: string;
  message: string;
};

const Protected: NextPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY!, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", (data: any) => {
      setChats((prevState) => [
        ...prevState,
        { sender: data.sender, message: data.message },
      ]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/pusher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageToSend,
        sender: user?.emailAddresses[0]?.emailAddress.split("@")[0],
      }),
    });
  };
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Hello, {user?.emailAddresses[0]?.emailAddress.split("@")[0]}</p>
        <div>
          {chats.map((chat, idx) => {
            const flexClasses =
              chat.sender !==
              user?.emailAddresses[0]?.emailAddress.split("@")[0]
                ? "flex flex-col justify-end items-end"
                : "";

            const chatBgClasses =
              chat.sender ===
              user?.emailAddresses[0]?.emailAddress.split("@")[0]
                ? "bg-gray-900 text-white "
                : "bg-purple-200 w-full text-gray-700";
            return (
              <div className={flexClasses} key={idx}>
                <div
                  className={`${chatBgClasses} mt-2 max-w-xs rounded-md px-3 py-3 text-sm`}
                >
                  <p>{chat.message}</p>
                </div>
                <div
                  className={`${
                    chat.sender !==
                    user?.emailAddresses[0]?.emailAddress.split("@")[0]
                      ? "w-full text-right"
                      : ""
                  } text-purple-900`}
                >
                  <small>{chat.sender}</small>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 items-baseline "
        >
          <input
            type="text"
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            className="col-span-3 w-full rounded-l-md border-2 border-gray-200 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="start typing...."
          />
          <button
            type="submit"
            className="h-full max-w-sm rounded-r-md bg-purple-500 px-2 text-white"
          >
            Send
          </button>
        </form>
      </main>
    </>
    // return (
    //   <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
    //     <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
    //       <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
    //         Welcome to the{" "}
    //         <span className="text-[hsl(280,100%,70%)]">Protected</span> Page
    //       </h1>
    //       <p className="text-2xl text-white">Click this User Button!</p>
    //       <UserButton afterSignOutUrl="/" />
    //     </div>
    //   </main>
  );
};

export default Protected;
