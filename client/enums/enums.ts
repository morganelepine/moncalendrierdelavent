export enum ContentType {
    Idea = "idea",
    Anecdote = "anecdote",
    Game = "game",
    Quiz = "quiz",
    Story = "story",
}

export enum IdeaType {
    Book = "book",
    Recipe = "recipe",
    Idea = "idea",
    List = "list",
    Video = "video",
    Game = "game",
    PersonalityQuiz = "personality_quiz",
    Cards = "cards",
    Audio = "audio",
}

export enum GameType {
    Hangman = "hangman",
    Wordle = "wordle",
    InputGame = "inputGame",
    QuizCitation = "quiz-citation",
    QuizNoel = "quiz-noel",
    QuizEmojis = "quiz-emojis",
    QuizHalloween = "quiz-halloween",
}

export enum Season {
    Christmas = "christmas",
    Halloween = "halloween",
}

export enum ScoreType {
    ContentOpening = "ContentOpening",
    GameAnswer = "GameAnswer",
    DayOpening = "DayOpening",
    Challenge = "Challenge",
    OctoberOpening = "OctoberOpening", // Just a record that the day was opened
}

// Values match the ids in data/challenges_data.ts
export enum ChallengeId {
    TvMoviesSchedule = 1,
    Thanks = 2,
    AllDayRecommendations = 3,
    ClosedDayTaps = 4,
    ShareCountdown = 5,
    DailySong = 6,
    ShareQuizProfile = 7,
    NightOpening = 8,
    Game2048Score = 9,
    FollowInstagram = 10,
    BingoCells = 11,
    Premium = 12,
}

export enum CountdownVariant {
    Nights = "nights", // "x nuits avant Noël" - default
    Columns = "columns", // days/hours/minutes/seconds side by side, big number above small label
}

// What the home screen counts down to before December (October is always Halloween).
export enum CountdownTarget {
    Calendar = "calendar", // "x jours avant le départ du calendrier" - default
    Christmas = "christmas", // same countdown as in December, straight to Noël
}

export enum ChristmasTargetDay {
    Eve = 24, // 24 décembre - réveillon
    Day = 25, // 25 décembre - default
}

// Stored as-is in ClickEvent.event (server checks /^[a-z0-9_]+$/).
export enum TrackEvent {
    // Sharing
    CountdownShare = "countdown_share",
    QuizShare = "quiz_share", // source: quiz title
    QuizDownload = "quiz_download", // source: quiz title
    RetrospectiveShare = "retrospective_share",
    RetrospectiveDownload = "retrospective_download",

    // Premium
    PremiumOpen = "premium_open", // source: entry point
    PremiumPurchase = "premium_purchase",

    // External links
    Instagram = "instagram",
    Terms = "terms",
    Privacy = "privacy",

    // App updates
    RecommendedUpdate = "recommended_update",
    Announcement = "announcement", // source: announcement id

    // Contents
    RecoLink = "reco_link", // source: content title
    ListRecoLink = "list_reco_link", // source: item title
    AnecdoteSource = "anecdote_source", // source: anecdote title

    // Day 25
    Day25Retrospective = "day25_retrospective",
    Day25Wallpaper = "day25_wallpaper", // source: wallpaper id
    Day25Recipe = "day25_recipe", // source: recipe title
    Day25Horoscope = "day25_horoscope",
    Day25MimesTemplate = "day25_mimes_template",
    Day25Bingo = "day25_bingo",
}
