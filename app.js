const calculator = {
    currentOperand: '0',
    previousOperand: '',
    operation: undefined,

    updateDisplay() {
        const currDisplay = document.getElementById('current-operand');
        const prevDisplay = document.getElementById('previous-operand');
        
        currDisplay.innerText = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            prevDisplay.innerText = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            prevDisplay.innerText = '';
        }
    },

    formatNumber(number) {
        if (number === '-' || number === 'Erro') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    },

    clearAll() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    },

    delete() {
        if (this.currentOperand === 'Erro') {
            this.clearAll();
            return;
        }
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.includes('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    },

    appendNumber(number) {
        if (this.currentOperand === 'Erro') this.clearAll();
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    },

    chooseOperation(operation) {
        if (this.currentOperand === 'Erro') return;
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    },

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '×': computation = prev * current; break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Erro';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default: return;
        }

        // Corrige bugs de ponto flutuante do JS (ex: 0.1 + 0.2 = 0.30000000000000004)
        this.currentOperand = Math.round(computation * 100000000) / 100000000;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    },

    percentage() {
        if (this.currentOperand === 'Erro') return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }
};

// Inicializa o display na primeira vez
calculator.updateDisplay();
