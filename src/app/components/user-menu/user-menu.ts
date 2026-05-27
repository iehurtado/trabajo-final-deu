import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
  protected readonly faRightFromBracket = faRightFromBracket;

  readonly user = input.required<User>();

  logout() {
    confirm("¿Está seguro de que desea cerrar sesión?");
  }
}
