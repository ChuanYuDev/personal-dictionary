import {Component, input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-page-header',
    imports: [MatIconModule, RouterLink],
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
    readonly backRoute = input.required<any[]>();
    readonly title = input.required<string>();
}
