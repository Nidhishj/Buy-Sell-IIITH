
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
            <motion.h1 
                className="text-5xl font-extrabold mb-4 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Welcome to <span className="text-yellow-400">BechKhao@IIITH</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p 
                className="text-xl italic opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                Buy & Sell effortlessly at IIITH
            </motion.p>

            {/* Animated Buttons */}
            <motion.div 
                className="flex mt-10 space-x-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-lg rounded-lg py-3 px-6 transition-all shadow-md hover:shadow-lg"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                <button 
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-lg rounded-lg py-3 px-6 transition-all shadow-md hover:shadow-lg"
                    onClick={() => navigate('/signup')}
                >
                    Signup
                </button>
            </motion.div>
        </div>
    );
};

export default Welcome;
