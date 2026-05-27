import { Component, inject, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCog, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-settings-menu',
  imports: [FaIconComponent, FormsModule, NgbOffcanvasModule],
  templateUrl: './settings-menu.html',
  styleUrl: './settings-menu.scss',
})
export class SettingsMenu {
  protected readonly faCog = faCog;
  protected readonly faRotateLeft = faRotateLeft;

  protected readonly settings = inject(SettingsService);
  protected readonly offcanvas = inject(NgbOffcanvas)

  protected open(content: TemplateRef<any>) {
    this.offcanvas.open(content, {
      ariaLabelledBy: 'offcanvas-basic-title',
      position: 'end',
    });
  }
}
