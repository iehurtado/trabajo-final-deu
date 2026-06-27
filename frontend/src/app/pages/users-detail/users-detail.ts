import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, resource } from '@angular/core';
import { RouterLink } from "@angular/router";
import { firstValueFrom } from 'rxjs';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-users-detail',
  imports: [CommonModule, FixedFooter, RouterLink],
  templateUrl: './users-detail.html',
  styleUrl: './users-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDetail {
  private readonly userService = inject(UserService);
  protected readonly userId = input.required<number>({ alias: 'id' });
  protected readonly user = resource({
    params: () => ({ userId: this.userId() }),
    loader: async ({ params }) => {
      const user = await firstValueFrom(this.userService.getUserById(params.userId));

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    },
  });
}
