// NotFoundPage.js dengan animasi menggunakan framer-motion
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "./PageWrapper";
import Header from "../components/common/Header";

const NotFoundPage = () => {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-auto relative z-10">
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 min-h-screen flex items-center justify-center ">
          <div className="text-center">
            <motion.h1
              className="text-6xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              404
            </motion.h1>
            <motion.p
              className="mt-4 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Oops! The page you are looking for does not exist.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                to="/overview"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};

export default NotFoundPage;
