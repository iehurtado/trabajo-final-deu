import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { faCog, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { SettingsMenu } from "./components/settings-menu/settings-menu";
import { UserMenu } from "./components/user-menu/user-menu";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbCollapseModule, NgbDropdownModule, RouterLink, RouterLinkActive, UserMenu, SettingsMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly auth = inject(AuthService);

  protected readonly faRightFromBracket = faRightFromBracket;
  protected readonly faCog = faCog;

  protected isNavbarCollapsed = signal(true);

  protected links = [
    { route: '', title: 'Home' },
    { route: '/puntos', title: 'Puntos de Interés' },
    { route: '/balnearios', title: 'Balnearios' },
  ];

  toggleNavbarCollapse() {
    this.isNavbarCollapsed.update(v => !v);
  }


}
