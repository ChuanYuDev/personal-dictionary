import {Component, ElementRef, output, viewChild} from '@angular/core';

@Component({
    selector: 'app-dialog',
    imports: [],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css'
})
export class DialogComponent {
    readonly confirmed = output<void>();
    private dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog")
    
    showModal() {
        this.dialog().nativeElement.showModal();
    }
    
    close() {
        this.dialog().nativeElement.close();
    }
    
}
