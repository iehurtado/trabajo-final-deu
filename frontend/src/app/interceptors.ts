import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, from, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Toaster } from "./components/toaster/toaster.service";

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
