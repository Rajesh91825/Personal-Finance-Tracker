import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900">
      <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-10 lg:px-20 py-24 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white">
        <div className="flex-1 space-y-6">
          <h1 className="text-6xl font-extrabold leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            A modern finance tracker to manage your{" "}
            <span className="font-semibold">income, expenses, and savings</span>.  
            Gain insights, track trends, and make smarter financial decisions.
          </p>
          <div className="flex gap-6">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition text-lg"
            >
              🔑 Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow hover:bg-yellow-300 transition text-lg"
            >
              📝 Register
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center mt-12 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6213/6213456.png"
            alt="Finance Illustration"
            className="w-[480px] drop-shadow-2xl"
          />
        </div>
      </section>

      <section className="w-full py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose <span className="text-indigo-600">FinTrack</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 lg:px-20">
          <div className="p-8 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-indigo-600 text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold mb-2">Track Spending</h3>
            <p className="text-gray-600">
              Monitor expenses across categories and time with ease.
            </p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-4">💳</div>
            <h3 className="text-2xl font-semibold mb-2">Manage Budgets</h3>
            <p className="text-gray-600">
              Stay in control with budgeting tools and expense limits.
            </p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-purple-600 text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-semibold mb-2">Gain Insights</h3>
            <p className="text-gray-600">
              Visual analytics to uncover saving opportunities and trends.
            </p>
          </div>
        </div>
      </section>

      <footer className="w-full py-6 bg-gray-900 text-gray-400 text-center">
        © {new Date().getFullYear()} FinTrack · All Rights Reserved
      </footer>
    </div>
  );
}
