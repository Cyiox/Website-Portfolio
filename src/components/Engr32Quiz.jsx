import React, { useState } from 'react';

const questions = [
    {
        question: "What became the second-largest source of generation capacity in PR by the end of 2025?",
        options: ["Coal", "Natural Gas", "Rooftop Solar", "Hydroelectric"],
        answer: "Rooftop Solar",
        fact: "Rooftop solar reached ~1.5 GW in 2025, officially surpassing natural gas capacity!"
    },
    {
        question: "Under the latest 2025 legislation, when is the island's only coal plant now scheduled to shut down?",
        options: ["2028", "2032", "2040", "2050"],
        answer: "2032",
        fact: "While the original 2019 law aimed for 2028, Act 1-2025 extended the lifespan of the AES coal plant to 2032."
    },
    {
        question: "How many rooftop solar systems were installed in PR every month on average in 2025?",
        options: ["500", "1,200", "2,500", "3,850"],
        answer: "3,850",
        fact: "Nearly 4,000 systems are being added to the grid every month!."
    },
    {
        question: "How much did you enjoy Prof's Krones class?",
        options: ["Not at all", "It was okay", "I liked it", "It was the best class I've ever taken"],
        answer: "It was the best class I've ever taken",
        fact: "Prof Krones is a legend and we all know it."
    }
];

function EnergyQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleAnswer = (option) => {
        if (option === questions[currentQuestion].answer) {
            setScore(score + 1);
            setFeedback("Correct! " + questions[currentQuestion].fact);
        } else {
            setFeedback("Not quite. " + questions[currentQuestion].fact);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setTimeout(() => {
                setCurrentQuestion(nextQuestion);
                setFeedback("");
            }, 3000);
        } else {
            setTimeout(() => setShowScore(true), 3000);
        }
    };

    return (
        <div className="quiz-section">
            {showScore ? (
                <div className="score-display">
                    <h3>You scored {score} out of {questions.length}!</h3>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            ) : (
                <div className="question-display">
                    <h3>Question {currentQuestion + 1}:</h3>
                    <p>{questions[currentQuestion].question}</p>
                    <div className="options">
                        {questions[currentQuestion].options.map((opt) => (
                            <button key={opt} onClick={() => handleAnswer(opt)}>{opt}</button>
                        ))}
                    </div>
                    {feedback && <p className="feedback">{feedback}</p>}
                </div>
            )}
        </div>
    );
}

export default EnergyQuiz;