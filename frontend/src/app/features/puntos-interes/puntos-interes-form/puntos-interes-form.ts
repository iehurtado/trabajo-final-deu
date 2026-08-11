import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, UrlTree } from '@angular/router';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { delay, map, of, switchMap } from 'rxjs';
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';
import { AutoTrim } from '@common/autotrim';
import { MapInput } from '@common/maps/input';
import { PuntoInteresIcon } from '@common/maps/util';

@Component({
  selector: 'app-puntos-interes-form',
  imports: [ReactiveFormsModule, RouterLink, FaIconComponent, AutoTrim, MapInput],
  templateUrl: './puntos-interes-form.html',
  styleUrl: './puntos-interes-form.scss',
})
export class PuntosInteresForm {
  protected readonly faLocationCrosshairs = faLocationCrosshairs;
  protected readonly PuntoInteresIcon = PuntoInteresIcon;

  private readonly fb = inject(FormBuilder);
  private readonly puntosInteresService = inject(PuntosInteresService);

  protected readonly detectando = signal(false);
  protected readonly guardando = signal(false);

  readonly backLink = input<string | readonly any[] | UrlTree>();
  readonly initialData = input<PuntoInteres>();
  protected readonly guardado = output<Omit<PuntoInteres, 'id'|'createdAt'|'updatedAt'>>();

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)], [this.puntoInteresNameValidator()]],
    categoria: ['Contaminantes', [Validators.required]],
    subcategoria: ['', [Validators.required]],
    ubicacion: [ null as L.LatLngLiteral|null, [Validators.required]],
    descripcion: ['', [Validators.maxLength(500)]],
  });

  protected readonly nombre = this.form.controls['nombre'];

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          ...data,
          ubicacion: { lat: data.latitud, lng: data.longitud },
        });
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

  protected detectarUbicacion() {
    if (navigator.geolocation) {
      this.detectando.set(true);
      navigator.geolocation.getCurrentPosition(e => {
        this.form.patchValue({ ubicacion: { lat: e.coords.latitude, lng: e.coords.longitude } });
        this.detectando.set(false);
      }, e => {
        this.detectando.set(false);
      });
    } else {
      this.form.patchValue({ ubicacion: { lat: -34.820367674622, lng: -57.96553512674702 } });
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
      latitud: Number(formValue.ubicacion!.lat),
      longitud: Number(formValue.ubicacion!.lng),
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
