import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, UrlTree } from '@angular/router';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { delay, map, of, switchMap } from 'rxjs';
import { Balneario, BalneariosService } from '../balnearios.service';
import { AutoTrim } from '@common/autotrim';
import { MapInput } from '@common/maps/input';
import { BalnearioIcon } from '@common/maps/util';

@Component({
  selector: 'app-balnearios-form',
  imports: [ReactiveFormsModule, RouterLink, FaIconComponent, AutoTrim, MapInput],
  templateUrl: './balnearios-form.html',
  styleUrl: './balnearios-form.scss',
})
export class BalneariosForm {
  protected readonly faLocationCrosshairs = faLocationCrosshairs;
  protected readonly BalnearioIcon = BalnearioIcon;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly balneariosService = inject(BalneariosService);

  protected readonly detectando = signal(false);
  protected readonly guardando = signal(false);

  readonly backLink = input<string | readonly any [] | UrlTree>();
  readonly initialData = input<Balneario>();
  protected readonly guardado = output<Omit<Balneario, 'id'|'createdAt'|'updatedAt'>>();

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)], [this.balnearioNameValidator()]],
    estadoAgua: ['APTO' as 'APTO'|'NO_APTO'|'PRECAUCION', [Validators.required]],
    ubicacion: [null as L.LatLngLiteral | null, [Validators.required]],
    auxilio: [false],
    banos: [false],
    rampa: [false],
    vigilancia: [false],
    parrillas: [false],
    bus: [false],
  });

  protected nombre = this.form.get('nombre') as FormControl<string>;


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

  private balnearioNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>) => {
      const value = control.value?.trim();

      if (!value || value.toLowerCase() === this.initialData()?.nombre.toLowerCase()) {
        return of(null);
      }

      return of(value).pipe(
        delay(200),
        switchMap(value => this.balneariosService.getBalnearioByNombre(value).pipe(
          map(balneario => balneario ? { balnearioNameExists: true } : null)
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
      }, () => {
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
    const ubicacion = formValue.ubicacion!;

    this.guardado.emit({
      nombre: formValue.nombre!.trim(),
      estadoAgua: formValue.estadoAgua!,
      latitud: Number(ubicacion.lat),
      longitud: Number(ubicacion.lng),
      auxilio: !!formValue.auxilio,
      banos: !!formValue.banos,
      rampa: !!formValue.rampa,
      vigilancia: !!formValue.vigilancia,
      parrillas: !!formValue.parrillas,
      bus: !!formValue.bus,
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
