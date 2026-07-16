import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-y-6">
            <h1 className="text-5xl font-bold mb-6">404 - Not Found</h1>
            <p className="mb-8 text-lg text-gray-400">Oops! The page you’re looking for doesn’t exist.</p>
            <Link
                to="/"
                className="px-5 py-1 rounded bg-[#2ECC71] text-white font-semibold transition-all duration-300 hover:brightness-110 shadow-lg"
            >
                Go Home
            </Link>
        </div>
    );
}
