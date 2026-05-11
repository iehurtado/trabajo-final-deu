import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import * as L from 'leaflet';
import { PuntoInteres } from '../puntos-interes.service';

@Component({
  selector: 'app-map',
  template: `<div #mapContainer class="map-container"></div>`,
  styleUrl: './map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  puntos = input<PuntoInteres[] | null>([]);
  center = input<[number, number]>([-34.820367674622, -57.96553512674702]);
  zoom = input<number>(13);

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: L.Map;
  private markers: L.Marker[] = [];

  constructor() {
    effect(() => {
      const puntos = this.puntos();
      if (puntos) {
        this.updateMarkers(puntos);
      }
    });

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

  private initMap(): void {
    this.map = L.map(this.mapContainer().nativeElement, {
      center: this.center(),
      zoom: this.zoom(),
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const puntos = this.puntos();
    if (puntos) {
      this.updateMarkers(puntos);
    }

    // // Force a resize check to avoid display issues in hidden containers
    // setTimeout(() => {
    //     this.map?.invalidateSize();
    // }, 100);
  }

  private updateMarkers(puntos: PuntoInteres[]): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    // Add new markers
    puntos.forEach(punto => {
      const marker = L.marker([punto.latitud, punto.longitud])
        .addTo(this.map!)
        .bindPopup(`
          <strong>${punto.nombre}</strong><br>
          ${punto.subcategoria}<br>
          ${punto.descripcion || ''}
        `);
      this.markers.push(marker);
    });
  }
}
