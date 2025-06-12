"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/components/atoms/max-width-wrapper";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { MotionDiv } from "@/components/animated/motion-div";
import { backgroundColors } from "@/lib/utils";
import { FiArrowLeft } from "react-icons/fi";
import { useQuestionStore } from "@/store/quiz-store";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { reset } = useQuestionStore();


    const handleBackToHome = () => {
        reset();
        router.push('/');
    }


    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    // Ambil data skor dari Supabase
    useEffect(() => {
        const fetchScores = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('quiz_scores')
                    .select('*')
                    .order('completed_at', { ascending: false });

                if (error) throw error;
                setScores(data || []);
            } catch (err) {
                console.error("Error fetching scores:", err);
                setError("Gagal memuat data skor");
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [user]);

    // Tampilkan loading state
    if (loading || isLoading) {
        return (
            <MaxWidthWrapper className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-xl text-dark-blue dark:text-white">Memuat...</div>
                </div>
            </MaxWidthWrapper>
        );
    }

    // Hitung statistik
    const totalQuizzes = scores.length;
    const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
    const totalMaxScore = scores.reduce((sum, item) => sum + item.max_score, 0);
    const averagePercentage = totalMaxScore > 0
        ? Math.round((totalScore / totalMaxScore) * 100)
        : 0;

    return (
        <MaxWidthWrapper className="px-6 py-8 z-20">
            <button
                onClick={handleBackToHome}
                className="flex items-center text-purple dark:text-light-blue mb-8 hover:underline bg-transparent border-0 cursor-pointer p-0"
            >
                <FiArrowLeft className="mr-2" /> Kembali ke Beranda
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate p-6 rounded-xl shadow-md"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                            <Image
                                src={user?.user_metadata?.avatar_url || `https://www.gravatar.com/avatar/${btoa(user?.email || "")}?d=mp`}
                                alt="User avatar"
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-dark-blue dark:text-white mb-1">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
                        </h2>
                        <p className="text-gray-navy dark:text-light-blue text-sm mb-4">
                            {user?.email}
                        </p>

                        {/* Statistik ringkas */}
                        <div className="w-full bg-gray-100 dark:bg-slate p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-navy dark:text-light-blue text-sm">Quiz Diselesaikan:</span>
                                <span className="text-dark-blue dark:text-white font-semibold">{totalQuizzes}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-navy dark:text-light-blue text-sm">Total Skor:</span>
                                <span className="text-dark-blue dark:text-white font-semibold">{totalScore}/{totalMaxScore}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-navy dark:text-light-blue text-sm">Rata-rata:</span>
                                <span className="text-dark-blue dark:text-white font-semibold">{averagePercentage}%</span>
                            </div>
                        </div>
                    </div>
                </MotionDiv>

                {/* Riwayat Quiz */}
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 bg-white dark:bg-slate p-6 rounded-xl shadow-md"
                >
                    <h3 className="text-lg font-semibold text-dark-blue dark:text-white mb-4">
                        Riwayat Quiz
                    </h3>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {scores.length === 0 && !error && (
                        <div className="text-center py-8 text-gray-navy dark:text-light-blue">
                            Belum ada quiz yang diselesaikan
                        </div>
                    )}

                    <div className="space-y-4">
                        {scores.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                                        style={{ backgroundColor: backgroundColors[item.quiz_title] || '#6949FD' }}
                                    >
                                        <span className="text-white font-bold">{item.quiz_title[0]}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-dark-blue dark:text-white">
                                            {item.quiz_title}
                                        </h4>
                                        <p className="text-sm text-gray-navy dark:text-light-blue">
                                            {new Date(item.completed_at).toLocaleDateString()} - {new Date(item.completed_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-dark-blue dark:text-white">
                                        {item.score}/{item.max_score}
                                    </div>
                                    <div className="text-sm text-gray-navy dark:text-light-blue">
                                        {Math.round((item.score / item.max_score) * 100)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </MotionDiv>
            </div>
        </MaxWidthWrapper>
    );
}