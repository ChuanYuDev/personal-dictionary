import {Component, input, numberAttribute, OnInit, signal} from '@angular/core';
import {EntryFormComponent} from "../entry-form/entry-form.component";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {EntryCreateDto, EntryDetailsDto} from "../entry.models";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";

@Component({
    selector: 'app-update-entry',
    imports: [EntryFormComponent, MatIconModule, FavoriteComponent, PageHeaderComponent],
    templateUrl: './update-entry.component.html',
    styleUrl: './update-entry.component.css'
})
export class UpdateEntryComponent implements OnInit{
    id = input.required({transform: numberAttribute});
    readonly entryDetailsDto = signal<EntryDetailsDto | null>(null);
    isFavorite = signal<boolean>(false);

    ngOnInit(): void {
        const entryDetailsDtoObject: EntryDetailsDto = {
            id: 2,
            term: "string2",
            pronunciation: "string",
            partOfSpeech: "Verb",
            meaning: "meaning\nsdf\n\n\nsdfsdf\n",
            notes: "notes\nnotes",
            isFavorite: true,
            categoryId: 2,
            categoryName: "word",
            modifiedAt: new Date("2026-10-19T20:08:00.770028"),
            createdAt: new Date("2026-10-19T10:08:00.770028")
        };

        this.entryDetailsDto.set(entryDetailsDtoObject);

        this.isFavorite.set(entryDetailsDtoObject.isFavorite);
    }
    
    saveChanges(entryCreateDto: EntryCreateDto) {
        entryCreateDto.isFavorite = this.isFavorite();
        
        console.log("Update entry: ", entryCreateDto);
    }
    
}
