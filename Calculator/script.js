const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expressionDisplay');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');

let currentInput = '';
let previousInput = '';
let operator = null;
let resetScreen = false;

function updateDisplay() {
  display.value = currentInput || '0';
  if (operator && previousInput !== '') {
    expressionDisplay.textContent = previousInput + ' ' + operator;
  } else {
    expressionDisplay.textContent = '';
  }
}

function appendNumber(number) {
  if (resetScreen) {
    currentInput = '';
    resetScreen = false;
  }
  if (currentInput === '0' && number === '0') return;
  if (number === '.' && currentInput.includes('.')) return;

  currentInput += number;
  updateDisplay();
}

function chooseOperator(op) {
  if (currentInput === '') return;
  if (previousInput !== '') {
    calculate();
  }
  operator = op;
  previousInput = currentInput;
  currentInput = '';
  updateDisplay();
}

function calculate() {
  let result;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(current)) return;

  switch(operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        alert("Cannot divide by zero!");
        clearAll();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operator = null;
  previousInput = '';
  updateDisplay();
  resetScreen = true;
}

function clearAll() {
  currentInput = '';
  previousInput = '';
  operator = null;
  updateDisplay();
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('number')) {
      appendNumber(button.textContent);
    } else if (button.classList.contains('operator')) {
      chooseOperator(button.dataset.op);
    } else if (button.classList.contains('decimal')) {
      appendNumber('.');
    }
  });
});

clearBtn.addEventListener('click', clearAll);

equalsBtn.addEventListener('click', () => {
  calculate();
});

// Initialize display
updateDisplay();
