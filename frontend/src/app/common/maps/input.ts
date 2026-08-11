import { afterNextRender, afterRenderEffect, ChangeDetectionStrategy, Component, forwardRef, inject, Injector, input, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PUNTA_LARA } from '@common/util';
import * as L from 'leaflet';
import { fromEvent, map, reduce, switchMap, takeUntil } from 'rxjs';
import { defaultIcon } from './defaults';

@Component({
  selector: 'app-map-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MapInput),
      multi: true,
    }
  ],
  styles: [`
    :host {
      display: block;
    }
  `],
  template: ``,
})
export class MapInput implements ControlValueAccessor {
  private injector = inject(Injector);
  private viewContainer = inject(ViewContainerRef);

  readonly markerIcon = input<L.Icon>(defaultIcon);

  private map!: L.Map;
  private marker?: L.Marker;
  private ghost?: L.Marker;

  private onChange?: Function;
  private onTouched?: Function;

  private disabled = false;

  constructor() {
    this.map = this.createMap();
    this.setMapClickable(!this.disabled);

    afterNextRender({ read: () => this.map.invalidateSize() });

    afterRenderEffect({ read: () => {
      const markerIcon = this.markerIcon();
      if (this.marker && markerIcon !== this.marker.getIcon()) {
        this.marker.setIcon(this.markerIcon());
      }
    }});
  }

  writeValue(value: any): void {
    afterNextRender({ read: () => {
      if (value) {
        this.putMarker(value);
      } else {
        this.marker?.remove();
      }
    }}, { injector: this.injector });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;

    afterNextRender({ read: () => {
      if (this.marker) {
        this.marker.options.draggable = !isDisabled;
      }

      this.setMapClickable(!isDisabled);
    }}, { injector: this.injector });
  }

  private createMap(): L.Map {
    const container = this.viewContainer.element.nativeElement;

    const map = L.map(container, {
      center: PUNTA_LARA,
      zoom: 14,
      dragging: true,
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'map-tiles',
    });

    map.addLayer(tileLayer);
    map.addEventListener('mouseup', () => this.onTouched?.());

    return map;
  }

  private handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!this.marker) {
      this.putMarker(e.latlng);
    }
  }

  private setMapClickable(value: boolean) {
    if (value) {
      this.map.addEventListener('click', this.handleMapClick);
    } else {
      this.map.removeEventListener('click', this.handleMapClick);
    }
  }

  private putMarker(location: L.LatLngLiteral) {
    this.marker?.remove();
    this.ghost?.remove();

    const marker = L.marker(location, {
      icon: this.markerIcon(),
      draggable: !this.disabled,
    });

    const ghost = L.marker(location, {
      icon: this.markerIcon(),
      interactive: false,
      opacity: 0.6,
    });

    this.ghost = ghost;
    this.ghost.addTo(this.map);

    this.setupDragMarkerObserver(marker);

    this.marker = marker;
    this.marker.addTo(this.map);

    const { lat, lng } = this.marker.getLatLng()!;
    this.map.setView([lat, lng], 14, { duration: 800 });
    this.map.invalidateSize();
  }

  private setupDragMarkerObserver(marker: L.Marker<any>) {
    const drag$ = fromEvent(marker, 'dragstart').pipe(
      takeUntil(fromEvent(marker, 'remove')),
      switchMap(() => fromEvent<any>(marker, 'drag').pipe(
        takeUntil(fromEvent(marker, 'dragend')),
        reduce((acc, ev: { oldLatLng: L.LatLng; latlng: L.LatLng; }) => {
          return acc
            ? { oldLatLng: acc.oldLatLng, latlng: ev.latlng }
            : { oldLatLng: ev.oldLatLng, latlng: ev.latlng };
        }),
        map(x => ({ start: x.oldLatLng, stop: x.latlng }))
      ))
    );

    drag$.subscribe(({ stop: { lat, lng } }) => {
      this.onChange?.({ lat, lng });
    });
  }
}
