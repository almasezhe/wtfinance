'use client'
import CryptoJS from "crypto-js"; // <-- добавляем
import JSZip from "jszip";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Navbar from "../components/navbar";
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


//TODO
// ZIP file загрузка

function encryptData(plainData: string, secretKey: string) {
    return CryptoJS.AES.encrypt(plainData, secretKey).toString();
  
}

// И функцию расшифрования
function decryptData(encryptedData: string, secretKey: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
   return bytes.toString(CryptoJS.enc.Utf8);
  }
  
// ✅ Register Chart.js components
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

const calculateTimeLeft = () => {
  const targetDate = new Date("2024-02-16T00:00:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};
export default function LoveAI() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  // States for AI results
  const [compatibilityScore, setCompatibilityScore] = useState(defaultCompatibilityScore);
  const [realMonthScore, setRealMonthScore] = useState<number[]>(defaultMonthScore);
  const [predictedMonthScore, setPredictedMonthScore] = useState<number[]>([]);
  const [months, setMonths] = useState(defaultMonths);
  const [loveAdvice, setLoveAdvice] = useState(defaultLoveAdvice);
  const [loveStory, setLoveStory] = useState(defaultLoveStory);
  const [insights, setInsights] = useState(defaultInsights);

  // States for additional stats
  const [mostActive, setMostActive] = useState<string>(defaultMostActive);
  const [mostNonchalant, setMostNonchalant] = useState<string>(defaultMostNonchalant);
  const [mostRedFlag, setMostRedFlag] = useState<string>(defaultMostRedFlag);
  const [dominant, setDominant] = useState<string>(defaultDominant);
  const [funnier, setFunnier] = useState<string>(defaultFunnier);
  const [romantic, setRomantic] = useState<string>(defaultRomantic);
  const [paymentNotification, setPaymentNotification] = useState(false);

  // Personalized Date Ideas
  const [personalizedDateIdeas, setPersonalizedDateIdeas] = useState<string[]>(defaultDateIdeas);

  // New states for additional AI-generated content:
  const [romancePredictions, setRomancePredictions] = useState<string[]>(defaultRomancePredictions);
  const [giftSuggestions, setGiftSuggestions] = useState<string[]>(defaultGiftSuggestions);

  // UI states
  const [showGraph, setShowGraph] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState("0%");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [isLoadingGPT, setisLoadingGPT] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Refs and uploaded file state
  const graphRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [uploadedFileContent, setUploadedFileContent] = useState<string>("");

  // Maximum file size: 10 MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Если в localStorage есть данные оплаты – показываем уведомление
      setPaymentNotification(true);
      // Можно удалить данные об оплате, если они больше не нужны:
      // localStorage.removeItem("paymentData");
      setTimeout(() => {
        setPaymentNotification(false);
      }, 3000); // уведомление скрывается через 3 секунды
      setisLoadingGPT(true);
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
      setPersonalizedDateIdeas(parsed.personalizedDateIdeas || defaultDateIdeas);
      setRomancePredictions(parsed.romancePredictions || defaultRomancePredictions);
      setGiftSuggestions(parsed.giftSuggestions || defaultGiftSuggestions);
    }
  }, []);
  useEffect(() => {
  async function fetchPaidContent() {
    const documentText = localStorage.getItem("uploadedFileContent");
    if (!documentText) return;

    // Ограничим documentText до, скажем, 8000 символов (примерно 2000 токенов)
    const MAX_DOCUMENT_LENGTH = 8000;
    let trimmedDocumentText = documentText;
    if (documentText.length > MAX_DOCUMENT_LENGTH) {
      trimmedDocumentText = documentText.slice(0, MAX_DOCUMENT_LENGTH);
    }

    // Здесь используем тот же секретный ключ, что и на сервере
    const secretKey =
      process.env.SECRET_KEY ||
      "akzholgayblyachort1928@`!))__)%2-2505020)%@@_%_205025%@%_@%-2-5-@_%_@5PIDORBLYA@)@)$)$@))@$))suka";
    
    // Если документ содержит данные в формате чата с messages, можно попробовать ограничить их:
    let payload;
    try {
      const parsed = JSON.parse(trimmedDocumentText);
      if (parsed.messages && Array.isArray(parsed.messages)) {
        // Ограничиваем количество токенов для массива сообщений
        const tokenLimit = 2000; // максимум токенов
        // Функция limitMessages уже у тебя есть
        parsed.messages = limitMessages(parsed.messages, tokenLimit);
      }
      // После обработки преобразуем обратно в строку
      payload = JSON.stringify(parsed);
    } catch (e) {
      // Если не получилось распарсить JSON, используем обрезанный текст
      payload = trimmedDocumentText;
    }

    // Формируем данные для шифрования
    const encryptedText = encryptData(
      JSON.stringify({ documentText: payload }),
      secretKey
    );
    try {
      const response = await fetch("/api/generatePaidContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedText }),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Error from generatePaidContent:", data.error);
        return;
      }
      if (!data.encryptedData) {
        console.error("No encryptedData received");
        return;
      }
      const decryptedServerJson = decryptData(data.encryptedData, secretKey);
      if (!decryptedServerJson) {
        console.error("Decryption error");
        return;
      }
      const generated = JSON.parse(decryptedServerJson);

      // Обновляем стейты (если нужны объединения, можно делать merge, а тут просто замена)
      setLoveStory(generated.loveStory || loveStory);
      setRomantic(generated.romantic || romantic);
      if (generated.personalizedDateIdeas) {
        setPersonalizedDateIdeas(generated.personalizedDateIdeas);
      }
      if (generated.romancePredictions) {
        setRomancePredictions(
          Array.isArray(generated.romancePredictions)
            ? generated.romancePredictions
            : [generated.romancePredictions]
        );
      }
      if (generated.giftSuggestions) {
        setGiftSuggestions(generated.giftSuggestions);
      }
      setShowResults(true);
      setisLoadingGPT(false);
    } catch (error) {
      console.error("Error fetching paid content:", error);
    }
  }
  fetchPaidContent();
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
          // Если документ соответствует формату чата, обрабатываем его через processDocument
          if (parsedDoc.messages) {
            parsedDoc = processDocument(parsedDoc);
          }
        } catch (error) {
          setErrorMessage("Uploaded file is not a valid JSON");
          setIsLoading(false);
          return;
        }
      } else {
        // Если не JSON и не HTML – обрабатываем как TXT
        parsedDoc = processTxtContent(uploadedFileContent);
      }
    
      // Ограничиваем количество токенов
      const tokenLimit = 2000; // максимум токенов (напр. 2000)
      const maxChars = tokenLimit * 4; // примерно 4 символа на токен
    
      if (parsedDoc && Array.isArray(parsedDoc.messages)) {
        // Если у нас чат (массив сообщений) – используем limitMessages
        parsedDoc.messages = limitMessages(parsedDoc.messages, tokenLimit);
      } else {
        // Если структура другая, ограничим всю JSON-строку
        let processedData = JSON.stringify(parsedDoc);
        if (processedData.length > maxChars) {
          // Просто обрежем строку до maxChars
          processedData = processedData.slice(0, maxChars);
          // Можно попытаться привести к валидному JSON, но это не всегда получится.
          // Поэтому здесь мы просто используем обрезанную строку.
          parsedDoc = { trimmedDocument: processedData };
        }
      }
      // Ограничиваем documentText до, скажем, 8000 символов (примерно 2000 токенов)

      // Готовим данные для отправки
      const processedData = JSON.stringify(parsedDoc);
      const MAX_DOCUMENT_LENGTH = 8000;
