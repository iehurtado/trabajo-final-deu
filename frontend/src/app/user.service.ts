import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UsersService as UsersControllerService, RolesService as RolesControllerService } from "../api";

export interface Rol {
  id: number;
  nombre: string;
}

export interface User {
    id: number;
    email: string;
    fullname: string;
    password: string;
    roles: Rol[];
}

export type CreateUserForm = {
  email: string;
  fullname: string;
  password: string;
  roles: number[];
}

export type UpdateUserForm = Partial<CreateUserForm>;

type Paginator<T> = {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
};

@Injectable({ providedIn: 'root' })
export class UserService {

    private usersController = inject(UsersControllerService);
    private rolesController = inject(RolesControllerService);

    getUsers(): Observable<User[]>
    getUsers(page: number, perPage?: number): Observable<Paginator<User>>
    getUsers(page?: number, perPage?: number): Observable<Paginator<User>|User[]> {
        if (page == undefined) {
          return this.usersController.findAllUsers(1, Infinity).pipe(map(x => x.data));
        }

        return this.usersController.findAllUsers(page, perPage ?? 10);
    }

    getUserById(id: number): Observable<User | undefined> {
        return this.usersController.findUserById(id);
    }

    getRoles(): Observable<Rol[]> {
      return this.rolesController.findAllRoles();
    }

    addUser(nuevo: CreateUserForm): Observable<User> {
        return this.usersController.createUser(nuevo);
    }

    updateUser(id: number, data: UpdateUserForm): Observable<User> {
        return this.usersController.updateUser(id, data);
    }

    updateUserRoles(id: number, roleIds: number[]): Observable<User> {
        return this.usersController.updateUserRoles(id, { roleIds });
    }

    addRoleToUser(id: number, roleId: number): Observable<User> {
        return this.usersController.addRoleToUser(id, roleId);
    }

    removeRoleFromUser(id: number, roleId: number): Observable<User> {
        return this.usersController.removeRoleFromUser(id, roleId);
    }
}
