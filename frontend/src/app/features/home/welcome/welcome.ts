import { Component, computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

type WelcomeSettings = {
  dontShowAgain: boolean;
}

@Component({
  selector: 'app-welcome',
  imports: [FormsModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  protected readonly faInfoCircle = faInfoCircle;

  protected readonly modal = inject(NgbActiveModal);
  protected readonly service = inject(WelcomeService);

  protected readonly dontShowAgain: boolean = this.service.dontShowAgain();
}

@Injectable({ providedIn: 'root' })
export class WelcomeService {
  private readonly SETTINGS_KEY = 'welcome';

  private readonly modal = inject(NgbModal);

  private readonly settings: WritableSignal<WelcomeSettings>;
  public readonly dontShowAgain = computed(() => this.settings().dontShowAgain);

  constructor() {
    this.settings = signal(this.loadSettings());
    effect(() => this.saveSettings(this.settings()));
  }

  public async show() {
    const modalRef = this.modal.open(Welcome, {
      size: 'lg',
      backdrop: 'static',
    });

    const { dontShowAgain } = await modalRef.result;

    this.setDontShowAgain(dontShowAgain);
  }

  public setDontShowAgain(value: boolean) {
    this.settings.update(s => ({ ...s, dontShowAgain: value }));
  }

  private loadSettings() {
    const saved = localStorage.getItem(this.SETTINGS_KEY);

    const settings: WelcomeSettings = saved != null
      ? JSON.parse(saved)
      : { dontShowAgain: false };

    if (!saved) {
      this.saveSettings(settings);
    }

    return settings;
  }

  private saveSettings(settings: WelcomeSettings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}

