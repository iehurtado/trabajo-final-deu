import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideDefaultClient } from '../api';
import { routes } from './app.routes';
import { authorizeRequests, prependBaseUrl } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([ prependBaseUrl, authorizeRequests ])),
    provideDefaultClient({ basePath: '' }),
  ]
};
