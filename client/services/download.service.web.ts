// Web version of download.service.ts: view capture is unreliable in the
// browser, and expo-media-library has no web implementation.
import { getCloudinaryDownloadUrl } from "@/services/cloudinary.service";

export const isViewDownloadSupported = false;

export const downloadView = async (): Promise<void> => {};

/**
 * On iOS, the share sheet is the only way to offer "Save to Photos"; elsewhere
 * (or if it's refused, e.g. after too long a fetch) the browser downloads it.
 */
export const downloadImage = async (publicId: string): Promise<void> => {
    try {
        const response = await fetch(getCloudinaryDownloadUrl(publicId));
        const blob = await response.blob();
        const file = new File([blob], `${publicId}.jpg`, {
            type: "image/jpeg",
        });
        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file] });
            return;
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            return;
        }
    }
    window.location.href = getCloudinaryDownloadUrl(publicId, true);
};
