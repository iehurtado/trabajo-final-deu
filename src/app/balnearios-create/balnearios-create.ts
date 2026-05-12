import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { distinctUntilChanged, map, startWith, Subscription } from 'rxjs';
import { BalneariosService } from '../balnearios.service';
import { FixedFooter } from "../fixed-footer/fixed-footer";

@Component({
  selector: 'app-balnearios-create',
  imports: [ReactiveFormsModule, RouterLink, FixedFooter],
  templateUrl: './balnearios-create.html',
  styleUrl: './balnearios-create.scss',
})
export class BalneariosCreate implements AfterViewInit, OnDestroy {
  private locationSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly balneariosService = inject(BalneariosService);
  private readonly router = inject(Router);

  private map!: L.Map;
  private marker?: L.Marker;
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  
  protected readonly detectando = signal(false);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    estadoAgua: ['Apto', [Validators.required]],
    latitud: [-34.820, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    longitud: [-57.965, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    auxilio: [false],
    banos: [false],
    rampa: [false],
    vigilancia: [false],
    parrillas: [false],
    bus: [false],
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.observeMarker();
    this.detectarUbicacion();
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer().nativeElement, {
      center: [this.form.value.latitud!, this.form.value.longitud!],
      zoom: 14,
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
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const formValue = this.form.getRawValue();

    const agregado$ = this.balneariosService.addBalneario({
      nombre: formValue.nombre!,
      estadoAgua: formValue.estadoAgua!,
      latitud: Number(formValue.latitud),
      longitud: Number(formValue.longitud),
      auxilio: !!formValue.auxilio,
      banos: !!formValue.banos,
      rampa: !!formValue.rampa,
      vigilancia: !!formValue.vigilancia,
      parrillas: !!formValue.parrillas,
      bus: !!formValue.bus,
    });

    agregado$.subscribe(({ id }) => {
      this.form.markAsPristine();
      this.guardando.set(false);
      this.router.navigate(['/balnearios', id]);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}
