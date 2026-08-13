import { AsyncPipe } from "@angular/common";
import { Component, DestroyRef, effect, inject, input, NgModule, ViewContainerRef } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { combineLatest, map, Observable, switchMap } from "rxjs";


@Component({
  selector: 'app-scroller',
  imports: [FontAwesomeModule, AsyncPipe],
  styles: [`
    :host {
      position: fixed;
      bottom: 1.2em;
      right: 1.2em;
    }

    .btn:not(:hover) {
      opacity: 0.8;
      transition: opacity ease 100ms;
    }
  `],
  template: `
  @if (show$|async) {
    <button type="button" class="btn btn-primary" (click)="scroll()">
      <ng-content></ng-content>
      <fa-icon [icon]="faArrowDown"></fa-icon>
    </button>
  }
  `
})
export class Scroller {
  protected readonly faArrowDown = faArrowDown;

  private readonly destroyRef = inject(DestroyRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  public readonly scrollable = input.required<HTMLElement>();
  public readonly threshold = input<number>();
  public readonly title = input<string>('Acciones');

  private readonly intersection$ = combineLatest([
    toObservable(this.scrollable),
    toObservable(this.threshold),
  ]).pipe(
    switchMap(([scrollable, threshold]) => observeIntersection(scrollable, { threshold }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ))
  );

  protected readonly show$ = this.intersection$.pipe(map(x => !x.isIntersecting));

  constructor() {
    //
  }

  protected scroll() {
    const element = this.scrollable();
    window.scroll({ top: element.offsetTop, left: element.offsetLeft });
  }
}

function observeIntersection(element: HTMLElement, opts?: IntersectionObserverInit) {
  return new Observable<IntersectionObserverEntry>(subscriber => {
    const observer = new IntersectionObserver(function (entries) {
      subscriber.next(entries.pop()!);
    }, opts);

    observer.observe(element);

    return () => observer.disconnect();
  });
}
