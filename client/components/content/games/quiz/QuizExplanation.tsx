import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { NextQuestion } from "@/components/content/games/util/NextQuestion";

interface QuizExplanationProps {
    correctAnswer: string;
    explanation?: string;
    selectedAnswer: string;
    totalQuestions: number;
    currentQuestionIndex: number;
    handleNextQuestion: () => void;
}

export const QuizExplanation: React.FC<QuizExplanationProps> = ({
    correctAnswer,
    explanation,
    selectedAnswer,
    totalQuestions,
    currentQuestionIndex,
    handleNextQuestion,
}) => {
    return (
        <View>
            <View>
                <ThemedText style={styles.response}>
                    {selectedAnswer.trim() === correctAnswer.trim()
                        ? "Bonne réponse !"
                        : `Oops... la bonne réponse était "${correctAnswer}"`}
                </ThemedText>

                {explanation ? (
                    <ThemedText style={styles.explanations}>
                        {explanation}
                    </ThemedText>
                ) : null}
            </View>

            <NextQuestion
                totalCount={totalQuestions}
                currentQuestionIndex={currentQuestionIndex}
                handleNextQuestion={handleNextQuestion}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    response: { fontFamily: "PoppinsBold" },
    explanations: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "left",
    },
});
