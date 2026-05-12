import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCog, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbCollapseModule, NgbDropdownModule, RouterLink, NgOptimizedImage, FaIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly faRightFromBracket = faRightFromBracket;
  protected isNavbarCollapsed = signal(true);

  protected user = signal({
    name: "Margarita Rosa Violeta",
    email: "mvr@example.com",
  })

  protected links = [
    { route: '', title: 'Home' },
    { route: '/puntos', title: 'Puntos de Interés' },
    { route: '/balnearios', title: 'Balnearios' },
  ];

  toggleNavbarCollapse() {
    this.isNavbarCollapsed.update(v => !v);
  }

  logout() {
    confirm("¿Está seguro de que desea cerrar sesión?");
  }
}
