import { Component } from "@angular/core";

@Component({
    selector: 'app-fixed-footer',
    imports: [],
    template: `<div class="fixed-footer border p-2"><ng-content/></div>`,
    styleUrl: './fixed-footer.scss',
})
export class FixedFooter {
    
}