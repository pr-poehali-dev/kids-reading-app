import { User } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  onBack: () => void;
}

const ALL_BADGES = [
  { id: "first_letter", emoji: "🌟", title: "Первая буква", desc: "Выучил первую букву" },
  { id: "triple_combo", emoji: "🔥", title: "Трио!", desc: "3 правильных ответа подряд" },
  { id: "perfect_lesson", emoji: "💎", title: "Идеально!", desc: "Урок без ошибок" },
  { id: "level_1", emoji: "🥇", title: "Уровень 1", desc: "Прошёл весь первый уровень" },
  { id: "level_2", emoji: "🥈", title: "Уровень 2", desc: "Прошёл второй уровень" },
  { id: "level_3", emoji: "🥉", title: "Уровень 3", desc: "Прошёл третий уровень" },
  { id: "streak_7", emoji: "⚡", title: "Неделя!", desc: "7 дней подряд" },
  { id: "streak_30", emoji: "🏅", title: "Месяц!", desc: "30 дней подряд" },
];

export default function ProfileScreen({ user, onBack }: Props) {
  const progress = (user.completedLessons.length / 30) * 100;

  return (
    <div className="min-h-dvh flex flex-col pb-10">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 relative"
        style={{ background: "linear-gradient(160deg, hsl(258 90% 66%), hsl(330 85% 65%))" }}>
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 mb-6">
          <Icon name="ArrowLeft" size={20} className="text-white" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{ background: "rgba(255,255,255,0.25)" }}>
            {user.name[0]}🎓
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{user.name}</h1>
            <p className="text-white/70 font-semibold text-sm">{user.email}</p>
            {user.isPremium ? (
              <span className="text-xs px-3 py-1 rounded-full font-black bg-yellow-400 text-yellow-900 mt-1 inline-block">
                ✨ PRO подписка
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full font-black bg-white/20 text-white mt-1 inline-block">
                Бесплатный план
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Звёзды", value: user.stars, emoji: "⭐" },
            { label: "Серия", value: `${user.streak}д`, emoji: "🔥" },
            { label: "Уроки", value: user.completedLessons.length, emoji: "📚" },
          ].map((s) => (
            <div key={s.label} className="bg-white/20 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-white font-black text-xl leading-none">{s.value}</div>
              <div className="text-white/70 text-xs font-bold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Progress */}
        <div className="game-card p-5">
          <h2 className="font-black text-base text-foreground mb-3">📈 Прогресс обучения</h2>
          <div className="space-y-3">
            {[
              { label: "Уровень 1: Буквы", done: Math.min(user.completedLessons.length, 10), total: 10 },
              { label: "Уровень 2: Слоги", done: Math.max(0, Math.min(user.completedLessons.length - 10, 10)), total: 10, locked: !user.isPremium },
              { label: "Уровень 3: Слова", done: Math.max(0, Math.min(user.completedLessons.length - 20, 10)), total: 10, locked: !user.isPremium },
            ].map((p) => (
              <div key={p.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-foreground flex items-center gap-1">
                    {p.locked && <span>🔒</span>} {p.label}
                  </span>
                  <span className="text-xs font-black" style={{ color: "hsl(var(--game-purple))" }}>
                    {p.done}/{p.total}
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(p.done / p.total) * 100}%`,
                      background: "linear-gradient(90deg, hsl(var(--game-purple)), hsl(var(--game-pink)))",
                      opacity: p.locked ? 0.3 : 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="game-card p-5">
          <h2 className="font-black text-base text-foreground mb-3">
            🏆 Бейджи ({user.badges.length}/{ALL_BADGES.length})
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {ALL_BADGES.map((badge) => {
              const earned = user.badges.includes(badge.id);
              return (
                <div key={badge.id} className="text-center">
                  <div
                    className="w-full aspect-square rounded-2xl flex items-center justify-center text-2xl mb-1"
                    style={{
                      background: earned
                        ? "linear-gradient(135deg, hsl(var(--game-yellow)), hsl(40 100% 60%))"
                        : "hsl(var(--muted))",
                      opacity: earned ? 1 : 0.4,
                    }}>
                    {badge.emoji}
                  </div>
                  <p className="text-xs font-bold text-muted-foreground leading-tight">
                    {badge.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription */}
        {!user.isPremium && (
          <div
            className="rounded-3xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, hsl(var(--game-purple)), hsl(var(--game-pink)))" }}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">🚀</span>
              <div className="flex-1">
                <h3 className="font-black text-lg mb-1">Открой все уровни!</h3>
                <p className="text-white/80 text-sm font-semibold mb-4">
                  Уровни 2 и 3 доступны только по подписке
                </p>
                <button className="btn-bounce w-full py-3 rounded-2xl font-black text-sm bg-white"
                  style={{ color: "hsl(var(--game-purple))" }}>
                  Подключить за 299 ₽/мес ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign out */}
        <button className="w-full py-3 rounded-2xl border-2 font-bold text-muted-foreground text-sm"
          style={{ borderColor: "hsl(var(--border))" }}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
