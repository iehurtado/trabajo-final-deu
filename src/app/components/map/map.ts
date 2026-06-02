import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, contentChild, Directive, effect, ElementRef, inject, Injector, input, OnDestroy, output, TemplateRef, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import * as L from 'leaflet';

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
  template: `
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

  readonly panelTemplate = contentChild(MapPanel, { read: TemplateRef });

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: L.Map;

  constructor() {
    effect(() => {
      const center = this.center();
      const zoom = this.zoom();
      if (this.map) {
        this.map.setView(center, zoom);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  addMarker(marker: L.Marker) {
    marker.addTo(this.map!);
  }

  setView(latlng: L.LatLngExpression, zoom?: number) {
    this.map?.setView(latlng, zoom);
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer().nativeElement, {
      center: this.center(),
      zoom: this.zoom(),
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'map-tiles',
    }).addTo(this.map);

    // Force a resize check to avoid display issues in hidden containers
    setTimeout(() => this.map?.invalidateSize());
  }
}
