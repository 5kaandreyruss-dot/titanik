import type { LocalizedText } from "@/lib/i18n/types";

function bi(en: string, ru: string): LocalizedText {
  return { en, ru };
}

/**
 * Bilingual message builders for engine-generated log/effect text (as
 * opposed to content-authored text, which is already a LocalizedText).
 * Both languages are baked into the persisted GameRunState.log at write
 * time so switching the UI language later still renders old log lines
 * correctly.
 */
export const engineMessages = {
  placeDoesntExist: () => bi("That place doesn't exist.", "Такого места не существует."),
  cantGetThereDirectly: () => bi("You can't get there directly from here.", "Отсюда туда напрямую не попасть."),
  areaRestricted: () =>
    bi("This area is restricted — you don't belong here.", "Эта зона закрыта для вас — здесь вам не место."),
  wayLockedOrBlocked: () => bi("The way is locked or blocked.", "Проход заперт или заблокирован."),
  foundWayInto: (name: LocalizedText) =>
    bi(`You find a way past the obstacle into ${name.en}.`, `Вам удаётся пробраться в: ${name.ru}.`),
  discovered: (name: LocalizedText) => bi(`Discovered: ${name.en}`, `Открыто: ${name.ru}`),
  movedTo: (name: LocalizedText) => bi(`You make your way to ${name.en}.`, `Вы направляетесь в: ${name.ru}.`),
  itemNotHere: () => bi("That item isn't here.", "Этого предмета здесь нет."),
  youTake: (name: LocalizedText) => bi(`You take the ${name.en}.`, `Вы берёте: ${name.ru}.`),
  dontHaveItem: () => bi("You don't have that item.", "У вас нет этого предмета."),
  theyArentHere: () => bi("They aren't here.", "Их здесь нет."),
  youGiveTo: (item: LocalizedText, npcName: string) =>
    bi(`You give the ${item.en} to ${npcName}.`, `Вы отдаёте ${npcName}: ${item.ru}.`),
  theyHaveNothingToSay: () => bi("They have nothing to say.", "Им нечего сказать."),
  notSomethingYouCanSayNow: () =>
    bi("That's not something you can say right now.", "Сейчас вы не можете этого сказать."),
  noActiveConversation: () => bi("No conversation is active.", "Разговор не начат."),
  newKnowledge: (title: LocalizedText) => bi(`New knowledge: ${title.en}`, `Новое знание: ${title.ru}`),
  locationUnlocked: (name: LocalizedText) => bi(`Location unlocked: ${name.en}`, `Локация открыта: ${name.ru}`),
  itemObtained: (name: LocalizedText) => bi(`Item obtained: ${name.en}`, `Получен предмет: ${name.ru}`),
  rescued: (npcName: string) => bi(`Rescued: ${npcName}`, `Спасён(а): ${npcName}`),
  runEnded: () => bi("This run has ended.", "Этот забег завершён."),
  youUse: (name: LocalizedText) => bi(`You use the ${name.en}.`, `Вы используете: ${name.ru}.`),
  timePasses: (minutes: number) => bi(`Time passes. (${minutes} min)`, `Проходит время. (${minutes} мин)`),
  unknownAction: () => bi("Unknown action.", "Неизвестное действие."),
  nothingMoreToSee: () => bi("Nothing more to see.", "Больше здесь ничего интересного нет."),
  npcInspect: (name: string, profession: LocalizedText) =>
    bi(`${name}: ${profession.en}.`, `${name}: ${profession.ru}.`),
  nothingRemarkableHere: () => bi("There is nothing remarkable here.", "Здесь нет ничего примечательного."),
};
