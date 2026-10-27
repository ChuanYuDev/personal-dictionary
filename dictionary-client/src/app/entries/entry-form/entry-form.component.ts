import {Component, inject, OnInit, output} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {EntryCreateDto} from "../entry.models";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CategoryDto} from "../../categories/category.models";
import {TextFieldModule} from "@angular/cdk/text-field";

@Component({
    selector: 'app-entry-form',
    imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, TextFieldModule],
    templateUrl: './entry-form.component.html',
    styleUrl: './entry-form.component.css'
})
export class EntryFormComponent implements OnInit{
    private readonly formBuilder = inject(FormBuilder);
    readonly postForm = output<EntryCreateDto>();
    
    readonly formGroup = this.formBuilder.group({
        term: new FormControl<string>("", {validators: [Validators.required]}),
        categoryId: new FormControl<number>(1),
        partOfSpeech: new FormControl<string | null>(null),
        pronunciation: new FormControl<string | null>(null),
        meaning: new FormControl<string | null>(null),
        notes: new FormControl<string | null>(null)
    });
    
    categoryDtos: CategoryDto[] = [];
    readonly partOfSpeeches: string[] = [
        "Noun",
        "Verb",
        "Adjective",
        "Adverb",
        "Pronoun",
        "Preposition",
        "Conjunction",
        "Interjection",
        "Determiner" 
    ];

    ngOnInit(): void {
        this.categoryDtos = [{
            id: 1,
            name: "Word"
        }, {
            id: 2,
            name: "Phase"
        }];
    }
    
    getErrorMessagesForTerm(): string {
        const termFormControl = this.formGroup.controls.term;
        
        if (termFormControl.hasError("required")) return "The Term field is required"; 
        
        return "";
    }
    
    saveChanges() {
        const entryCreationDto = this.formGroup.value as EntryCreateDto;
        console.log(entryCreationDto);
        this.postForm.emit(entryCreationDto);
    }
}
