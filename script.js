const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const buttons = document.querySelectorAll(".btn");

let expression = "";
let result = "0";
let finished = false;

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

// Eventos dos botões
buttons.forEach(button => {
    button.addEventListener("click", () => {

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
        addValue(key);
    }

    if (key === "Enter") {
        calculate();
    }

    if (key === "Backspace") {
        deleteLast();
    }

    if (key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();