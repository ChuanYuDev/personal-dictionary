import {Component, inject, output, signal, viewChild} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {DictionaryService} from "../dictionary.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-connect-dictionary',
    imports: [ReactiveFormsModule, DialogComponent, DisplayErrorsComponent],
    templateUrl: './connect-dictionary.component.html',
    styleUrl: './connect-dictionary.component.css'
})
export class ConnectDictionaryComponent {
    readonly connected = output<void>();
    
    readonly errors = signal<string[]>([]);
    readonly isConnecting = signal<boolean>(false);
    readonly dialogComponent = viewChild.required(DialogComponent);
    
    private readonly dictionaryService = inject(DictionaryService);
    private readonly formBuilder = inject(FormBuilder);
    
    readonly formGroup = this.formBuilder.group({
        dbId: new FormControl<string>("", {
            nonNullable: true, 
            validators: [Validators.required]
        })
    });
    
    openDialog() {
        this.dialogComponent().open();
    }
    
    getErrorMessagesForDbId(): string {
        const dbIdFormControl = this.formGroup.controls.dbId;
        
        if (dbIdFormControl.hasError("required")) return "The dictionary ID is required.";
        
        return "";
    }
    
    connect() {
        this.isConnecting.set(true);
        this.errors.set([]);
        
        const dbId = this.formGroup.controls.dbId.value;
        
        this.dictionaryService.connect(dbId).subscribe({
            next: () => {
                this.isConnecting.set(false);
                this.connected.emit();
                this.dialogComponent().close();
                
            },
            error: async err => {
                console.error("Failed to connect the dictionary", "error response: ", err);
                this.isConnecting.set(false);
                
                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
    }
}
