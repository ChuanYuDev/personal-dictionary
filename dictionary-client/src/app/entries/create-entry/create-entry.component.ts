import {Component, signal} from '@angular/core';
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {EntryFormComponent} from "../entry-form/entry-form.component";
import {EntryCreateDto} from "../entry.models";

@Component({
    selector: 'app-create-entry',
    imports: [PageHeaderComponent, FavoriteComponent, EntryFormComponent],
    templateUrl: './create-entry.component.html',
    styleUrl: './create-entry.component.css'
})
export class CreateEntryComponent {
    isFavorite = signal<boolean>(false);
    
    saveChanges(entryCreateDto: EntryCreateDto)
    {
        entryCreateDto.isFavorite = this.isFavorite();
        // Http request
        console.log(entryCreateDto);
    }
}
