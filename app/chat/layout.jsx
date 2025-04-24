"use client";

import { useSession } from "next-auth/react";

export default function ChatLayout({children}){

    const { data: session} = useSession({refetchOnWindowFocus: false});
    if(session?.user){
        return children;
    }else{
        return(
            <div className="flex flex-col justify-center items-center w-full h-full">
                <span className="max-w-xl text-center text-4xl text-red-500 font-bold">You need to be signed in to access this page.</span>
            </div>
        )
    }

}