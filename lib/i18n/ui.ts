import type { Locale } from "@/lib/i18n/types";

export interface UiDictionary {
  landing: {
    title: string;
    subtitle: string;
    tagline: string;
    newAccount: string;
    signIn: string;
  };
  auth: {
    signInTitle: string;
    createAccountTitle: string;
    nickname: string;
    password: string;
    signInButton: string;
    createAccountButton: string;
  };
  menu: {
    signedInAs: string;
    premiumBadge: string;
    continueRun: string;
    newRun: string;
    runsLeftToday: (n: number) => string;
    outOfRunsToday: string;
    goPremium: string;
    profile: string;
    achievements: string;
    leaderboard: string;
    knowledgeArchive: string;
    premium: string;
    logout: string;
  };
  game: {
    look: string;
    move: string;
    inventory: string;
    map: string;
    peopleHere: string;
    nearby: string;
    talkTo: (name: string) => string;
    take: (name: string) => string;
    giveTo: (name: string) => string;
    moveToTitle: string;
    lockedSuffix: string;
    unexploredPassage: string;
    inventoryTitle: string;
    inventoryEmpty: string;
    use: string;
    mapTitle: string;
    unknownLocation: string;
    achievementUnlocked: string;
    tapToDismiss: string;
    returnToMenu: string;
    characterLabel: string;
    peopleRescuedLabel: string;
    locationsDiscoveredLabel: string;
    secretsUncoveredLabel: string;
    shipCalm: string;
    historyTitle: string;
    historyEmpty: string;
  };
  ship: {
    none: string;
    light: string;
    moderate: string;
    severe: string;
    critical: string;
    flooding: string;
    panic: string;
    damage: string;
    power: string;
    fire: string;
  };
  relationship: {
    hostile: string;
    distrustful: string;
    neutral: string;
    trusting: string;
    loyal: string;
  };
  profile: {
    freeAccount: string;
    premiumMember: string;
    totalRuns: string;
    survivals: string;
    peopleRescued: string;
    endingsFound: string;
    achievementsLabel: string;
    knowledgeEntries: string;
    backToMenu: string;
  };
  achievementsPage: {
    title: string;
    hiddenName: string;
    hiddenDescription: string;
    backToMenu: string;
  };
  leaderboard: {
    title: string;
    backToMenu: string;
    noEntries: string;
    yes: string;
    no: string;
    minutesSuffix: string;
    categories: {
      rescuers: string;
      explorers: string;
      detectives: string;
      survivors: string;
      heroes: string;
      speed: string;
      collectors: string;
    };
  };
  archive: {
    title: string;
    empty: string;
    backToMenu: string;
    categories: {
      People: string;
      Locations: string;
      Events: string;
      Secrets: string;
      Technical: string;
      Endings: string;
    };
  };
  premium: {
    title: string;
    alreadyPremium: string;
    description: string;
    comingSoon: string;
    backToMenu: string;
  };
  admin: {
    title: string;
    grantRevokeTitle: string;
    nicknamePlaceholder: string;
    activate: string;
    deactivate: string;
    activated: (nickname: string) => string;
    deactivated: (nickname: string) => string;
    failed: string;
  };
  errors: {
    notAuthenticated: string;
    invalidInput: string;
    nicknameTaken: string;
    invalidCredentials: string;
    forbidden: string;
    runNotFound: string;
    runAlreadyEnded: string;
    unknownArchetype: string;
    premiumRequiredArchetype: string;
    dailyLimitReached: string;
    userNotFound: string;
    invalidAction: string;
    somethingWrong: string;
    thisRunEnded: string;
    theyArentHere: string;
    theyHaveNothingToSay: string;
    notSomethingYouCanSayNow: string;
    noActiveConversation: string;
    thatPlaceDoesntExist: string;
    cantGetThereDirectly: string;
    areaRestricted: string;
    wayLockedOrBlocked: string;
    itemNotHere: string;
    dontHaveThatItem: string;
    theyArentHereGive: string;
    nothingMoreToSee: string;
    unknownActionType: string;
  };
}

