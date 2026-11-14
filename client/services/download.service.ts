import { RefObject } from "react";
import { Platform, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { File, Paths } from "expo-file-system";
import { showToast } from "@/components/utils/Toast";
import { ShareFormat } from "@/constants/shareImage";
import { getCloudinaryDownloadUrl } from "@/services/cloudinary.service";
import { captureView } from "@/services/viewCapture.service";

export const isViewDownloadSupported = true;

// Android 13+ adds to the gallery without any permission (the READ_MEDIA_*
// ones are blocked in app.json); below, the module needs WRITE_EXTERNAL_STORAGE.
const ensureWritePermission = async (): Promise<boolean> => {
    if (Platform.OS === "android" && Platform.Version >= 33) return true;
    const { granted } = await MediaLibrary.requestPermissionsAsync(true);
    return granted;
};

const saveToGallery = async (localUri: string | undefined): Promise<void> => {
    try {
        if (!localUri) throw new Error("Nothing to save");
        if (!(await ensureWritePermission())) {
            showToast(
                "Autorisez l'accès aux photos pour enregistrer l'image",
                "long",
            );
            return;
        }
        await MediaLibrary.saveToLibraryAsync(localUri);
        showToast("Image enregistrée dans la galerie");
    } catch (error) {
        console.warn("Saving to gallery failed", error);
        showToast("Impossible d'enregistrer l'image");
    }
};

/** Captures the card and saves it to the gallery. */
export const downloadView = async (
    ref: RefObject<View | null>,
    format: ShareFormat = "post",
): Promise<void> => {
    await saveToGallery(await captureView(ref, format));
};

/** Downloads a Cloudinary image and saves it to the gallery. */
export const downloadImage = async (publicId: string): Promise<void> => {
    let localUri: string | undefined;
    try {
        // The .jpg extension tells the gallery the file type.
        const file = new File(Paths.cache, `${publicId}.jpg`);
        localUri = (
            await File.downloadFileAsync(
                getCloudinaryDownloadUrl(publicId),
                file,
                {
                    idempotent: true,
                },
            )
        ).uri;
    } catch (error) {
        console.warn("Image download failed", error);
    }
    await saveToGallery(localUri);
};
