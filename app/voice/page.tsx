"use client"

import VapiWidget from "@/components/VapiWidget";



import {useAuth} from "@/app/context/useAuth";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {LoaderOne} from "@/components/ui/loader";

function VoicePage() {
    const {user, loading} = useAuth()
    const router  =useRouter()
    console.log(user)
    useEffect(() => {
        if (!user && !loading) {
            router.replace('/')
        }
    }, [user, loading, router]);
    if (!user && loading) {
        return  <div className='flex items-center justify-center w-screen h-screen'>
            <LoaderOne/>
        </div>
    }
  return (
    <div className="min-h-screen bg-background">


        <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
            <VapiWidget />
        </div>


    </div>
  );
}

export default VoicePage;
