import {Component, inject, signal, viewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DictionaryService} from "../dictionary.service";
import {DictionaryUpdateDto} from "../dictionary.models";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-update-dictionary-name',
    imports: [MatIconModule, DialogComponent, ReactiveFormsModule, DisplayErrorsComponent],
    templateUrl: './update-dictionary-name.component.html',
    styleUrl: './update-dictionary-name.component.css'
})
export class UpdateDictionaryNameComponent {
    private readonly formBuilder = inject(FormBuilder);
    readonly formGroup = this.formBuilder.group({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(60)]
        })
    });
    
    private readonly dictionaryService = inject(DictionaryService);
    readonly errors = signal<string[]>([]);
    readonly isUpdating = signal<boolean>(false);
    
    readonly dialogComponent = viewChild.required(DialogComponent);

    getErrorMessagesForName(): string {
        const nameFormControl = this.formGroup.controls.name;

        if (nameFormControl.hasError("required")) return "The Name field is required.";

        if (nameFormControl.hasError("maxlength")) {
            const error = nameFormControl.getError("maxlength");
            return `The Name field be ${error.requiredLength} characters or fewer (currently ${error.actualLength}).`;
        }

        return "";
    }

    updateDictionaryName() {
        this.isUpdating.set(true);
        this.errors.set([]);
        
        const dictionaryUpdateDto = this.formGroup.value as DictionaryUpdateDto;
        this.dictionaryService.updateName(dictionaryUpdateDto).subscribe({
            next: () => {
                this.isUpdating.set(false);
                this.dialogComponent().close();
            },
            
            error: async (err) => {
                console.error("Failed to update the dictionary name", "error response: ", err);
                this.isUpdating.set(false);
                
                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
        
    }
}
