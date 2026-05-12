import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { BalneariosService } from './balnearios.service';
import { Home } from './pages/home/home';
import { BalneariosCreate } from './pages/balnearios-create';
import { BalneariosDetail } from './pages/balnearios-detail/balnearios-detail';
import { BalneariosList } from './pages/balnearios-list/balnearios-list';
import { BalneariosUpdate } from './pages/balnearios-update';
import { PuntosInteresCreate } from './pages/puntos-interes-create';
import { PuntosInteresDetail } from './pages/puntos-interes-detail/puntos-interes-detail';
import { PuntosInteresList } from './pages/puntos-interes-list/puntos-interes-list';
import { PuntosInteresUpdate } from './pages/puntos-interes-update';
import { PuntosInteresService } from './puntos-interes.service';

export const routes: Routes = [
    {
        component: Home,
        path: '',
        title: 'Home',
    },
    {
        component: PuntosInteresList,
        path: 'puntos',
        title: 'Puntos de Interés',
    },
    {
        component: PuntosInteresCreate,
        path: 'puntos/create',
        title: 'Nuevo Punto de Interés',
        canDeactivate: [(component: PuntosInteresCreate) => {
            if (component.hasUnsavedChanges()) {
                return confirm('Tienes cambios sin guardar. ¿Deseas salir igualmente?');
            }
            return true;
        }]
    },
    {
        component: PuntosInteresDetail,
        path: 'puntos/:id',
        title: 'Puntos de Interés',
        resolve: {
            punto: (route: ActivatedRouteSnapshot) => {
                const id = route.paramMap.get('id');
                return inject(PuntosInteresService).getPuntoInteresById(Number(id));
            } 
        }
    },
    {
        component: PuntosInteresUpdate,
        path: 'puntos/:id/update',
        title: 'Editar Punto de Interés',
        resolve: {
            punto: (route: ActivatedRouteSnapshot) => {
                const id = route.paramMap.get('id');
                return inject(PuntosInteresService).getPuntoInteresById(Number(id));
            }
        },
        canDeactivate: [(component: PuntosInteresUpdate) => {
            if (component.hasUnsavedChanges()) {
                return confirm('Tienes cambios sin guardar. ¿Deseas salir igualmente?');
            }
            return true;
        }]
    },
    {
        component: BalneariosList,
        path: 'balnearios',
        title: 'Balnearios',
    },
    {
        component: BalneariosCreate,
        path: 'balnearios/create',
        title: 'Nuevo Balneario',
        canDeactivate: [(component: BalneariosCreate) => {
            if (component.hasUnsavedChanges()) {
                return confirm('Tienes cambios sin guardar. ¿Deseas salir igualmente?');
            }
            return true;
        }]
    },
    {
        component: BalneariosDetail,
        path: 'balnearios/:id',
        title: 'Balneario',
        resolve: {
            balneario: (route: ActivatedRouteSnapshot) => {
                const id = route.paramMap.get('id');
                return inject(BalneariosService).getBalnearioById(Number(id));
            }
        }
    },
    {
        component: BalneariosUpdate,
        path: 'balnearios/:id/update',
        title: 'Editar Balneario',
        resolve: {
            balneario: (route: ActivatedRouteSnapshot) => {
                const id = route.paramMap.get('id');
                return inject(BalneariosService).getBalnearioById(Number(id));
            }
        },
        canDeactivate: [(component: BalneariosUpdate) => {
            if (component.hasUnsavedChanges()) {
                return confirm('Tienes cambios sin guardar. ¿Deseas salir igualmente?');
            }
            return true;
        }]
    }
];
