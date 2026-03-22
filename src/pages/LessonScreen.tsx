import { useState, useRef, useEffect } from "react";
import { User, LessonResult } from "../App";
import Icon from "@/components/ui/icon";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  lessonId: number;
  user: User;
  onComplete: (result: LessonResult) => void;
  onBack: () => void;
}

const LETTER_DATA: Record<number, {
  letter: string;
  emoji: string;
  words: { word: string; photo: string }[];
  color: string;
  bg: string;
  shadow: string;
}> = {
  101: {
    letter: "А",
    emoji: "🍎",
    words: [
      { word: "Арбуз",    photo: "https://images.unsplash.com/photo-1582281298055-e25b84a2559b?w=120&h=120&fit=crop&auto=format" },
      { word: "Апельсин", photo: "https://images.unsplash.com/photo-1547514701-42782101795e?w=120&h=120&fit=crop&auto=format" },
      { word: "Аист",     photo: "https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(0 85% 60%)",
    bg: "linear-gradient(135deg, hsl(0 85% 60%), hsl(350 85% 55%))",
    shadow: "hsl(0 85% 45%)",
  },
  102: {
    letter: "Б",
    emoji: "🐝",
    words: [
      { word: "Банан",    photo: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=120&h=120&fit=crop&auto=format" },
      { word: "Бабочка",  photo: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=120&h=120&fit=crop&auto=format" },
      { word: "Бегемот",  photo: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(45 95% 55%)",
    bg: "linear-gradient(135deg, hsl(45 95% 55%), hsl(35 95% 50%))",
    shadow: "hsl(45 95% 40%)",
  },
  103: {
    letter: "В",
    emoji: "🐺",
    words: [
      { word: "Волк",   photo: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=120&h=120&fit=crop&auto=format" },
      { word: "Виноград", photo: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=120&h=120&fit=crop&auto=format" },
      { word: "Ворона",  photo: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(220 70% 55%)",
    bg: "linear-gradient(135deg, hsl(220 70% 55%), hsl(210 70% 50%))",
    shadow: "hsl(220 70% 40%)",
  },
  104: {
    letter: "Г",
    emoji: "🦆",
    words: [
      { word: "Гусь",  photo: "https://images.unsplash.com/photo-1548550231-a08da8c88f42?w=120&h=120&fit=crop&auto=format" },
      { word: "Груша", photo: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=120&h=120&fit=crop&auto=format" },
      { word: "Гриб",  photo: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(120 60% 45%)",
    bg: "linear-gradient(135deg, hsl(120 60% 45%), hsl(100 60% 40%))",
    shadow: "hsl(120 60% 32%)",
  },
  105: {
    letter: "Д",
    emoji: "🌳",
    words: [
      { word: "Дом",     photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&h=120&fit=crop&auto=format" },
      { word: "Дыня",    photo: "https://images.unsplash.com/photo-1571575309232-4f031a5e1b6b?w=120&h=120&fit=crop&auto=format" },
      { word: "Дельфин", photo: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(25 90% 55%)",
    bg: "linear-gradient(135deg, hsl(25 90% 55%), hsl(15 90% 50%))",
    shadow: "hsl(25 90% 40%)",
  },
  106: {
    letter: "Е",
    emoji: "🦔",
    words: [
      { word: "Ёж",     photo: "https://images.unsplash.com/photo-1555169062-013468b47731?w=120&h=120&fit=crop&auto=format" },
      { word: "Ель",    photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=120&fit=crop&auto=format" },
      { word: "Енот",   photo: "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(150 60% 42%)",
    bg: "linear-gradient(135deg, hsl(150 60% 42%), hsl(140 60% 37%))",
    shadow: "hsl(150 60% 30%)",
  },
  107: {
    letter: "Ё",
    emoji: "🌲",
    words: [
      { word: "Ёж",     photo: "https://images.unsplash.com/photo-1555169062-013468b47731?w=120&h=120&fit=crop&auto=format" },
      { word: "Ёлка",   photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=120&fit=crop&auto=format" },
      { word: "Ёжик",   photo: "https://images.unsplash.com/photo-1608170825938-a8ea0305f7b5?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(160 55% 40%)",
    bg: "linear-gradient(135deg, hsl(160 55% 40%), hsl(150 55% 35%))",
    shadow: "hsl(160 55% 28%)",
  },
  108: {
    letter: "Ж",
    emoji: "🐞",
    words: [
      { word: "Жираф",   photo: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=120&h=120&fit=crop&auto=format" },
      { word: "Жук",     photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&auto=format" },
      { word: "Журавль", photo: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(50 90% 50%)",
    bg: "linear-gradient(135deg, hsl(50 90% 50%), hsl(40 90% 45%))",
    shadow: "hsl(50 90% 35%)",
  },
  109: {
    letter: "З",
    emoji: "🦓",
    words: [
      { word: "Зебра",  photo: "https://images.unsplash.com/photo-1501705388630-4e2fa65c91ce?w=120&h=120&fit=crop&auto=format" },
      { word: "Заяц",   photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=120&h=120&fit=crop&auto=format" },
      { word: "Змея",   photo: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(270 70% 60%)",
    bg: "linear-gradient(135deg, hsl(270 70% 60%), hsl(260 70% 55%))",
    shadow: "hsl(270 70% 45%)",
  },
  110: {
    letter: "И",
    emoji: "🦌",
    words: [
      { word: "Индюк",  photo: "https://images.unsplash.com/photo-1574068468678-f2f0cad8b7f4?w=120&h=120&fit=crop&auto=format" },
      { word: "Ива",    photo: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=120&h=120&fit=crop&auto=format" },
      { word: "Игла",   photo: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(190 70% 48%)",
    bg: "linear-gradient(135deg, hsl(190 70% 48%), hsl(180 70% 43%))",
    shadow: "hsl(190 70% 34%)",
  },
  111: {
    letter: "Й",
    emoji: "🎯",
    words: [
      { word: "Йогурт", photo: "https://images.unsplash.com/photo-1571212515416-fca988083f6d?w=120&h=120&fit=crop&auto=format" },
      { word: "Йод",    photo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop&auto=format" },
      { word: "Йети",   photo: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(200 65% 50%)",
    bg: "linear-gradient(135deg, hsl(200 65% 50%), hsl(190 65% 45%))",
    shadow: "hsl(200 65% 36%)",
  },
  112: {
    letter: "К",
    emoji: "🐱",
    words: [
      { word: "Кот",    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&h=120&fit=crop&auto=format" },
      { word: "Корова", photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=120&h=120&fit=crop&auto=format" },
      { word: "Кит",    photo: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(330 80% 58%)",
    bg: "linear-gradient(135deg, hsl(330 80% 58%), hsl(320 80% 53%))",
    shadow: "hsl(330 80% 43%)",
  },
  113: {
    letter: "Л",
    emoji: "🦁",
    words: [
      { word: "Лев",    photo: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=120&h=120&fit=crop&auto=format" },
      { word: "Лиса",   photo: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=120&h=120&fit=crop&auto=format" },
      { word: "Лук",    photo: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(28 85% 52%)",
    bg: "linear-gradient(135deg, hsl(28 85% 52%), hsl(18 85% 47%))",
    shadow: "hsl(28 85% 37%)",
  },
  114: {
    letter: "М",
    emoji: "🐭",
    words: [
      { word: "Медведь", photo: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=120&h=120&fit=crop&auto=format" },
      { word: "Мышь",    photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=120&h=120&fit=crop&auto=format" },
      { word: "Морковь", photo: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(10 80% 55%)",
    bg: "linear-gradient(135deg, hsl(10 80% 55%), hsl(0 80% 50%))",
    shadow: "hsl(10 80% 40%)",
  },
  115: {
    letter: "Н",
    emoji: "🌙",
    words: [
      { word: "Носорог", photo: "https://images.unsplash.com/photo-1510022151265-1d5c3885e7b8?w=120&h=120&fit=crop&auto=format" },
      { word: "Нож",     photo: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=120&h=120&fit=crop&auto=format" },
      { word: "Ночь",    photo: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(240 60% 55%)",
    bg: "linear-gradient(135deg, hsl(240 60% 55%), hsl(230 60% 50%))",
    shadow: "hsl(240 60% 40%)",
  },
  116: {
    letter: "О",
    emoji: "🦊",
    words: [
      { word: "Обезьяна", photo: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=120&h=120&fit=crop&auto=format" },
      { word: "Овца",     photo: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=120&h=120&fit=crop&auto=format" },
      { word: "Орёл",     photo: "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(35 90% 52%)",
    bg: "linear-gradient(135deg, hsl(35 90% 52%), hsl(25 90% 47%))",
    shadow: "hsl(35 90% 37%)",
  },
  117: {
    letter: "П",
    emoji: "🐧",
    words: [
      { word: "Пингвин", photo: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=120&h=120&fit=crop&auto=format" },
      { word: "Попугай", photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=120&h=120&fit=crop&auto=format" },
      { word: "Помидор", photo: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(350 80% 58%)",
    bg: "linear-gradient(135deg, hsl(350 80% 58%), hsl(340 80% 53%))",
    shadow: "hsl(350 80% 43%)",
  },
  118: {
    letter: "Р",
    emoji: "🌹",
    words: [
      { word: "Роза",    photo: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=120&h=120&fit=crop&auto=format" },
      { word: "Рыба",    photo: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=120&h=120&fit=crop&auto=format" },
      { word: "Ракета",  photo: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(0 80% 58%)",
    bg: "linear-gradient(135deg, hsl(0 80% 58%), hsl(350 80% 53%))",
    shadow: "hsl(0 80% 43%)",
  },
  119: {
    letter: "С",
    emoji: "🐘",
    words: [
      { word: "Слон",   photo: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=120&h=120&fit=crop&auto=format" },
      { word: "Собака", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop&auto=format" },
      { word: "Сыр",    photo: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(200 60% 50%)",
    bg: "linear-gradient(135deg, hsl(200 60% 50%), hsl(190 60% 45%))",
    shadow: "hsl(200 60% 36%)",
  },
  120: {
    letter: "Т",
    emoji: "🐯",
    words: [
      { word: "Тигр",    photo: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=120&h=120&fit=crop&auto=format" },
      { word: "Торт",    photo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&h=120&fit=crop&auto=format" },
      { word: "Тюлень",  photo: "https://images.unsplash.com/photo-1558618047-f4e90fef7d6a?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(20 85% 55%)",
    bg: "linear-gradient(135deg, hsl(20 85% 55%), hsl(10 85% 50%))",
    shadow: "hsl(20 85% 40%)",
  },
  121: {
    letter: "У",
    emoji: "🦆",
    words: [
      { word: "Утка",   photo: "https://images.unsplash.com/photo-1548550231-a08da8c88f42?w=120&h=120&fit=crop&auto=format" },
      { word: "Улитка", photo: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=120&h=120&fit=crop&auto=format" },
      { word: "Уж",     photo: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(180 60% 44%)",
    bg: "linear-gradient(135deg, hsl(180 60% 44%), hsl(170 60% 39%))",
    shadow: "hsl(180 60% 31%)",
  },
  122: {
    letter: "Ф",
    emoji: "🎩",
    words: [
      { word: "Фламинго", photo: "https://images.unsplash.com/photo-1572431447238-425af66a273b?w=120&h=120&fit=crop&auto=format" },
      { word: "Фрукты",   photo: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=120&h=120&fit=crop&auto=format" },
      { word: "Фонарь",   photo: "https://images.unsplash.com/photo-1511971476924-f7a3a3e27bb3?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(300 65% 55%)",
    bg: "linear-gradient(135deg, hsl(300 65% 55%), hsl(290 65% 50%))",
    shadow: "hsl(300 65% 40%)",
  },
  123: {
    letter: "Х",
    emoji: "🦔",
    words: [
      { word: "Хомяк",  photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=120&h=120&fit=crop&auto=format" },
      { word: "Хлеб",   photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&h=120&fit=crop&auto=format" },
      { word: "Хвост",  photo: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(15 75% 52%)",
    bg: "linear-gradient(135deg, hsl(15 75% 52%), hsl(5 75% 47%))",
    shadow: "hsl(15 75% 37%)",
  },
  124: {
    letter: "Ц",
    emoji: "🌸",
    words: [
      { word: "Цветок",  photo: "https://images.unsplash.com/photo-1490750967868-88df5691cc4c?w=120&h=120&fit=crop&auto=format" },
      { word: "Цапля",   photo: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=120&h=120&fit=crop&auto=format" },
      { word: "Цирк",    photo: "https://images.unsplash.com/photo-1533229716649-8da0b2a06d01?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(315 70% 57%)",
    bg: "linear-gradient(135deg, hsl(315 70% 57%), hsl(305 70% 52%))",
    shadow: "hsl(315 70% 42%)",
  },
  125: {
    letter: "Ч",
    emoji: "☕",
    words: [
      { word: "Черепаха", photo: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=120&h=120&fit=crop&auto=format" },
      { word: "Чайник",   photo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop&auto=format" },
      { word: "Чайка",    photo: "https://images.unsplash.com/photo-1570000440015-3fde4e50b5aa?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(30 80% 50%)",
    bg: "linear-gradient(135deg, hsl(30 80% 50%), hsl(20 80% 45%))",
    shadow: "hsl(30 80% 36%)",
  },
  126: {
    letter: "Ш",
    emoji: "🎱",
    words: [
      { word: "Шар",     photo: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=120&h=120&fit=crop&auto=format" },
      { word: "Шмель",   photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&auto=format" },
      { word: "Шоколад", photo: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(280 65% 55%)",
    bg: "linear-gradient(135deg, hsl(280 65% 55%), hsl(270 65% 50%))",
    shadow: "hsl(280 65% 40%)",
  },
  127: {
    letter: "Щ",
    emoji: "🛡️",
    words: [
      { word: "Щенок",  photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&h=120&fit=crop&auto=format" },
      { word: "Щука",   photo: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=120&h=120&fit=crop&auto=format" },
      { word: "Щётка",  photo: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(90 55% 45%)",
    bg: "linear-gradient(135deg, hsl(90 55% 45%), hsl(80 55% 40%))",
    shadow: "hsl(90 55% 32%)",
  },
  128: {
    letter: "Ъ",
    emoji: "🔑",
    words: [
      { word: "Объект",  photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&h=120&fit=crop&auto=format" },
      { word: "Объём",   photo: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=120&h=120&fit=crop&auto=format" },
      { word: "Съезд",   photo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(210 50% 50%)",
    bg: "linear-gradient(135deg, hsl(210 50% 50%), hsl(200 50% 45%))",
    shadow: "hsl(210 50% 36%)",
  },
  129: {
    letter: "Ы",
    emoji: "🧀",
    words: [
      { word: "Рыба",   photo: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=120&h=120&fit=crop&auto=format" },
      { word: "Мыло",   photo: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=120&h=120&fit=crop&auto=format" },
      { word: "Дым",    photo: "https://images.unsplash.com/photo-1495573258723-2c7be7a646ce?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(55 80% 50%)",
    bg: "linear-gradient(135deg, hsl(55 80% 50%), hsl(45 80% 45%))",
    shadow: "hsl(55 80% 36%)",
  },
  130: {
    letter: "Ь",
    emoji: "🍂",
    words: [
      { word: "Соль",    photo: "https://images.unsplash.com/photo-1626878299-df25f8e0e8a3?w=120&h=120&fit=crop&auto=format" },
      { word: "Мышь",    photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=120&h=120&fit=crop&auto=format" },
      { word: "Огонь",   photo: "https://images.unsplash.com/photo-1540496905036-5937c10647cc?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(25 70% 50%)",
    bg: "linear-gradient(135deg, hsl(25 70% 50%), hsl(15 70% 45%))",
    shadow: "hsl(25 70% 36%)",
  },
  131: {
    letter: "Э",
    emoji: "⚡",
    words: [
      { word: "Экран",    photo: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=120&h=120&fit=crop&auto=format" },
      { word: "Экскаватор", photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=120&h=120&fit=crop&auto=format" },
      { word: "Этаж",     photo: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(195 80% 48%)",
    bg: "linear-gradient(135deg, hsl(195 80% 48%), hsl(185 80% 43%))",
    shadow: "hsl(195 80% 34%)",
  },
  132: {
    letter: "Ю",
    emoji: "🌍",
    words: [
      { word: "Юла",    photo: "https://images.unsplash.com/photo-1558618047-f4e90fef7d6a?w=120&h=120&fit=crop&auto=format" },
      { word: "Юноша",  photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=120&h=120&fit=crop&auto=format" },
      { word: "Юг",     photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(210 80% 55%)",
    bg: "linear-gradient(135deg, hsl(210 80% 55%), hsl(200 80% 50%))",
    shadow: "hsl(210 80% 40%)",
  },
  133: {
    letter: "Я",
    emoji: "🍓",
    words: [
      { word: "Яблоко",  photo: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=120&h=120&fit=crop&auto=format" },
      { word: "Ягода",   photo: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=120&h=120&fit=crop&auto=format" },
      { word: "Якорь",   photo: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=120&h=120&fit=crop&auto=format" },
    ],
    color: "hsl(345 85% 58%)",
    bg: "linear-gradient(135deg, hsl(345 85% 58%), hsl(335 85% 53%))",
    shadow: "hsl(345 85% 43%)",
  },
};

const DEFAULT_LESSON = LETTER_DATA[101];

type Phase = "learn" | "mic" | "success" | "wrong";

export default function LessonScreen({ lessonId, user, onComplete, onBack }: Props) {
  const lesson = LETTER_DATA[lessonId] || DEFAULT_LESSON;
  const [phase, setPhase] = useState<Phase>("learn");
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState(3);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; char: string }[]>([]);
  const confettiId = useRef(0);
  const { speak, speakLetter, stop, speaking } = useTTS();

  // Auto-speak letter when lesson loads
  useEffect(() => {
    const t = setTimeout(() => speakLetter(lesson.letter), 600);
    return () => clearTimeout(t);
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const spawnConfetti = () => {
    const chars = ["⭐", "✨", "🌟", "💫", "🎉"];
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F59E0B", "#34D399"];
    const items = Array.from({ length: 16 }, (_, i) => ({
      id: confettiId.current++,
      x: 5 + Math.random() * 90,
      color: colors[i % colors.length],
      char: chars[i % chars.length],
    }));
    setConfetti(items);
    setTimeout(() => setConfetti([]), 1800);
  };

  const { state: speechState, transcript, volume, start, reset } = useSpeechRecognition(
    lesson.letter,
    {
      onResult: (heard, correct) => {
        if (correct) {
          spawnConfetti();
          setPhase("success");
          const phrases = [
            `Молодец! Ты правильно сказал букву ${lesson.letter}!`,
            `Отлично! Буква ${lesson.letter} — ты справился!`,
            `Супер! Так держать, умница!`,
          ];
          const phrase = phrases[Math.floor(Math.random() * phrases.length)];
          setTimeout(() => speak(phrase), 400);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= 2) setStars((s) => Math.max(1, s - 1));
          setPhase("wrong");
          setTimeout(() => speak(`Не расстраивайся! Попробуй ещё раз. Буква ${lesson.letter}.`), 300);
        }
      },
    }
  );

  const handleMicClick = () => {
    reset();
    setPhase("mic");
    start();
  };

  const handleRetry = () => {
    reset();
    setPhase("learn");
  };

  const handleComplete = () => {
    onComplete({
      lessonId,
      stars,
      badge: lessonId === 101 ? "first_letter" : undefined,
    });
  };

  const progressWidth =
    phase === "learn" ? "30%" : phase === "mic" ? "65%" : "100%";

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-background">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none z-50 text-2xl"
          style={{
            left: `${c.x}%`,
            top: "-5%",
            animation: "confettiFall 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
          }}>
          {c.char}
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted transition-transform active:scale-95">
          <Icon name="X" size={20} />
        </button>

        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className="text-2xl transition-all duration-300"
              style={{ opacity: s <= stars ? 1 : 0.25, transform: s <= stars ? "scale(1)" : "scale(0.8)" }}>
              ⭐
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-muted rounded-xl px-3 py-1.5">
          <span className="text-base">⭐</span>
          <span className="font-black text-sm">{user.stars}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-5">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-600 ease-out"
            style={{ width: progressWidth, background: lesson.bg }}
          />
        </div>
      </div>

      {/* ── LEARN PHASE ── */}
      {phase === "learn" && (
        <div className="flex-1 flex flex-col items-center px-5 pb-6 animate-fade-in">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
            Знакомимся с буквой
          </p>

          {/* Giant floating letter — tap to hear */}
          <button
            onClick={() => speakLetter(lesson.letter)}
            className="w-44 h-44 rounded-[2.5rem] flex flex-col items-center justify-center mb-6 shadow-xl relative transition-transform active:scale-95"
            style={{
              background: lesson.bg,
              boxShadow: speaking === `letter_${lesson.letter}`
                ? `0 0 0 6px ${lesson.color}40, 0 16px 48px ${lesson.color}66`
                : `0 12px 40px ${lesson.color}55`,
              animation: "floatY 3s ease-in-out infinite",
            }}>
            <span className="font-black text-white leading-none" style={{ fontSize: "7rem", textShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
              {lesson.letter}
            </span>
            <span className="text-white/70 text-xs font-bold mt-1 flex items-center gap-1">
              {speaking === `letter_${lesson.letter}` ? "🔊 звучит..." : "🔊 нажми"}
            </span>
          </button>

          {/* Words */}
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">
            Слова на «{lesson.letter}»
          </p>
          <div className="w-full space-y-2.5 mb-6">
            {lesson.words.map((w, i) => {
              const isSpeaking = speaking === w.word;
              return (
                <button
                  key={i}
                  onClick={() => isSpeaking ? stop() : speak(w.word)}
                  className="game-card w-full flex items-center gap-3 px-3 py-3 transition-all active:scale-[0.98] text-left overflow-hidden"
                  style={{
                    boxShadow: isSpeaking
                      ? `0 0 0 3px ${lesson.color}70, 0 8px 0 rgba(0,0,0,0.08), 0 2px 20px rgba(0,0,0,0.06)`
                      : undefined,
                  }}>
                  {/* Photo */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-muted">
                    <img
                      src={w.photo}
                      alt={w.word}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ transform: isSpeaking ? "scale(1.08)" : "scale(1)" }}
                    />
                  </div>
                  {/* Word */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-black text-2xl" style={{ color: lesson.color }}>
                        {w.word[0]}
                      </span>
                      <span className="font-bold text-xl text-foreground">{w.word.slice(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                      {isSpeaking ? "🔊 звучит..." : "нажми, чтобы услышать"}
                    </p>
                  </div>
                  {/* Play button */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: isSpeaking ? lesson.bg : "hsl(var(--muted))" }}>
                    <span className="text-lg">{isSpeaking ? "🔊" : "▶️"}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA button */}
          <button
            onClick={handleMicClick}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white relative overflow-hidden"
            style={{ background: lesson.bg, boxShadow: `0 6px 0 ${lesson.shadow}` }}>
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎤</span>
              Произнести «{lesson.letter}»
            </span>
          </button>
        </div>
      )}

      {/* ── MIC PHASE ── */}
      {phase === "mic" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          {/* Mic pulse ring */}
          <div className="relative mb-8">
            {speechState === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ background: lesson.color }} />
                <div className="absolute -inset-4 rounded-full opacity-10 animate-ping" style={{ background: lesson.color, animationDelay: "0.3s" }} />
              </>
            )}
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
              style={{
                background: lesson.bg,
                boxShadow: speechState === "listening"
                  ? `0 0 0 8px ${lesson.color}30, 0 12px 40px ${lesson.color}55`
                  : `0 12px 40px ${lesson.color}40`,
                transform: speechState === "listening" ? "scale(1.05)" : "scale(1)",
              }}>
              <span className="font-black text-white leading-none" style={{ fontSize: "5.5rem" }}>
                {lesson.letter}
              </span>
            </div>
          </div>

          {/* Equalizer bars */}
          <div className="flex items-end gap-1 h-12 mb-6">
            {(volume.length > 0 ? volume : Array(12).fill(0)).map((v, i) => (
              <div
                key={i}
                className="w-2.5 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(8, v * 48)}px`,
                  background: speechState === "listening"
                    ? lesson.color
                    : "hsl(var(--muted-foreground))",
                  opacity: speechState === "listening" ? 0.7 + v * 0.3 : 0.3,
                }}
              />
            ))}
          </div>

          <p className="font-black text-xl text-foreground mb-1">
            {speechState === "listening" ? "Слушаю..." : "Обрабатываю..."}
          </p>
          <p className="font-semibold text-muted-foreground text-center text-sm">
            {speechState === "listening"
              ? <>Скажи букву <span className="font-black text-base" style={{ color: lesson.color }}>«{lesson.letter}»</span> вслух</>
              : "Подожди секунду ⏳"}
          </p>

          {speechState === "unsupported" && (
            <div className="mt-6 game-card p-4 text-center">
              <p className="font-bold text-sm text-muted-foreground">
                Браузер не поддерживает распознавание речи.<br />
                Попробуй Chrome или Safari.
              </p>
              <button onClick={handleRetry} className="mt-3 font-black text-sm" style={{ color: lesson.color }}>
                Назад
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── SUCCESS PHASE ── */}
      {phase === "success" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div style={{ animation: "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} className="mb-3">
            <span className="text-8xl">🎉</span>
          </div>
          <h2 className="text-4xl font-black text-foreground mb-1">Отлично!</h2>
          {transcript && (
            <p className="text-muted-foreground font-semibold mb-2 text-sm">
              Я услышал: <span className="font-black text-foreground">«{transcript}»</span>
            </p>
          )}
          <p className="text-muted-foreground font-semibold text-center mb-7">
            Ты правильно произнёс букву{" "}
            <span className="font-black text-xl" style={{ color: lesson.color }}>«{lesson.letter}»</span>
          </p>

          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map((s, i) => (
              <span
                key={s}
                className="text-5xl"
                style={{
                  animation: `bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards`,
                  animationDelay: `${0.1 + i * 0.12}s`,
                  opacity: 0,
                }}>
                {s <= stars ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white"
            style={{
              background: "linear-gradient(135deg, hsl(var(--game-green)), hsl(142 60% 40%))",
              boxShadow: "0 6px 0 hsl(142 60% 35%)",
            }}>
            Получить награду 🏆
          </button>
        </div>
      )}

      {/* ── WRONG PHASE ── */}
      {phase === "wrong" && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
          <div style={{ animation: "bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} className="mb-3">
            <span className="text-7xl">😅</span>
          </div>
          <h2 className="text-2xl font-black text-foreground mb-1">Попробуй ещё!</h2>
          {transcript && (
            <p className="text-muted-foreground font-semibold mb-1 text-sm">
              Я услышал: <span className="font-black text-foreground">«{transcript}»</span>
            </p>
          )}
          <p className="font-semibold text-muted-foreground text-center mb-6">
            Произнеси букву <span className="font-black text-lg" style={{ color: lesson.color }}>«{lesson.letter}»</span> чётко и громко
          </p>

          <div className="game-card p-4 mb-6 w-full">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 text-center">Подсказка</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{lesson.words[0].emoji}</span>
              <p className="font-black text-xl text-foreground">{lesson.words[0].word}</p>
            </div>
            <p className="text-center text-sm text-muted-foreground font-semibold mt-1">
              Скажи первую букву этого слова
            </p>
          </div>

          <button
            onClick={handleMicClick}
            className="btn-bounce w-full py-5 rounded-2xl font-black text-lg text-white mb-3"
            style={{ background: lesson.bg, boxShadow: `0 6px 0 ${lesson.shadow}` }}>
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎤</span>
              Попробовать снова
            </span>
          </button>

          <button
            onClick={handleRetry}
            className="w-full py-3 rounded-2xl font-bold text-sm text-muted-foreground">
            ← Вернуться к букве
          </button>
        </div>
      )}
    </div>
  );
}