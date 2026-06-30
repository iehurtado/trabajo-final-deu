import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { MapComponent, MarkerComponent } from '../../components/map/map';
import { PuntoInteresIcon } from '../../components/map/util';
import { PuntoInteres, PuntosInteresService } from '../../puntos-interes.service';
import { getUserFriendlyErrorMessage } from '../../util';
import { DialogService } from '../../components/dialog/dialog.service';
import { Toaster } from '../../components/toaster/toaster.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-puntos-interes-detail',
  imports: [MapComponent, FixedFooter, RouterLink, MarkerComponent],
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

