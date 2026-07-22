import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideDefaultClient } from '../api';
import { routes } from './app.routes';
import { authorizeRequests, prependBaseUrl } from './interceptors';
import { AuthService } from './auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([ prependBaseUrl, authorizeRequests ])),
    provideDefaultClient({ basePath: '' }),
    provideAppInitializer(() => inject(AuthService).initialize()),
  ],
};
