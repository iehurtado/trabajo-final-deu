import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { User } from '../../user.service';

@Component({
  selector: 'app-users-detail',
  imports: [CommonModule, FixedFooter, RouterLink],
  templateUrl: './users-detail.html',
  styleUrl: './users-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDetail {
  protected readonly user = input<User>();
}
