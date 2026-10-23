import {booleanAttribute, Component, input, numberAttribute, OnInit} from '@angular/core';

@Component({
    selector: 'app-update-entry',
    imports: [],
    templateUrl: './update-entry.component.html',
    styleUrl: './update-entry.component.css'
})
export class UpdateEntryComponent implements OnInit{
    id = input.required({transform: numberAttribute});

    ngOnInit(): void {
        console.log(typeof this.id());
    }
    
}
