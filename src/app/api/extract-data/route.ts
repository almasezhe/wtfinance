const fs = require("fs");
const pdf = require("pdf-parse");

interface Transaction {
  date: string;
  amount: number;
  type: string;
  details: string;
}

const extractTransactions = async (filePath: string) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);

  let text = data.text;

  console.log("\n🔹 RAW EXTRACTED TEXT:\n", text);

  // 1️⃣ Объединяем строки с USD в одну (чтобы корректно удалять)
  text = text.replace(/\n\(\s?[-+]?\d{1,3}(?:[ .]?\d{3})*,?\d{0,2} USD\)/g, "");

  // 2️⃣ Убираем знаки валюты и исправляем разрывы чисел
  text = text
    .replace(/[₸]/g, "") // Убираем ₸
    .replace(/\s{2,}/g, " ") // Убираем лишние пробелы
    .replace(/([+-])\s?(\d{1,3}(?:[ .]?\d{3})*,?\d{0,2})/g, "$1$2") // Исправляем пробел между знаком и числом
    .trim();

  console.log("\n🔹 TEXT AFTER CLEANUP:\n", text);

  // 3️⃣ Новый regex для извлечения транзакций
  const transactionRegex =
    /(\d{2}\.\d{2}\.\d{2})\s+([-+]?\d{1,3}(?:[ .]?\d{3})*,?\d{0,2})\s+(\w+)\s+(.+)/g;

  const transactions: Transaction[] = [];
  let match;

  while ((match = transactionRegex.exec(text)) !== null) {
    const [_, date, amount, type, details] = match;

    const normalizedAmount = amount.replace(/\s/g, "").replace(",", ".");

    transactions.push({
      date,
      amount: parseFloat(normalizedAmount),
      type,
      details: details.trim(),
    });
  }

  console.log("\n🔹 FILTERED TRANSACTIONS:");
  transactions.forEach((t) =>
    console.log(`📅 ${t.date} | ${t.amount} ₸ | ${t.type} | ${t.details}`)
  );

  // 4️⃣ Подсчёт баланса
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalReceived = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  console.log("\n🔹 FINAL SUMS:");
  console.log("🔸 Total Balance: ", totalBalance.toFixed(2), "₸");
  console.log("🔸 Total Spent: ", totalSpent.toFixed(2), "₸");
  console.log("🔸 Total Received: ", totalReceived.toFixed(2), "₸");

  return {
    transactions,
    totalBalance,
    totalSpent,
    totalReceived,
  };
};


// 🚀 Запуск
const filePath = "src\\app\\api\\extract-data\\month.pdf";

// 🚀 Запуск
extractTransactions(filePath).then((result) => {
  console.log("\n✅ FINAL RESULT:", result);
});

