import { HttpErrorResponse } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AuthService as AuthControllerService } from "../api/services/auth.service";

export class UnauthorizedError extends Error {
  //
}

type AuthState = {
  user: { id: string, fullname: string, email: string, roles: Array<{ id: string, nombre: string }> }|null;
  token: string|null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authController = inject(AuthControllerService);

  private readonly state = signal<AuthState>({
    user: JSON.parse(localStorage.getItem("user") ?? 'null'),
    token: JSON.parse(localStorage.getItem("token") ?? 'null'),
  });

  public readonly user = computed(() => this.state().user);
  public readonly token = computed(() => this.state().token);

  constructor() {
    effect(() => {
      const { user, token } = this.state();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(token));
    });
  }

  public async login(credentials: { email: string, password: string }): Promise<void> {
    try {
      const response = await firstValueFrom(this.authController.login(credentials));
      this.state.set({ token: response.access_token, user: response.user });
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        throw new UnauthorizedError();
      }

      throw e;
    }
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
