import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, from, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Toaster } from "./components/toaster/toaster.service";

const API_BASE_URL = (import.meta as any)?.env?.API_BASE_URL;

export const authorizeRequests: HttpInterceptorFn = (req, next) => {
  const toaster = inject(Toaster);
  const auth = inject(AuthService);
  const token = auth.token();
  const request = token != null
    ? req.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) })
    : req;

  return next(request).pipe(
    catchError((e: unknown) => {
      if (e instanceof HttpErrorResponse && e.status == 401) {
        toaster.show('Error de Autenticación', 'La sesión es inválida. Se cerró la sesión.');
        return from(auth.logout()).pipe(
          switchMap(() => throwError(() => e)),
        );
      }

      return throwError(() => e);
    })
  );
};

export const prependBaseUrl: HttpInterceptorFn = (req, next) => {
  const base = API_BASE_URL;

  // If the request URL is already absolute (has a scheme:// or protocol-relative //), leave it.
  const isAbsolute = req.url.startsWith('//')
    || /^[a-z][a-z0-9+\-.]*:\/\//i.test(req.url);

  if (!base || isAbsolute) return next(req);

  const trimmedBase = String(base).replace(/\/+$/, '');
  const trimmedPath = String(req.url).replace(/^\/+/, '');
  const full = trimmedBase + '/' + trimmedPath;

  const newReq = req.clone({ url: full });
  return next(newReq);

}
