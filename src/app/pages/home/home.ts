import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Binding, ChangeDetectionStrategy, Component, inject, signal, Type, viewChild } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { BalneariosService } from '../../balnearios.service';
import { MapComponent, MapPopup, MarkerComponent } from '../../components/map/map';
import { PuntoInteresIcon } from '../../components/map/util';
import { PopupBalneario } from '../../components/popup-balneario';
import { PopupPuntoInteres } from '../../components/popup-punto-interes';
import { PuntosInteresService } from '../../puntos-interes.service';

type Panel = {
  component: Type<any>;
  options?: {
    bindings?: Binding[];
  };
};

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    MapComponent,
    MarkerComponent,
    MapPopup,
    PopupPuntoInteres,
    PopupBalneario,
    FaIconComponent
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements AfterViewInit {
  private readonly puntosService = inject(PuntosInteresService);
  private readonly balneariosService = inject(BalneariosService);
  private readonly map = viewChild.required(MapComponent);

  protected readonly faInfoCircle = faInfoCircle;

  protected readonly popup = signal<L.Popup|null>(null);

  protected readonly PuntoInteresIcon = PuntoInteresIcon;

  protected readonly puntos$ = this.puntosService.getPuntosInteres();
  protected readonly balnearios$ = this.balneariosService.getBalnearios();

  ngAfterViewInit(): void {
    //
  }

  clickMap(e: any) {
    console.log(e);
  }

  onPopupOpened(e: L.PopupEvent) {
    e.popup.once('remove', () => {
      this.popup.set(null);
    });

    this.map().setView(e.popup.getLatLng()!);

    this.popup.set(e.popup);
  }
}





