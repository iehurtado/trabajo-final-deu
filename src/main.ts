/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as L from 'leaflet';


const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const defaultIcon = L.icon({
    ...L.Icon.Default,
    iconSize: [25, 41],
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    shadowAnchor: [0, 0],
    iconAnchor: [0, 0],
});

L.Marker.prototype.options.icon = defaultIcon;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
