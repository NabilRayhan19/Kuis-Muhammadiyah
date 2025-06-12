"use client";
import SwitchTheme from "../atoms/switch-theme";
import { useQuestionStore } from "@/store/quiz-store";
import { backgroundColors, cn } from "@/lib/utils";
import Image from "next/image";
import { MotionHeader } from "../animated/motion-header";
import { useAuth } from "@/context/authContext";
import { useState, useRef, useEffect } from "react";
import { FiLogOut, FiChevronDown, FiUser, FiHome } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const Header = () => {
    const selectedQuizz = useQuestionStore((state) => state.selectedQuizz);
    const { user, signOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini

    // Fungsi untuk mendapatkan title berdasarkan pathname
    const getPageTitle = () => {
        // Hanya gunakan selectedQuizz.title di halaman beranda (/)
        if (selectedQuizz && pathname === '/') {
            return selectedQuizz.title;
        }

        switch (pathname) {
            case '/':
                return "Beranda";
            case '/auth':
                return "Autentikasi";
            case '/profile':
                return "Profil Pengguna";
            default:
                if (pathname.startsWith('/profile')) return "Profil Pengguna";
                return "Muhammadiyah Quiz";
        }
    };

    // Fungsi untuk mendapatkan icon berdasarkan pathname
    const getPageIcon = () => {
        // Hanya gunakan selectedQuizz.icon di halaman beranda (/)
        if (selectedQuizz && pathname === '/') {
            return selectedQuizz.icon;
        }

        switch (pathname) {
            case '/':
                return "./assets/images/home.svg";
            case '/auth':
                return "./assets/images/lock.svg";
            case '/profile':
                return "./assets/images/user.svg";
            default:
                return "./assets/images/logo.svg";
        }
    };

    // Fungsi untuk mendapatkan background color berdasarkan pathname
    const getPageColor = () => {
        // Hanya gunakan selectedQuizz color di halaman beranda (/)
        if (selectedQuizz && pathname === '/') {
            return backgroundColors[selectedQuizz.title];
        }

        switch (pathname) {
            case '/':
                return "#4ACFFF"; // Biru muda
            case '/auth':
                return "#FF8A3D"; // Oranye
            case '/profile':
                return "#6949FD"; // Ungu
            default:
                return "#22B573"; // Hijau
        }
    };

    // Handle klik di luar dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fungsi untuk mendapatkan avatar
    const getAvatar = () => {
        if (user?.user_metadata?.avatar_url) {
            return user.user_metadata.avatar_url; // Avatar dari Google Auth
        }
        // Fallback gravatar dari email
        const email = user?.email || "";
        const hash = email ? btoa(email) : "";
        return `https://www.gravatar.com/avatar/${hash}?d=mp`;
    };

    // Fungsi untuk mendapatkan nama pengguna
    const getUserName = () => {
        if (user?.user_metadata?.full_name) {
            return user.user_metadata.full_name; // Nama dari Google Auth
        }
        if (user?.email) {
            return user.email.split('@')[0]; // Username dari email
        }
        return "User"; // Fallback
    };

    // Cek apakah perlu menampilkan header title
    const shouldShowTitle = true; // Ubah menjadi true agar selalu tampil untuk konsistensi

    // Fungsi untuk mendapatkan icon yang sesuai berdasarkan kondisi
    const renderIcon = () => {
        // Tampilkan quiz icon hanya jika di halaman beranda
        if (selectedQuizz && pathname === '/') {
            return (
                <Image
                    src={selectedQuizz.icon}
                    alt="Icon"
                    width={30}
                    height={30}
                    className="xs:size-5 xl:size-10"
                />
            );
        }

        // Untuk halaman lain, tampilkan icon sesuai pathname
        return (
            <div className="xs:size-5 xl:size-10 flex items-center justify-center">
                {pathname === '/profile' && <FiUser className="text-white" size={20} />}
                {pathname === '/auth' && <FiLogOut className="text-white" size={20} />}
                {pathname === '/' && <FiHome className="text-white" size={20} />}
                {!['/', '/auth', '/profile'].includes(pathname) && <FiHome className="text-white" size={20} />}
            </div>
        );
    };

    return (
        <MotionHeader
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn(
                "flex justify-between w-full items-center",
                "relative z-50"
            )}
        >
            {shouldShowTitle && (
                <div className="flex gap-x-4 items-center sm:px-6 sm:py-4">
                    <div
                        className="xs:p-1 p-2 rounded-lg"
                        style={{ backgroundColor: getPageColor() }}
                    >
                        {renderIcon()}
                    </div>
                    <p className="text-dark-blue dark:text-white font-bold xs:text-lg sm:text-xl xl:text-3xl">
                        {getPageTitle()}
                    </p>
                </div>
            )}

            <div className="flex items-center gap-4 ml-auto">
                <SwitchTheme />

                {/* Profile Section */}
                {user && (
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            className="flex items-center gap-2 bg-white dark:bg-slate p-2 rounded-lg shadow-sm"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src={getAvatar()}
                                    alt="User avatar"
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium text-dark-blue dark:text-white truncate max-w-[120px]">
                                    {getUserName()}
                                </div>
                                <div className="text-xs text-gray-navy dark:text-light-blue truncate max-w-[120px]">
                                    {user.email}
                                </div>
                            </div>

                            <motion.div
                                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiChevronDown className="text-dark-blue dark:text-white" />
                            </motion.div>
                        </motion.button>

                        {/* Dropdown Menu dengan Framer Motion */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate rounded-md shadow-lg overflow-hidden z-50"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-medium text-dark-blue dark:text-white">{getUserName()}</p>
                                        <p className="text-xs text-gray-navy dark:text-light-blue truncate">{user.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <motion.a
                                            href="/profile"
                                            className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiUser className="mr-2 h-5 w-5" />
                                            Profil
                                        </motion.a>

                                        <motion.button
                                            className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => signOut().then(() => window.location.href = '/auth')}
                                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiLogOut className="mr-2 h-5 w-5" />
                                            Logout
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </MotionHeader>
    );
};

export default Header;
