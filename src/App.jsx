import React, { useState } from "react";
import "./App.css";

function App() {
  const [number, setNumber] = useState("");
  const [factType, setFactType] = useState("trivia");
  const [randomMode, setRandomMode] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const translateText = async (texts) => {
    const response = await fetch(
      "https://server-test-bay-gamma.vercel.app/api/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: Array.isArray(texts) ? texts : [texts],
          targetLanguageCode: "ru",
        }),
      }
    );

    const data = await response.json();

    if (!data.translations || !Array.isArray(data.translations)) {
      console.error("❌ Ошибка в ответе от Yandex API:", data);
      throw new Error("Ошибка перевода: сервер не вернул translations");
    }

    return data.translations.map((t) => t.text).join("\n");
  };

  const fetchFact = async () => {
    setLoading(true);
    setError("");

    try {
      if (!randomMode && !number.trim()) {
        throw new Error(
          "Пожалуйста, введите число или включите режим случайного числа"
        );
      }

      if (!randomMode && isNaN(number)) {
        throw new Error("Число должно быть в виде цифры");
      }

      const url = randomMode
        ? `http://numbersapi.com/random/${factType}?json`
        : `http://numbersapi.com/${number}/${factType}?json`;

      const response = await fetch(url);
      const data = await response.json();

      const translated = await translateText([data.text]);

      setResult({
        number: data.number || number,
        text: data.text,
        translatedText: translated,
        type: factType,
        isRandom: randomMode,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFact();
  };

  const resetForm = () => {
    setNumber("");
    setFactType("trivia");
    setRandomMode(false);
    setResult(null);
    setError("");
  };

  return (
    <div className="app">
      {!result ? (
        <div className="form-container">
          <h1>Факты о числах</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Введите число:
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  disabled={randomMode}
                  placeholder={randomMode ? "Случайное число" : "Введите число"}
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={randomMode}
                  onChange={(e) => setRandomMode(e.target.checked)}
                />
                Использовать случайное число
              </label>
            </div>

            <div className="form-group">
              <label>
                Тип факта:
                <select
                  value={factType}
                  onChange={(e) => setFactType(e.target.value)}
                >
                  <option value="trivia">Trivia (интересный факт)</option>
                  <option value="math">Math (математический факт)</option>
                  <option value="date">Date (факт о дате)</option>
                  <option value="year">Year (факт о годе)</option>
                </select>
              </label>
            </div>

            <div className="button-group">
              <button type="submit" disabled={loading}>
                {loading ? "Загрузка..." : "Получить факт"}
              </button>
            </div>
          </form>

          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className="result-container">
          <h1>Результат</h1>

          <div className="result-info">
            <p>
              <strong>Число:</strong> {result.number}
            </p>
            <p>
              <strong>Тип факта:</strong> {getFactTypeName(result.type)}
            </p>
            <p>
              <strong>Режим:</strong>{" "}
              {result.isRandom ? "Случайное число" : "Выбранное число"}
            </p>
          </div>

          <div className="fact-box">
            <h2>Оригинальный факт (англ):</h2>
            <p>{result.text}</p>
            <h2>Перевод:</h2>
            <p>{result.translatedText}</p>
          </div>

          <button onClick={resetForm} className="back-button">
            Назад к форме
          </button>
        </div>
      )}
    </div>
  );
}

function getFactTypeName(type) {
  const types = {
    trivia: "Trivia (интересный факт)",
    math: "Math (математический факт)",
    date: "Date (факт о дате)",
    year: "Year (факт о годе)",
  };
  return types[type] || type;
}

export default App;
