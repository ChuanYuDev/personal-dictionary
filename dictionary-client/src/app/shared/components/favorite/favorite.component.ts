import {Component, input, model} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-favorite',
    imports: [MatIconModule],
    templateUrl: './favorite.component.html',
    styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
    readonly isFavorite = model<Boolean>(false);
    readonly readonlyMode = input(false);
    
    favoriteToggle() {
        if (this.readonlyMode()) return; 
        
        this.isFavorite.set(!this.isFavorite());    
    }
}
