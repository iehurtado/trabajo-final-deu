import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { distinctUntilChanged, map, startWith, Subscription } from 'rxjs';
import { PuntosInteresService } from '../puntos-interes.service';

@Component({
  selector: 'app-puntos-interes-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './puntos-interes-create.html',
  styleUrl: './puntos-interes-create.scss',
})
export class PuntosInteresCreate implements AfterViewInit, OnDestroy {
  private locationSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly puntosService = inject(PuntosInteresService);
  private readonly router = inject(Router);

  private map!: L.Map;
  private marker?: L.Marker;
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  
  protected readonly detectando = signal(false);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Contaminantes', [Validators.required]],
    subcategoria: ['', [Validators.required]],
    latitud: [-34.92134576106383, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    longitud: [-57.953514458653274, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    descripcion: ['', [Validators.maxLength(500)]],
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.observeMarker();
    this.detectarUbicacion();
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer().nativeElement, {
      center: [this.form.value.latitud!, this.form.value.longitud!],
      zoom: 14,
      dragging: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.map.addEventListener('click', e => {
      this.form.patchValue({ latitud: e.latlng.lat, longitud: e.latlng.lng });
    });
  }

  private observeMarker() {
    const marker$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      map(x => ({ lat: x.latitud, lng: x.longitud })),
      distinctUntilChanged((x, y) => x?.lat === y?.lat && x?.lng === y?.lng),
      map(({ lat, lng }) => lat && lng && L.marker([lat, lng])),
    );

    this.locationSubscription = marker$.subscribe(currentMarker => {
      if (this.marker) {
        this.marker.remove();
      }

      if (currentMarker) {
        this.marker = currentMarker;
        this.marker.addTo(this.map);

        const { lat, lng } = this.marker.getLatLng()!;
        this.map.setView([lat, lng], 14, { duration: 800 });
        this.map.invalidateSize();
      }
    });
  }

  private detectarUbicacion() {
    if (navigator.geolocation) {
      this.detectando.set(true);
      navigator.geolocation.getCurrentPosition(e => {
        this.form.patchValue({ latitud: e.coords.latitude, longitud: e.coords.longitude });
        this.detectando.set(false);
      }, e => {
        this.detectando.set(false);
      });
    } else {
      this.form.patchValue({ latitud: -34.820367674622, longitud: -57.96553512674702 });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const formValue = this.form.getRawValue();

    const agregado$ = this.puntosService.addPuntoInteres({
      nombre: formValue.nombre!,
      categoria: formValue.categoria!,
      subcategoria: formValue.subcategoria!,
      latitud: Number(formValue.latitud),
      longitud: Number(formValue.longitud),
      descripcion: formValue.descripcion ?? undefined,
    });

    agregado$.subscribe(({ id }) => {
      this.form.markAsPristine(); // Evitar el guard de confirmación al navegar tras guardar
      this.guardando.set(false);
      this.router.navigate(['/puntos', id]);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}
