import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Platform } from "react-native";
import { StorageKeys } from "@/constants/storageKeys";
import { TrackEvent } from "@/enums/enums";
import { apiFetch } from "@/services/apiFetch";

// Fire-and-forget: never awaited by callers, and a lost click is not worth
// an error report or a message to the user.
export const trackEvent = (event: TrackEvent, source?: string): void => {
    void (async (): Promise<void> => {
        try {
            const userUuid = await AsyncStorage.getItem(StorageKeys.userUuid);
            if (!userUuid) return;
            await apiFetch<void>("/events", {
                method: "POST",
                body: {
                    event,
                    source,
                    userUuid,
                    platform: Platform.OS,
                    appVersion: Constants.expoConfig?.version,
                },
                silent: true,
            });
        } catch {
            // Best effort.
        }
    })();
};

export const openPremiumScreen = (source: string): void => {
    trackEvent(TrackEvent.PremiumOpen, source);
    router.push("/informations/premium");
};
