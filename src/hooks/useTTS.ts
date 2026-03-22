import { useCallback, useRef, useState } from "react";

export function useTTS() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getVoice = (): SpeechSynthesisVoice | null => {
    const voices = speechSynthesis.getVoices();
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

  const makeUtter = (text: string, rate: number, pitch: number): SpeechSynthesisUtterance => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = 1;
    const voice = getVoice();
    if (voice) utter.voice = voice;
    return utter;
  };

  // Обычная озвучка текста (для слов и фраз)
  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utter = makeUtter(text, 0.82, 1.25);
    utter.onstart = () => setSpeaking(text);
    utter.onend = () => setSpeaking(null);
    utter.onerror = () => setSpeaking(null);
    utteranceRef.current = utter;
    setSpeaking(text);
    speechSynthesis.speak(utter);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Специальная озвучка буквы: «Буква» → пауза → сама буква медленно и чётко
  const speakLetter = useCallback((letter: string) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();

    // Первый utterance: слово "Буква"
    const u1 = makeUtter("Буква", 0.8, 1.2);
    // Второй utterance: сама буква — очень медленно и с высоким тоном
    const u2 = makeUtter(letter, 0.45, 1.4);

    const key = `letter_${letter}`;

    u1.onstart = () => setSpeaking(key);
    u1.onend = () => {
      // небольшая пауза через silent utterance
      const pause = makeUtter(" ", 0.1, 1);
      pause.onend = () => speechSynthesis.speak(u2);
      speechSynthesis.speak(pause);
    };
    u2.onend = () => setSpeaking(null);
    u2.onerror = () => setSpeaking(null);
    u1.onerror = () => setSpeaking(null);

    setSpeaking(key);
    speechSynthesis.speak(u1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(null);
  }, []);

  return { speak, speakLetter, stop, speaking };
}
