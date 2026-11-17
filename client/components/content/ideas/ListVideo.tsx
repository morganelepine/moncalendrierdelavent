import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { getCloudinaryImageUrl } from "@/services/cloudinary.service";
import { ListOfContents } from "@/interfaces/contentInterface";

export const ListVideo = (content: ListOfContents) => {
    return (
        <>
            <ThemedText style={styles.title}>{content.title}</ThemedText>

            {content.author && (
                <ThemedText style={styles.author}>{content.author}</ThemedText>
            )}

            {content.image && (
                <Image
                    source={{
                        uri: getCloudinaryImageUrl(content.image),
                    }}
                    style={styles.image}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    accessibilityLabel={content.title}
                />
            )}

            <ThemedText style={styles.description}>
                {content.description}
            </ThemedText>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: "PoppinsBold",
    },
    author: {
        fontStyle: "italic",
        fontSize: 14,
        marginTop: -6,
    },
    image: {
        marginVertical: 20,
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 8,
    },
    description: { fontSize: 15 },
});
