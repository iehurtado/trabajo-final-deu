import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BalneariosService } from './balnearios.service';
import { BalneariosCreate } from './pages/balnearios-create';
import { BalneariosDetail } from './pages/balnearios-detail/balnearios-detail';
import { BalneariosList } from './pages/balnearios-list/balnearios-list';
import { BalneariosUpdate } from './pages/balnearios-update';
import { ErrorPage } from './pages/error-page';
import { Home } from './pages/home/home';
import { PuntosInteresCreate } from './pages/puntos-interes-create';
import { PuntosInteresDetail } from './pages/puntos-interes-detail/puntos-interes-detail';
import { PuntosInteresList } from './pages/puntos-interes-list/puntos-interes-list';
import { PuntosInteresUpdate } from './pages/puntos-interes-update';
import { PuntosInteresService } from './puntos-interes.service';
import { UserService } from './user.service';
import { UsersCreate } from './pages/users-create';
import { UsersDetail } from './pages/users-detail/users-detail';
import { UsersList } from './pages/users-list/users-list';
import { UsersUpdate } from './pages/users-update';
import { confirmOnUnsavedChanges } from './util';

const resolvePuntoInteres = async (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const service = inject(PuntosInteresService);
    const id = route.paramMap.get('id');
    const punto = await firstValueFrom(service.getPuntoInteresById(Number(id)));

    if (!punto) {
        return router.navigate(['/error'], {
            state: {
                message: "Punto de Interés no encontrado"
            },
        });
    }

    return punto;
};

const resolveBalneario = async (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const service = inject(BalneariosService);
    const id = route.paramMap.get('id');
    const balneario = await firstValueFrom(service.getBalnearioById(Number(id)));

    if (!balneario) {
        return router.navigate(['/error'], {
            state: {
                message: "Balneario no encontrado"
            },
        });
    }

    return balneario;
};

const resolveUser = async (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const service = inject(UserService);
    const id = route.paramMap.get('id');
    const user = await firstValueFrom(service.getUserById(Number(id)));

    if (!user) {
        return router.navigate(['/error'], {
            state: {
                message: "Usuario no encontrado"
            },
        });
    }

    return user;
};

export const routes: Routes = [
    {
        component: Home,
        path: '',
        pathMatch: 'full',
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
        canDeactivate: [confirmOnUnsavedChanges]
    },
    {
        component: PuntosInteresDetail,
        path: 'puntos/:id',
        title: 'Puntos de Interés',
        resolve: {
            punto: resolvePuntoInteres
        }
    },
    {
        component: PuntosInteresUpdate,
        path: 'puntos/:id/update',
        title: 'Editar Punto de Interés',
        resolve: {
            punto: resolvePuntoInteres,
        },
        canDeactivate: [confirmOnUnsavedChanges]
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
        canDeactivate: [confirmOnUnsavedChanges]
    },
    {
        component: BalneariosDetail,
        path: 'balnearios/:id',
        title: 'Balneario',
        resolve: {
            balneario: resolveBalneario
        }
    },
    {
        component: BalneariosUpdate,
        path: 'balnearios/:id/update',
        title: 'Editar Balneario',
        resolve: {
            balneario: resolveBalneario,
        },
        canDeactivate: [confirmOnUnsavedChanges]
    },
    {
        component: UsersList,
        path: 'users',
        title: 'Usuarios',
    },
    {
        component: UsersCreate,
        path: 'users/create',
        title: 'Nuevo Usuario',
        canDeactivate: [confirmOnUnsavedChanges]
    },
    {
        component: UsersDetail,
        path: 'users/:id',
        title: 'Usuario',
        resolve: {
            user: resolveUser
        }
    },
    {
        component: UsersUpdate,
        path: 'users/:id/edit',
        title: 'Editar Usuario',
        resolve: {
            user: resolveUser,
        },
        canDeactivate: [confirmOnUnsavedChanges]
    },
    {
        component: ErrorPage,
        path: 'error',
        title: 'Error',
    },
    {
        component: ErrorPage,
        path: '**',
        title: 'No encontrado',
        data: {
            message: 'Ruta no encontrada',
        },
    }
];
