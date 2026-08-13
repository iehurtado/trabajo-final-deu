import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, contentChild, contentChildren, Directive, effect, ElementRef, EmbeddedViewRef, inject, Injector, input, OnDestroy, output, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import { Tip } from './zoom-tip';
import { MapControl } from './controls';

@Directive({
  selector: 'ng-template[appMapPopup]',
})
export class MapPopup {
  readonly templateRef = inject(TemplateRef);
}

@Directive({
  selector: 'ng-template[appMapPanel]',
})
export class MapPanel {
  readonly templateRef = inject(TemplateRef);
}
@Component({
  selector: 'app-map-marker',
  template: ``,
})
export class MarkerComponent implements AfterViewInit, OnDestroy {
  private readonly injector = inject(Injector);
  private readonly map = inject(MapComponent);
  private readonly appRef = inject(ApplicationRef);

  readonly latlng = input.required<L.LatLngExpression>();
  readonly options = input<L.MarkerOptions>();

  readonly popup = output<L.PopupEvent>();

  readonly popupTemplate = contentChild(MapPopup, { read: TemplateRef });

  private marker?: L.Marker;

  ngAfterViewInit(): void {
    effect(() => this.addToMap({ latlng: this.latlng(), options: this.options() }), { injector: this.injector });
  }

  ngOnDestroy(): void {
    if (this.marker) {
      this.marker.remove();
    }
  }

  openPopup() {
    this.marker?.openPopup();
  }

  private addToMap({ latlng, options }: { latlng: L.LatLngExpression, options?: L.MarkerOptions }) {
    if (this.marker) {
      this.marker.remove();
    }

    const marker = L.marker(latlng, options);
    marker.addEventListener('popupopen', e => this.popup.emit(e));

    const popupTemplate = this.popupTemplate();

    if (popupTemplate) {
      this.bindPopup(marker, popupTemplate);
    }

    this.map.addMarker(marker);
    this.marker = marker;
  }

  private bindPopup(marker: L.Marker, templateRef: TemplateRef<any>) {
    const el = document.createElement('div');
    el.classList.add('leaflet-popup-custom');

    const popup = new L.Popup(marker.getLatLng(), <L.PopupOptions>{
      content: el,
      autoPan: true,
      closeOnClick: false,
      closeButton: false,
    });

    marker.bindPopup(popup);

    marker.addEventListener('popupopen', ev => {
      const view = templateRef.createEmbeddedView({}, this.injector);
      view.rootNodes.forEach(node => el.appendChild(node));

      this.appRef.attachView(view);

      marker.addEventListener('popupclose', ev => {
        view.destroy();
      });
    });
  }
}

@Component({
  selector: 'app-map',
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class.is-loading]": "loading()",
  },
  template: `
    @if (loading()) {
      <div class="map-loading-overlay">
        <div class="spinner-border" aria-role="status" aria-label="Cargando"></div>
      </div>
    }
    <div #mapContainer class="map-container"></div>
    @if (panelTemplate()) {
      <div class="map-overlay-panel" (mousedown)="$event.stopPropagation()" (dblclick)="$event.stopPropagation()">
        <ng-container *ngTemplateOutlet="panelTemplate()!"></ng-container>
      </div>
    }
  `,
  styleUrl: './map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  readonly center = input<[number, number]>([-34.820367674622, -57.96553512674702]);
  readonly zoom = input<number>(13);
  readonly loading = input(false);

  readonly panelTemplate = contentChild(MapPanel, { read: TemplateRef });
  readonly controls = contentChildren(MapControl);

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: L.Map;

  constructor() {
    afterRenderEffect(() => {
      const center = this.center();
      const zoom = this.zoom();
      this.map!.setView(center, zoom);
    });

    afterRenderEffect(() => {
      for (const control of this.controls()) {
        control.addTo(this.map!);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  addControl(control: L.Control) {
    this.map?.addControl(control);
  }

  addLayer(layer: L.Layer) {
    this.map?.addLayer(layer);
  }

  addMarker(marker: L.Marker) {
    marker.addTo(this.map!);
  }

  flyTo(latlng: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions) {
    this.map?.flyTo(latlng, zoom, options)
  }

  setView(latlng: L.LatLngExpression, zoom?: number) {
    this.map?.setView(latlng, zoom);
  }

  private initMap(): void {
    const container = this.mapContainer().nativeElement;
    this.map = L.map(container, {
      center: this.center(),
      zoom: this.zoom(),
      zoomControl: false,
      scrollWheelZoom: false,
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'map-tiles',
      referrerPolicy: 'origin',
    });

    this.map.addLayer(tileLayer);

    this.setupZoom();

    // Force a resize check to avoid display issues in hidden containers
    setTimeout(() => this.map?.invalidateSize());
  }

  private setupZoom() {
    this.map?.getContainer().addEventListener('wheel', ev => {
      if (ev.ctrlKey && ev.deltaY !== 0) {
        ev.preventDefault();

        if (ev.deltaY < 0) {
          this.map?.zoomIn();
        } else {
          this.map?.zoomOut();
        }
      }
    });

    const text = 'Mantenga presionada la tecla Ctrl para manipular el zoom con el ratón';
    this.map?.addControl(new Tip(text, { position: 'topright' }));

    const zoomControl = L.control.zoom({ position: 'topright' });
    this.map?.addControl(zoomControl);
  }
}
