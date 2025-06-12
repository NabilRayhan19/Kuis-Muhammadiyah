"use client";
import Game from "@/components/molecules/game";
import MaxWidthWrapper from "@/components/atoms/max-width-wrapper";
import Score from "@/components/atoms/score";
import Subjects from "@/components/atoms/subjects";
import { useQuestionStore } from "@/store/quiz-store";
import { useEffect, useState } from "react";
import { MotionDiv } from "@/components/animated/motion-div";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function Home() {
    const { fetchQuizzes, quizzes, selectedQuizz, hasCompleteAll, reset } = useQuestionStore();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Gabungkan kedua useEffect menjadi satu untuk menghindari konflik
    useEffect(() => {
        // Periksa autentikasi terlebih dahulu
        if (!loading) {
            if (!user) {
                router.push('/auth'); // Gunakan router.push sebagai alternatif redirect
            } else {
                // Hanya fetch quizzes jika sudah terautentikasi
                fetchQuizzes();
                setIsLoading(false);
            }
        }
    }, [user, loading, router, fetchQuizzes]);

    // Tampilkan loading state saat proses autentikasi atau fetching data
    if (loading || isLoading) {
        return (
            <MaxWidthWrapper className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-xl text-dark-blue dark:text-white">Memuat...</div>
                    <div className="w-16 h-16 border-4 border-purple dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                </div>
            </MaxWidthWrapper>
        );
    }

    return (
        <MaxWidthWrapper
            className={cn(
                selectedQuizz && "xl:place-content-center",
                "grid px-6 grid-cols-1 md:grid-cols-2 gap-10 xl:gap-20 lg:px-0 relative z-20 h-full"
            )}
        >
            {!selectedQuizz && (
                <>
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col xs:gap-4 md:gap-10 lg:mt-28 xl:mt-0"
                    >
                        <h1 className="xs:text-4xl md:text-5xl font-normal text-dark-blue dark:text-white xl:text-6xl 2xl:text-6xl">
                            Welcome to the <span className="font-bold">Muhammadiyah Quizz!</span>
                        </h1>
                        <p className="text-gray-navy italic dark:text-light-blue xs:text-sm xl:text-xl">
                            Pick a subject to get started.
                        </p>
                    </MotionDiv>
                    <MotionDiv
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-y-4 xl:gap-y-6 justify-center w-full"
                    >
                        <Subjects data={quizzes} />
                    </MotionDiv>
                </>
            )}
            {selectedQuizz && hasCompleteAll === false && <Game />}
            {hasCompleteAll && (
                <>
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col xs:gap-3 md:gap-6 h-full lg:mt-20"
                    >
                        <h1 className="xs:text-4xl md:text-5xl font-normal text-dark-blue dark:text-white xl:text-6xl">
                            Quizz Completed!
                        </h1>
                        <p className="xs:text-4xl md:text-5xl font-bold text-dark-blue dark:text-white xl:text-6xl">
                            You scored...
                        </p>
                    </MotionDiv>
                    <MotionDiv
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col justify-center gap-y-4"
                    >
                        <Score />
                        <button
                            className="w-full bg-purple py-4 px-5 rounded-xl shadow-lg text-white font-semibold text-lg text-center"
                            onClick={reset}
                        >
                            Play Again
                        </button>
                    </MotionDiv>
                </>
            )}
        </MaxWidthWrapper>
    );
}