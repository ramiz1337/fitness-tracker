"use client";

import Card from "../Components/Header/Card";
import HeaderCard from "../Components/Header/HeaderCard";
import PersonalCard from "../Components/Header/PersonalCard";
import { useIsAuthenticated } from "react-auth-kit";

export default function Home() {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <section className="bg-[#121212] mt-24">
                <div className="max-w-6xl mx-auto flex justify-between">
                    <div className="w-1/2 flex flex-col items-center justify-center">
                        <h2 className="text-left text-white">Welcome to Pulse Fit</h2>
                        <h1 className="text-6xl text-center font-bold uppercase text-white">Online Workout Planner</h1>
                        <div className="flex gap-x-4 mt-6">
                            <HeaderCard img="fiticon.webp">Blog</HeaderCard>
                            <HeaderCard img="healicon.webp">Weight Loss</HeaderCard>
                            <HeaderCard img="nutritionicon.webp">Nutrition</HeaderCard>   
                        </div>
                        {!isAuthenticated() && (
                            <>
                                <p className="text-white my-2 uppercase">
                                To use Fitness planner for free
                                </p>

                                <a
                                className="bg-green-600 hover:bg-green-400 px-3 py-1 rounded font-semibold text-white text-sm"
                                href="/register"
                                >
                                Sign Up Now
                                </a>
                            </>
                        )}
                    </div>
                    <div className="w-1/2 flex justify-center items-center">
                        <img src="burn-man.webp" alt="" />
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto mt-10">
                <h1 className="text-2xl tect-primary font-bold text-gray-800 uppercase">What is Workout Planner?</h1>
                <p className="mt-5">
                    Workout Planner is your personal digital assistant for creating, managing, and tracking your workout plans.
                    Whether you're a beginner or a professional athlete, Workout Planner helps you build customized training routines that fit your goals, fitness level, and schedule.
                    Choose from hundreds of exercises, track your progress, and stay motivated on your fitness journey — all in one place.
                </p>
                <div className="flex mt-10">
                    <div className="w-1/2 flex flex-col gap-y-10">
                        <Card title='Learn how to do the exercises' img='plates.webp'>Not sure about an exercise? The exercise library offers resources to guide you on proper form and technique.</Card>
                        <Card title='Create a free personalized workout' img='mascular.webp'>Build a workout plan that fits your goals and preferences. Easily add or remove exercises to create a workout designed specifically by and for you. It's completely free!</Card>
                        <Card title='Create custom workouts for your students' img='dumbell.svg'>Design free custom workout plans for your students. Tailor each educational plan to your student's needs and goals.</Card>
                        <Card title='Fitness Calculators' img='calculator.svg'>Track calories, calculate rep maxes, and monitor body composition – all within the app.</Card>
                    </div>
                    <img className="w-1/2" src="fitness-model.webp" alt="fitness-model" />
                </div>
            </section>

            <section className="max-w-6xl mx-auto text-center flex flex-col items-center gap-y-5 after:h-[1px] after:bg-gray-200 my-15 after:w-full">
                <h1 className="text-3xl uppercase tect-primary font-bold text-gray-800">Create Your Workout And Share It With The World!</h1>
                <p className="max-w-2xl">From sets, reps, tempo, and rest times, you have complete control over how you want to write it and how you want to present it.</p>

                {!isAuthenticated() && (
                <a
                    className="bg-green-600 hover:bg-green-400 px-3 py-1 rounded font-semibold text-white text-sm"
                    href="/register"
                >
                    Get Started
                </a>
                )}
            </section>

            <section className="max-w-6xl mb-20 mx-auto">
                <h1 className="text-2xl uppercase tect-primary font-bold text-gray-800">How to Create a Personalized Workout Plan</h1>
                <p className="mt-4">One of the most important things to consider when creating your custom workout plan is what you want to achieve.</p>
                <div className="flex mt-14">
                    <img className="max-w-32 mr-10" src="book.webp" alt="book" />
                    <ul className="list-disc">
                        <li>Do you want to build muscle?</li>
                        <li>Are you looking to lose weight?</li>
                        <li>Do you want to become stronger?</li>
                        <li>Do you desire to increase your endurance?</li>
                        <li>Do you want to focus on a specific body part or muscle group?</li>
                    </ul>
                </div>
                <p className="my-10">Of course, the end goal is to lose weight or gain muscle mass and to have a healthier and fitter body...</p>
                <div className="flex">
                    <PersonalCard overlayDescrition="Lorem ipsum..." overlayText="Bodybuilding" img="fitnes1-icon.webp"/>
                    <PersonalCard overlayDescrition="Lorem ipsum..." overlayText="Fitness" img="body-icon.webp"/>
                    <PersonalCard overlayDescrition="Lorem ipsum..." overlayText="Cardio" img="cardio-icon.webp"/>
                    <PersonalCard overlayDescrition="Lorem ipsum..." overlayText="Pilates" img="pilates-icon.webp"/>
                </div>
            </section>
        </>
    )
}
