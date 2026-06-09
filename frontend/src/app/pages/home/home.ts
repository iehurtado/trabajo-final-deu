import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type, viewChild } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Icon, IconOptions } from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { BalneariosService } from '../../balnearios.service';
import { FixedFooter } from "../../components/fixed-footer/fixed-footer";
import { MapComponent, MapPanel, MapPopup, MarkerComponent } from '../../components/map/map';
import { BalnearioIcon, PuntoInteresIcon } from '../../components/map/util';
import { PopupBalneario } from '../../components/popup-balneario';
import { PopupPuntoInteres } from '../../components/popup-punto-interes';
import { PuntosInteresService } from '../../puntos-interes.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

type PanelMarcador = {
  component: Type<any>;
  inputs: {[name: string]: any};
};

type Marcador = {
  lat: number;
  long: number;
  nombre: string;
  icono: Icon<IconOptions>;
  panel: PanelMarcador;
}

function diagonally(a: Marcador, b: Marcador) {
  if (a.lat === b.lat) {
    return a.long - b.long;
  }
  return b.lat - a.lat;
}

@Component({
  selector: 'app-home',
  imports: [
    MapComponent,
    MarkerComponent,
    MapPopup,
    FaIconComponent,
    MapPanel,
    NgComponentOutlet,
    FixedFooter,
    RouterLink,
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly auth = inject(AuthService);
  protected readonly canAddPuntos = this.auth.can(['Colaborador', 'Administrador']);

  private readonly puntosService = inject(PuntosInteresService);
  private readonly balneariosService = inject(BalneariosService);
  private readonly map = viewChild.required(MapComponent);

  protected readonly faInfoCircle = faInfoCircle;
  protected readonly faExclamationCircle = faExclamationCircle;

  protected readonly popup = signal<L.Popup|null>(null);
  protected readonly panel = signal<PanelMarcador | null>(null);
  protected readonly marcadores = signal<Marcador[]>([]);

  protected readonly PuntoInteresIcon = PuntoInteresIcon;
  protected readonly BalnearioIcon = BalnearioIcon;

  async ngOnInit(): Promise<void> {
    const [puntos, balnearios] = await Promise.all([
      this.fetchPuntosInteres(),
      this.fetchBalnearios()
    ]);

    this.marcadores.set([...puntos, ...balnearios].sort(diagonally));
  }

  private async fetchPuntosInteres() {
    const puntos = await firstValueFrom(this.puntosService.getPuntosInteres());

    return puntos.map(punto => <Marcador>{
      lat: punto.latitud,
      long: punto.longitud,
      nombre: punto.nombre,
      icono: PuntoInteresIcon,
      panel: {
        component: PopupPuntoInteres,
        inputs: {
          punto,
        },
      },
    });
  }

  private async fetchBalnearios() {
    const balnearios = await firstValueFrom(this.balneariosService.getBalnearios());

    return balnearios.map(balneario => <Marcador>{
      lat: balneario.latitud,
      long: balneario.longitud,
      nombre: balneario.nombre,
      icono: BalnearioIcon,
      panel: {
        component: PopupBalneario,
        inputs: {
          balneario,
        },
      },
    });
  }

  closePanel() {
    this.popup()?.close();
  }

  onPopupOpened(e: L.PopupEvent, marcador: Marcador) {
    e.popup.once('remove', () => {
      this.popup.set(null);
      this.panel.set(null);
    });

    this.map().setView(e.popup.getLatLng()!);
    this.panel.set(marcador.panel);
    this.popup.set(e.popup);
  }
}





