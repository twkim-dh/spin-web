"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import RouletteWheel from "@/components/RouletteWheel";
import ResultModal from "@/components/ResultModal";
import { initKakao, shareResult } from "@/lib/kakao";

export default function SpinPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const router = useRouter();

  const initialItems = params.items
    ? (typeof params.items === "string" ? params.items : params.items[0])
        .split(",")
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean)
    : [];

  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState("");
  const [showWheel, setShowWheel] = useState(initialItems.length >= 2);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    initKakao();
  }, []);

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setInputValue("");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const startRoulette = () => {
    if (items.length < 2) return;
    setShowWheel(true);
    // Update URL with items
    const encoded = encodeURIComponent(items.join(","));
    window.history.replaceState(null, "", `/spin?items=${encoded}`);
  };

  const handleSpin = useCallback(() => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
  }, [spinning]);

  const handleResult = useCallback((winner: string) => {
    setResult(winner);
  }, []);

  const handleSpinEnd = useCallback(() => {
    setSpinning(false);
  }, []);

  const handleEdit = () => {
    setResult(null);
    setShowWheel(false);
  };

  const handleShare = () => {
    if (result) {
      shareResult(result, items);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  // --- Item Input Form ---
  if (!showWheel) {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-2xl mr-3 transition-transform active:scale-90"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "#FFC107" }}>
            항목 입력
          </h1>
        </div>

        {/* Input area */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="항목을 입력하세요"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-base bg-white"
            autoFocus
          />
          <button
            onClick={addItem}
            className="px-5 py-3 rounded-xl text-white font-bold text-base transition-transform active:scale-95"
            style={{ backgroundColor: "#FFC107" }}
          >
            추가
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto mb-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🎰</p>
              <p className="text-text-medium">항목을 2개 이상 추가해주세요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
                    style={{ backgroundColor: "#FFC107" }}
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 text-base font-medium">{item}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-red-500 text-xl transition-colors p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item count */}
        {items.length > 0 && (
          <p className="text-center text-sm text-text-medium mb-3">
            총 {items.length}개 항목
            {items.length < 2 && " (2개 이상 필요)"}
          </p>
        )}

        {/* Start button */}
        <button
          onClick={startRoulette}
          disabled={items.length < 2}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background:
              items.length >= 2
                ? "linear-gradient(135deg, #FF5252 0%, #FF1744 100%)"
                : "#ccc",
          }}
        >
          🎰 룰렛 시작! ({items.length}개)
        </button>
      </div>
    );
  }

  // --- Roulette Wheel View ---
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="text-2xl mr-3 transition-transform active:scale-90"
        >
          ←
        </button>
        <h1 className="text-xl font-bold" style={{ color: "#FFC107" }}>
          돌려돌려 🎰
        </h1>
        <button
          onClick={handleEdit}
          className="ml-auto text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: "#FFF3D6", color: "#333" }}
        >
          ✏️ 편집
        </button>
      </div>

      {/* Items summary */}
      <div className="text-center mb-4">
        <p className="text-sm text-text-medium">
          {items.length}개 항목 ·{" "}
          <span className="font-medium">{items.join(", ")}</span>
        </p>
      </div>

      {/* Roulette Wheel */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-6">
          <RouletteWheel
            items={items}
            spinning={spinning}
            onResult={handleResult}
            onSpinEnd={handleSpinEnd}
          />
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className={`w-full max-w-[280px] py-4 rounded-2xl text-white font-black text-xl shadow-lg transition-transform active:scale-95 disabled:opacity-70 ${
            !spinning ? "animate-pulse-spin" : ""
          }`}
          style={{
            background: spinning
              ? "#999"
              : "linear-gradient(135deg, #FF5252 0%, #FF1744 100%)",
          }}
        >
          {spinning ? "돌아가는 중... 🌀" : "돌리기! 🎯"}
        </button>
      </div>

      {/* Result Modal */}
      {result && (
        <ResultModal
          result={result}
          onSpin={() => {
            setResult(null);
            setTimeout(handleSpin, 100);
          }}
          onEdit={handleEdit}
          onShare={handleShare}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
}
