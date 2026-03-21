declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

const KAKAO_KEY = "ea95354167038ebb0be11c1aae1ffe26";
const BASE_URL = "https://spin.dhlm-studio.com";

export function initKakao(): Promise<void> {
  return new Promise((resolve) => {
    const tryInit = (attempts: number) => {
      if (attempts <= 0) {
        console.warn("Kakao SDK failed to load after retries");
        resolve();
        return;
      }
      if (typeof window !== "undefined" && window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_KEY);
        }
        resolve();
      } else {
        setTimeout(() => tryInit(attempts - 1), 500);
      }
    };
    tryInit(10);
  });
}

export function shareRoulette(items: string[]): void {
  const url = `${BASE_URL}/spin?items=${encodeURIComponent(items.join(","))}`;
  const text = `돌려돌려 룰렛! 🎰\n항목: ${items.join(", ")}\n\n`;

  if (navigator.share) {
    navigator.share({
      title: "돌려돌려 룰렛",
      text,
      url,
    }).catch(() => {
      copyToClipboard(url);
    });
  } else {
    copyToClipboard(url);
  }
}

export function shareResult(result: string, items: string[]): void {
  const url = `${BASE_URL}/spin?items=${encodeURIComponent(items.join(","))}`;
  const text = `돌려돌려 결과: ${result}! 🎉\n항목: ${items.join(", ")}\n\n`;

  if (navigator.share) {
    navigator.share({
      title: `돌려돌려 결과: ${result}`,
      text,
      url,
    }).catch(() => {
      copyToClipboard(`${text}${url}`);
    });
  } else {
    copyToClipboard(`${text}${url}`);
  }
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).then(() => {
    alert("링크가 복사되었습니다! 📋");
  }).catch(() => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("링크가 복사되었습니다! 📋");
  });
}

export { BASE_URL };
