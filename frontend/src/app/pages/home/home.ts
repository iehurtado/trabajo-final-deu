import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, computed, createComponent, effect, EnvironmentInjector, inject, Injector, inputBinding, OnInit, resource, signal, Type, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import L, { Icon, IconOptions } from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth.service';
import { BalneariosService } from '../../balnearios.service';
import { MapComponent, MapPanel } from '../../components/map/map';
import { BalnearioIcon, PuntoInteresIcon } from '../../components/map/util';
import { PopupBalneario } from '../../components/popup-balneario';
import { PopupPuntoInteres } from '../../components/popup-punto-interes';
import { PuntosInteresService } from '../../puntos-interes.service';

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

type SearchOption = {
  marker: L.Marker;
  label: string;
  tipo: string;
};

@Component({
  selector: 'app-home',
  imports: [
    MapComponent,
    FaIconComponent,
    MapPanel,
    RouterLink,
    NgSelectComponent,
    ReactiveFormsModule,
    NgOptionComponent
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit, AfterViewInit {
  private readonly auth = inject(AuthService);
  protected readonly canAddPuntos = this.auth.can(['Colaborador', 'Administrador']);

  private readonly app = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly puntosService = inject(PuntosInteresService);
  private readonly balneariosService = inject(BalneariosService);
  private readonly map = viewChild.required(MapComponent);

  protected readonly faInfoCircle = faInfoCircle;
  protected readonly faExclamationCircle = faExclamationCircle;

  protected readonly popup = signal<L.Popup|null>(null);
  protected readonly panel = signal<PanelMarcador | null>(null);

  protected readonly balnearios = resource<Marcador[], unknown>({
    defaultValue: [],
    loader: () => this.fetchBalnearios(),
  });

  protected readonly puntosInteres = resource<Marcador[], unknown>({
    defaultValue: [],
    loader: () => this.fetchPuntosInteres(),
  });

  protected readonly loading = computed(() => {
    return this.balnearios.isLoading() || this.puntosInteres.isLoading();
  });

  protected readonly compareWith = <T extends SearchOption>(a: T, b: T) => a.marker === b.marker;

  protected balneariosLayer?: L.LayerGroup;
  protected puntosInteresLayer?: L.LayerGroup;

  protected searchableElems: SearchOption[] = [];

  protected layersControl: L.Control.Layers = L.control.layers(undefined, undefined, {
    collapsed: false,
    position: 'bottomright',
  });

  ngOnInit() {
    //
  }

  async ngAfterViewInit() {
    const map = this.map();

    map.addControl(this.layersControl);

    effect(() => {
      if (this.balneariosLayer) {
        this.balneariosLayer.remove();
        this.layersControl.removeLayer(this.balneariosLayer);
      }

      if (this.balnearios.hasValue()) {
        const balnearios = this.balnearios.value();
        this.balneariosLayer = this.createLayerGroup(balnearios);
        map.addLayer(this.balneariosLayer);
        this.layersControl.addOverlay(this.balneariosLayer, 'Balnearios');
        this.updateSearchableElements();
      }
    }, { injector: this.injector });

    effect(() => {
      if (this.puntosInteresLayer) {
        this.puntosInteresLayer.remove();
        this.layersControl.removeLayer(this.puntosInteresLayer);
        this.puntosInteresLayer = undefined;
      }

      if (this.puntosInteres.hasValue()) {
        const puntos = this.puntosInteres.value();
        this.puntosInteresLayer = this.createLayerGroup(puntos);
        map.addLayer(this.puntosInteresLayer);
        this.layersControl.addOverlay(this.puntosInteresLayer, 'Puntos de Interés');
        this.updateSearchableElements();
      }
    }, { injector: this.injector });
  }

  selectMarker(item: SearchOption) {
    item.marker.openPopup();
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

  private updateSearchableElements() {
    const elems = [] as Array<SearchOption>;

    if (this.balneariosLayer) {
      elems.push(...this.balneariosLayer.getLayers().map(layer => mapMarker(layer, 'Balnearios')));
    }

    if (this.puntosInteresLayer) {
      elems.push(...this.puntosInteresLayer.getLayers().map(layer => mapMarker(layer, 'Puntos de Interés')));
    }

    this.searchableElems = elems;

    function mapMarker(layer: L.Layer, tipo: string) {
      const marker = layer as L.Marker;
      return { marker, label: marker.options.title!, tipo };
    }
  }

  closePanel() {
    this.popup()?.close();
  }

  private createLayerGroup(puntos: Marcador[]) {
    const markers: L.Marker[] = [];

    for (const punto of puntos) {
      const marker = this.createMarker(punto);
      markers.push(marker);
    }

    return L.layerGroup(markers);
  }

  private createMarker(marcador: Marcador) {
    const marker = L.marker([marcador.lat, marcador.long], {
      title: marcador.nombre,
      icon: marcador.icono,
    });

    const popup = this.createPopup(marker, marcador);
    marker.bindPopup(popup);
    marker.bindTooltip(marcador.nombre);

    return marker;
  }

  private createPopup(marker: L.Marker<any>, marcador: Marcador) {
    const el = document.createElement('div');
    el.classList.add('leaflet-popup-custom');

    const popup = L.popup({
      content: el,
      autoPan: false,
      closeButton: true,
      closeOnClick: false,
    });

    marker.on('popupopen', (e) => {
      const component = createComponent(marcador.panel.component, {
        hostElement: el,
        environmentInjector: this.environmentInjector,
        bindings: Object.entries(marcador.panel.inputs).map(([name, value]) => {
          return inputBinding(name, () => value);
        }),
      });

      this.app.attachView(component.hostView);

      e.popup.once('remove', () => {
        this.app.detachView(component.hostView);

        this.popup.set(null);
        this.panel.set(null);
      });

      this.map().flyTo(e.popup.getLatLng()!);
      this.panel.set(marcador.panel);
      this.popup.set(e.popup);
    });

    return popup;
  }
}





