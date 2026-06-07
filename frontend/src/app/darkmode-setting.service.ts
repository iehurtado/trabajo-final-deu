import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeSettingService {
  private readonly STORAGE_KEY = 'app-darkmode';

  readonly isDarkMode = signal<boolean>(this.loadDarkMode());

  constructor() {
    effect(() => {
      const active = this.isDarkMode();

      if (active) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-bs-theme');
      }

      localStorage.setItem(this.STORAGE_KEY, String(active));
    });
  }

  setDarkMode(active: boolean) {
    this.isDarkMode.set(active);
  }

  toggleDarkMode() {
    this.isDarkMode.update(value => !value);
  }

  private loadDarkMode(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === 'true';
  }
}
