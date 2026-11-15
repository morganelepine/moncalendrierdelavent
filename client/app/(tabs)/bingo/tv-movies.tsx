import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlueBackground } from "@/components/utils/BlueBackground";
import { ThemedText } from "@/components/ThemedText";
import { PillTabBar, PillTabBarItem } from "@/components/navigation/PillTabBar";
import { TvMovieImage } from "@/components/activities/TvMovieImage";
import { TvMovieStatusBadge } from "@/components/activities/TvMovieStatusBadge";
import { Colors } from "@/constants/Colors";
import { NO_TOP_EDGES } from "@/constants/safeAreaEdges";
import { useTvMoviesSchedule } from "@/hooks/useTvMoviesSchedule";
import {
    ALL,
    SlotFilter,
    useTvMoviesFilters,
} from "@/hooks/useTvMoviesFilters";
import { useCurrentMinutes } from "@/hooks/useCurrentMinutes";
import { TvMovie } from "@/interfaces/tvMovieInterface";
import { formatHour, isBetween } from "@/utils/hours";

const SLOT_ITEMS: readonly PillTabBarItem[] = [
    { key: ALL, label: "Toute la journée" },
    { key: "morning", label: "Matin" },
    { key: "afternoon", label: "Après-midi" },
    { key: "evening", label: "Soir" },
];

const TvMovieCard: React.FC<{ movie: TvMovie; onAir: boolean }> = ({
    movie,
    onAir,
}) => {
    const startHour = formatHour(movie.startHour);
    const endHour = formatHour(movie.endHour);

    return (
        <View style={[styles.card, onAir && styles.onAirCard]}>
            {onAir ? <TvMovieStatusBadge status="live" /> : null}
            <View style={[styles.header, { marginTop: onAir ? 10 : 0 }]}>
                <TvMovieImage uri={movie.image} />
                <View
                    style={styles.schedule}
                    accessible
                    accessibilityLabel={`${onAir ? "En cours, " : ""}De ${startHour} à ${endHour} sur ${movie.channel}`}
                >
                    <ThemedText style={styles.hour}>
                        {startHour} – {endHour}
                    </ThemedText>
                    <ThemedText style={styles.channel}>
                        {movie.channel}
                    </ThemedText>
                </View>
            </View>
            <ThemedText style={styles.title} accessibilityRole="header">
                {movie.title}
            </ThemedText>
            {movie.description && (
                <ThemedText style={styles.description}>
                    {movie.description}
                </ThemedText>
            )}
        </View>
    );
};

interface TvMoviesListProps {
    movies: TvMovie[] | null;
    filteredMovies: TvMovie[];
    error: boolean;
    isTomorrow: boolean;
    nowMinutes: number;
}

const TvMoviesList: React.FC<TvMoviesListProps> = ({
    movies,
    filteredMovies,
    error,
    isTomorrow,
    nowMinutes,
}) => {
    if (error) {
        return (
            <ThemedText style={styles.message}>
                Impossible de charger le programme, réessayez plus tard.
            </ThemedText>
        );
    }
    if (movies === null) {
        return <ActivityIndicator size="large" color={Colors.snow} />;
    }
    if (movies.length === 0) {
        return (
            <ThemedText style={styles.message}>
                {isTomorrow
                    ? "Pas de téléfilm de Noël demain."
                    : "Pas de téléfilm de Noël aujourd'hui, revenez demain !"}
            </ThemedText>
        );
    }
    if (filteredMovies.length === 0) {
        return (
            <ThemedText style={styles.message}>
                Aucun téléfilm avec ces filtres.
            </ThemedText>
        );
    }
    return filteredMovies.map((movie) => (
        <TvMovieCard
            key={`${movie.channel}-${movie.startHour}`}
            movie={movie}
            onAir={
                !isTomorrow &&
                isBetween(nowMinutes, movie.startHour, movie.endHour)
            }
        />
    ));
};

export default function TvMoviesScreen() {
    const { day, movies, error } = useTvMoviesSchedule();
    const nowMinutes = useCurrentMinutes();
    const isTomorrow = day === "tomorrow";
    const { channelItems, channel, setChannel, slot, setSlot, filteredMovies } =
        useTvMoviesFilters(movies, isTomorrow, nowMinutes);

    const showFilters = !error && !!movies?.length;

    return (
        <BlueBackground>
            {showFilters ? (
                <View style={styles.filters}>
                    {channelItems.length > 0 ? (
                        <PillTabBar
                            items={channelItems}
                            activeKey={channel}
                            onSelect={setChannel}
                            variant="outline"
                            accessibilityLabel="Filtrer par chaîne"
                        />
                    ) : null}
                    <PillTabBar
                        items={SLOT_ITEMS}
                        activeKey={slot}
                        onSelect={(key) => setSlot(key as SlotFilter)}
                        variant="outline"
                        accessibilityLabel="Filtrer par créneau"
                    />
                </View>
            ) : null}
            <ScrollView contentContainerStyle={styles.container}>
                <SafeAreaView edges={NO_TOP_EDGES} style={styles.list}>
                    {isTomorrow ? (
                        <ThemedText
                            style={styles.dayTitle}
                            accessibilityRole="header"
                        >
                            Les téléfilms du jour sont terminés.{"\n"}Au
                            programme demain :
                        </ThemedText>
                    ) : null}
                    <TvMoviesList
                        movies={movies}
                        filteredMovies={filteredMovies}
                        error={error}
                        isTomorrow={isTomorrow}
                        nowMinutes={nowMinutes}
                    />
                </SafeAreaView>
            </ScrollView>
        </BlueBackground>
    );
}

const styles = StyleSheet.create({
    filters: {
        paddingTop: 8,
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    list: {
        gap: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: Colors.snow,
        opacity: 0.9,
        gap: 4,
    },
    onAirCard: {
        borderWidth: 4,
        borderColor: Colors.red,
        opacity: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    schedule: {
        flex: 1,
    },
    hour: {
        fontSize: 18,
        fontFamily: "FreightNeoBold",
        color: Colors.red,
    },
    channel: {
        fontSize: 14,
        color: Colors.blue,
    },
    title: {
        fontSize: 20,
        fontFamily: "FreightNeoBold",
        color: Colors.blue,
    },
    description: {
        fontSize: 14,
    },
    dayTitle: {
        color: Colors.snow,
        fontFamily: "FreightNeo",
        fontSize: 18,
        textAlign: "center",
    },
    message: {
        color: Colors.snow,
        fontFamily: "PoppinsItalic",
        textAlign: "center",
    },
});
