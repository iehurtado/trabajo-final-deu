import { computed, effect, inject, Injectable, Injector, Signal, signal, WritableSignal } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { AuthService as AuthControllerService } from "../api/services/auth.service";
import { HttpClient, HttpContext, HttpContextToken, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

export class UnauthorizedError extends Error {
  //
}

type AuthState = {
  user: { id: string, fullname: string, email: string, roles: Array<{ id: string, nombre: string }> }|null;
  token: string|null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authController = inject(AuthControllerService);
  private readonly injector = inject(Injector);

  private readonly state: WritableSignal<AuthState> = signal<AuthState>({
    user: JSON.parse(localStorage.getItem("user") ?? 'null'),
    token: JSON.parse(localStorage.getItem("token") ?? 'null'),
  });

  public readonly user = computed(() => this.state().user);
  public readonly token = computed(() => this.state().token);

  public async initialize() {
    effect(() => {
      const { user, token } = this.state();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(token));
    }, { injector: this.injector });

    const token = JSON.parse(localStorage.getItem("token") ?? 'null');

    if (token !== null) {
      try {
        const user = await firstValueFrom(this.authController.profile());
        this.state.set({ token, user });
      } catch (e: unknown) {
        if (e instanceof HttpErrorResponse && e.status === 401) {
          return;
        }

        throw e;
      };
    }
  }

  public can(role: string|string[]) {
    const requeridos = !Array.isArray(role) ? [role] : role;

    return computed(() => {
      const user = this.user();
      return user != null && user.roles.some(x => requeridos.includes(x.nombre));
    });
  }

  public checkEmail(email: string): Observable<{ available: boolean }> {
    return this.authController.checkEmail(email);
  }

  public async login(credentials: { email: string, password: string }): Promise<void> {
    const response = await firstValueFrom(this.authController.login(credentials));
    this.state.set({ token: response.access_token, user: response.user });
  }

  public async signup(form: { email: string, fullname: string, password: string, password_repeat: string }) {
    return firstValueFrom(this.authController.signup(form));
  }

  public async logout(): Promise<void> {
    // TODO Implementar logout con invalidación de tokens, etc

    return new Promise(resolve => {
      setTimeout(() => {
        this.state.set({ token: null, user: null });
        resolve();
      }, 600);
    });
  }
}
