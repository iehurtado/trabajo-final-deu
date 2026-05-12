import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Home } from './home/home';
import { PuntosInteresList } from './puntos-interes-list/puntos-interes-list';
import { PuntosInteresDetail } from './puntos-interes-detail/puntos-interes-detail';
import { PuntosInteresCreate } from './puntos-interes-create/puntos-interes-create';
import { inject } from '@angular/core';
import { PuntosInteresService } from './puntos-interes.service';
import { BalneariosList } from './balnearios-list/balnearios-list';
import { BalneariosCreate } from './balnearios-create/balnearios-create';
import { BalneariosDetail } from './balnearios-detail/balnearios-detail';
import { BalneariosService } from './balnearios.service';

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
    }
];
