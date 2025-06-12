import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/utils/supabase";

const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://unismu-quiz.vercel.app/"
        : "http://localhost:3000/";

export const useQuestionStore = create(
    persist(
        (set, get) => {
            return {
                quizzes: [],
                questions: [],
                score: 0,
                selectedQuizz: null,
                currentQuestion: 0,
                hasCompleteAll: false,
                isSavingScore: false,
                scoreError: null,

                selectQuizz: (quizz) => {
                    set({ selectedQuizz: quizz, questions: quizz.questions });
                },

                fetchQuizzes: async () => {
                    try {
                        const res = await fetch(`${API_URL}/data.json`);
                        const json = await res.json();
                        const quizzes = json.quizzes;
                        set({ quizzes, hasCompleteAll: false }, false);
                    } catch (error) {
                        console.log(error);
                    }
                },

                selectAnswer: (questionId, selectedAnswer) => {
                    const { questions } = get();
                    const newQuestions = structuredClone(questions);
                    const questionIndex = newQuestions.findIndex(
                        (q) => q.id === questionId
                    );
                    const questionInfo = newQuestions[questionIndex];
                    const isCorrectUserAnswer =
                        questionInfo.answer === selectedAnswer;

                    newQuestions[questionIndex] = {
                        ...questionInfo,
                        isCorrectUserAnswer,
                        userSelectedAnswer: selectedAnswer,
                    };
                    // actualizamos el estado
                    set({ questions: newQuestions }, false);
                },

                onCompleteQuestions: async () => {
                    const { questions, selectedQuizz } = get();
                    const score = questions.filter((q) => q.isCorrectUserAnswer).length;

                    set({
                        hasCompleteAll: true,
                        currentQuestion: 0,
                        score,
                        isSavingScore: true,
                        scoreError: null
                    });

                    // Simpan skor ke Supabase
                    try {
                        const { data: userData } = await supabase.auth.getUser();
                        if (userData?.user?.id) {
                            // Coba update jika sudah ada, insert jika belum
                            const { data, error } = await supabase
                                .from('quiz_scores')
                                .upsert({
                                    user_id: userData.user.id,
                                    quiz_id: selectedQuizz.id,
                                    quiz_title: selectedQuizz.title,
                                    score: score,
                                    max_score: questions.length,
                                    completed_at: new Date().toISOString()
                                }, {
                                    onConflict: 'user_id,quiz_id',
                                    ignoreDuplicates: false
                                });

                            if (error) throw error;
                            set({ isSavingScore: false });
                        }
                    } catch (error) {
                        console.error("Error saving score:", error);
                        set({
                            scoreError: "Gagal menyimpan skor ke database",
                            isSavingScore: false
                        });
                    }
                },

                goNextQuestion: () => {
                    const { currentQuestion, questions } = get();
                    const nextQuestion = currentQuestion + 1;
                    if (nextQuestion < questions.length) {
                        set({ currentQuestion: nextQuestion }, false);
                    }
                },

                goPreviousQuestion: () => {
                    const { currentQuestion } = get();
                    const previousQuestion = currentQuestion - 1;

                    if (previousQuestion >= 0) {
                        set({ currentQuestion: previousQuestion }, false);
                    }
                },

                reset: () => {
                    set(
                        {
                            currentQuestion: 0,
                            questions: [],
                            hasCompleteAll: false,
                            selectedQuizz: null,
                            scoreError: null
                        },
                        false
                    );
                },
            };
        },
        {
            name: "quizz",
        }
    )
);