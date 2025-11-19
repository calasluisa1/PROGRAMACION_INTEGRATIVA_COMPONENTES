
const template = document.createElement('template');
template.innerHTML = `

<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-lg border-0">
        <div class="card-body">
          <h5 class="card-title text-center mb-4 fw-bold">
            Conversor de Temperaturas
          </h5>

          <div class="mb-3">
            <label class="form-label">Valor</label>
            <input
              part="input"
              type="number"
              class="form-control"
              placeholder="Ingresa el valor"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Tipo de conversión</label>
            <select part="select" class="form-select">
              <option value="C-F">Celsius a Fahrenheit (C-F)</option>
              <option value="F-C">Fahrenheit a Celsius (F-C)</option>
            </select>
          </div>

          <div class="d-flex gap-2 mt-2">
            <button part="btn-convert" class="btn btn-primary w-50">
              Convertir
            </button>

          </div>

          <div class="mt-4">
            <div
              class="result p-3 rounded bg-light border text-center fw-semibold"
              part="result-area"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
></script>

`;

class ConversorTemperatura extends HTMLElement {
  static get observedAttributes() { return ['formato']; }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this._input = this._shadow.querySelector('input[type="number"]');
    this._select = this._shadow.querySelector('select');
    this._btnConvert = this._shadow.querySelector('button[part="btn-convert"]');
    this._resultArea = this._shadow.querySelector('.result');

    this._btnConvert.addEventListener('click', () => this._onConvert());
    this._btnClear.addEventListener('click', () => this._onClear());
    this._input.addEventListener('keydown', (e) => e.key === 'Enter' && this._onConvert());
  }

  connectedCallback() {
    const formato = this.getAttribute('formato')?.toUpperCase() || 'C-F';
    this._formato = ['C-F', 'F-C'].includes(formato) ? formato : 'C-F';
    this._select.value = this._formato;

    const valor = Number(this.getAttribute('value'));
    if (!Number.isNaN(valor)) {
      this._input.value = valor;
    }
  }

  attributeChangedCallback(name, _, newVal) {
    if (name === 'formato') {
      const f = newVal?.toUpperCase() || 'C-F';
      if (['C-F', 'F-C'].includes(f)) {
        this._formato = f;
        this._select.value = f;
      }
    }
  }

  _onConvert() {
    const x = Number(this._input.value);
    if (Number.isNaN(x)) {
      this._showResult('Valor inválido. Introduce un número.', 'danger');
      return;
    }

    const tipo = this._select.value;
    const output = tipo === 'C-F'
      ? `${x} °C = ${((x * 9/5) + 32).toFixed(2)} °F`
      : `${x} °F = ${((x - 32) * 5/9).toFixed(2)} °C`;

    this._showResult(output, 'success');
  }


  _showResult(message, level = 'primary') {
    this._resultArea.innerHTML = `<div class="w-100 alert alert-${level} mb-0 text-center" role="alert">${message}</div>`;
  }
}

customElements.define('conversor-temperatura', ConversorTemperatura);