const calculator = {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    previousState: null
};

function updateDisplay() {
    const display = document.getElementById('display');
    display.value = calculator.displayValue;
}

function appendToDisplay(value) {
    if (calculator.waitingForSecondOperand) {
        calculator.displayValue = value;
        calculator.waitingForSecondOperand = false;
    } else if (calculator.displayValue === '0' && value !== '.') {
        calculator.displayValue = value;
    } else {
        calculator.displayValue += value;
    }
    updateDisplay();
}

function calculateResult() {
    const { firstOperand, displayValue, operator } = calculator;
    const secondOperand = parseFloat(displayValue);
    
    if (firstOperand == null || operator == null) {
        return;
    }

    let result;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    calculator.displayValue = result.toString();
    calculator.firstOperand = result;
    calculator.operator = null;
    calculator.waitingForSecondOperand = false;

    updateDisplay();
}

function clearDisplay() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.operator = null;
    calculator.waitingForSecondOperand = false;
    updateDisplay();
}

function saveState() {
    calculator.previousState = { ...calculator };
}

function undoLastAction() {
    if (calculator.previousState) {
        calculator.displayValue = calculator.previousState.displayValue;
        calculator.firstOperand = calculator.previousState.firstOperand;
        calculator.operator = calculator.previousState.operator;
        calculator.waitingForSecondOperand = calculator.previousState.waitingForSecondOperand;
        updateDisplay();
    }
}

// Function to delete the last character
function deleteLastCharacter() {
    const { displayValue } = calculator;

    if (displayValue.length === 1) {
        calculator.displayValue = '0'; // If only one character, reset to '0'
    } else {
        calculator.displayValue = displayValue.slice(0, -1); // Remove the last character
    }

    updateDisplay();
}

// Listen for clicks on the calculator buttons
document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const { target } = event;
    
    // Ignore clicks that are not on buttons
    if (!target.matches('button')) return;

    const value = target.getAttribute('data-value');

    // Handle special cases like 'AC', '=', and undo
    if (value === 'AC') {
        saveState();
        clearDisplay();
    } 
    else if (value === '=') {
        saveState();
        calculateResult();
    } 
    else if (['+', '-', '*', '/'].includes(value)) {
        saveState();
        handleOperator(value);
    } 
    else if (value === 'undo') {
        undoLastAction();
    }
    else if (value === 'DEL') { // If the DEL button is pressed, delete the last character
        saveState();
        deleteLastCharacter();
    }
    else {
        saveState();
        appendToDisplay(value);
    }
});

// Handle the operator logic
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand
};

// Update display on initial load
updateDisplay();
