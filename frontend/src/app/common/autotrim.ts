import { afterNextRender, booleanAttribute, DestroyRef, Directive, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, NgControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Directive({
  selector: 'input[autotrim]',
  host: {
    '(blur)': 'handleBlur()',
  }
})
export class AutoTrim {
  private readonly ngControl = inject(NgControl);
  private readonly destroyRef = inject(DestroyRef);

  readonly disallowSpaces = input<boolean>(false, { transform: booleanAttribute });

  constructor() {
    afterNextRender({
      read: () => this.ngControl.control?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
        .subscribe(() => this.handleChange()),
    });
  }

  protected handleChange() {
    this.applyTransform(value => trim(value, { allowEndSpace: !this.disallowSpaces() }));
  }

  protected handleBlur() {
    this.applyTransform(value => trim(value, { allowEndSpace: false }));
  }

  private applyTransform(mapFn: (value: string | null | undefined) => string | null | undefined) {
    const control = this.ngControl.control;

    if (control === null) {
      throw new Error('Only for use with FormControl');
    }

    const value = control.value;
    const next = typeof value === 'string' ? mapFn(value) : value;

    if (next !== value) {
      control.setValue(next);
    }
  }
}

export const setupTrimmer = (control: AbstractControl<string|null|undefined>, opts?: { allowEndSpace?: boolean, destroyRef?: DestroyRef }) => {
  const value$ = control.valueChanges.pipe(
    takeUntilDestroyed(opts?.destroyRef),
    distinctUntilChanged(),
  );

  value$.subscribe(current => {
    const trimmed = trim(current, opts);

    if (trimmed !== current) {
      control.setValue(current);
    }
  });
}

function trim(current: string | null | undefined, opts?: { allowEndSpace?: boolean }) {
  return current && (
    (opts?.allowEndSpace === true)
      ? current.trimStart().replace(/\s\s+$/, ' ')
      : current.trim()
  );
}

