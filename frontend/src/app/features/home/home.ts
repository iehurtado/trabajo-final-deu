import { afterNextRender, afterRenderEffect, ApplicationRef, ChangeDetectionStrategy, Component, computed, createComponent, EnvironmentInjector, inject, Injector, inputBinding, linkedSignal, resource, Signal, signal, Type, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MapComponent, MapControl, MapPanel } from '@common/maps/map';
import { BalnearioIcon, PuntoInteresIcon } from '@common/maps/util';
import { AuthService } from '@features/auth/auth.service';
import { BalneariosService } from '@features/balnearios/balnearios.service';
import { PuntosInteresService } from '@features/puntos-interes/puntos-interes.service';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import L, { Icon, IconOptions } from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { PopupBalneario } from '../balnearios/popup-balneario';
import { PopupPuntoInteres } from '../puntos-interes/popup-punto-interes';

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
    NgOptionComponent,
    MapControl
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
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

  protected balneariosLayer = linkedSignal({
    source: this.balnearios.value,
    computation: this.computeLayerGroup.bind(this),
  });

  protected puntosInteresLayer = linkedSignal({
    source: this.puntosInteres.value,
    computation: this.computeLayerGroup.bind(this),
  })

  protected readonly searchableElems = computed<SearchOption[]>(() => {
    const elems = [] as Array<SearchOption>;

    const sources = [
      [this.balneariosLayer(), 'Balnearios'] as const,
      [this.puntosInteresLayer(), 'Puntos de Interés'] as const,
    ];

    for (const [ layer, name ] of sources) {
      elems.push(...layer.getLayers().map(layer => mapMarker(layer, name)));
    }

    return elems;

    function mapMarker(layer: L.Layer, tipo: string) {
      const marker = layer as L.Marker;
      return { marker, label: marker.options.title!, tipo };
    }
  });

  protected layersControl: L.Control.Layers = L.control.layers(undefined, undefined, {
    collapsed: false,
    position: 'bottomright',
  });

  constructor() {
    const createEffect = (name: string, source: Signal<L.LayerGroup>) => {
      return () => {
        const layer = source();
        this.map().addLayer(layer);
        this.layersControl.addOverlay(layer, name);
      }
    };

    afterRenderEffect(createEffect('Balnearios', this.balneariosLayer));
    afterRenderEffect(createEffect('Puntos de Interés', this.puntosInteresLayer));
    afterNextRender({ read: () => this.map().addControl(this.layersControl) });
  }

  selectMarker(item: SearchOption|undefined) {
    item?.marker.openPopup();
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

  private computeLayerGroup(data: Marcador[], previous: { source: Marcador[], value: L.LayerGroup } | undefined): L.LayerGroup {
    if (previous?.value) {
      previous.value.remove();
      this.layersControl.removeLayer(previous.value);
    }

    return this.createLayerGroup(data);
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





