/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as L from 'leaflet';
import { defaultIcon } from './app/map/defaults';


L.Marker.prototype.options.icon = defaultIcon;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
