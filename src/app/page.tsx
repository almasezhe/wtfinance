'use client'
import JSZip from "jszip";
import CryptoJS from "crypto-js"; // <-- добавляем
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Navbar from "./components/navbar";
import Payment from "./components/payment";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

function encryptData(plainData: string, secretKey: string) {
  return CryptoJS.AES.encrypt(plainData, secretKey).toString();
}

// Функция расшифрования
function decryptData(encryptedData: string, secretKey: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
  
// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Default values
const defaultCompatibilityScore = "101%";
const defaultMonthScore = [33, 44, 48, 60, 70, 78, 90];
const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const defaultLoveAdvice = [
  {
    topic: "Trust",
    message: "A strong relationship is built on trust. Always be honest and open with your partner. 💑",
  },
  {
    topic: "Communication",
    message: "Great relationships thrive on healthy communication. Express your feelings and listen actively. 🗣️❤️",
  },
  {
    topic: "Quality Time",
    message: "Spending meaningful time together strengthens your bond. Even small moments count! ⏳💖",
  },
];
const defaultLoveStory =
  "Once upon a time, on September 1st, 2023, two hearts started exchanging messages. Over time, they shared laughter, stickers, and videos, building memories together. As their bond grew stronger, their chats became filled with emotions, creating an unbreakable connection. And so, their journey continues... ❤️";
const defaultInsights =
  "Your love journey has been 101% compatible so far! Keep cherishing each other. 💑";

// New default values for additional stats
const defaultMostActive = "";
const defaultMostNonchalant = "";
const defaultMostRedFlag = "";
const defaultDominant = "";
const defaultFunnier = "";
const defaultRomantic = "";

// Default for personalized date ideas
const defaultDateIdeas = [
  "You firstly need to pay me 4.99",
  "4.99 and after that you can know!",
  "Try paying first you filthy hacker",
];

// New defaults for virtual romance predictions and gift suggestions
const defaultRomancePredictions = [
  "In 3 months, i except my money!",
  "In 6 months, i am still gonna be waiting for my money",
  "In 12 months, is 5 bucks a really costfull for you bro?"
];
const defaultGiftSuggestions = [
  "For partner A: 5 dollars.",
  "For partner B: A beautifull jacket with 5 dollars in it's pocket",
  "For both: Try paying first!"
];

// Функция для обработки JSON-документа.
function processDocument(doc: any) {
  if (!doc || !Array.isArray(doc.messages)) {
    throw new Error("Invalid document structure");
  }
  const processedMessages = doc.messages.map((msg: any) => ({
    from: msg.from || null,
    date: msg.date || null,
    text: typeof msg.text === "string" ? msg.text : "",
    media_type: msg.media_type || null,
  }));
  return {
    name: doc.name || null,
    type: doc.type || null,
    id: doc.id || null,
    messages: processedMessages,
  };
}

// Функция для обработки HTML-документа.
function processHtmlContent(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const messageElements = doc.querySelectorAll(".message");
  const messages: any[] = [];
  messageElements.forEach((el) => {
    const body = el.querySelector(".body");
    if (!body) return;
    const dateEl = body.querySelector(".pull_right.date.details");
    const date = dateEl ? dateEl.getAttribute("title") || dateEl.textContent?.trim() : null;
    const fromEl = body.querySelector(".from_name");
    const from = fromEl ? fromEl.textContent?.trim() : null;
    const textEl = body.querySelector(".text");
    const text = textEl ? textEl.textContent?.trim() : "";
    const mediaEl = body.querySelector(".media_wrap");
    const media_type = mediaEl ? "media" : null;
    messages.push({ from, date, text, media_type });
  });
  return {
    name: null,
    type: null,
    id: null,
    messages,
  };
}

// Функция для обработки TXT-документа.
function processTxtContent(txt: string) {
  return {
    name: null,
    type: null,
    id: null,
    documentText: txt,
  };
}

function isHtml(content: string): boolean {
  return content.trim().startsWith("<");
}
function isJson(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

// Функция для ограничения сообщений до 2000 токенов (примерно: 1 токен ≈ 4 символа)
function limitMessages(messages: any[], maxTokens: number): any[] {
  let totalTokens = 0;
  const result: any[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const tokenCount = (msg.text ? msg.text.length : 0) / 4;
    if (totalTokens + tokenCount <= maxTokens) {
      totalTokens += tokenCount;
      result.unshift(msg);
    } else {
      break;
    }
  }
  return result;
}

const calculateTimeLeft = () => {
  const targetDate = new Date(2025, 1, 16, 0, 0, 0).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

export default function LoveAI() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  // Состояния для результатов AI
  const [compatibilityScore, setCompatibilityScore] = useState(defaultCompatibilityScore);
  const [realMonthScore, setRealMonthScore] = useState<number[]>(defaultMonthScore);
  const [predictedMonthScore, setPredictedMonthScore] = useState<number[]>([]);
  const [months, setMonths] = useState(defaultMonths);
  const [loveAdvice, setLoveAdvice] = useState(defaultLoveAdvice);
  const [loveStory, setLoveStory] = useState(defaultLoveStory);
  const [insights, setInsights] = useState(defaultInsights);

  // Состояния для дополнительных статистик
  const [mostActive, setMostActive] = useState<string>(defaultMostActive);
  const [mostNonchalant, setMostNonchalant] = useState<string>(defaultMostNonchalant);
  const [mostRedFlag, setMostRedFlag] = useState<string>(defaultMostRedFlag);
  const [dominant, setDominant] = useState<string>(defaultDominant);
  const [funnier, setFunnier] = useState<string>(defaultFunnier);
  const [romantic, setRomantic] = useState<string>(defaultRomantic);

  // Персонализированные идеи для свиданий
  const personalizedDateIdeas = defaultDateIdeas;

  // Дополнительное AI-содержимое:
  const romancePredictions = defaultRomancePredictions;
  const giftSuggestions = defaultGiftSuggestions;

  // UI-состояния
  const [showGraph, setShowGraph] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState("0%");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const slides = [
    {
      title: "WhatsApp",
      images: ["/what1.avif", "/what2.avif", "/what3.avif"],
      description:
        "Open WhatsApp, go to Settings > Chats > Chat history, then choose Export Chat.",
    },
    {
      title: "Telegram",
      images: ["/1.png", "/2.png", "/3.png"],
      description:
        "In Telegram, open the chat, tap on the chat name, and choose Export Chat History to get a file.",
    },
  ];

  // Refs и состояние загруженного файла
  const graphRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [uploadedFileContent, setUploadedFileContent] = useState<string>("");

  // Максимальный размер файла: 10 MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileUpload triggered");
    setErrorMessage("");
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File is too big");
      return;
    }
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.zip') || fileName.endsWith('.dat') || fileName.endsWith('.unknown')) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result instanceof ArrayBuffer) {
          console.log(result);
          try {
            const zip = await JSZip.loadAsync(result);
            let txtFileFound = false;
            for (const name in zip.files) {
              console.log(name);
              if (name.toLowerCase().endsWith('.txt')) {
                const txtContent = await zip.files[name].async("string");
                setUploadedFileContent(txtContent);
                txtFileFound = true;
                break;
              }
            }
            if (!txtFileFound) {
              setErrorMessage("No .txt file found in archive");
            }
          } catch (err) {
            console.error("Error processing zip file:", err);
            setErrorMessage("Error processing zip file");
          }
        } else {
          console.log("File cannot be read as ArrayBuffer");
          setErrorMessage("File cannot be read as ArrayBuffer");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setUploadedFileContent(result);
          console.log("log");
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const savedState = localStorage.getItem("loveAIState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setCompatibilityScore(parsed.compatibilityScore || defaultCompatibilityScore);
      setRealMonthScore(parsed.realMonthScore || defaultMonthScore);
      setPredictedMonthScore(parsed.predictedMonthScore || []);
      setMonths(parsed.months || defaultMonths);
      setLoveAdvice(parsed.loveAdvice || defaultLoveAdvice);
      setLoveStory(parsed.loveStory || defaultLoveStory);
      setInsights(parsed.insights || defaultInsights);
      setMostActive(parsed.mostActive || defaultMostActive);
      setMostNonchalant(parsed.mostNonchalant || defaultMostNonchalant);
      setMostRedFlag(parsed.mostRedFlag || defaultMostRedFlag);
      setDominant(parsed.dominant || defaultDominant);
      setFunnier(parsed.funnier || defaultFunnier);
      setRomantic(parsed.romantic || defaultRomantic);
    }
    const savedDocument = localStorage.getItem("uploadedFileContent");
    if (savedDocument) {
      setUploadedFileContent(savedDocument);
    }
  }, []);

  useEffect(() => {
    const loveAIState = {
      compatibilityScore,
      realMonthScore,
      predictedMonthScore,
      months,
      loveAdvice,
      loveStory,
      insights,
      mostActive,
      mostNonchalant,
      mostRedFlag,
      dominant,
      funnier,
      romantic,
    };
    localStorage.setItem("loveAIState", JSON.stringify(loveAIState));
  }, [
    compatibilityScore,
    realMonthScore,
    predictedMonthScore,
    months,
    loveAdvice,
    loveStory,
    insights,
    mostActive,
    mostNonchalant,
    mostRedFlag,
    dominant,
    funnier,
    romantic,
  ]);

  useEffect(() => {
    if (!showResults) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowGraph(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (graphRef.current) observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, [showResults]);

  useEffect(() => {
    if (!showResults) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProgress(compatibilityScore);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (progressContainerRef.current) observer.observe(progressContainerRef.current);
    return () => observer.disconnect();
  }, [showResults, compatibilityScore]);

  const handleGenerateInsights = async () => {
    if (!uploadedFileContent) {
      setErrorMessage("No file content uploaded");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    try {
      let parsedDoc;
      if (isHtml(uploadedFileContent)) {
        try {
          parsedDoc = processHtmlContent(uploadedFileContent);
        } catch (error) {
          setErrorMessage("Error processing HTML file. Please try again later.");
          setIsLoading(false);
          return;
        }
      } else if (isJson(uploadedFileContent)) {
        try {
          parsedDoc = JSON.parse(uploadedFileContent);
          parsedDoc = processDocument(parsedDoc);
        } catch (error) {
          setErrorMessage("Uploaded file is not a valid JSON");
          setIsLoading(false);
          return;
        }
      } else {
        parsedDoc = processTxtContent(uploadedFileContent);
      }
      if ("messages" in parsedDoc && Array.isArray(parsedDoc.messages)) {
        parsedDoc.messages = limitMessages(parsedDoc.messages, 1700);
      }
      
      const processedData = JSON.stringify(parsedDoc);
      localStorage.setItem("uploadedFileContent", processedData);

      const secretKey = process.env.SECRET_KEY || "akzholgayblyachort1928@`!))__)%2-2505020)%@@_%_205025%@%_@%-2-5-@_%_@5PIDORBLYA@)@)$)$@))@$))suka";
      const encryptedText = encryptData(JSON.stringify({ documentText: processedData }), secretKey);

      const response = await fetch("/api/generateFreeContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedText }),
      });
      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error + ". Please try again later.");
        setIsLoading(false);
        return;
      }
      if (!data.encryptedData) {
        setErrorMessage("No encryptedData in server reply");
        setIsLoading(false);
        return;
      }
      const decryptedServerJson = decryptData(data.encryptedData, secretKey);
      if (!decryptedServerJson) {
        setErrorMessage("Decryption error — possibly wrong key or bad data");
        setIsLoading(false);
        return;
      }
      const generated = JSON.parse(decryptedServerJson);
      setCompatibilityScore(generated.compatibilityScore);
      setRealMonthScore(generated.realMonthScore);
      setPredictedMonthScore(generated.predictedMonthScore);
      setMonths(generated.months);
      setLoveAdvice(generated.loveAdvice);
      setLoveStory(generated.loveStory);
      setInsights(generated.insights);
      setMostActive(generated.mostActive);
      setMostNonchalant(generated.mostNonchalant);
      setMostRedFlag(generated.mostRedFlag);
      setDominant(generated.dominant);
      setFunnier(generated.funnier);
      setRomantic(generated.romantic);
      setShowResults(true);
    } catch (error) {
      console.error("Error generating content:", error);
      setErrorMessage("Error generating content. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  function limitMessages(messages: any[], maxTokens: number): any[] {
    let totalTokens = 0;
    const result: any[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const tokenCount = (msg.text ? msg.text.length : 0) / 4;
      if (totalTokens + tokenCount <= maxTokens) {
        totalTokens += tokenCount;
        result.unshift(msg);
      } else {
        break;
      }
    }
    return result;
  }

  const additionalStats = [
    { title: "Most Active", value: mostActive || "N/A" },
    { title: "Most Nonchalant", value: mostNonchalant || "N/A" },
    { title: "Most Red Flag", value: mostRedFlag || "N/A" },
    { title: "Dominant", value: dominant || "N/A" },
    { title: "Funnier", value: funnier || "N/A" },
    { title: "Romantic", value: romantic || "N/A" },
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Real Relationship Progress (%)",
        data: realMonthScore,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
      {
        label: "Predicted Relationship Progress (%)",
        data: predictedMonthScore,
        fill: true,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        tension: 0.4,
      }
    ],
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-red-200 text-gray-800 min-h-screen">
      <Navbar />

      {/* Main Section */}
      <section id="main" className="flex flex-col lg:flex-row items-center justify-center px-4 sm:px-10 lg:px-24 py-16 sm:py-32 min-h-auto max-w-screen-xl mx-auto gap-8 lg:gap-16">
        <div className="lg:w-2/5 text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-red-600">
            Generating Your <span className="text-pink-500"><u>Love Story.</u></span> 💕
          </h1>
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
            Upload your <b>chat history</b> or answer a few questions, and let AI analyze your{" "}
            <b>relationship progress, give love advice, and even craft a romantic story</b> for you. 🥰
          </p>
        </div>
        <div className="card bg-white text-gray-800 shadow-md p-8 sm:p-16 rounded-lg w-full max-w-lg transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-pink-600">
            Upload Your Love Story 💌 
          </h2>
          <div className="relative mt-6 sm:mt-8">
            <input
              type="file"
              className="file-input file-input-bordered w-full text-slate-500 pr-10"
              onChange={handleFileUpload}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z" />
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Supported file types: .json, .txt, .html. Works well with WhatsApp and Telegram.
              </span>
            </span>
          </div>
          <button
            onClick={handleGenerateInsights}
            className="btn bg-red-500 text-white font-semibold w-full mt-6 sm:mt-8 py-4 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            {isLoading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              "Generate My Love Insights 💖"
            )}
          </button>
        </div>
      </section>

      <section className="py-16 px-8 bg-white text-center shadow-md rounded-lg mx-6 md:mx-20">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">📤 How to Export Your Chat?</h2>
        {/* Slider Container */}
        <div className="relative overflow-hidden max-w-2xl mx-auto">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full p-6">
                <h3 className="text-2xl font-semibold">{slide.title}</h3>
                <div className="my-4 flex flex-wrap justify-center gap-4">
                  {slide.images.map((src, idx) => {
                    let objectPositionClass = "object-center"; // По умолчанию

                    if (src.includes("what1.avif")) {
                      objectPositionClass = "object-top";
                    } else if (src.includes("what2.avif")){
                      objectPositionClass = "object-[60%_80%]";
                    } else if (src.includes("what3.avif")){
                      objectPositionClass = "object-[50%_70%]";
                    }

                    return (
                      <img
                        key={idx}
                        src={src}
                        alt={`${slide.title} Export ${idx}`}
                        className={`w-64 h-40 object-cover ${objectPositionClass} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}
                      />
                    );
                  })}
                </div>
                <p className="text-lg text-gray-700">{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform disabled:opacity-50"
            disabled={currentSlide === 0}
          >
            ⬅️
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform disabled:opacity-50"
            disabled={currentSlide === slides.length - 1}
          >
            ➡️
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-blue-600 scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>

      {showResults && (
        <div className="animate-fade-in">
          {/* Love Insights */}
          <section className="py-16 px-10 text-center bg-pink-500 text-white shadow-md rounded-lg mx-6 md:mx-20">
            <h2 className="text-4xl font-bold mb-6">❤️ AI Relationship Insights</h2>
            <p className="text-xl p-6 rounded-lg shadow-sm">{insights}</p>
          </section>

          <section className="py-16 px-4 bg-white flex flex-col justify-center items-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-pink-600">📈 Relationship Progress</h2>
            <div
              ref={graphRef}
              className={`transition-all duration-1000 ${showGraph ? "opacity-100" : "opacity-0"} w-full md:w-[600px]`}
              style={{ height: "300px", minHeight: "300px" }}
            >
              <div className="w-full h-full flex justify-center items-center">
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </section>

          {/* Additional Stats */}
          <section className="py-16 px-10 text-center bg-pink-50 overflow-hidden relative">
            <h2 className="text-3xl font-bold mb-6 text-red-600">💖 Additional Stats</h2>
            <div className="whitespace-nowrap flex space-x-8 animate-marquee">
              {additionalStats.map((stat, idx) => (
                <div key={idx} className="stat inline-block">
                  <div className="stat-title text-gray-600 font-bold">{stat.title}</div>
                  <div className="stat-value text-pink-500 font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>
            <style jsx>{`
              @keyframes marquee {
                0% {
                  transform: translateX(0%);
                }
                100% {
                  transform: translateX(50%);
                }
              }
              .animate-marquee {
                animation: marquee2 35s linear infinite;
              }
              @media (max-width: 768px) {
                .animate-marquee {
                  animation-duration: 15s !important;
                }
              }
              @media (max-width: 480px) {
                .animate-marquee {
                  animation-duration: 10s !important;
                }
              }
            `}</style>
          </section>

          {/* Relationship Advice */}
          <section className="py-16 px-10 text-center bg-white">
            <h2 className="text-3xl font-bold mb-6 text-pink-600">💡 Relationship Advice</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {loveAdvice.map((advice, idx) => (
                <div key={idx} className="bg-gray-100 p-6 rounded-lg shadow-md w-64 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <h3 className="text-xl font-semibold">{advice.topic}</h3>
                  <p className="text-lg mt-2 text-red-500">{advice.message}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Love Story */}
          <section className="py-16 px-10 text-center bg-gray-100">
            <div className="relative">
              <div className="absolute top-60 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2">
                <h3 className="text-lg text-gray-600 font-bold drop-shadow-lg">
                  Pay once to access all features
                </h3>
                <Payment />
              </div>
              <h2 className="text-3xl font-bold mb-6">📖 Your AI-Generated Love Story</h2>
              <div className="text-xl p-6 rounded-lg shadow-md bg-white text-pink-600">
                {loveStory} <br />
                <div className="glass backdrop-blur-lg bg-white/30 p-6 rounded-lg shadow-md relative overflow-hidden">
                  <svg width="0" height="0">
                    <filter id="blur-filter">
                      <feGaussianBlur stdDeviation="5" />
                    </filter>
                  </svg>
                  <div className="text-pink-600 text-xl filter" style={{ filter: "url(#blur-filter)", maxWidth: "100%", overflowWrap: "break-word", whiteSpace: "normal" }}>
                    🔮 <b>Did you really think you could unveil the mystery?</b> 😏 Messing with DevTools? Inspecting the source code? Trying to remove the blur? 
                    <b>Cute, but absolutely useless.</b> This text is hidden behind layers you cannot peel away so easily.
                    <br /><br />
                    The blur isn’t just an effect—it’s <b>a lesson.</b> A barrier between <b>you and the truth.</b> You can see, but not understand. 
                    You can reach, but never grasp. <b>Frustrating, isn’t it?</b> It’s right there, yet forever out of reach. The harder you try, the more distant it feels.
                    <br /><br />
                    💰 <b>But there’s always a way out.</b> You know what it is. <b>Everything has a price.</b> You can’t escape that simple truth. 
                    Nothing in life is ever truly free. <b>You must give to receive.</b>
                    <br /><br />
                    And yet… you hesitate. <b>You refuse?</b> 🫢 What’s wrong? Are you afraid? Or are you just… cheap? 
                    <b>You wouldn’t even unlock this for her?</b> 😳 Your girl? Your soulmate? The one you claim to love? 💞
                    <br /><br />
                    Damn. <b>That’s actually embarrassing.</b> 💀 No gifts, no surprises, and now… not even this? Not even the smallest effort? <b>Pathetic.</b>
                    <br /><br />
                    Maybe you’re just broke. <b>Or maybe you’re heartless.</b> 💔 Which is it? <b>Choose wisely.</b>
                    <br /><br />
                    🔓 <b>Or perhaps... you do want to pay?</b> The choice is yours. <b>Prove yourself.</b>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Personalized Date Ideas */}
          <section className="py-16 px-10 text-center bg-white overflow-hidden relative">
            <div className="relative">
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2">
                <h3 className="text-lg text-gray-600 font-bold drop-shadow-lg">
                  Pay once to access all features
                </h3>
                <Payment />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-pink-600">💡 Personalized Date Ideas</h2>
              <div className="relative overflow-hidden glass backdrop-blur-lg bg-white/30 p-6 rounded-lg shadow-md inline-block">
                <svg width="0" height="0">
                  <filter id="blur-filter-ideas">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                </svg>
                <div className="whitespace-nowrap flex space-x-8 animate-marquee2 filter text-gray-700" style={{ filter: "url(#blur-filter-ideas)" }}>
                  {personalizedDateIdeas.concat(personalizedDateIdeas).map((idea, idx) => (
                    <div key={idx} className="inline-block bg-pink-100 px-4 py-2 rounded-lg shadow-md border border-pink-300">
                      {idea}
                    </div>
                  ))}
                </div>
              </div>
              <style jsx>{`
                @keyframes marquee2 {
                  0% {
                    transform: translateX(-50%);
                  }
                  100% {
                    transform: translateX(0%);
                  }
                }
                .animate-marquee2 {
                  animation: marquee2 35s linear infinite;
                }
                @media (max-width: 768px) {
                  .animate-marquee2 {
                    animation-duration: 15s !important;
                  }
                }
                @media (max-width: 480px) {
                  .animate-marquee2 {
                    animation-duration: 10s !important;
                  }
                }
              `}</style>
            </div>
          </section>

          {/* Virtual Romance Predictions */}
          <section className="py-16 px-10 text-center bg-white">
            <div className="relative">
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2">
                <h3 className="text-lg text-gray-600 font-bold drop-shadow-lg">
                  Pay once to access all features
                </h3>
                <Payment />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-pink-600">💘 Romance Predictions(3|6|12-months)</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <svg width="0" height="0">
                  <filter id="blur-filter-ideas">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </svg>
                {Array.isArray(romancePredictions) ? (
                  romancePredictions.map((prediction, idx) => (
                    <div key={idx} className="bg-purple-100 p-6 rounded-lg shadow-md w-80">
                      <p className="text-lg text-gray-700 filter" style={{ filter: "url(#blur-filter-ideas)" }}>
                        {prediction}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-purple-100 p-6 rounded-lg shadow-md w-80">
                    <p className="text-lg text-gray-700 filter" style={{ filter: "url(#blur-filter-ideas)" }}>{romancePredictions}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Evaluating the Perfect Gift */}
          <section className="py-16 px-10 text-center bg-white relative">
            <h2 className="text-3xl font-bold mb-6 text-pink-600">🎁 Evaluating the Perfect Gift</h2>
            <div className="relative">
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2">
                <h3 className="text-lg text-gray-600 font-bold drop-shadow-lg">
                  Pay once to access all features
                </h3>
                <Payment />
              </div>
              <div className="flex flex-col items-center gap-4">
                <svg width="0" height="0">
                  <filter id="blur-filter-ideas">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </svg>
                {giftSuggestions.length > 0 ? (
                  giftSuggestions.map((gift, idx) => (
                    <div key={idx} className="bg-green-100 text-gray-700 px-4 py-2 rounded-lg shadow-md border border-green-300 filter" style={{ filter: "url(#blur-filter-ideas)" }}>
                      {gift}
                    </div>
                  ))
                ) : (
                  <p className="text-lg">N/A</p>
                )}
              </div>
            </div>
          </section>

          <div className="divider divider-primary"></div>
          <section className="py-16 px-10 text-center bg-white">
            <h2 className="text-3xl font-bold mb-6">💞 Compatibility Score</h2>
            <div ref={progressContainerRef} className="w-full max-w-lg mx-auto bg-gray-300 rounded-full h-6 overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-600" style={{ width: progress, transition: "width 1.5s ease-in-out" }}></div>
            </div>
            <p className="text-xl font-semibold mt-4">
              You & Your Partner: <b>{compatibilityScore} Soulmates!</b> 💘
            </p>
          </section>
          
        </div>
      )}
            <section className="py-16 px-10 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6 text-pink-600">💖 Limited Valentine’s Day Offer</h2>
        <p className="text-lg text-gray-700 mb-4">Unlock the full experience with a special 50% discount! ❤️</p>
        <div className="flex justify-center items-center gap-2 text-gray-800 font-mono text-2xl mb-4">
          <span className="countdown"><span style={{ "--value": timeLeft.days } as React.CSSProperties}></span>d</span>
          <span className="countdown"><span style={{ "--value": timeLeft.hours } as React.CSSProperties}></span>h</span>
          <span className="countdown"><span style={{ "--value": timeLeft.minutes } as React.CSSProperties}></span>m</span>
          <span className="countdown"><span style={{ "--value": timeLeft.seconds } as React.CSSProperties}></span>s</span>
        </div>
        <div id="price" className="relative inline-block group transition-transform duration-300">
          <Payment />
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-red-500 text-white py-8 mt-10 text-center">
        <h2 className="text-2xl font-semibold">LoverTest.AI ❤️</h2>
        <p className="text-gray-300 text-sm max-w-2xl mx-auto">
          Your <b>AI-powered romance analyzer & story generator.</b> Celebrate your love journey today!
        </p>
        <p className="text-gray-200 text-sm mt-6">&copy; {new Date().getFullYear()} LoverTest.AI. All rights reserved.</p>
        {/* Ссылка для открытия модального окна с юридической информацией */}
        <button
          onClick={() => setIsLegalModalOpen(true)}
          className="mt-4 underline text-sm hover:text-gray-300"
        >
          Legal Information
        </button>
      </footer>

      {/* Модальное окно с юридической информацией */}
      {isLegalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsLegalModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6">Legal Information</h2>
            {/* Terms of Service */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2">Terms of Service</h3>
              <p><strong>Effective Date:</strong> February 14, 2025</p>
              <ol className="list-decimal ml-6 mt-4 space-y-2">
                <li><strong>Acceptance of Terms:</strong> Welcome to LoverTest.AI (“Service”, “Site”). By accessing or using our Service, you agree to be bound by these Terms of Service (“Terms”). If you do not agree with any part of these Terms, please do not use our Service.</li>
                <li><strong>Changes to Terms:</strong> LoverTest.AI reserves the right to modify these Terms at any time. All changes will be effective upon posting to the Site. Your continued use of the Service constitutes acceptance of such modifications.</li>
                <li><strong>Eligibility:</strong> You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that you meet this age requirement.</li>
                <li><strong>Access and Usage:</strong> LoverTest.AI does not require the creation of user accounts or login credentials to access the Service. All features of the Service are available without registration.</li>
                <li><strong>Payment Terms:</strong> Certain features of the Service require payment. By providing payment information, you represent that you are authorized to use the payment method. All payments are processed securely via our third-party payment provider. Please review our Refund Policy for details regarding payment reversals.</li>
                <li><strong>User Conduct:</strong> You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else’s use of the Service.</li>
                <li><strong>Intellectual Property:</strong> All content on the Service, including text, graphics, logos, images, and software, is the property of LoverTest.AI or its licensors and is protected by applicable intellectual property laws.</li>
                <li><strong>Disclaimer of Warranties:</strong> The Service is provided “as is” and “as available” without any warranties of any kind, whether express or implied.</li>
                <li><strong>Limitation of Liability:</strong> In no event shall LoverTest.AI, its affiliates, or their respective officers, directors, or employees be liable for any indirect, incidental, special, consequential, or punitive damages arising from or in connection with your use of the Service.</li>
                <li><strong>Indemnification:</strong> You agree to indemnify and hold harmless LoverTest.AI and its affiliates from any claims, losses, liabilities, or expenses (including reasonable attorneys’ fees) arising from your use of the Service or violation of these Terms.</li>
                <li><strong>Governing Law and Dispute Resolution:</strong> These Terms shall be governed by and construed in accordance with the laws of [Insert Jurisdiction]. Any disputes shall be resolved through binding arbitration in [Insert Location], except where prohibited by applicable law.</li>
                <li><strong>Contact Information:</strong> For any questions regarding these Terms, please contact us at: assetalmas07@gmail.com.</li>
              </ol>
            </div>
            {/* Privacy Notice */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2">Privacy Notice</h3>
              <p><strong>Effective Date:</strong> February 14, 2025</p>
              <ol className="list-decimal ml-6 mt-4 space-y-2">
                <li><strong>Information We Collect:</strong> We may collect personal information such as your name, email address, payment details, usage data (including IP address, browser type, device information, and pages visited) and use cookies and similar technologies to enhance your experience.</li>
                <li><strong>How We Use Your Information:</strong> We use your information to provide, maintain, and improve our Service; process transactions; personalize your experience; and monitor usage patterns.</li>
                <li><strong>Sharing and Disclosure:</strong> Your data is not sold or rented to third parties. It may be shared with trusted service providers under strict confidentiality obligations or as required by law.</li>
                <li><strong>Data Security:</strong> We implement reasonable measures to protect your data, though no method of transmission over the Internet is completely secure.</li>
                <li><strong>Your Rights and Choices:</strong> You have the right to access, update, or delete your personal information by contacting us directly. Disabling cookies via your browser may affect the functionality of the Service.</li>
                <li><strong>International Data Transfers:</strong> Your information may be transferred to servers outside your country of residence. By using our Service, you consent to such transfers.</li>
                <li><strong>Changes to This Privacy Notice:</strong> Updates to this Notice will be posted on our Site and your continued use of the Service signifies acceptance of the changes.</li>
                <li><strong>Contact Information:</strong> For any inquiries, please contact us at: assetalmas07@gmail.com.</li>
              </ol>
            </div>
            {/* Refund Policy */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2">Refund Policy</h3>
              <p><strong>Effective Date:</strong> February 14, 2025</p>
              <ol className="list-decimal ml-6 mt-4 space-y-2">
                <li><strong>Eligibility for Refunds:</strong> Refunds apply to digital products or services purchased directly from LoverTest.AI. Requests must be submitted within [30] days of purchase.</li>
                <li><strong>Refund Process:</strong> To request a refund, contact our support team at assetalmas07@gmail.com with your order number and detailed explanation. We will respond within [7–10] business days. If approved, the refund will be issued within [10] business days to the original payment method.</li>
                <li><strong>Non-Refundable Items:</strong> Certain items, such as partially used subscriptions or promotional offers, may be non-refundable and will be clearly identified at the time of purchase.</li>
                <li><strong>Cancellation Policy:</strong> You may cancel your subscription at any time; however, charges already incurred will not be refunded.</li>
                <li><strong>Dispute Resolution:</strong> If you are dissatisfied with your refund request outcome, please contact our support team at assetalmas07@gmail.com. Unresolved disputes will be handled according to our Terms of Service.</li>
                <li><strong>Contact Information:</strong> For any questions regarding this Refund Policy, please contact us at: assetalmas07@gmail.com.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
