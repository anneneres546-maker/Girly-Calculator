const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const buttons = document.querySelectorAll(".btn");
const keyboardPressTimers = new Map();

let expression = "";
let result = "0";
let finished = false;

const animalSounds = {
    "1": "assets/som gatinho.mp3",
    "2": "assets/som patinho.mp3",
    "3": "assets/som vaca.mp3",
    "4": "assets/som piu piu.mp3",
    "5": "assets/som porquinho.mp3",
    "6": "assets/som dolphin.mp3",
    "7": "assets/som coelinho.mp3",
    "8": "assets/som elefante.mp3",
    "9": "assets/som leao.mp3",
    "0": "assets/som cachorro.mp3"
};
const soundPlayers = {};

// Atualiza o visor
function updateDisplay() {
    expressionDisplay.textContent = expression || "0";
    resultDisplay.textContent = result;
}

// Adiciona valores à expressão
function addValue(value) {
    if (finished && !["+", "-", "*", "/", "%"].includes(value)) {
        expression = "";
        result = "0";
    }

    finished = false;

    expression += value;
    expressionDisplay.textContent = expression;
}

// Limpa a calculadora
function clearCalculator() {
    expression = "";
    result = "0";

    updateDisplay();
}

// Apaga o último caractere
function deleteLast() {
    expression = expression.slice(0, -1);

    updateDisplay();
}

// Realiza o cálculo
function calculate() {
    if (!expression) return;

    try {
        // Impede expressões inválidas
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Expressão inválida");
        }

        let calculation = expression;

        // Converte porcentagem
        calculation = calculation.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        let answer = Function(
            '"use strict"; return (' + calculation + ')'
        )();

        if (!Number.isFinite(answer)) {
            throw new Error("Erro matemático");
        }

        result = Number(answer.toPrecision(12)).toString();

        expressionDisplay.textContent = expression + " =";
        resultDisplay.textContent = result;

        expression = result;
        finished = true;

    } catch (error) {
        resultDisplay.textContent = "Erro";
        finished = true;
    }
}
// Sons dos botões (bichinhos)
function playAnimalSound(button) {
    const value = button.dataset.value;
    const soundFile = animalSounds[value];

    if (soundFile) {
        let sound = soundPlayers[value];

        if (!sound) {
            sound = new Audio(encodeURI(soundFile));
            soundPlayers[value] = sound;
        }

        sound.currentTime = 0;
        const playback = sound.play();

        if (playback) {
            playback.catch(error => {
                console.error("Não foi possível reproduzir o som do bichinho.", error);
            });
        }
    }
}

function showKeyboardPress(value, action) {
    const button = Array.from(buttons).find(item => (
        action ? item.dataset.action === action : item.dataset.value === value
    ));

    if (!button) return;

    button.classList.add("keyboard-pressed");
    clearTimeout(keyboardPressTimers.get(button));
    keyboardPressTimers.set(button, setTimeout(() => {
        button.classList.remove("keyboard-pressed");
        keyboardPressTimers.delete(button);
    }, 140));
}

// Eventos dos botões
buttons.forEach(button => {
    button.addEventListener("click", () => {

        if (button.classList.contains("btn-kawaii")) {
            playAnimalSound(button);
        }

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            addValue(value);
        }

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "calculate") {
            calculate();
        }
    });
});

// Teclado do computador
document.addEventListener("keydown", event => {

    const key = event.key;

    if ("0123456789+-*/.%".includes(key)) {
        showKeyboardPress(key);
        const button = Array.from(buttons).find(item => item.dataset.value === key);
        if (button && button.classList.contains("btn-kawaii")) {
            playAnimalSound(button);
        }
        addValue(key);
    }

    if (key === "Enter") {
        showKeyboardPress(null, "calculate");
        calculate();
    }

    if (key === "Backspace") {
        showKeyboardPress(null, "delete");
        deleteLast();
    }

    if (key === "Escape") {
        showKeyboardPress(null, "clear");
        clearCalculator();
    }
});

updateDisplay();