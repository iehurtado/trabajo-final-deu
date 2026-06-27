import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from 'rxjs';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Balneario, BalneariosService } from '../../balnearios.service';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { MapComponent, MarkerComponent } from '../../components/map/map';
import { BalnearioIcon } from '../../components/map/util';
import { EstadoAguaBadge } from "../../components/estado-agua-badge";

@Component({
  selector: 'app-balnearios-detail',
  imports: [MapComponent, FixedFooter, RouterLink, MarkerComponent, EstadoAguaBadge],
  templateUrl: './balnearios-detail.html',
  styleUrl: './balnearios-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalneariosDetail {
  protected readonly faPencilAlt = faPencilAlt;

  private readonly balneariosService = inject(BalneariosService);

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

  markerOptions(balneario: Balneario): L.MarkerOptions {
    return { title: `Balneario ${balneario.nombre}`, icon: BalnearioIcon };
  }
}