const en: UiDictionary = {
  landing: {
    title: "TITANIC",
    subtitle: "THE LAST CHANCE",
    tagline:
      "April 14, 1912. Explore. Talk. Investigate. Remember. Make decisions — and live with the consequences.",
    newAccount: "New Account",
    signIn: "Sign In",
  },
  auth: {
    signInTitle: "Sign In",
    createAccountTitle: "Create Account",
    nickname: "Nickname",
    password: "Password",
    signInButton: "Sign In",
    createAccountButton: "Create Account",
  },
  menu: {
    signedInAs: "Signed in as",
    premiumBadge: "Premium",
    continueRun: "Continue",
    newRun: "New Run",
    runsLeftToday: (n) => `(${n} left today)`,
    outOfRunsToday: "Out of free runs for today.",
    goPremium: "Go Premium",
    profile: "Profile",
    achievements: "Achievements",
    leaderboard: "Leaderboard",
    knowledgeArchive: "Knowledge Archive",
    premium: "Premium",
    logout: "Logout",
  },
  game: {
    look: "Look",
    move: "Move",
    inventory: "Inventory",
    map: "Map",
    peopleHere: "People here",
    nearby: "Nearby",
    talkTo: (name) => `Talk: ${name}`,
    take: (name) => `Take ${name}`,
    giveTo: (name) => `Give to ${name}`,
    moveToTitle: "Move to...",
    lockedSuffix: " (locked)",
    unexploredPassage: "Unexplored passage",
    inventoryTitle: "Inventory",
    inventoryEmpty: "You carry nothing of note.",
    use: "Use",
    mapTitle: "Ship Map",
    unknownLocation: "???",
    achievementUnlocked: "Achievement unlocked! Tap to dismiss.",
    tapToDismiss: "Tap to dismiss.",
    returnToMenu: "Return to Menu",
    characterLabel: "Character",
    peopleRescuedLabel: "People rescued",
    locationsDiscoveredLabel: "Locations discovered",
    secretsUncoveredLabel: "Secrets uncovered",
    shipCalm: "The ship feels calm tonight.",
    historyTitle: "History",
    historyEmpty: "Nothing has happened yet.",
  },
  ship: {
    none: "Calm",
    light: "Slight",
    moderate: "Noticeable",
    severe: "Severe",
    critical: "Critical",
    flooding: "flooding",
    panic: "panic",
    damage: "damage",
    power: "power",
    fire: "fire",
  },
  relationship: {
    hostile: "Hostile",
    distrustful: "Distrustful",
    neutral: "Neutral",
    trusting: "Trusting",
    loyal: "Loyal",
  },
  profile: {
    freeAccount: "Free account",
    premiumMember: "Premium member",
    totalRuns: "Total Runs",
    survivals: "Survivals",
    peopleRescued: "People Rescued",
    endingsFound: "Endings Found",
    achievementsLabel: "Achievements",
    knowledgeEntries: "Knowledge Entries",
    backToMenu: "Back to Menu",
  },
  achievementsPage: {
    title: "Achievements",
    hiddenName: "???",
    hiddenDescription: "A hidden achievement.",
    backToMenu: "Back to Menu",
  },
  leaderboard: {
    title: "Leaderboard",
    backToMenu: "Back to Menu",
    noEntries: "No entries yet.",
    yes: "Yes",
    no: "No",
    minutesSuffix: "min",
    categories: {
      rescuers: "Rescuers",
      explorers: "Explorers",
      detectives: "Detectives",
      survivors: "Survivors",
      heroes: "Heroes",
      speed: "Speed",
      collectors: "Collectors",
    },
  },
  archive: {
    title: "Knowledge Archive",
    empty: "Nothing discovered yet. Play a run to start filling this in.",
    backToMenu: "Back to Menu",
    categories: {
      People: "People",
      Locations: "Locations",
      Events: "Events",
      Secrets: "Secrets",
      Technical: "Technical",
      Endings: "Endings",
    },
  },
  premium: {
    title: "Premium",
    alreadyPremium: "You already have Premium. Thank you for supporting the ship.",
    description:
      "Premium unlocks unlimited daily runs and additional story content — alternative characters, extra investigations, and special campaigns. It never changes stats, odds, or gives you answers: everyone plays the same fair game.",
    comingSoon: "Premium is coming soon.",
    backToMenu: "Back to Menu",
  },
  admin: {
    title: "Admin",
    grantRevokeTitle: "Grant / Revoke Premium (testing)",
    nicknamePlaceholder: "Nickname",
    activate: "Activate",
    deactivate: "Deactivate",
    activated: (nickname) => `Activated Premium for ${nickname}.`,
    deactivated: (nickname) => `Deactivated Premium for ${nickname}.`,
    failed: "Failed.",
  },
  errors: {
    notAuthenticated: "Not authenticated",
    invalidInput: "Invalid input",
    nicknameTaken: "Nickname is already taken",
    invalidCredentials: "Invalid nickname or password",
    forbidden: "Forbidden",
    runNotFound: "Run not found",
    runAlreadyEnded: "This run has already ended",
    unknownArchetype: "Unknown archetype",
    premiumRequiredArchetype: "This archetype requires Premium",
    dailyLimitReached: "Daily free run limit reached. Upgrade to Premium for unlimited runs.",
    userNotFound: "User not found",
    invalidAction: "Invalid action",
    somethingWrong: "Something went wrong.",
    thisRunEnded: "This run has ended.",
    theyArentHere: "They aren't here.",
    theyHaveNothingToSay: "They have nothing to say.",
    notSomethingYouCanSayNow: "That's not something you can say right now.",
    noActiveConversation: "No conversation is active.",
    thatPlaceDoesntExist: "That place doesn't exist.",
    cantGetThereDirectly: "You can't get there directly from here.",
    areaRestricted: "This area is restricted — you don't belong here.",
    wayLockedOrBlocked: "The way is locked or blocked.",
    itemNotHere: "That item isn't here.",
    dontHaveThatItem: "You don't have that item.",
    theyArentHereGive: "They aren't here.",
    nothingMoreToSee: "Nothing more to see.",
    unknownActionType: "Unknown action.",
  },
};

