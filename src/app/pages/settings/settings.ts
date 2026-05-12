import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './settings.html',
})
export class Settings {
  protected readonly faRotateLeft = faRotateLeft;

  protected settings = inject(SettingsService);

  setFontSize(size: number|string) {
    this.settings.setFontSize(Number(size));
  }

  restoreDefault() {
    this.settings.setFontSize(100);
  }
}
