import {Component, input} from '@angular/core';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";

@Component({
    selector: 'app-delete-entry',
    imports: [DialogComponent],
    templateUrl: './delete-entry.component.html',
    styleUrl: './delete-entry.component.css'
})
export class DeleteEntryComponent {
    id = input.required<number>();
    
    delete() {
        console.log("Delete entry:", this.id());
    }
}
