import L from "leaflet";

export class Tip extends L.Control {
  constructor(readonly text: string, opts?: L.ControlOptions) {
    super(opts);
  }

  override onAdd(map: L.Map): HTMLElement {
    const root = document.createElement('div');
    root.innerHTML = `
    <div class="card">
      <div class="card-body py-1 px-2">
        ${this.text}
      </div>
    </div>
    `;

    return root;
  }
};
