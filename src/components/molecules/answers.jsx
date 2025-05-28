"use client";
import { useQuestionStore } from "@/store/quiz-store";
import Image from "next/image";
import { useState } from "react";
import Answer from "../atoms/answer";

const Answers = ({ data, handleAnswer, questionId, goNextQuestion }) => {
    const [selectedAns, setSelectedAns] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { questions, onCompleteQuestions } = useQuestionStore();
    const isCorrectUserAnswer = questions.find((q) => q.id === questionId)?.isCorrectUserAnswer;

    const answerLabels = ["A", "B", "C", "D"];

    const handleSelectAnswer = (answer) => {
        if (submitted) return;
        if (selectedAns === answer) {
            setSelectedAns("");
            return;
        }
        setSelectedAns(answer);
    };

    const handleSubmit = () => {
        if (submitted) {
            if (questions.every((q) => q.userSelectedAnswer != null)) {
                onCompleteQuestions();
                return;
            }
            goNextQuestion();
            setSelectedAns("");
            setSubmitted(false);
            return;
        }
        if (!selectedAns) return;
        handleAnswer(questionId, selectedAns);
        setSubmitted(true);
    };

    return (
        <>
            <ul className="flex flex-col gap-y-4 justify-center w-full">
                {data.map((answer, index) => (
                    <Answer
                        key={answer}
                        answer={answer}
                        selectedAns={selectedAns}
                        isCorrectUserAnswer={isCorrectUserAnswer}
                        handleSelectAnswer={handleSelectAnswer}
                        index={index}
                        answerLabels={answerLabels}
                    />
                ))}
            </ul>

            <button
                onClick={handleSubmit}
                className="w-full bg-purple py-4 px-5 rounded-xl shadow-lg text-white font-semibold text-lg text-center"
            >
                {submitted ? "Next Question" : "Submit Answer"}
            </button>
        </>
    );
};

export default Answers;