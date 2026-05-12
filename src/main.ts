/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import * as L from 'leaflet';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { defaultIcon } from './app/components/map/defaults';


L.Marker.prototype.options.icon = defaultIcon;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
