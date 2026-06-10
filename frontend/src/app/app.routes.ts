import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, Routes } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { BalneariosService } from './balnearios.service';
import { Toaster } from './components/toaster/toaster.service';
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
import { Signup } from './pages/signup/signup';
import { UsersCreate } from './pages/users-create';
import { UsersDetail } from './pages/users-detail/users-detail';
import { UsersList } from './pages/users-list/users-list';
import { UsersUpdate } from './pages/users-update';
import { PuntosInteresService } from './puntos-interes.service';
import { UserService } from './user.service';
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

function requiereAutenticacion(): CanActivateFn {
  return () => {
    const router = inject(Router);
    const toaster = inject(Toaster);
    const auth = inject(AuthService);
    const user = auth.user();

    if (user == null) {
      toaster.show('No Autorizado', 'Inicie sesión para ver esta página');
      return router.createUrlTree(['/']);
    }

    return true;
  }
}

function requiereRol(nombre: string|string[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const toaster = inject(Toaster);
    const auth = inject(AuthService);
    const user = auth.user();

    const requeridos = !Array.isArray(nombre) ? [nombre] : nombre;

    if (user == null || !user.roles.some(x => requeridos.includes(x.nombre))) {
      toaster.show('No Autorizado', 'No tiene autorización para acceder a esta página.');
      return router.createUrlTree(['/']);
    }

    return true;
  }
}

export const routes: Routes = [
    {
        component: Home,
        path: '',
        pathMatch: 'full',
        title: 'Home',
    },
    {
        component: Signup,
        path: 'signup',
        title: 'Crear Cuenta',
        canActivate: [
          () => inject(AuthService).user() === null || inject(Router).createUrlTree(['/']),
        ],
    },
    {
      path: 'puntos',
      children: [
        {
            component: PuntosInteresList,
            path: '',
            pathMatch: 'full',
            title: 'Puntos de Interés',
            canActivate: [requiereRol('Administrador')],
        },
        {
            component: PuntosInteresCreate,
            path: 'create',
            title: 'Nuevo Punto de Interés',
            canActivate: [requiereRol(['Administrador', 'Colaborador'])],
            canDeactivate: [confirmOnUnsavedChanges]
        },
        {
            component: PuntosInteresDetail,
            path: ':id',
            title: 'Puntos de Interés',
            resolve: {
                punto: resolvePuntoInteres
            },
            canActivate: [requiereRol('Administrador')],
        },
        {
            component: PuntosInteresUpdate,
            path: ':id/update',
            title: 'Editar Punto de Interés',
            resolve: {
                punto: resolvePuntoInteres,
            },
            canActivate: [requiereRol('Administrador')],
            canDeactivate: [confirmOnUnsavedChanges],
        },
      ],
    },
    {
      path: 'balnearios',
      canActivateChild: [requiereRol('Administrador')],
      children: [
        {
            component: BalneariosList,
            path: '',
            pathMatch: 'full',
            title: 'Balnearios',
        },
        {
            component: BalneariosCreate,
            path: 'create',
            title: 'Nuevo Balneario',
            canDeactivate: [confirmOnUnsavedChanges],
        },
        {
            component: BalneariosDetail,
            path: ':id',
            title: 'Balneario',
            resolve: {
                balneario: resolveBalneario
            },
        },
        {
            component: BalneariosUpdate,
            path: ':id/update',
            title: 'Editar Balneario',
            resolve: {
                balneario: resolveBalneario,
            },
            canDeactivate: [confirmOnUnsavedChanges],
        },
      ],
    },
    {
      path: 'users',
      canActivateChild: [requiereRol('Administrador')],
      children: [
        {
            component: UsersList,
            path: '',
            pathMatch: 'full',
            title: 'Usuarios',
        },
        {
            component: UsersCreate,
            path: 'create',
            title: 'Nuevo Usuario',
            canDeactivate: [confirmOnUnsavedChanges]
        },
        {
            component: UsersDetail,
            path: ':id',
            title: 'Usuario',
            resolve: {
                user: resolveUser
            }
        },
        {
            component: UsersUpdate,
            path: ':id/edit',
            title: 'Editar Usuario',
            resolve: {
                user: resolveUser,
            },
            canDeactivate: [confirmOnUnsavedChanges]
        },
      ],
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
