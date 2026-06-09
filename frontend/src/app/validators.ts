import { ValidatorFn, AbstractControl, FormGroup } from "@angular/forms";

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
