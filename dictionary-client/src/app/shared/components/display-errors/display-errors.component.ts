import { Component, input, Input } from '@angular/core';

@Component({
    selector: 'app-display-errors',
    imports: [],
    templateUrl: './display-errors.component.html',
    styleUrl: './display-errors.component.css'
})
export class DisplayErrorsComponent {
    errors = input.required<string[]>();
}
