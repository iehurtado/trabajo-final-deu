import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from '../dialog/dialog.service';

type User = {
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-menu',
  imports: [FaIconComponent, NgOptimizedImage, NgbDropdownModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
})
export class UserMenu {
  private readonly dialog = inject(DialogService);

  protected readonly faRightFromBracket = faRightFromBracket;

  readonly user = input.required<User>();

  logout() {
    this.dialog.confirm({ message: "Está por salir de la aplicación ¿desea continuar?" });
  }
}
