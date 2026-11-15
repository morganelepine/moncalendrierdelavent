// Keys: TrackEvent values in client/enums/enums.ts. An unknown event is shown
// with its raw name, so a new one appears before it gets a label here.
export const CLICK_EVENT_LABELS: Record<string, string> = {
    countdown_share: "Partage du décompte",
    quiz_share: "Quiz (partage)",
    quiz_download: "Quiz (téléchargement)",
    retrospective_share: "Rétro (partage)",
    retrospective_download: "Rétro (téléchargement)",
    premium_open: "Hotte Magique (ouverture de la page)",
    premium_purchase: "Hotte Magique (achat)",
    instagram: "Instagram",
    terms: "CGU",
    privacy: "Confidentialité",
    recommended_update: "Mise à jour conseillée",
    announcement: "Annonce",
    reco_link: "Reco (lien)",
    list_reco_link: "Liste de recos (lien)",
    anecdote_source: "Anecdote (source)",
    day25_retrospective: "25 : rétrospective",
    day25_wallpaper: "25 : fond d'écran",
    day25_recipe: "25 : recette",
    day25_horoscope: "25 : horoscope",
    day25_mimes_template: "25 : template des mimes",
    day25_bingo: "25 : bingo à imprimer",
};

// premium_open sources (openPremiumScreen calls in the client).
export const CLICK_SOURCE_LABELS: Record<string, string> = {
    informations: "Infos",
    "2048_win": "2048 : victoire",
    "2048_tier": "2048 : niveau verrouillé",
    streak: "Guirlande",
};
