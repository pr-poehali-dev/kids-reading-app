import { useCallback, useRef, useState } from "react";

export function useTTS() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getVoice = (): SpeechSynthesisVoice | null => {
    const voices = speechSynthesis.getVoices();
    // Prefer Russian female voices
    const priority = [
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru") && v.name.toLowerCase().includes("female"),
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru") && v.name.toLowerCase().includes("милена"),
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru") && v.name.toLowerCase().includes("алёна"),
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru") && v.name.toLowerCase().includes("victoria"),
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru") && v.name.toLowerCase().includes("katya"),
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru") && !v.name.toLowerCase().includes("male"),
      (v: SpeechSynthesisVoice) => v.lang.startsWith("ru"),
    ];
    for (const match of priority) {
      const found = voices.find(match);
      if (found) return found;
    }
    return null;
  };

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = 0.82;   // чуть медленнее — хорошо для детей
    utter.pitch = 1.25;  // немного выше — мягче, добрее
    utter.volume = 1;

    const voice = getVoice();
    if (voice) utter.voice = voice;

    utter.onstart = () => setSpeaking(text);
    utter.onend = () => setSpeaking(null);
    utter.onerror = () => setSpeaking(null);

    utteranceRef.current = utter;
    setSpeaking(text);
    speechSynthesis.speak(utter);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(null);
  }, []);

  return { speak, stop, speaking };
}
