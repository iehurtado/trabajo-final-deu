import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from './auth.service';
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
import { confirmOnUnsavedChanges } from './util';

function requiereAutenticacion(): CanActivateFn {
  return () => {
    const router = inject(Router);
    const toaster = inject(Toaster);
    const auth = inject(AuthService);
    const user = auth.user();

    if (user == null) {
      toaster.show('No Autorizado', 'Inicie sesión para ver esta página', { class: 'text-bg-danger' });
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
      toaster.show('No Autorizado', 'No tiene autorización para acceder a esta página.', { class: 'text-bg-danger' });
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
        title: 'Carcará',
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
            canActivate: [requiereRol('Administrador')],
        },
        {
            component: PuntosInteresUpdate,
            path: ':id/update',
            title: 'Editar Punto de Interés',
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
        },
        {
            component: BalneariosUpdate,
            path: ':id/update',
            title: 'Editar Balneario',
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
        },
        {
            component: UsersUpdate,
            path: ':id/edit',
            title: 'Editar Usuario',
            canDeactivate: [confirmOnUnsavedChanges]
        },
      ],
    },
    {
      path: 'mapa',
      redirectTo: '',
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
