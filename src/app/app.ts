import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbCollapseModule, NgbDropdownModule, RouterLink, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
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
