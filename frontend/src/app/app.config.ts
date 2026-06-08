import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideDefaultClient } from '../api';
import { routes } from './app.routes';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './auth.service';

const authorizeRequests: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const request = token != null
    ? req.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) })
    : req;

  return next(request);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      authorizeRequests
    ])),
    provideDefaultClient({ basePath: '' }),
  ]
};
