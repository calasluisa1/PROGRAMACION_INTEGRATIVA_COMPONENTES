import { LitElement, html } from "lit";

export class BasicaCalculadora extends LitElement {

  static properties = {
    displayValue: { type: String },
    firstOperand: { type: Number },
    waitingForSecondOperand: { type: Boolean },
    operator: { type: String }
  };

  constructor() {
    super();
    this.displayValue = "";
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
  }

  inputDigit(num) {
    this.displayValue += String(num);

    if (this.waitingForSecondOperand) {
      this.displayValue += "";
      this.waitingForSecondOperand = false;
    }
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.displayValue.split(/[\+\-\*\/]/).pop());
    if (isNaN(inputValue)) return;

    if (this.firstOperand == null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.performCalculation(this.firstOperand, inputValue, this.operator);
      this.displayValue = String(result) + nextOperator;
      this.firstOperand = result;
      this.operator = nextOperator;
      this.waitingForSecondOperand = true;
      return;
    }

    this.operator = nextOperator;

    this.displayValue += nextOperator;

    this.waitingForSecondOperand = true;
  }

  handleEquals() {
    if (!this.operator) return;

    const parts = this.displayValue.split(this.operator);
    const secondOperand = parseFloat(parts[1]);

    const result = this.performCalculation(
      this.firstOperand,
      secondOperand,
      this.operator
    );

    this.displayValue = String(result);

    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = true;
  }

  inputDecimal() {
    if (!this.displayValue.includes(".")) {
      this.displayValue += ".";
    }
  }

  clearAll() {
    this.displayValue = "";
    this.firstOperand = null;
    this.operator = null;
  }

  performCalculation(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? "Err" : a / b;
      default: return b;
    }
  }

  render() {
    return html`
      <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"/>

      <div class="p-4 rounded-3 shadow border border-light border-2 mx-auto"
        style="width: 750px; background:clear;">

        <input 
          class="form-control form-control-lg text-end bg-dark text-white mb-3 border-light"
          placeholder="Ingrese un número"
          .value=${this.displayValue}
          disabled
        />

        <div class="row g-2">

          <!-- Fila 1 -->
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(1)}>1</button></div>
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(2)}>2</button></div>
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(3)}>3</button></div>
          <div class="col-3"><button class="btn btn-danger w-100" @click=${() => this.handleOperator("+")}>+</button></div>

          <!-- Fila 2 -->
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(4)}>4</button></div>
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(5)}>5</button></div>
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(6)}>6</button></div>
          <div class="col-3"><button class="btn btn-danger w-100" @click=${() => this.handleOperator("-")}>-</button></div>

          <!-- Fila 3 -->
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(7)}>7</button></div>
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(8)}>8</button></div>
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(9)}>9</button></div>
          <div class="col-3"><button class="btn btn-danger w-100" @click=${() => this.handleOperator("*")}>*</button></div>

          <!-- Fila 4 -->
          <div class="col-3"><button class="btn btn-secondary w-100" @click=${() => this.inputDigit(0)}>0</button></div>
          <div class="col-3"><button class="btn btn-success w-100" @click=${() => this.handleEquals()}>=</button></div>
          <div class="col-3"><button class="btn btn-danger w-100" @click=${() => this.handleOperator("/")}>/</button></div>
          <div class="col-3"><button class="btn btn-primary w-100" @click=${() => this.clearAll()}>Borrar</button></div>

        </div>
      </div>
    `;
  }
}

customElements.define("basica-calculadora", BasicaCalculadora);
