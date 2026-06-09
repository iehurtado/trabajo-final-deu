import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { DialogService } from '../dialog/dialog.service';
import { LoginDialogService } from '../login-dialog/login-dialog';
import { Router, RouterLink } from '@angular/router';
import { Toaster } from '../toaster/toaster.service';

@Component({
  selector: 'app-user-menu',
  imports: [FaIconComponent, NgOptimizedImage, NgbDropdownModule, RouterLink],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
})
export class UserMenu {
  protected readonly auth = inject(AuthService);
  private readonly dialog = inject(DialogService);
  protected readonly loginDialog = inject(LoginDialogService);
  private readonly toaster = inject(Toaster);
  private readonly router = inject(Router);

  protected readonly faRightFromBracket = faRightFromBracket;

  readonly working = signal(false);

  async login() {
    await this.loginDialog.show();
    this.router.navigate(['/']);
  }

  async logout() {
    const message = "Está por cerrar sesión ¿desea continuar?";

    if (await this.dialog.confirm({ message })) {
      this.working.set(true);

      try {
        await this.auth.logout();
        this.toaster.show('Cerrar Sesión', 'La sesión se cerró exitosamente');
        await this.router.navigate(['/']);
      } finally {
        this.working.set(false);
      }
    }
  }
}
