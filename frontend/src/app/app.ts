import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { faCog, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { SettingsMenu } from "./components/settings-menu/settings-menu";
import { UserMenu } from "./components/user-menu/user-menu";
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbCollapseModule, NgbDropdownModule, RouterLink, RouterLinkActive, UserMenu, SettingsMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly ngSelect = inject(NgSelectConfig);

  protected readonly faRightFromBracket = faRightFromBracket;
  protected readonly faCog = faCog;

  protected isNavbarCollapsed = signal(true);

  protected links = [
    { route: '', title: 'Home' },
    { route: '/puntos', title: 'Puntos de Interés' },
    { route: '/balnearios', title: 'Balnearios' },
    { route: '/users', title: 'Usuarios' },
  ];

  ngOnInit() {
    this.ngSelect.notFoundText = 'No se encontraron items';
    this.ngSelect.loadingText = 'Cargando...';
  }

  toggleNavbarCollapse() {
    this.isNavbarCollapsed.update(v => !v);
  }

}
