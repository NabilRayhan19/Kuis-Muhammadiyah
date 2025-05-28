"use client";
import { useState } from "react";
import { useQuestionStore } from "@/store/quiz-store";

const UserForm = ({ onStartTest }) => {
    const [name, setName] = useState("");
    const [campus, setCampus] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && campus && whatsapp) {
            onStartTest({ name, campus, whatsapp });
        } else {
            alert("Harap isi semua field!");
        }
    };

    return (
        <div className="flex flex-col gap-4 bg-white dark:bg-slate p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-dark-blue dark:text-white">
                Masukkan Data Anda
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 rounded-lg border border-gray-300 dark:bg-slate dark:text-white"
                />
                <input
                    type="text"
                    placeholder="Asal Kampus"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="p-2 rounded-lg border border-gray-300 dark:bg-slate dark:text-white"
                />
                <input
                    type="text"
                    placeholder="Nomor WhatsApp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="p-2 rounded-lg border border-gray-300 dark:bg-slate dark:text-white"
                />
                <button
                    type="submit"
                    className="bg-purple text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-dark transition-all"
                >
                    Start Test
                </button>
            </form>
        </div>
    );
};

export default UserForm;