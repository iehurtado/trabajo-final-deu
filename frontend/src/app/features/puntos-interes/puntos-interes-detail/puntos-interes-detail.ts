import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { MapComponent, MarkerComponent } from '@common/maps/map';
import { PuntoInteresIcon } from '@common/maps/util';
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';
import { getUserFriendlyErrorMessage } from '@common/util';
import { DialogService } from '@common/ui/dialog/dialog.service';
import { Toaster } from '@common/ui/toaster/toaster.service';
import { AuthService } from '@features/auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-puntos-interes-detail',
  imports: [MapComponent, RouterLink, MarkerComponent, DatePipe],
  templateUrl: './puntos-interes-detail.html',
  styleUrl: './puntos-interes-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuntosInteresDetail {
  protected readonly faPencilAlt = faPencilAlt;
  protected readonly getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;

  private readonly auth = inject(AuthService);
  private readonly puntosInteresService = inject(PuntosInteresService);
  private readonly dialog = inject(DialogService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  readonly puntoId = input.required<number>({alias: 'id'});

  protected readonly punto = resource({
    params: () => ({ puntoId: this.puntoId() }),
    loader: async ({ params }) => {
      const punto = await firstValueFrom(
        this.puntosInteresService.getPuntoInteresById(params.puntoId)
      );

      if (!punto) {
        throw new Error('Punto de interés no encontrado');
      }

      return punto;
    },
  });

  protected readonly canDeletePunto = computed(() => this.auth.can('Administrador'));

  async deletePunto(): Promise<void> {
    const confirmed = await this.dialog.confirm({
      title: 'Eliminar Punto de Interés',
      message: '¿Seguro deseas eliminar este punto de interés? Esta acción no se puede deshacer',
    });

    if (!confirmed) {
      return;
    }

    await firstValueFrom(this.puntosInteresService.deletePuntoInteres(this.puntoId()));
    this.toaster.show('Eliminar Punto de Interés', 'El punto de interés se eliminó correctamente', { class: 'text-bg-success' });
    await this.router.navigate(['/puntos']);
  }

  markerOptions(punto: PuntoInteres): L.MarkerOptions {
    return { title: `Punto de Interés ${punto.nombre}`, icon: PuntoInteresIcon };
  }
}

