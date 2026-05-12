import { Component, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-error-page",
    standalone: true,
    template: `
    <div class="container">
        <h1>Error</h1>
        <div class="alert alert-danger">
            {{ message() ?? "Se ha producido un error desconocido" }}
        </div>
    </div>
    `,
})
export class ErrorPage {
    protected readonly message = signal<string | null>(null);

    constructor(route: ActivatedRoute) {
        const { data } = route.snapshot;
        const message = data['message'] ?? history.state.message;

        if (message) {
            this.message.set(message);
        }
    }
}