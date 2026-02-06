import { motion } from "framer-motion";

export const TuluLogo = ({ className = "w-15 h-15" }: { className?: string }) => {
    return (
        <div className={`relative ${className} flex items-center justify-center`}>
            <img
                src="/tulu_logo_bg.png"
                alt="Tulu Kalpuga Logo"
                className="w-full h-full object-contain drop-shadow-sm"
            />
        </div>
    );
};
