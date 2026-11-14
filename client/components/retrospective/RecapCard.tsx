import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
    TIME_PROFILES,
    formatNumber,
    formatPercent,
    getTopText,
} from "@/components/retrospective/retrospectiveTexts";
import { Colors } from "@/constants/Colors";
import { pluralWord } from "@/utils/pluralize";
import { Retrospective } from "@/interfaces/retrospectiveInterface";

// 3 questions a day, days 1 to 24.
const MAX_CORRECT_ANSWERS = 24 * 3;

interface Stat {
    value: string;
    label: string;
}

export const RecapCard: React.FC<{ retrospective: Retrospective }> = ({
    retrospective,
}) => {
    const {
        year,
        points,
        daysOpened,
        longestStreak,
        correctAnswers,
        challengesCompleted,
        timeProfile,
    } = retrospective;
    const profile = TIME_PROFILES[timeProfile.value];
    const topSummary = getTopText(points.topPercent);

    const stats: Stat[] = [
        {
            value: String(daysOpened.value),
            label: `${pluralWord(daysOpened.value, "case ouverte", "cases ouvertes")}\nle jour même`,
        },
        {
            value: String(longestStreak.value),
            label: pluralWord(
                longestStreak.value,
                "jour d'affilée\nsans manquer\nune case",
                "jours d'affilée\nsans manquer\nune case",
            ),
        },
        {
            value: formatPercent(
                Math.round((correctAnswers.value / MAX_CORRECT_ANSWERS) * 100),
            ),
            label: "de bonnes\nréponses",
        },
        {
            value: String(challengesCompleted.value),
            label: pluralWord(
                challengesCompleted.value,
                "défi\nréussi",
                "défis\nréussis",
            ),
        },
    ];

    return (
        <View style={styles.card}>
            <ThemedText style={[styles.text, styles.title]}>
                Mon avent {year}
            </ThemedText>

            <View>
                <ThemedText style={[styles.text, styles.points]}>
                    {formatNumber(points.value)}
                </ThemedText>
                <ThemedText style={[styles.text, styles.pointsLabel]}>
                    points
                </ThemedText>
                {topSummary && (
                    <ThemedText style={[styles.text, styles.top]}>
                        {topSummary}
                    </ThemedText>
                )}
            </View>

            <View style={styles.stats}>
                {stats.map((stat) => (
                    <View key={stat.label} style={styles.stat}>
                        <ThemedText style={[styles.text, styles.statValue]}>
                            {stat.value}
                        </ThemedText>
                        <ThemedText style={[styles.text, styles.statLabel]}>
                            {stat.label}
                        </ThemedText>
                    </View>
                ))}
            </View>

            <View>
                <View style={styles.banner}>
                    <ThemedText style={[styles.text, styles.bannerText]}>
                        {profile.title}
                    </ThemedText>
                </View>
                <ThemedText style={[styles.text, styles.slot]}>
                    Mes cases ouvertes {profile.slot}
                </ThemedText>
            </View>

            <View style={styles.footer}>
                <ThemedText style={[styles.text, styles.greeting]}>
                    {"Joyeux Noël\u00a0!"}
                </ThemedText>
                <ThemedText style={[styles.text, styles.appName]}>
                    de l'application{"\n"}Mon calendrier de l'avent
                </ThemedText>
            </View>
        </View>
    );
};

const STATS_WIDTH = 200;
const STATS_GAP = 8;

// Measured on the 360x640 background: the bow's tails reach y = 165,
// the frame narrows from y = 480 and ends at y = 600.
const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 110,
        paddingBottom: 75,
        paddingHorizontal: 40,
    },
    text: {
        paddingTop: 0,
        textAlign: "center",
    },
    title: {
        fontFamily: "FreightNeoBold",
        fontSize: 22,
        lineHeight: 28,
        color: Colors.lightRed,
    },

    points: {
        fontFamily: "FreightNeoBold",
        fontSize: 44,
        lineHeight: 52,
        color: Colors.greenRecap,
    },
    pointsLabel: {
        fontFamily: "FreightNeoBold",
        fontSize: 20,
        lineHeight: 22,
        color: Colors.greenRecap,
    },
    top: {
        fontSize: 10,
        color: Colors.darkGreen,
        marginTop: 6,
    },

    stats: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: STATS_WIDTH,
        gap: STATS_GAP,
        marginVertical: 16,
    },
    // Tiles of a row share its height (the tallest label sets it).
    stat: {
        width: (STATS_WIDTH - STATS_GAP) / 2,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4,
        paddingBottom: 8,
        paddingHorizontal: 4,
        gap: 4,
        borderRadius: 8,
        backgroundColor: Colors.goldLight,
    },
    statValue: {
        fontFamily: "FreightNeoBold",
        fontSize: 27,
        lineHeight: 30,
        color: Colors.lightRed,
    },
    statLabel: {
        fontSize: 10,
        lineHeight: 13,
        color: Colors.darkGreen,
    },

    banner: {
        paddingHorizontal: 18,
        paddingVertical: 2,
        borderRadius: 24,
        backgroundColor: Colors.greenRecap,
    },
    bannerText: {
        fontFamily: "FreightNeoBold",
        fontSize: 15,
        color: Colors.snow,
        paddingBottom: 1,
    },
    slot: {
        fontSize: 10,
        lineHeight: 12,
        color: Colors.darkGreen,
        marginTop: 4,
    },

    footer: {
        alignItems: "center",
    },
    greeting: {
        fontFamily: "FreightNeoBold",
        fontSize: 20,
        color: Colors.lightRed,
        marginTop: 12,
    },
    appName: {
        fontSize: 10,
        color: Colors.lightRed,
    },
});