const ru: UiDictionary = {
  landing: {
    title: "ТИТАНИК",
    subtitle: "ПОСЛЕДНИЙ ШАНС",
    tagline:
      "14 апреля 1912 года. Исследуйте. Говорите. Расследуйте. Запоминайте. Принимайте решения — и живите с их последствиями.",
    newAccount: "Создать аккаунт",
    signIn: "Войти",
  },
  auth: {
    signInTitle: "Вход",
    createAccountTitle: "Регистрация",
    nickname: "Никнейм",
    password: "Пароль",
    signInButton: "Войти",
    createAccountButton: "Создать аккаунт",
  },
  menu: {
    signedInAs: "Вы вошли как",
    premiumBadge: "Premium",
    continueRun: "Продолжить",
    newRun: "Новый забег",
    runsLeftToday: (n) => `(осталось сегодня: ${n})`,
    outOfRunsToday: "Бесплатные забеги на сегодня закончились.",
    goPremium: "Оформить Premium",
    profile: "Профиль",
    achievements: "Достижения",
    leaderboard: "Таблица лидеров",
    knowledgeArchive: "Архив знаний",
    premium: "Premium",
    logout: "Выйти",
  },
  game: {
    look: "Осмотреться",
    move: "Идти",
    inventory: "Инвентарь",
    map: "Карта",
    peopleHere: "Здесь находятся",
    nearby: "Рядом",
    talkTo: (name) => `Поговорить: ${name}`,
    take: (name) => `Взять: ${name}`,
    giveTo: (name) => `Отдать: ${name}`,
    moveToTitle: "Куда пойти...",
    lockedSuffix: " (заперто)",
    unexploredPassage: "Неисследованный проход",
    inventoryTitle: "Инвентарь",
    inventoryEmpty: "У вас нет ничего примечательного.",
    use: "Использовать",
    mapTitle: "Карта корабля",
    unknownLocation: "???",
    achievementUnlocked: "Достижение получено! Нажмите, чтобы закрыть.",
    tapToDismiss: "Нажмите, чтобы закрыть.",
    returnToMenu: "Вернуться в меню",
    characterLabel: "Персонаж",
    peopleRescuedLabel: "Спасено людей",
    locationsDiscoveredLabel: "Исследовано локаций",
    secretsUncoveredLabel: "Раскрыто секретов",
    shipCalm: "Этой ночью на корабле спокойно.",
    historyTitle: "История",
    historyEmpty: "Пока ничего не произошло.",
  },
  ship: {
    none: "Спокойно",
    light: "Небольшое",
    moderate: "Заметное",
    severe: "Серьёзное",
    critical: "Критическое",
    flooding: "затопление",
    panic: "паника",
    damage: "повреждения",
    power: "энергия",
    fire: "пожар",
  },
  relationship: {
    hostile: "Враждебность",
    distrustful: "Недоверие",
    neutral: "Нейтралитет",
    trusting: "Доверие",
    loyal: "Преданность",
  },
  profile: {
    freeAccount: "Бесплатный аккаунт",
    premiumMember: "Premium-аккаунт",
    totalRuns: "Всего забегов",
    survivals: "Выживаний",
    peopleRescued: "Спасено людей",
    endingsFound: "Найдено концовок",
    achievementsLabel: "Достижения",
    knowledgeEntries: "Записей в архиве",
    backToMenu: "Вернуться в меню",
  },
  achievementsPage: {
    title: "Достижения",
    hiddenName: "???",
    hiddenDescription: "Скрытое достижение.",
    backToMenu: "Вернуться в меню",
  },
  leaderboard: {
    title: "Таблица лидеров",
    backToMenu: "Вернуться в меню",
    noEntries: "Пока нет записей.",
    yes: "Да",
    no: "Нет",
    minutesSuffix: "мин",
    categories: {
      rescuers: "Спасатели",
      explorers: "Исследователи",
      detectives: "Детективы",
      survivors: "Выжившие",
      heroes: "Герои",
      speed: "Скорость",
      collectors: "Коллекционеры",
    },
  },
  archive: {
    title: "Архив знаний",
    empty: "Пока ничего не открыто. Сыграйте забег, чтобы начать заполнять архив.",
    backToMenu: "Вернуться в меню",
    categories: {
      People: "Люди",
      Locations: "Места",
      Events: "События",
      Secrets: "Секреты",
      Technical: "Техническое",
      Endings: "Концовки",
    },
  },
  premium: {
    title: "Premium",
    alreadyPremium: "У вас уже есть Premium. Спасибо, что поддерживаете корабль.",
    description:
      "Premium открывает неограниченное количество забегов в день и дополнительный сюжетный контент — альтернативных персонажей, дополнительные расследования и специальные кампании. Premium никогда не меняет характеристики, шансы и не даёт готовых ответов: все играют по одним и тем же честным правилам.",
    comingSoon: "Premium скоро появится.",
    backToMenu: "Вернуться в меню",
  },
  admin: {
    title: "Админ-панель",
    grantRevokeTitle: "Выдать / отозвать Premium (для тестов)",
    nicknamePlaceholder: "Никнейм",
    activate: "Активировать",
    deactivate: "Отключить",
    activated: (nickname) => `Premium активирован для ${nickname}.`,
    deactivated: (nickname) => `Premium отключён для ${nickname}.`,
    failed: "Не удалось выполнить.",
  },
  errors: {
    notAuthenticated: "Требуется вход в аккаунт",
    invalidInput: "Некорректные данные",
    nicknameTaken: "Этот никнейм уже занят",
    invalidCredentials: "Неверный никнейм или пароль",
    forbidden: "Доступ запрещён",
    runNotFound: "Забег не найден",
    runAlreadyEnded: "Этот забег уже завершён",
    unknownArchetype: "Неизвестный архетип",
    premiumRequiredArchetype: "Этот архетип доступен только с Premium",
    dailyLimitReached: "Дневной лимит бесплатных забегов исчерпан. Оформите Premium для безлимитных забегов.",
    userNotFound: "Пользователь не найден",
    invalidAction: "Некорректное действие",
    somethingWrong: "Что-то пошло не так.",
    thisRunEnded: "Этот забег завершён.",
    theyArentHere: "Их здесь нет.",
    theyHaveNothingToSay: "Им нечего сказать.",
    notSomethingYouCanSayNow: "Сейчас вы не можете этого сказать.",
    noActiveConversation: "Разговор не начат.",
    thatPlaceDoesntExist: "Такого места не существует.",
    cantGetThereDirectly: "Отсюда туда напрямую не попасть.",
    areaRestricted: "Эта зона закрыта для вас — здесь вам не место.",
    wayLockedOrBlocked: "Проход заперт или заблокирован.",
    itemNotHere: "Этого предмета здесь нет.",
    dontHaveThatItem: "У вас нет этого предмета.",
    theyArentHereGive: "Их здесь нет.",
    nothingMoreToSee: "Больше здесь ничего интересного нет.",
    unknownActionType: "Неизвестное действие.",
  },
};

const dictionaries: Record<Locale, UiDictionary> = { en, ru };

export function getUiDictionary(locale: Locale): UiDictionary {
  return dictionaries[locale];
}
