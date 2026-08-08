import { AbstractControl, AsyncValidatorFn, FormGroup, ValidatorFn } from "@angular/forms";
import { delay, map, of, switchMap } from "rxjs";
import { AuthService } from "./auth.service";

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

export function equals(a: string, b: string): ValidatorFn {
  return (form: AbstractControl) => {
    if (!(form instanceof FormGroup)) {
      throw new Error('form must be a FormGroup');
    }

    const aField = form.controls[a];
    const bField = form.controls[b];

    if (!aField) throw new Error(`FormControl with name ${a} not found`);
    if (!bField) throw new Error(`FormControl with name ${b} not found`);

    if (aField.value === bField.value) {
      return null;
    }

    return { equals: {} };
  }
}
