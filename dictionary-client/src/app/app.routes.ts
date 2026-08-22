import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ManageDictionaryComponent} from "./dictionaries/manage-dictionary/manage-dictionary.component";
import {CreateEntryComponent} from "./entris/create-entry/create-entry.component";
import {EditEntryComponent} from "./entris/edit-entry/edit-entry.component";
import {EntryDetailsComponent} from "./entris/entry-details/entry-details.component";

export const routes: Routes = [
    {path: "", component: HomeComponent},

    {path: "dictionaries/manage", component: ManageDictionaryComponent},

    {path: "entries/create", component: CreateEntryComponent},
    {path: "entries/edit/:id", component: EditEntryComponent},
    {path: "entries/:id", component: EntryDetailsComponent},
    
    {path: "**", redirectTo: ""}
];
