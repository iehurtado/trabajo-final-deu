import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Home } from './home/home';
import { PuntosInteresList } from './puntos-interes-list/puntos-interes-list';
import { PuntosInteresDetail } from './puntos-interes-detail/puntos-interes-detail';
import { inject } from '@angular/core';
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
        component: PuntosInteresDetail,
        path: 'puntos/:id',
        title: 'Puntos de Interés',
        resolve: {
            punto: (route: ActivatedRouteSnapshot) => {
                const id = route.paramMap.get('id');
                return inject(PuntosInteresService).getPuntoInteresById(Number(id));
            } 
        }
    }
];
