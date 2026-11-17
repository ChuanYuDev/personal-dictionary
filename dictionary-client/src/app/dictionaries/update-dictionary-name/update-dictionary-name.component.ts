import {Component, inject, input, output, signal, viewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {MetadataService} from "../metadata.service";
import {MetadataUpdateDto} from "../metadata.models";

@Component({
    selector: 'app-update-dictionary-name',
    imports: [MatIconModule, DialogComponent, ReactiveFormsModule, DisplayErrorsComponent],
    templateUrl: './update-dictionary-name.component.html',
    styleUrl: './update-dictionary-name.component.css'
})
export class UpdateDictionaryNameComponent {
    readonly name = input.required<string>();
    readonly updated = output<void>();

    readonly errors = signal<string[]>([]);
    readonly isUpdating = signal<boolean>(false);
    readonly dialogComponent = viewChild.required(DialogComponent);

    private readonly metadataService = inject(MetadataService);

    private readonly formBuilder = inject(FormBuilder);
    
    readonly formGroup = this.formBuilder.group({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(50)]
        })
    });

    openDialog() {
        this.formGroup.patchValue({name: this.name()});
        this.dialogComponent().open();
    }

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
        
        const dictionaryUpdateDto = this.formGroup.value as MetadataUpdateDto;
        this.metadataService.updateName(dictionaryUpdateDto).subscribe({
            next: () => {
                this.isUpdating.set(false);
                this.updated.emit();
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
