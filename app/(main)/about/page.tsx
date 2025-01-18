"use client";

import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="bg-white text-black min-h-[70vh] flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-4xl font-bold text-[#16A34A]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        kiyu Nahi Ho Rahi Padhai ??
      </motion.h1>
      <motion.p
        className="text-2xl px-64 mt-6 font-semibold w-screen text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Padhai ka scene tight karne ka time aa gaya hai!{" "}
        <span className="font-extrabold">Skillable</span> ke saath, padhai ko
        banaye fun aur competitive. 📚🚀 Blockchain-powered platform par apni
        skills upgrade karo, challenges complete karo, aur rewards kamao—ekdum
        Web3 swag ke saath. 🏆 Ab boring methods ko bolo bye-bye, aur Skillable
        par apne doston ke saath competition ka mazza lo. Skill karo, thrill
        karo, aur leaderboard ka king bano! 😎
      </motion.p>
    </div>
  );
};

export default AboutUs;
