import { useState, useRef, useCallback } from "react";

export type SpeechState = "idle" | "listening" | "processing" | "success" | "error" | "unsupported";

interface UseSpeechRecognitionOptions {
  lang?: string;
  onResult?: (transcript: string, correct: boolean) => void;
}

export function useSpeechRecognition(
  expected: string,
  options: UseSpeechRecognitionOptions = {}
) {
  const { lang = "ru-RU", onResult } = options;
  const [state, setState] = useState<SpeechState>("idle");
  const [transcript, setTranscript] = useState("");
  const [volume, setVolume] = useState<number[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopAudio = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    setVolume([]);
  }, []);

  const trackVolume = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    src.connect(analyser);
    analyserRef.current = analyser;
    streamRef.current = stream;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bars = Array.from(data.slice(0, 12)).map((v) => v / 255);
      setVolume(bars);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    type SpeechRecognitionCtor = new () => SpeechRecognition;
    const w = window as Window & { webkitSpeechRecognition?: SpeechRecognitionCtor };
    const SpeechRecognition: SpeechRecognitionCtor | undefined =
      w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setState("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      trackVolume(stream);
    } catch {
      // volume tracking optional — continue even if mic access denied
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognitionRef.current = recognition;

    recognition.onstart = () => setState("listening");

    recognition.onresult = (e) => {
      setState("processing");
      stopAudio();

      const results: string[] = [];
      for (let i = 0; i < e.results[0].length; i++) {
        results.push(e.results[0][i].transcript.trim().toUpperCase());
      }
      const heard = results[0] || "";
      setTranscript(heard);

      // Match: heard contains first letter of expected word or the letter itself
      const expectedUpper = expected.toUpperCase();
      const correct =
        results.some((r) => r.startsWith(expectedUpper)) ||
        results.some((r) => r === expectedUpper) ||
        results.some((r) => r.includes(expectedUpper));

      setTimeout(() => {
        setState(correct ? "success" : "error");
        onResult?.(heard, correct);
      }, 400);
    };

    recognition.onerror = () => {
      stopAudio();
      setState("error");
      onResult?.("", false);
    };

    recognition.onend = () => {
      stopAudio();
      if (state === "listening") {
        setState("error");
        onResult?.("", false);
      }
    };

    recognition.start();
    setState("listening");
  }, [expected, lang, onResult, stopAudio, trackVolume, state]);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    stopAudio();
    setTranscript("");
    setState("idle");
  }, [stopAudio]);

  return { state, transcript, volume, start, reset };
}