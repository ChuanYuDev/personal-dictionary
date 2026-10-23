import {Component, input, numberAttribute} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-entry-details',
    imports: [RouterLink],
    templateUrl: './entry-details.component.html',
    styleUrl: './entry-details.component.css'
})
export class EntryDetailsComponent {
    id = input.required({transform: numberAttribute});

    ngOnInit(): void {
        console.log(typeof this.id());
    }
}
