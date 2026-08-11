import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { AuthService } from "@features/auth/auth.service";
import { delay, map, of, switchMap } from "rxjs";

export function createUserEmailValidator(authService: AuthService, forgiven: string[] = []): AsyncValidatorFn {
  forgiven = forgiven.map(x => x.toLowerCase());

  return (control: AbstractControl<string>) => {
    const value = control.value?.trim();

    if (!value || forgiven.includes(value.toLowerCase())) {
      return of(null);
    }

    return of(value).pipe(
      delay(200),
      switchMap(value => authService.checkEmail(value).pipe(
        map(({ available }) => available ? null : { emailTaken: true })
      ))
    )
  }
}
