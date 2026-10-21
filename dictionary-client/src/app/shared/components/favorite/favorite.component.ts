import {Component, input, model} from '@angular/core';
import {NgClass} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-favorite',
    imports: [MatIconModule],
    templateUrl: './favorite.component.html',
    styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
    isFavorite = model<Boolean>(false);
    readonlyMode = input(false);
    
    favoriteToggle() {
        if (this.readonlyMode()) return; 
        
        this.isFavorite.set(!this.isFavorite());    
    }
}
