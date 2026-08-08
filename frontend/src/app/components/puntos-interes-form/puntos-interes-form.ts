import { AfterViewInit, Component, effect, ElementRef, inject, input, OnDestroy, output, signal, viewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, UrlSegment, UrlTree } from '@angular/router';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { delay, distinctUntilChanged, map, of, startWith, Subscription, switchMap } from 'rxjs';
import { PuntoInteres, PuntosInteresService } from '../../puntos-interes.service';
import { PUNTA_LARA } from '../../util';
import { PuntoInteresIcon } from '../map/util';
import { AutoTrim } from '../autotrim';

@Component({
  selector: 'app-puntos-interes-form',
  imports: [ReactiveFormsModule, RouterLink, FaIconComponent, AutoTrim],
  templateUrl: './puntos-interes-form.html',
  styleUrl: './puntos-interes-form.scss',
})
export class PuntosInteresForm implements AfterViewInit, OnDestroy {
  private locationSubscription!: Subscription;

  protected readonly faLocationCrosshairs = faLocationCrosshairs;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly puntosInteresService = inject(PuntosInteresService);

  private map!: L.Map;
  private marker?: L.Marker;
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  protected readonly detectando = signal(false);
  protected readonly guardando = signal(false);

  readonly backLink = input<string | readonly any[] | UrlTree>();
  readonly initialData = input<PuntoInteres>();
  protected readonly guardado = output<Omit<PuntoInteres, 'id'|'createdAt'|'updatedAt'>>();

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)], [this.puntoInteresNameValidator()]],
    categoria: ['Contaminantes', [Validators.required]],
    subcategoria: ['', [Validators.required]],
    latitud: [null as number|null, [Validators.required]],
    longitud: [null as number|null, [Validators.required]],
    descripcion: ['', [Validators.maxLength(500)]],
  });

  protected readonly nombre = this.form.controls['nombre'];

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue(data);
      }
    });

    effect(() => {
      if (this.guardando()) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.observeMarker();
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

  private puntoInteresNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>) => {
      const value = control.value?.trim();

      if (!value || value.toLowerCase() === this.initialData()?.nombre.toLowerCase()) {
        return of(null);
      }

      return of(value).pipe(
        delay(200),
        switchMap(value => this.puntosInteresService.getPuntoInteresByNombre(value).pipe(
          map(puntoInteres => puntoInteres ? { puntoInteresNameExists: true } : null)
        )),
      );
    };
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer().nativeElement, {
      center: PUNTA_LARA,
      zoom: 14,
      dragging: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'map-tiles',
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
      map(({ lat, lng }) => lat && lng && L.marker([lat, lng], { icon: PuntoInteresIcon })),
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

  protected detectarUbicacion() {
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

    this.guardado.emit({
      nombre: formValue.nombre.trim(),
      categoria: formValue.categoria,
      subcategoria: formValue.subcategoria.trim(),
      latitud: Number(formValue.latitud),
      longitud: Number(formValue.longitud),
      descripcion: formValue.descripcion,
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  notifySubmissionCompleted() {
    this.form.markAsPristine();
    this.guardando.set(false);
  }
}
