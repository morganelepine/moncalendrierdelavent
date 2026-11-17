import { Href, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ContentScreenWrapper } from "@/components/utils/custom/ContentScreenWrapper";
import { CustomMarkdown } from "@/components/utils/custom/Markdown";
import { ExternalLink } from "@/components/utils/ExternalLink";
import { useDayContents } from "@/hooks/useDayContents";
import { isOctober } from "@/constants/Dates";
import { TrackEvent } from "@/enums/enums";
import { trackEvent } from "@/services/tracking.service";

export default function AnecdoteScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dayId = parseInt(id, 10);

    const anecdote = useDayContents(dayId).contents?.anecdote;

    if (!anecdote) {
        return null;
    }

    const backgroundImage = isOctober
        ? "buveur_de_boissons_chaudes_mess4j"
        : "kiwi1_r7kihz";

    return (
        <ContentScreenWrapper
            typeTitle={anecdote.typeTitle}
            backgroundImage={backgroundImage}
            dayId={dayId}
        >
            <ThemedText type="contentSubtitle">{anecdote.title}</ThemedText>

            <CustomMarkdown>{anecdote.content1}</CustomMarkdown>

            {anecdote.content2 ? (
                <ExternalLink
                    href={anecdote.content3 as Href}
                    onPress={() =>
                        trackEvent(TrackEvent.AnecdoteSource, anecdote.title)
                    }
                    style={{ marginTop: 10 }}
                >
                    <ThemedText type="italic14">
                        Source :{" "}
                        <ThemedText
                            type="italic14"
                            style={
                                anecdote.content3
                                    ? { textDecorationLine: "underline" }
                                    : {}
                            }
                        >
                            {anecdote.content2}
                        </ThemedText>
                    </ThemedText>
                </ExternalLink>
            ) : null}
        </ContentScreenWrapper>
    );
}
