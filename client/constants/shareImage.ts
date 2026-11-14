export const SHARE_FORMATS = {
    // 4:5 portrait, the format Instagram and most messaging apps display in full.
    post: { width: 1080, height: 1350 },
    // 9:16, full screen in Instagram / WhatsApp stories.
    story: { width: 1080, height: 1920 },
} as const;

export type ShareFormat = keyof typeof SHARE_FORMATS;
