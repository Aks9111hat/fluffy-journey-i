"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/userContext";
// import DietPlan from "@/components/DisplayComponents/dietPlan"
// import WorkoutPlan from "@/components/DisplayComponents/workoutPlan"
import FloatingChatIcon from "@/components/DisplayComponents/FloatingChatIcon"
import dynamic from 'next/dynamic';

const DietPlan = dynamic(() => import('@/components/DisplayComponents/dietPlan'), { ssr: false });
const WorkoutPlan = dynamic(() => import('@/components/DisplayComponents/workoutPlan'), { ssr: false });


export default function ProfilePage() {
    const [data, setData] = useState("nothing");
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            setData(user._id)
        }
    }, [user])

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p>Profile Page</p>
            <h2 className="p-4 rounded bg-green-400">{data === 'nothing' ? 'Nothing' : <Link href={`/profile/${data}`}>Your Profile</Link>}</h2>
            <hr />

            <div className="flex flex-row ">
                <DietPlan email={user?.email} />

                <WorkoutPlan email={user?.email} />
            </div>
            {/* <div className="">
                <ExerciseStats email={user?.email} exerciseName="Sample Exercise" />
            </div> */}
            <div className="">
                {/* <ExerciseStatsDisplay email={user?.email} exerciseName="Romanian Deadlifts" /> */}
                {/* <Chatbot /> */}
                <FloatingChatIcon showChatbot={true} />
            </div>
        </div>
    )
}