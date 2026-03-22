import { User } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  onStartLesson: (id: number) => void;
  onProfile: () => void;
}

const LEVELS = [
  {
    id: 1,
    title: "Буквы",
    emoji: "🔤",
    description: "Знакомимся с алфавитом",
    color: "var(--game-purple)",
    shadow: "hsl(258 80% 45%)",
    gradient: "linear-gradient(135deg, hsl(258 90% 66%), hsl(258 80% 55%))",
    lessons: [
      { id: 101, title: "Буква А", emoji: "🍎" },
      { id: 102, title: "Буква Б", emoji: "🐝" },
      { id: 103, title: "Буква В", emoji: "🐺" },
      { id: 104, title: "Буква Г", emoji: "🦆" },
      { id: 105, title: "Буква Д", emoji: "🌳" },
      { id: 106, title: "Буква Е", emoji: "🦔" },
      { id: 107, title: "Буква Ё", emoji: "🌲" },
      { id: 108, title: "Буква Ж", emoji: "🐞" },
      { id: 109, title: "Буква З", emoji: "🦓" },
      { id: 110, title: "Буква И", emoji: "🦌" },
      { id: 111, title: "Буква Й", emoji: "🎯" },
      { id: 112, title: "Буква К", emoji: "🐱" },
      { id: 113, title: "Буква Л", emoji: "🦁" },
      { id: 114, title: "Буква М", emoji: "🐭" },
      { id: 115, title: "Буква Н", emoji: "🌙" },
      { id: 116, title: "Буква О", emoji: "🦊" },
      { id: 117, title: "Буква П", emoji: "🐧" },
      { id: 118, title: "Буква Р", emoji: "🌹" },
      { id: 119, title: "Буква С", emoji: "🐘" },
      { id: 120, title: "Буква Т", emoji: "🐯" },
      { id: 121, title: "Буква У", emoji: "🦆" },
      { id: 122, title: "Буква Ф", emoji: "🎩" },
      { id: 123, title: "Буква Х", emoji: "🦔" },
      { id: 124, title: "Буква Ц", emoji: "🌸" },
      { id: 125, title: "Буква Ч", emoji: "☕" },
      { id: 126, title: "Буква Ш", emoji: "🎱" },
      { id: 127, title: "Буква Щ", emoji: "🛡️" },
      { id: 128, title: "Буква Ъ", emoji: "🔑" },
      { id: 129, title: "Буква Ы", emoji: "🧀" },
      { id: 130, title: "Буква Ь", emoji: "🍂" },
      { id: 131, title: "Буква Э", emoji: "⚡" },
      { id: 132, title: "Буква Ю", emoji: "🌍" },
      { id: 133, title: "Буква Я", emoji: "🍓" },
    ],
  },
  {
    id: 2,
    title: "Слоги",
    emoji: "🎵",
    description: "Учим слоги и звуки",
    color: "var(--game-green)",
    shadow: "hsl(142 60% 35%)",
    gradient: "linear-gradient(135deg, hsl(142 72% 50%), hsl(142 60% 40%))",
    locked: true,
    lessons: [
      { id: 11, title: "МА-МА", emoji: "👩" },
      { id: 12, title: "ПА-ПА", emoji: "👨" },
      { id: 13, title: "БА-БА", emoji: "👵" },
      { id: 14, title: "МИ-МИ", emoji: "😻" },
      { id: 15, title: "ТУ-ТУ", emoji: "🚂" },
      { id: 16, title: "КУ-КА", emoji: "🐓" },
      { id: 17, title: "ЗИ-ЗИ", emoji: "🦟" },
      { id: 18, title: "НА-НА", emoji: "🎁" },
      { id: 19, title: "Сложные слоги", emoji: "🧩" },
      { id: 20, title: "Финальный тест", emoji: "🏆" },
    ],
  },
  {
    id: 3,
    title: "Слова",
    emoji: "📖",
    description: "Читаем первые слова",
    color: "var(--game-orange)",
    shadow: "hsl(35 90% 45%)",
    gradient: "linear-gradient(135deg, hsl(35 100% 60%), hsl(35 90% 50%))",
    locked: true,
    lessons: [
      { id: 21, title: "МА-МА", emoji: "👩" },
      { id: 22, title: "РЫ-БА", emoji: "🐟" },
      { id: 23, title: "КО-ШКА", emoji: "🐱" },
      { id: 24, title: "СО-БА-КА", emoji: "🐶" },
      { id: 25, title: "ДОМ", emoji: "🏠" },
      { id: 26, title: "ЛЕС", emoji: "🌲" },
      { id: 27, title: "МЯЧ", emoji: "⚽" },
      { id: 28, title: "ЕЖ", emoji: "🦔" },
      { id: 29, title: "КНИГА", emoji: "📚" },
      { id: 30, title: "Финальный тест", emoji: "🏆" },
    ],
  },
];

