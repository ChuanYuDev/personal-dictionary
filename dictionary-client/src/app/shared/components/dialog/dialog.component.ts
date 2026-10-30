import {Component, ElementRef, input, output, viewChild} from '@angular/core';

@Component({
    selector: 'app-dialog',
    imports: [],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css'
})
export class DialogComponent {
    readonly title = input.required<string>();
    readonly content = input<string>();
    readonly confirmButtonText = input.required<string>();
    readonly confirmButtonStyle = input.required<string>();
    readonly confirmed = output<void>();
    
    private dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog")
    
    showModal() {
        this.dialog().nativeElement.showModal();
    }
    
    close() {
        this.dialog().nativeElement.close();
    }
    
    confirm() {
        this.confirmed.emit();
    }
}
