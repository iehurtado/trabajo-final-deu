import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideDefaultClient } from '@api/providers';
import { routes } from './app.routes';
import { prependBaseUrl } from '@common/interceptors';
import { AuthService } from '@features/auth/auth.service';
import { authorizeRequests } from '@features/auth/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([ prependBaseUrl, authorizeRequests ])),
    provideDefaultClient({ basePath: '' }),
    provideAppInitializer(() => inject(AuthService).initialize()),
  ],
};
