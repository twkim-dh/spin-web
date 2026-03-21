"use client";

interface ResultModalProps {
  result: string;
  onSpin: () => void;
  onEdit: () => void;
  onShare: () => void;
  onClose: () => void;
}

export default function ResultModal({
  result,
  onSpin,
  onEdit,
  onShare,
  onClose,
}: ResultModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 mx-6 max-w-[400px] w-full text-center animate-scale-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration emojis */}
        <div className="text-5xl mb-2 animate-celebrate">🎉</div>

        {/* Result label */}
        <p className="text-text-medium text-sm mb-2 font-medium">결과는...</p>

        {/* Big result */}
        <h2
          className="text-3xl font-black mb-6 break-keep"
          style={{ color: "#FF5252" }}
        >
          {result}
        </h2>

        {/* Decorative emojis */}
        <div className="text-2xl mb-6">🎊 ✨ 🎊</div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onSpin}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-lg transition-transform active:scale-95"
            style={{ backgroundColor: "#FFC107" }}
          >
            🔄 다시 돌리기
          </button>

          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 py-3 rounded-2xl font-bold text-sm transition-transform active:scale-95"
              style={{
                backgroundColor: "#FFF3D6",
                color: "#333",
              }}
            >
              ✏️ 항목 편집
            </button>

            <button
              onClick={onShare}
              className="flex-1 py-3 rounded-2xl text-white font-bold text-sm transition-transform active:scale-95"
              style={{ backgroundColor: "#FF5252" }}
            >
              📤 공유하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