let trimmedDocumentText = processedData;
if (processedData.length > MAX_DOCUMENT_LENGTH) {
  trimmedDocumentText = processedData.slice(0, MAX_DOCUMENT_LENGTH);
}

      const secretKey =
        process.env.SECRET_KEY ||
        "akzholgayblyachort1928@`!))__)%2-2505020)%@@_%_205025%@%_@%-2-5-@_%_@5PIDORBLYA@)@)$)$@))@$))suka";
      const encryptedText = encryptData(
        JSON.stringify({ documentText: trimmedDocumentText }),
        secretKey
      );
    
      const response = await fetch("/api/generateTillEnd", {
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
    
      // Обновляем стейты
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
      setLoveStory(generated.loveStory);
      if (generated.personalizedDateIdeas) {
        setPersonalizedDateIdeas(generated.personalizedDateIdeas);
      }
      if (generated.romancePredictions) {
        setRomancePredictions(
          Array.isArray(generated.romancePredictions)
            ? generated.romancePredictions
            : [generated.romancePredictions]
        );
      }
      if (generated.giftSuggestions) {
        setGiftSuggestions(generated.giftSuggestions);
      }
      setShowResults(true);
    } catch (error) {
      console.error("Error generating content:", error);
      setErrorMessage("Error generating content. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // Функция ограничения сообщений до заданного количества токенов (~2000 токенов, 1 токен ≈ 4 символа)
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

  // Additional stats array
  const additionalStats = [
    { title: "Most Active", value: mostActive || "N/A" },
    { title: "Most Nonchalant", value: mostNonchalant || "N/A" },
    { title: "Most Red Flag", value: mostRedFlag || "N/A" },
    { title: "Dominant", value: dominant || "N/A" },
    { title: "Funnier", value: funnier || "N/A" },
    { title: "Romantic", value: romantic || "N/A" },
  ];

  // Chart data
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
      {paymentNotification && (
        <div className="fixed top-0 left-0 right-0 p-4 bg-green-500 text-white text-center z-50">
          The payment was successful! Wait for the response to be generated
        </div>
      )}
      <section className="flex flex-col lg:flex-row items-center justify-center px-4 sm:px-10 lg:px-24 py-16 sm:py-32 min-h-auto max-w-screen-xl mx-auto gap-8 lg:gap-16">
        {/* Левая часть */}
        <div id="main" className="lg:w-2/5 text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-red-600">
            Generating Your <span className="text-pink-500"><u>Love Story.</u></span> 💕
          </h1>
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
            Upload your <b>chat history</b> or answer a few questions, and let AI analyze your{" "}
            <b>relationship progress, give love advice, and even craft a romantic story</b> for you. 🥰
          </p>
        </div>
        {/* Правая часть (карточка) */}
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
{
  isLoading ? (
    <span className="loading loading-dots loading-md"></span>
  ) : isLoadingGPT ? (
    <span className="loading loading-dots loading-xs">

    </span>
    
  ) : (
    "Generate My Love Insights 💖"
  )
}

          </button>
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



{/* Additional Stats: Horizontal Scrolling Marquee */}
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
      animation-duration: 15s !important; /* В 2 раза быстрее на мобилках */
    }
  }
  
  @media (max-width: 480px) {
    .animate-marquee {
      animation-duration: 10s !important; /* Ещё быстрее на очень маленьких экранах */
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
  <h2 className="text-3xl font-bold mb-6">📖 Your AI-Generated Love Story</h2>
  <div className="text-xl p-6 rounded-lg shadow-md bg-white text-pink-600">
    {loveStory}
    </div>
</section>

{/* Personalized Date Ideas (Marquee) */}
<section className="py-16 px-10 text-center bg-white overflow-hidden relative">
  <h2 className="text-3xl font-bold mb-6 text-pink-600">💡 Personalized Date Ideas</h2>
    <div
      className="whitespace-nowrap flex space-x-8 animate-marquee2 filter text-gray-700"
    >
      {personalizedDateIdeas.concat(personalizedDateIdeas).map((idea, idx) => (
        <div
          key={idx}
          className="inline-block bg-pink-100 px-4 py-2 rounded-lg shadow-md border border-pink-300"
        >
          {idea}
        </div>
      ))}
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
</section>


                    {/* Virtual Romance Predictions: 3 Cards */}
                    <section className="py-16 px-10 text-center bg-white">
            <h2 className="text-3xl font-bold mb-6 text-pink-600">💘 Romance Predictions(3|6|12-months)</h2>
            <div className="flex flex-wrap justify-center gap-6">

              {Array.isArray(romancePredictions) ? (
                romancePredictions.map((prediction, idx) => (
                  <div key={idx} className="bg-purple-100 p-6 rounded-lg shadow-md w-80  transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <p className="text-lg text-gray-700">
                      {prediction}</p>
                  </div>
                ))
              ) : (
                <div className="bg-purple-100 p-6 rounded-lg shadow-md w-80">
                  <p className="text-lg text-gray-700">{romancePredictions} </p>
                </div>
              )}
            </div>
          </section>

          {/* Evaluating the Perfect Gift 🎁 */}
          <section className="py-16 px-10 text-center bg-white">
            <h2 className="text-3xl font-bold mb-6 text-pink-600">🎁 Evaluating the Perfect Gift</h2>
            
            <div className="flex flex-col items-center gap-4">
              {giftSuggestions.length > 0 ? (
                giftSuggestions.map((gift, idx) => (
                  <div key={idx} className="bg-green-100 text-gray-700 px-4 py-2 rounded-lg shadow-md border border-green-300  transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    {gift}
                  </div>
                ))
              ) : (
                <p className="text-lg">N/A</p>
              )}
            </div>
          </section>
<div className="divider divider-primary"></div>
          {/* Compatibility Score with Animated Progress Bar */}
          <section className="py-16 px-10 text-center bg-white">
            <h2 className="text-3xl font-bold mb-6">💞 Compatibility Score</h2>
            <div
              ref={progressContainerRef}
              className="w-full max-w-lg mx-auto bg-gray-300 rounded-full h-6 overflow-hidden relative"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
                style={{ width: progress, transition: "width 1.5s ease-in-out" }}
              ></div>
            </div>
            <p className="text-xl font-semibold mt-4">
              You & Your Partner: <b>{compatibilityScore} Soulmates!</b> 💘
            </p>
          </section>
        </div>
      )}

      <section className="py-16 px-10 text-center bg-white">
        <h2 id="why" className="text-3xl font-bold mb-8 text-red-500">Why Analyze Your Love? 💞</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-lg mx-auto">
          <div className="p-6 rounded-lg bg-pink-100 text-gray-800 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold">❤️ See Your Love Story</h3>
            <p className="mt-3">AI helps you <b>visualize your love journey</b> in a unique way.</p>
          </div>
          <div className="p-6 rounded-lg bg-pink-100 text-gray-800 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold">💡 Get Love Advice</h3>
            <p className="mt-3">Improve your relationship with <b>AI-powered tips</b>.</p>
          </div>
          <div className="p-6 rounded-lg bg-pink-100 text-gray-800 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold">💌 Romantic Fun</h3>
            <p className="mt-3">Turn your chat history into a <b>beautiful love story</b>.</p>
          </div>
        </div>
      </section>
      <footer id="price" className="bg-red-500 text-white py-8 mt-10 text-center">
        <h2 className="text-2xl font-semibold">LoverTest ❤️</h2>
        <p className="text-gray-300 text-sm max-w-2xl mx-auto">
          Your <b>AI-powered romance analyzer & story generator.</b> Celebrate your love journey today!
        </p>
        <p className="text-gray-200 text-sm mt-6">&copy; {new Date().getFullYear()} LoverTest. All rights reserved.</p>
      </footer>
    </div>
  );
}
