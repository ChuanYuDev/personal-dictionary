import { Component, input, Input } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-display-errors',
    imports: [MatIconModule],
    templateUrl: './display-errors.component.html',
    styleUrl: './display-errors.component.css'
})
export class DisplayErrorsComponent {
    errors = input.required<string[]>();
}
