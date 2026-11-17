import { ContentFamily } from "../types";

export const SUBTYPES_BY_TYPE: Record<ContentFamily, string[]> = {
    anecdote: ["anecdote", "word", "song", "drink"],
    idea: ["idea", "list", "recipe", "personality_quiz", "cards"],
    game: [
        "quiz-noel",
        "quiz-citation",
        "quiz-emojis",
        "quiz-halloween",
        "pendu",
        "wordle",
        "jeu",
    ],
    story: ["story", "article"],
};

type ContentFieldLabels = [string, string | null, string | null, string | null];

// content1-4 mean different things per family; null hides an unused field.
const CONTENT_FIELD_LABELS: Record<ContentFamily, ContentFieldLabels> = {
    anecdote: ["Texte", "Nom de la source", "URL de la source", null],
    idea: [
        "Texte / intro",
        "Détails (ex. ingrédients pour une recette, règles d'un jeu...)",
        "Source / crédit photo",
        "Sous-catégorie (ex. book, video, recipe, creator)",
    ],
    game: ["Mots à trouver", null, null, null],
    story: [
        "Teaser (uniquement pour les articles)",
        "Texte / corps du chapitre",
        'Marqueur "end" (fin de chapitre — laisser vide sinon)',
        "Image (uniquement pour les articles)",
    ],
};

// The letters game ("jeu") is the only game still reading content2.
export const getContentFieldLabels = (
    type: ContentFamily,
    subType: string,
): ContentFieldLabels => {
    const labels = CONTENT_FIELD_LABELS[type];
    if (type === "game" && subType === "jeu") {
        return [
            labels[0],
            "Réponses (dans l'ordre, séparées par des virgules)",
            labels[2],
            labels[3],
        ];
    }
    return labels;
};
