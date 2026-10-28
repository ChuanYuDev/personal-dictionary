import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {EntryCreateDto, EntryDetailsDto} from "../entry.models";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CategoryDto} from "../../categories/category.models";
import {TextFieldModule} from "@angular/cdk/text-field";
import {toSignal} from "@angular/core/rxjs-interop";

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
        term: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required]
        }),
        categoryId: new FormControl<number>(1, { nonNullable: true }),
        partOfSpeech: new FormControl<string | null>(null),
        pronunciation: new FormControl<string | null>(null),
        meaning: new FormControl<string | null>(null),
        notes: new FormControl<string | null>(null)
    });
    
    readonly categoryDtos = signal<CategoryDto[]>([]);
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
    
    readonly selectedCategoryId = toSignal(this.formGroup.controls.categoryId.valueChanges, {
        initialValue: this.formGroup.controls.categoryId.value
    });
    
    readonly showPartOfSpeech = computed(() => {
        const selectedCategoryDto = this.categoryDtos().find((categoryDto) => categoryDto.id === this.selectedCategoryId());
        return selectedCategoryDto?.name === "Word";
    });
    
    readonly entryDetailsDto = input<EntryDetailsDto | null>(null);

    ngOnInit(): void {
        this.categoryDtos.set([{
            id: 1,
            name: "Word"
        }, {
            id: 2,
            name: "Phase"
        }]);
        
        const entryDetailsDtoObject = this.entryDetailsDto();
        
        if (entryDetailsDtoObject) this.formGroup.patchValue(entryDetailsDtoObject);
    }
    
    getErrorMessagesForTerm(): string {
        const termFormControl = this.formGroup.controls.term;
        
        if (termFormControl.hasError("required")) return "The Term field is required"; 
        
        return "";
    }
    
    onSubmit() {
        const entryCreationDto = this.formGroup.value as EntryCreateDto;
        this.postForm.emit(entryCreationDto);
    }
}
