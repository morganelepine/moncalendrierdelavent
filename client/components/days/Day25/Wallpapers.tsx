import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { getCloudinaryImageUrl } from "@/services/cloudinary.service";
import { downloadImage } from "@/services/download.service";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { WallpaperData } from "@/interfaces/contentInterface";

interface WallpapersProps {
    datas: WallpaperData[];
    type: "wallpapers" | "recipes";
}

export const Wallpapers: React.FC<WallpapersProps> = ({ datas, type }) => {
    const [downloadingId, setDownloadingId] = useState<
        WallpaperData["id"] | null
    >(null);

    const download = async (data: WallpaperData): Promise<void> => {
        setDownloadingId(data.id);
        await downloadImage(data.image);
        setDownloadingId(null);
    };

    return (
        <View style={styles.gallery}>
            {datas.map((data, index) => {
                const isDownloading = downloadingId === data.id;
                const label =
                    type === "wallpapers"
                        ? `Télécharger le fond d'écran ${index + 1}`
                        : `Télécharger la recette ${data.title}`;

                return (
                    <Pressable
                        key={data.id}
                        onPress={() => void download(data)}
                        disabled={downloadingId !== null}
                        accessibilityRole="button"
                        accessibilityLabel={label}
                        accessibilityState={{ busy: isDownloading }}
                        hitSlop={type === "recipes" ? 8 : undefined}
                        style={({ pressed }) => [
                            type === "recipes" && styles.button,
                            pressed && styles.pressed,
                        ]}
                    >
                        {type === "wallpapers" ? (
                            <Image
                                source={{
                                    uri: getCloudinaryImageUrl(data.image),
                                }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                style={styles.thumbnail}
                            />
                        ) : (
                            <ThemedText style={styles.buttonText}>
                                {data.title}
                            </ThemedText>
                        )}
                        {isDownloading && (
                            <ActivityIndicator
                                color={Colors.snow}
                                style={styles.loader}
                            />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    gallery: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    // 48 wide: minimum touch target size.
    thumbnail: {
        width: 48,
        height: 85,
        borderRadius: 5,
        margin: 2,
    },
    button: {
        width: "45%",
        margin: 4,
        borderRadius: 50,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: Colors.red,
        alignSelf: "center",
    },
    buttonText: {
        fontSize: 14,
        textAlign: "center",
    },
    pressed: {
        opacity: 0.7,
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: 5,
    },
});
