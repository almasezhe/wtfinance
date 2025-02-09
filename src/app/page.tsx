'use client'

import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-[#F4F4F4] to-[#E0E0E0] text-[#333] min-h-screen">
      <Navbar />
      <section className="flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 py-32 min-h-screen max-w-screen-xl mx-auto gap-16 lg:gap-32">

        {/* 🔥 Left Content */}
        <div className="lg:w-2/5 text-center lg:text-left">
          <h1 className="text-6xl font-bold leading-tight">
            AI <span className="text-[#E67E22]"><u>Roasts</u></span> Your Finances.
          </h1>
          <p className="mt-8 text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
            Drop your <b>annual report</b>, and let AI <b>roast your spending habits</b> before actually giving you <b>smart financial advice</b>.
          </p>
        </div>

        {/* 📂 Upload Box - Now Larger & More Spaced Out */}
        <div className="card bg-white text-[#333] shadow-md p-16 rounded-lg w-full max-w-lg mt-12 lg:mt-0 lg:w-2/5 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-semibold text-center lg:text-left">Upload Your Annual Report</h2>
          <input
            type="file"
            className="file-input file-input-bordered text-slate-50 w-full mt-8"
          />
          <button className="btn bg-[#E67E22] text-slate-50 font-semibold w-full mt-8 py-4 rounded-lg hover:scale-105 transition-transform duration-300">
            Roast My Spending 🔥
          </button>
        </div>

      </section>
        {/* ✅ Why Choose Us */}
        <section id="whyus" className="py-16 px-10 text-center bg-white text-[#333]">
          <h2 className="text-3xl font-bold mb-8">Why Get Roasted?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-lg mx-auto">

            <div className="p-6 rounded-lg bg-[#F4F4F4] text-[#333] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#E67E22] hover:text-white">
              <h3 className="text-xl font-semibold">Brutal Honesty</h3>
              <p className="mt-3">Your AI roast will <b>hurt</b>, but you need it.</p>
            </div>

            <div className="p-6 rounded-lg bg-[#F4F4F4] text-[#333] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#E67E22] hover:text-white">
              <h3 className="text-xl font-semibold">Smart Insights</h3>
              <p className="mt-3">Get <b>real financial advice</b> after the roast.</p>
            </div>

            <div className="p-6 rounded-lg bg-[#F4F4F4] text-[#333] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#E67E22] hover:text-white">
              <h3 className="text-xl font-semibold">One-Time & Free</h3>
              <p className="mt-3">No signup. No spam. Just a <b>good roast.</b></p>
            </div>

          </div>
        </section>


{/* 🔥 Before & After Section */}
<section id="before" className="py-16 px-10 text-center bg-gradient-to-tr from-[#F4F4F4] to-[#D6D6D6] text-[#333]">
  <h2 className="text-3xl font-bold mb-8">Before & After: The Roast Effect</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
    
    {/* Before Card */}
    <div className="group p-6 bg-white shadow-md rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#E67E22] hover:text-white">
      <h3 className="text-xl font-semibold text-[#2C3E50] transition-colors duration-300 group-hover:text-white">
        Before the Roast 🤡
      </h3>
      <p className="mt-3 text-lg transition-colors duration-75 group-hover:text-white">
        Spent $600 on Starbucks. Subscribed to <b>10+ streaming services</b>. Still broke.
      </p>
    </div>

    {/* After Card */}
    <div className="group p-6 bg-white shadow-md rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#E67E22] hover:text-white">
      <h3 className="text-xl font-semibold text-[#2C3E50] transition-colors duration-300 group-hover:text-white">
        After the Advice 🚀
      </h3>
      <p className="mt-3 text-lg transition-colors duration-75 group-hover:text-white">
        Cut spending by <b>40%</b>. Invested in ETFs. Finally saving for a vacation.
      </p>
    </div>

  </div>
  <p className="mt-5 text-base text-[#3f3f3f]"><b>Bolat Akzhol</b></p>
</section>



      {/* 📝 Why I Created This Website */}
      <section id="about" className="py-16 px-10 bg-white text-[#333]">
        <div className="max-w-screen-lg mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-10">

          {/* Photo (Replace with your actual image) */}
          <div className="relative w-48 h-48">
      <div className="w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-[#E67E22] p-1">
        <img 
          src="/logo.jpg" 
          alt="Asset Almas" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>

          {/* Text Content */}
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Why I Created This Website</h2>
            <p className="text-lg leading-relaxed">
              We all struggle with <b>managing money</b>, and keeping track of expenses  
              is often <b>time-consuming and overwhelming</b>. Budgeting spreadsheets and  
              manual tracking can be <b>boring and frustrating</b>.  
              <br /><br />
              I wanted to create a <b>simple, fast, and fun</b> tool that helps you see   
              <b> where your money goes</b> without the headache. Instead of spending  
              hours analyzing numbers, just <b>upload your financial report</b>,  
              <b> get roasted</b>, and receive <b>personalized financial advice</b> in seconds.  
            </p>
            <p className="mt-4 font-semibold">— Asset Almas</p>
          </div>
        </div>
      </section>


      {/* 🎁 Financial Tips */}
      <section id="fintip" className="-mt-5 py-16 px-10 text-center bg-white text-[#333]">
        <h2 className="text-3xl font-bold mb-4">Want More Financial Tips?</h2>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed">
          Get a <b>free PDF guide</b> on <b>"How to Save Money & Still Have Fun"</b> directly to your inbox.  
        </p>
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="input text-slate-50 input-bordered w-full max-w-md mt-4"
        />
        <button className="btn bg-[#E67E22] text-white font-semibold mt-4">
          📩 Get My Free Guide
        </button>
      </section>

      {/* 📢 Footer */}
      <footer className="bg-gray-950 text-white py-8 mt-10">
        <div className="container mx-auto text-center max-w-screen-lg">
          <h2 className="text-2xl font-semibold mb-4">WTFinance?</h2>
          <p className="text-gray-300 text-sm max-w-2xl mx-auto">
            Your <b>AI-powered financial roast and advice tool</b>. No judgment, just brutal honesty. 
            Laugh at your mistakes, then fix them.
          </p>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Github</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Creator</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm mt-6">
            &copy; {new Date().getFullYear()} WTFinance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
