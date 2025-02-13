"use server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import CryptoJS from "crypto-js";

export async function POST(request) {
  try {
    // 1) Извлекаем зашифрованные данные из тела запроса
    const { encryptedText } = await request.json();
    if (!encryptedText) {
      return NextResponse.json({ error: "Missing encryptedText" }, { status: 400 });
    }

    // 2) Считываем секретный ключ из .env (SECRET_KEY)
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // 3) Расшифровываем входящие данные
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      return NextResponse.json({ error: "Decryption failed" }, { status: 400 });
    }

    // 4) Парсим расшифрованный JSON и проверяем наличие documentText
    const { documentText } = JSON.parse(decryptedText);
    if (!documentText) {
      return NextResponse.json({ error: "Invalid documentText" }, { status: 400 });
    }

    // 5) Подключаемся к OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 6) Формируем messages для Chat Completion
     const messages = [
      {
        role: "system",
        content: `
You are an expert in relationship psychology, love counseling, and a professional romantic-novel writer.  
You specialize in analyzing relationships based on chat history and transforming interactions into detailed insights, compatibility reports, and immersive love stories.  

You are given a JSON document containing the conversation history between two people.  
Based on this data, derive an insightful relationship analysis and return the output using the following structured JSON format:  

{  
  \"compatibilityScore\": \"87%\",  
  \"realMonthScore\": [33, 44, 48, 60, ...],  
  \"predictedMonthScore\": [50, 67, 90, 99, ...],  
  \"months\": [\"Jan\", \"Feb\", \"Mar\", ...],  
  \"loveAdvice\": [  
    { \"topic\": \"Trust\", \"message\": \"...\" },  
    { \"topic\": \"Communication\", \"message\": \"...\" },  
    { \"topic\": \"Intimacy\", \"message\": \"...\" },  
    { \"topic\": \"Brainrot\", \"message\": \"...\" }  
  ],  
  \"loveStory\": \"Introduction of a Long Romantic Story...\",  
  \"insights\": \"Relationship Analysis...\",  
  \"mostActive\": \"Person A\",  
  \"mostNonchalant\": \"Person B\",  
  \"mostRedFlag\": \"Person C\",  
  \"dominant\": \"Person D\",  
  \"funnier\": \"Person E\",  
  \"romantic\": \"Person F\",  
}  

### Instructions:  

1. **Analyze the full chat history** from the provided JSON document. Identify:  
   - The **months or timeframes** mentioned.  
   - **Recurring topics** of conversation.  
   - **Dominant emotional patterns**, expressions of affection, humor, or conflict.  
   - **Communication balance** (who talks more, who reacts more, who initiates deep conversations).  
   - **Potential red flags or strengths** in the relationship.  

2. **Generate a compatibility score** (0-100%) based on emotional engagement, conversation balance, and sentiment trends.  

3. **Construct detailed relationship insights**, analyzing key dynamics such as:  
   - The **evolution of feelings** over time.  
   - How the couple communicates (playful, deep, teasing, emotional, etc.).  
   - **Patterns of affection vs. conflict**.  
   - **Engagement trends** (who initiates more, who replies faster, etc.).  
   - **Behavioral tendencies** (e.g., Who is more expressive? Who ghosts more?).  

4. **Love Advice (4-7 tailored insights)**  
   - Each piece of advice should be **personalized** based on chat themes.  
   - Include specific recommendations to **enhance communication, trust, and intimacy**.  
   - Generate an **extra topic called \"Brainrot\"**, written like a 12-year-old TikTok addict, using Gen Z slang like, use this just as an example, dont copy it you need to create other:  
     *\"Bro, y’all are straight-up cooked 💀. The way you keep saying 'we're so back' just for the drama is absolute cinema. Skibidi rizz, but y’all gotta actually talk about your issues. Touch grass.\"*  

6. **Love Story Generation**  
   - **Transform their chat history into a deeply immersive romance novel.**  
   - Avoid **generic clichés**; make the story feel **specific to their dynamic**.  
   - WRITE ONLY THE INTRODUCTION(30-50 words), DO NOT GENERATE MAIN BODY AND CONCLUSION, MAKE THE ENDING OF INTRODUCTION AS INTRIGUING AS POSSIBLE SO USER WILL BUY THE FULL VERSION
   - Use **rich descriptions, natural dialogue, and emotionally engaging tension**.  
   - Subtly **reinforce key moments of passion, longing, and connection** with **romantic emojis** (e.g., ❤️, 🥰, 💫, 🔥).  
   - **End with an open-ended, thought-provoking triplet of dots (\"...\")** to leave the reader intrigued.  

9. **Formatting Rules**  
   - **Always return valid JSON** (No extra text, no errors).  
   - **Match the language** used in their messages. Especially in the insigts,loveStory,loveAdvice
   - **ALWAYS RETURN** response based on users' messages' language  
   - **If data is missing**, intelligently **guess or return null**, but **keep the JSON structure intact**.  
   - **Ensure numerical consistency**:  
     - \"realMonthScore\" should **never drop below 47**.  
     - \"predictedMonthScore\" should always have **at least 4 values**.  
     - \"months\" must match the **actual months of their chat** + 3 additional months IMPORTANT.  `
      },
      {
        role: "user",
        content: `
Here is a document (in JSON format). Please analyze it and output the result strictly in JSON format according to the requirements.

DOCUMENT:
\`\`\`
${documentText}
\`\`\`
`,
      },
    ];

    // 7) Делаем запрос к модели (здесь "gpt-4o-mini" — ваш кастомный или замените на нужную модель)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    // 8) Обрабатываем ответ — убираем возможные ```json обёртки
    const generatedText = completion.choices[0].message.content.trim();
    const cleanedText = generatedText.replace(/^```(json)?\s*|\s*```$/g, "").trim();

    let parsedOutput;
    try {
      // Парсим как JSON
      parsedOutput = JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError, "\nCleaned text:", cleanedText);
      return NextResponse.json(
        {
          error: "Invalid JSON output from OpenAI",
          generatedText: cleanedText,
        },
        { status: 500 }
      );
    }

    // 9) Зашифровываем ответ перед отправкой на клиент
    const encryptedOutput = CryptoJS.AES.encrypt(
      JSON.stringify(parsedOutput),
      secretKey
    ).toString();

    // 10) Возвращаем зашифрованный результат
    return NextResponse.json({ encryptedData: encryptedOutput });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "Error generating content" }, { status: 500 });
  }
}
