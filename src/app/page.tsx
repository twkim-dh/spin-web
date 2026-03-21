"use client";

import { useRouter } from "next/navigation";

const PRESETS = [
  {
    emoji: "🍚",
    title: "점심 메뉴",
    items: ["김치찌개", "된장찌개", "비빔밥", "제육볶음", "돈까스", "짜장면", "짬뽕", "칼국수", "떡볶이", "치킨"],
    color: "#FF6B6B",
  },
  {
    emoji: "🍺",
    title: "회식 메뉴",
    items: ["삼겹살", "치킨", "족발", "곱창", "이자카야", "양꼬치", "피자", "감자탕"],
    color: "#FFA06B",
  },
  {
    emoji: "🎲",
    title: "벌칙",
    items: ["노래 부르기", "춤추기", "개인기", "물 원샷", "폭탄주", "사랑해 외치기", "윗몸 일으키기"],
    color: "#6BCB77",
  },
  {
    emoji: "🔢",
    title: "순서 정하기",
    items: ["1번", "2번", "3번", "4번", "5번", "6번"],
    color: "#45B7D1",
  },
  {
    emoji: "🎯",
    title: "이거 아님 저거",
    items: ["이거", "저거"],
    color: "#A06BFF",
  },
];

export default function Home() {
  const router = useRouter();

  const handlePresetClick = (items: string[]) => {
    const encoded = encodeURIComponent(items.join(","));
    router.push(`/spin?items=${encoded}`);
  };

  const handleCustomClick = () => {
    router.push("/spin");
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-8">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black mb-3" style={{ color: "#FFC107" }}>
          돌려돌려 🎰
        </h1>
        <p className="text-lg font-medium" style={{ color: "#666" }}>
          뭐든 결정 못 할 때 돌려!
        </p>
      </div>

      {/* Preset Cards */}
      <div className="flex flex-col gap-3 mb-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.title}
            onClick={() => handlePresetClick(preset.items)}
            className="card-hover bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{preset.emoji}</span>
              <h3 className="text-lg font-bold" style={{ color: preset.color }}>
                {preset.title}
              </h3>
              <span
                className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: preset.color }}
              >
                {preset.items.length}개
              </span>
            </div>
            <p className="text-sm text-text-medium truncate pl-9">
              {preset.items.join(", ")}
            </p>
          </button>
        ))}
      </div>

      {/* Custom Button */}
      <button
        onClick={handleCustomClick}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95"
        style={{
          background: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)",
        }}
      >
        ✨ 직접 만들기
      </button>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs" style={{ color: "#bbb" }}>
          DHLM STUDIO
        </p>
      </div>
    </div>
  );
}
