import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogin: () => void;
}

type Step = "welcome" | "login" | "register" | "verify";

export default function AuthScreen({ onLogin }: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1200);
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 800);
  };

  if (step === "welcome") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "hsl(var(--game-purple))" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "hsl(var(--game-blue))" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "hsl(var(--game-pink))" }} />

        {/* Logo */}
        <div className="relative z-10 text-center animate-slide-up mb-2">
          <div className="w-28 h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center float"
            style={{ background: "linear-gradient(135deg, hsl(var(--game-purple)), hsl(var(--game-pink)))" }}>
            <span className="text-6xl">📚</span>
          </div>
          <h1 className="text-4xl font-black text-foreground leading-tight">
            Букво<span style={{ color: "hsl(var(--game-purple))" }}>Рост</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-2 font-semibold">
            Учимся читать играючи! ✨
          </p>
        </div>

        {/* Stars decoration */}
        <div className="relative z-10 flex gap-3 my-6">
          {["⭐", "🌟", "✨", "🌟", "⭐"].map((s, i) => (
            <span key={i} className="text-2xl" style={{
              animation: `float ${1.5 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}>{s}</span>
          ))}
        </div>

        {/* Features */}
        <div className="relative z-10 w-full max-w-sm space-y-3 mb-8">
          {[
            { emoji: "🔤", text: "Учим буквы весело" },
            { emoji: "🎯", text: "3 уровня сложности" },
            { emoji: "🏆", text: "Награды и бейджи" },
          ].map((f, i) => (
            <div key={i} className="game-card flex items-center gap-4 px-5 py-3 animate-fade-in"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <span className="text-3xl">{f.emoji}</span>
              <span className="font-bold text-foreground text-base">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="relative z-10 w-full max-w-sm space-y-3">
          <button
            onClick={() => setStep("register")}
            className="btn-bounce w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(var(--game-purple)), hsl(var(--game-pink)))",
              boxShadow: "0 6px 0 hsl(258 80% 45%)",
            }}>
            Начать обучение 🚀
          </button>
          <button
            onClick={() => setStep("login")}
            className="btn-bounce w-full py-4 rounded-2xl font-bold text-base border-2"
            style={{
              borderColor: "hsl(var(--game-purple))",
              color: "hsl(var(--game-purple))",
              background: "white",
            }}>
            Уже есть аккаунт
          </button>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(var(--game-yellow))" }}>
              <span className="text-4xl">📩</span>
            </div>
            <h2 className="text-2xl font-black text-foreground">Проверь почту!</h2>
            <p className="text-muted-foreground mt-2 font-semibold">
              Отправили код на<br />
              <span style={{ color: "hsl(var(--game-purple))" }}>{email}</span>
            </p>
          </div>

          <div className="game-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">КОД ИЗ ПИСЬМА</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                placeholder="— — — — — —"
                className="w-full text-center text-3xl font-black py-4 rounded-2xl border-2 outline-none tracking-widest"
                style={{ borderColor: "hsl(var(--game-purple))", color: "hsl(var(--game-purple))" }}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={code.length < 4 || isLoading}
              className="btn-bounce w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(var(--game-green)), hsl(142 60% 40%))",
                boxShadow: code.length >= 4 ? "0 5px 0 hsl(142 60% 35%)" : "none",
              }}>
              {isLoading ? "Проверяем... ⏳" : "Подтвердить ✅"}
            </button>

            <button
              onClick={() => setStep("register")}
              className="w-full text-center text-muted-foreground font-semibold text-sm py-2">
              ← Вернуться назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRegister = step === "register";

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <button
            onClick={() => setStep("welcome")}
            className="inline-flex items-center gap-2 text-muted-foreground font-semibold mb-4">
            <Icon name="ArrowLeft" size={18} /> Назад
          </button>
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(var(--game-purple)), hsl(var(--game-pink)))" }}>
            <span className="text-3xl">{isRegister ? "🌟" : "👋"}</span>
          </div>
          <h2 className="text-2xl font-black text-foreground">
            {isRegister ? "Создать аккаунт" : "Добро пожаловать!"}
          </h2>
          <p className="text-muted-foreground mt-1 font-semibold text-sm">
            {isRegister ? "Регистрация родителя" : "Войдите в свой аккаунт"}
          </p>
        </div>

        <div className="game-card p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">ИМЯ РЕБЁНКА</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Маша"
                className="w-full px-4 py-3 rounded-2xl border-2 font-bold text-base outline-none transition-all"
                style={{ borderColor: name ? "hsl(var(--game-purple))" : "hsl(var(--border))" }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-2">EMAIL РОДИТЕЛЯ</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mama@example.com"
              className="w-full px-4 py-3 rounded-2xl border-2 font-bold text-base outline-none transition-all"
              style={{ borderColor: email ? "hsl(var(--game-purple))" : "hsl(var(--border))" }}
            />
          </div>

          <button
            onClick={handleSendCode}
            disabled={!email || isLoading}
            className="btn-bounce w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, hsl(var(--game-purple)), hsl(var(--game-pink)))",
              boxShadow: email ? "0 5px 0 hsl(258 80% 45%)" : "none",
            }}>
            {isLoading ? "Отправляем... ⏳" : "Получить код 📩"}
          </button>

          <div className="text-center">
            <span className="text-muted-foreground text-sm font-semibold">
              {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
            </span>
            <button
              onClick={() => setStep(isRegister ? "login" : "register")}
              className="font-bold text-sm"
              style={{ color: "hsl(var(--game-purple))" }}>
              {isRegister ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
