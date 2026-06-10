import { Component, inject, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCog, faMoon, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { DarkModeSettingService } from '../../darkmode-setting.service';
import { FontSizeSettingService } from '../../font-size-setting.service';
import { WelcomeService } from '../welcome/welcome';

@Component({
  selector: 'app-settings-menu',
  imports: [FaIconComponent, FormsModule, NgbOffcanvasModule, ReactiveFormsModule],
  templateUrl: './settings-menu.html',
  styleUrl: './settings-menu.scss',
})
export class SettingsMenu {
  protected readonly faCog = faCog;
  protected readonly faRotateLeft = faRotateLeft;
  protected readonly faMoon = faMoon;

  protected readonly settings = inject(FontSizeSettingService);
  protected readonly darkModeSetting = inject(DarkModeSettingService);
  protected readonly welcome = inject(WelcomeService);
  protected readonly offcanvas = inject(NgbOffcanvas);

  protected open(content: TemplateRef<any>) {
    this.offcanvas.open(content, {
      ariaLabelledBy: 'offcanvas-basic-title',
      position: 'end',
    });
  }
}
