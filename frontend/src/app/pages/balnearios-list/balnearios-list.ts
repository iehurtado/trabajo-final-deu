import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { Balneario, BalneariosService } from '../../balnearios.service';
import { EstadoAguaBadge } from "../../components/estado-agua-badge";
import { Paginator } from "../../components/paginator/paginator";
import { getUserFriendlyErrorMessage } from '../../util';
import { DatePipe } from '@angular/common';

const perPage = 10;
@Component({
  selector: 'app-balnearios-list',
  imports: [RouterLink, FaIconComponent, Paginator, EstadoAguaBadge, DatePipe],
  templateUrl: './balnearios-list.html',
  styleUrl: './balnearios-list.scss',
})
export class BalneariosList {
  protected faEye = faEye;
  protected readonly getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;

  private balneariosService = inject(BalneariosService);

  protected readonly page = signal(1);

  protected readonly balnearios = resource({
    params: () => ({ page: this.page() }),
    loader: ({ params }) => firstValueFrom(
      this.balneariosService.getBalnearios(params.page, perPage)
    ),
  });

  protected services(b: Balneario) {
    const available = [
      { key: 'auxilio' as const, name: 'Auxilio' },
      { key: 'banos' as const, name: 'Baños' },
      { key: 'rampa' as const, name: 'Rampa' },
      { key: 'vigilancia' as const, name: 'Vigilancia' },
      { key: 'parrillas' as const, name: 'Parrillas' },
      { key: 'bus' as const, name: 'Bus' },
    ];

    return available.filter(x => b[x.key]);
  }
}
