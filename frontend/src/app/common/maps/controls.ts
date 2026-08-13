import { EmbeddedViewRef, Directive, inject, ApplicationRef, Injector, TemplateRef, input, afterRenderEffect } from "@angular/core";
import L from "leaflet";

export class CustomControl extends L.Control {
  constructor(private readonly viewRef: EmbeddedViewRef<any>, options?: L.ControlOptions) {
    super(options);
  }

  override onAdd(map: L.Map): HTMLElement {
    const element = document.createElement('div');
    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);

    element.append(...this.viewRef.rootNodes);

    return element;
  }

  override onRemove(map: L.Map): void {
    this.viewRef?.destroy();
  }
}

@Directive({
  selector: 'ng-template[appMapControl]',
})
export class MapControl {
  private readonly appRef = inject(ApplicationRef);
  readonly injector = inject(Injector);
  readonly templateRef = inject(TemplateRef);
  readonly position = input<L.ControlPosition>();

  private control?: CustomControl;
  private viewRef?: EmbeddedViewRef<any>;

  constructor() {
    afterRenderEffect(() => {
      const position = this.position();

      if (position && position != this.control?.getPosition()) {
        this.control?.setPosition(position);
      }
    })
  }

  addTo(map: L.Map) {
    this.viewRef = this.templateRef.createEmbeddedView({}, this.injector);
    this.appRef.attachView(this.viewRef);
    this.control = new CustomControl(this.viewRef, { position: this.position() });
    this.control.addTo(map);
  }
}
