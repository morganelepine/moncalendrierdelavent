import { RefObject } from "react";
import { TurboModuleRegistry, View } from "react-native";
import { ShareFormat } from "@/constants/shareImage";
import { captureView } from "@/services/viewCapture.service";

// react-native-share's native module isn't in Expo Go.
export const isShareSupported = TurboModuleRegistry.get("RNShare") != null;

/**
 * Captures the share card as an image and opens the native share sheet,
 * with the message (and its link) as the caption.
 */
export const shareView = async (
    ref: RefObject<View | null>,
    message: string,
    format: ShareFormat = "post",
): Promise<void> => {
    if (!isShareSupported) return;

    const imageUri = await captureView(ref, format);

    try {
        const { default: Share } = await import("react-native-share");
        await Share.open({
            message,
            ...(imageUri ? { url: imageUri, type: "image/jpeg" } : {}),
            failOnCancel: false,
        });
    } catch {
        // Sharing can be dismissed or unavailable; no action is needed.
    }
};
