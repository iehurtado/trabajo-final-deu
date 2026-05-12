import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'app-font-size';
  private readonly DEFAULT_SIZE = 16;

  fontSize = signal<number>(this.loadSize());

  constructor() {
    effect(() => {
      const size = this.fontSize();
      const rems = size / 100;
      const value = rems.toFixed(2).replace(/\.00$/, '');
      document.documentElement.style.setProperty('--bs-body-font-size', `${value}rem`);
      localStorage.setItem(this.STORAGE_KEY, size.toString());
    });
  }

  private loadSize(): number {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? parseInt(saved, 10) : this.DEFAULT_SIZE;
  }

  setFontSize(size: number) {
    this.fontSize.set(size);
  }
}
