import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from 'rxjs';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Balneario, BalneariosService } from '../balnearios.service';
import { MapComponent, MarkerComponent } from '@common/maps/map';
import { BalnearioIcon } from '@common/maps/util';
import { EstadoAguaBadge } from "../estado-agua-badge";
import { getUserFriendlyErrorMessage } from '@common/util';
import { DialogService } from '@common/ui/dialog/dialog.service';
import { Toaster } from '@common/ui/toaster/toaster.service';
import { AuthService } from '@features/auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-balnearios-detail',
  imports: [MapComponent, RouterLink, MarkerComponent, EstadoAguaBadge, DatePipe],
  templateUrl: './balnearios-detail.html',
  styleUrl: './balnearios-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalneariosDetail {
  protected readonly faPencilAlt = faPencilAlt;
  protected readonly getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;

  private readonly balneariosService = inject(BalneariosService);
  private readonly dialog = inject(DialogService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);
  private readonly auth = inject(AuthService);

  protected readonly balnearioId = input.required<number>({ alias: 'id' });
  protected readonly balneario = resource({
    params: () => ({ balnearioId: this.balnearioId() }),
    loader: async ({ params }) => {
      const balneario = await firstValueFrom(
        this.balneariosService.getBalnearioById(params.balnearioId)
      );

      if (!balneario) {
        throw new Error('Balneario no encontrado');
      }

      return balneario;
    },
  });

  protected readonly canDeleteBalneario = computed(() => this.auth.can('Administrador'));

  async deleteBalneario(): Promise<void> {
    const confirmed = await this.dialog.confirm({
      title: 'Eliminar Balneario',
      message: '¿Seguro deseas eliminar este balneario? Esta acción no se puede deshacer',
    });

    if (!confirmed) {
      return;
    }

    await firstValueFrom((this.balneariosService as any).deleteBalneario(this.balnearioId()));
    this.toaster.show('Eliminar Balneario', 'El balneario se eliminó correctamente', { class: 'text-bg-success' });
    await this.router.navigate(['/balnearios']);
  }

  markerOptions(balneario: Balneario): L.MarkerOptions {
    return { title: `Balneario ${balneario.nombre}`, icon: BalnearioIcon };
  }
}
