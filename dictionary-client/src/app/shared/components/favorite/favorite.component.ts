import {Component, model} from '@angular/core';
import {NgClass} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-favorite',
    imports: [NgClass, MatIconModule],
    templateUrl: './favorite.component.html',
    styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
    isFavorite = model<Boolean>(false);
    
    favoriteToggle() {
        this.isFavorite.set(!this.isFavorite());    
    }
}
