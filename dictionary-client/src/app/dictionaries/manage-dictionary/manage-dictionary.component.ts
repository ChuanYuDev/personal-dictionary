import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionary.service";
import {CreateDictionaryComponent} from "../create-dictionary/create-dictionary.component";
import {DownloadDictionaryComponent} from "../download-dictionary/download-dictionary.component";
import {OpenDictionaryComponent} from "../open-dictionary/open-dictionary.component";
import {MatIconModule} from "@angular/material/icon";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'app-manage-dictionary',
    imports: [CreateDictionaryComponent, DownloadDictionaryComponent, OpenDictionaryComponent, MatIconModule,
        PageHeaderComponent, MatIconModule, DialogComponent, ReactiveFormsModule],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent {
    private readonly formBuilder = inject(FormBuilder);
    
    private readonly dictionaryService = inject(DictionaryService);
    private readonly router = inject(Router);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
    
    readonly formGroup = this.formBuilder.group({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(50)]
        })
    });
    
    getErrorMessagesForName(): string {
        const nameFormControl = this.formGroup.controls.name;
        
        if (nameFormControl.hasError("required")) return "The Name field is required.";
        
        if (nameFormControl.hasError("maxlength")) {
            const error = nameFormControl.getError("maxlength");
            return `The Name field be ${error.requiredLength} characters or fewer (currently ${error.actualLength}).`;
        }
        
        return "";
    }
    
    disconnectDictionary(): void {
        this.dictionaryService.disconnect();
        this.navigateToHome();
    }
    
    navigateToHome(): void {
        this.router.navigate(["/"]);
    }
}
