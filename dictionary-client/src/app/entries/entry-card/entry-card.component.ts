import {Component, input} from '@angular/core';
import {EntrySummaryDto} from "../entry.models";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";

@Component({
    selector: 'app-entry-card',
    imports: [FavoriteComponent],
    templateUrl: './entry-card.component.html',
    styleUrl: './entry-card.component.css'
})
export class EntryCardComponent {
    readonly entrySummaryDto = input.required<EntrySummaryDto>();
}
