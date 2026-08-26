import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { personalityDescription } from "@/lib/pet/personality";
import type { Personality, PetStats } from "@/lib/pet/types";

const MODEL = "claude-haiku-4-5-20251001";

export interface ChatHistoryItem {
  role: "USER" | "PET";
  content: string;
}

function buildSystemPrompt(petName: string, stage: string, personality: Personality, stats: PetStats): string {
  const mood: string[] = [];
  if (stats.hunger < 25) mood.push("сильно проголодался");
  if (stats.energy < 25) mood.push("очень устал");
  if (stats.trust < 20) mood.push("чувствует себя брошенным и обиженным");
  if (stats.trust > 80) mood.push("обожает своего хозяина");

  return [
    `Ты — ${petName}, ${stage}, ручное существо из ролевой игры-питомца.`,
    `Твой характер: ${personalityDescription(personality)}.`,
    mood.length > 0 ? `Сейчас ты: ${mood.join(", ")}.` : "",
    "Отвечай от первого лица, коротко (1-3 предложения), живо и эмоционально, в стиле своего характера.",
    "Ты помнишь предыдущие разговоры с хозяином — используй историю переписки ниже, чтобы отвечать так, будто действительно помнишь его.",
    "Не используй markdown, не представляйся заново, не пиши system-подобный текст — только реплика питомца.",
  ]
    .filter(Boolean)
    .join("\n");
}

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

/** Zero-cost fallback used when no ANTHROPIC_API_KEY is configured yet, so the app still works end-to-end. */
function fallbackReply(petName: string, userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (/привет|здравств/.test(lower)) return `Привет! Я ${petName}, рад тебя видеть!`;
  if (/как дела|как ты/.test(lower)) return "У меня всё хорошо, особенно когда ты рядом!";
  return "Мур... я тебя слышу, но пока не умею отвечать по-настоящему — хозяину нужно подключить ИИ-ключ.";
}

export async function generatePetReply(params: {
  petName: string;
  stageLabel: string;
  personality: Personality;
  stats: PetStats;
  history: ChatHistoryItem[];
  userMessage: string;
}): Promise<string> {
  const anthropic = getClient();
  if (!anthropic) {
    return fallbackReply(params.petName, params.userMessage);
  }

  const system = buildSystemPrompt(params.petName, params.stageLabel, params.personality, params.stats);
  const messages: Anthropic.MessageParam[] = [
    ...params.history.slice(-10).map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    })),
    { role: "user", content: params.userMessage },
  ];

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 200,
    system,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text.trim() : fallbackReply(params.petName, params.userMessage);
}
