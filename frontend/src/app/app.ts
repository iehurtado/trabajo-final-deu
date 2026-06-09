import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { faCog, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { SettingsMenu } from "./components/settings-menu/settings-menu";
import { UserMenu } from "./components/user-menu/user-menu";
import { NgSelectConfig } from '@ng-select/ng-select';
import { ToastContainer } from './components/toaster/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbCollapseModule, NgbDropdownModule, RouterLink, RouterLinkActive, UserMenu, SettingsMenu, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly ngSelect = inject(NgSelectConfig);

  protected readonly faRightFromBracket = faRightFromBracket;
  protected readonly faCog = faCog;

  protected isNavbarCollapsed = signal(true);

  protected links = computed(() => {
    const links = [ { route: '', title: 'Home' } ];

    const user = this.auth.user();

    if (!user) {
      return links;
    }

    if (user.roles.some(x => x.nombre == 'Administrador')) {
      links.push(
        { route: '/puntos', title: 'Puntos de Interés' },
        { route: '/balnearios', title: 'Balnearios' },
        { route: '/users', title: 'Usuarios' },
      )
    }

    return links;
  });

  ngOnInit() {
    this.ngSelect.notFoundText = 'No se encontraron items';
    this.ngSelect.loadingText = 'Cargando...';
  }

  toggleNavbarCollapse() {
    this.isNavbarCollapsed.update(v => !v);
  }

}
