const display = document.getElementById("display");
const buttons = document.querySelectorAll("#calculator button");

let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleButtonClick(button.textContent);
    });
});

function handleButtonClick(value) {
    if (isDigit(value)) {
        if (shouldResetDisplay) {
            display.value = "";
            shouldResetDisplay = false;
        }
        display.value += value;
        return;
    }

    if (value === "." && checkpoint(display.value)) {
        if (shouldResetDisplay || display.value === "") {
            display.value = "0";
            shouldResetDisplay = false;
        }
        display.value += value;
        return;
    }

    if (value === "AC") {
        display.value = "";
        firstOperand = null;
        operator = null;
        shouldResetDisplay = false;
        return;
    }

    if (value === "C") {
        display.value = display.value.slice(0, -1);
        return;
    }

    if (value === "%") {
        if (display.value !== "") {
            display.value = String(parseFloat(display.value) / 100);
            shouldResetDisplay = true;
        }
        return;
    }

    if (value === "+/-") {
        if (display.value !== "" && !isNaN(parseFloat(display.value))) {
            display.value = String(-parseFloat(display.value));
        }
        return;
    }

    if (value === "=") {
        handleEquals();
        return;
    }

    let op = value;
    if (op === "X" || op === "x" || op === "×") op = "*";
    if (op === "÷") op = "/";

    if (op === "+" || op === "-" || op === "*" || op === "/") {
        handleOperator(op);
        return;
    }
}

function isDigit(v) {
    return v >= "0" && v <= "9";
}

function checkpoint(str) {
    return !str.includes(".");
}

function handleOperator(op) {
    const currentValue = display.value === "" ? 0 : parseFloat(display.value);
    if (firstOperand === null) {
        firstOperand = currentValue;
    } else if (!shouldResetDisplay && operator !== null) {
        firstOperand = compute(firstOperand, currentValue, operator);
        display.value = String(firstOperand);
    }
    operator = op;
    shouldResetDisplay = true;
}

function handleEquals() {
    if (operator === null || firstOperand === null) return;
    const secondOperand = display.value === "" ? 0 : parseFloat(display.value);
    const result = compute(firstOperand, secondOperand, operator);
    display.value = String(result);
    firstOperand = null;
    operator = null;
    shouldResetDisplay = true;
}

function compute(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? NaN : a / b;
    return b;
}
