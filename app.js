const testQuestions = [
    {
        category: "Prirodne znanosti",
        questions: [
            {
                question: "Koji je najveći planet u Sunčevom sustavu?",
                options: ["Zemlja", "Mars", "Jupiter", "Venera"],
                answer: "Jupiter"
            },
            {
                question: "Koji organ u tijelu pumpa krv?",
                options: ["Pluća", "Bubrezi", "Srce", "Mozak"],
                answer: "Srce"
            }
        ]
    },
    {
        category: "Matematika",
        questions: [
            {
                question: "Koliko je 5 + 3?",
                options: ["6", "7", "8", "9"],
                answer: "8"
            },
            {
                question: "Koliko je 10 * 2?",
                options: ["20", "15", "30", "25"],
                answer: "20"
            }
        ]
    },
    {
        category: "Društvene znanosti",
        questions: [
            {
                question: "Koji je glavni grad Hrvatske?",
                options: ["Zagreb", "Split", "Rijeka", "Osijek"],
                answer: "Zagreb"
            },
            {
                question: "Tko je napisao 'Ilijadu'?",
                options: ["Dante", "Homer", "Shakespeare", "Virgil"],
                answer: "Homer"
            }
        ]
    }
];

let userAnswers = [];
let correctAnswersCount = {};

// Funkcija za početak testa
function startTest() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert("Molimo unesite ime");
        return;
    }

    document.getElementById('login').classList.add('hidden');
    document.getElementById('test-section').classList.remove('hidden');

    displayQuestions();
}

// Funkcija za prikaz pitanja
function displayQuestions() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    testQuestions.forEach((category, catIndex) => {
        const categoryTitle = document.createElement('h3');
        categoryTitle.innerText = `${category.category}`;
        questionContainer.appendChild(categoryTitle);

        category.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            const questionTitle = document.createElement('h4');
            questionTitle.innerText = `${catIndex + 1}.${index + 1} ${question.question}`;
            questionDiv.appendChild(questionTitle);

            question.options.forEach(option => {
                const optionLabel = document.createElement('label');
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = `question-${catIndex}-${index}`;
                optionInput.value = option;
                optionLabel.appendChild(optionInput);
                optionLabel.append(option);

                questionDiv.appendChild(optionLabel);
                questionDiv.appendChild(document.createElement('br'));
            });

            questionContainer.appendChild(questionDiv);
        });
    });
}

// Funkcija za slanje testa
function submitTest() {
    userAnswers = [];
    correctAnswersCount = {};

    testQuestions.forEach((category, catIndex) => {
        correctAnswersCount[category.category] = 0; // Inicijaliziramo broj točnih odgovora po kategoriji

        category.questions.forEach((question, index) => {
            const selectedOption = document.querySelector(`input[name="question-${catIndex}-${index}"]:checked`);
            const userAnswer = selectedOption ? selectedOption.value : null;
            userAnswers.push(userAnswer);

            if (userAnswer === question.answer) {
                correctAnswersCount[category.category]++;
            }
        });
    });

    saveResults();
    displayResults();
}

// Funkcija za prikaz rezultata
function displayResults() {
    let totalCorrect = 0;
    const resultText = [];

    for (const category in correctAnswersCount) {
        const correct = correctAnswersCount[category];
        totalCorrect += correct;
        resultText.push(`${category}: ${correct} točnih odgovora.`);
    }

    document.getElementById('test-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('result').innerText = resultText.join('\n');

    // Prikaži grafikon
    const ctx = document.getElementById('resultChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(correctAnswersCount),
            datasets: [{
                label: 'Broj točnih odgovora',
                data: Object.values(correctAnswersCount),
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Pohrani rezultate u localStorage
function saveResults() {
    const previousResults = JSON.parse(localStorage.getItem('testResults')) || [];
    previousResults.push(correctAnswersCount);
    localStorage.setItem('testResults', JSON.stringify(previousResults));
}