export default function MapScreen({ user, onStartLesson, onProfile }: Props) {
  const totalLessons = LEVELS.reduce((sum, l) => sum + l.lessons.length, 0);
  const progress = (user.completedLessons.length / totalLessons) * 100;

  return (
    <div className="min-h-dvh flex flex-col pb-6">
      {/* Header */}
      <div className="px-5 pt-12 pb-4"
        style={{ background: "linear-gradient(180deg, hsl(258 90% 66%) 0%, hsl(220 60% 97%) 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 font-semibold text-sm">Привет,</p>
            <h1 className="text-2xl font-black text-white">{user.name}! 👋</h1>
          </div>
          <button
            onClick={onProfile}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
            <span className="text-2xl">👤</span>
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-white/70 text-xs font-bold">ЗВЁЗДЫ</p>
              <p className="text-white font-black text-lg leading-none">{user.stars}</p>
            </div>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-white/70 text-xs font-bold">СЕРИЯ</p>
              <p className="text-white font-black text-lg leading-none">{user.streak} дней</p>
            </div>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🏅</span>
            <div>
              <p className="text-white/70 text-xs font-bold">БЕЙДЖИ</p>
              <p className="text-white font-black text-lg leading-none">{user.badges.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="px-5 py-4">
        <div className="game-card p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-sm text-foreground">Общий прогресс</span>
            <span className="font-black text-sm" style={{ color: "hsl(var(--game-purple))" }}>
              {user.completedLessons.length}/{totalLessons} уроков
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, hsl(var(--game-purple)), hsl(var(--game-pink)))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Levels */}
      <div className="px-5 space-y-5">
        {LEVELS.map((level, levelIdx) => {
          const isLocked = level.locked && !user.isPremium;
          const levelCompleted = level.lessons.filter(
            (l) => user.completedLessons.includes(l.id)
          ).length;

          return (
            <div key={level.id}>
              {/* Level header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                  style={{ background: level.gradient }}>
                  {level.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-lg text-foreground">
                      Уровень {level.id}: {level.title}
                    </h2>
                    {isLocked && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                        style={{ background: "hsl(var(--game-orange))" }}>
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm font-semibold">
                    {levelCompleted}/{level.lessons.length} выполнено
                  </p>
                </div>
              </div>

              {/* Lessons grid */}
              {isLocked ? (
                <div className="game-card p-5 text-center">
                  <span className="text-4xl mb-3 block">🔒</span>
                  <h3 className="font-black text-base text-foreground mb-1">
                    Уровень заблокирован
                  </h3>
                  <p className="text-muted-foreground text-sm font-semibold mb-4">
                    Открой подписку, чтобы продолжить
                  </p>
                  <button
                    className="btn-bounce w-full py-3 rounded-2xl font-black text-sm text-white"
                    style={{
                      background: level.gradient,
                      boxShadow: `0 4px 0 ${level.shadow}`,
                    }}>
                    Открыть за 299 ₽/мес 🚀
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {level.lessons.map((lesson) => {
                    const isDone = user.completedLessons.includes(lesson.id);
                    const letterMatch = lesson.title.match(/Буква\s+(.+)/);
                    const letterLabel = letterMatch ? letterMatch[1] : null;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onStartLesson(lesson.id)}
                        className="btn-bounce rounded-2xl flex flex-col items-center justify-center relative transition-all py-2 gap-0.5"
                        style={{
                          background: isDone ? level.gradient : "white",
                          boxShadow: isDone
                            ? `0 4px 0 ${level.shadow}`
                            : `0 4px 0 hsl(var(--border)), 0 0 0 2px hsl(${level.color})`,
                          border: isDone ? "none" : `2px solid hsl(${level.color})`,
                          minHeight: "60px",
                        }}>
                        <span className="text-lg leading-none">{lesson.emoji}</span>
                        {letterLabel ? (
                          <span
                            className="font-black leading-none"
                            style={{
                              fontSize: "1rem",
                              color: isDone ? "white" : `hsl(${level.color})`,
                            }}>
                            {letterLabel}
                          </span>
                        ) : (
                          <span className="text-xs font-bold leading-none" style={{ color: isDone ? "white" : "hsl(var(--muted-foreground))" }}>
                            {isDone ? "✓" : lesson.emoji}
                          </span>
                        )}
                        {isDone && (
                          <span className="absolute top-1 right-1.5 text-white text-xs font-black leading-none">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}