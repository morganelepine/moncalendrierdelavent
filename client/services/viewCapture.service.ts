import { RefObject } from "react";
import { View } from "react-native";
import { captureRef } from "react-native-view-shot";
import { SHARE_FORMATS, ShareFormat } from "@/constants/shareImage";

/** Captures the card as a JPEG temp file, or returns undefined on failure. */
export const captureView = async (
    ref: RefObject<View | null>,
    format: ShareFormat,
): Promise<string | undefined> => {
    try {
        return await captureRef(ref, {
            format: "jpg",
            quality: 0.9,
            width: SHARE_FORMATS[format].width,
            height: SHARE_FORMATS[format].height,
            result: "tmpfile",
        });
    } catch {
        return undefined;
    }
};
