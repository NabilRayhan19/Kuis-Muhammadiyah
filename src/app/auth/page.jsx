"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/components/atoms/max-width-wrapper";
import { MotionDiv } from "@/components/animated/motion-div";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [validEmail, setValidEmail] = useState(true);
    const [touchedEmail, setTouchedEmail] = useState(false);

    const { signIn, signUp, signInWithGoogle, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    // Password requirements
    const minLength = password.length >= 6;
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === confirmPassword;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        // Redirect jika sudah login
        if (user) {
            router.push(redirectTo);
        }
    }, [user, router, redirectTo]);

    // Email validation on change
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touchedEmail) {
            setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        }
    };

    // Email validation on blur
    const handleEmailBlur = () => {
        setTouchedEmail(true);
        setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    };

    const handleGoogleAuth = async () => {
        try {
            setGoogleLoading(true);
            setError(null);
            await signInWithGoogle();
            // Navigasi akan ditangani oleh useEffect ketika user diperbarui
        } catch (err) {
            console.error("Google auth error:", err);
            setError("Gagal masuk dengan Google. Silakan coba lagi.");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi dasar
        if (!isEmailValid) {
            setError("Email tidak valid.");
            return;
        }

        // Validasi khusus untuk pendaftaran
        if (!isLogin) {
            if (!minLength || !hasNumber) {
                setError("Password harus minimal 6 karakter dan mengandung angka.");
                return;
            }

            if (password !== confirmPassword) {
                setError("Password dan konfirmasi password tidak cocok.");
                return;
            }
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isLogin) {
                await signIn({ email, password });
                // Pergi ke halaman redirect setelah login berhasil
                router.push(redirectTo);
            } else {
                const { user, session } = await signUp({ email, password });

                if (!session) {
                    setSuccessMessage("Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi.");
                    setIsLogin(true); // Beralih ke form login
                } else {
                    router.push(redirectTo);
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            // Handle error dari Supabase
            if (err.message.includes("Email not confirmed")) {
                setError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda.");
            } else if (err.message.includes("Invalid login credentials")) {
                setError("Email atau password tidak valid.");
            } else if (err.message.includes("User already registered")) {
                setError("Email sudah terdaftar. Silakan login.");
                setIsLogin(true);
            } else {
                setError(err.message || "Terjadi kesalahan saat autentikasi");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <MaxWidthWrapper className="flex items-center justify-center px-6 z-50">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-slate p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-center text-dark-blue dark:text-white">
                        {isLogin ? "Masuk ke Akun" : "Buat Akun Baru"}
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-3 px-4 rounded-xl shadow-sm text-dark-blue dark:text-white font-medium mb-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-purple rounded-full animate-spin" />
                        ) : (
                            <FcGoogle className="text-2xl" />
                        )}
                        <span>{isLogin ? "Masuk dengan Google" : "Daftar dengan Google"}</span>
                    </button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-500"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 text-sm bg-white dark:bg-slate text-gray-500 dark:text-gray-400">
                                atau dengan email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-navy dark:text-light-blue"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-6 pointer-events-none">
                                    <FiMail className={`${!validEmail && touchedEmail ? "text-red" : "text-gray-400"}`} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                    required
                                    className={`w-full pl-10 px-4 py-3 mt-1 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white
                                    ${!validEmail && touchedEmail
                                            ? "border-red-500 focus:ring-red-300 dark:border-red-700"
                                            : "border-gray-300 focus:ring-purple dark:border-gray-700"}`}
                                    placeholder="contoh@email.com"
                                />
                                {touchedEmail && !validEmail && (
                                    <p className="mt-1 text-sm text-red dark:text-red">
                                        Email tidak valid
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-navy dark:text-light-blue"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                                    placeholder={isLogin ? "Masukkan password" : "Buat password (min. 6 karakter)"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password requirements display for sign up mode */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className={`mr-2 ${minLength ? "text-green-500" : "text-gray-300 dark:text-gray-500"}`}>
                                        {minLength ? <FiCheck size={16} /> : <FiX size={16} />}
                                    </div>
                                    <span className={`text-sm ${minLength ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                                        Minimal 6 karakter
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <div className={`mr-2 ${hasNumber ? "text-green-500" : "text-gray-300 dark:text-gray-500"}`}>
                                        {hasNumber ? <FiCheck size={16} /> : <FiX size={16} />}
                                    </div>
                                    <span className={`text-sm ${hasNumber ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                                        Mengandung angka
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Confirm Password field for sign up mode */}
                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-navy dark:text-light-blue"
                                >
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={`w-full px-4 py-3 mt-1 border rounded-md focus:outline-none focus:ring-2 pr-10 dark:bg-gray-800 dark:text-white 
                                        ${confirmPassword && !passwordsMatch
                                                ? "border-red-500 focus:ring-red-300 dark:border-red-700"
                                                : "border-gray-300 focus:ring-purple dark:border-gray-700"}`}
                                        placeholder="Ulangi password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword && !passwordsMatch && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Password tidak cocok
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (touchedEmail && !validEmail) || (!isLogin && (!minLength || !hasNumber || !passwordsMatch))}
                            className="w-full bg-purple py-4 px-5 rounded-xl shadow-lg text-white font-semibold text-lg hover:bg-purple/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                isLogin ? "Masuk" : "Daftar"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleSwitchMode}
                            className="text-purple hover:underline dark:text-light-blue"
                        >
                            {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
                        </button>
                    </div>
                </div>
            </MotionDiv>
        </MaxWidthWrapper>
    );
}