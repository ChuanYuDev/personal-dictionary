import {CategoryDto} from "../categories/categories.models";

export interface EntryCreateDto {
    term: string;
    pronunciation?: string;
    partOfSpeech?: string;
    meaning?: string;
    notes?: string;
    isFavorite: boolean;
    categoryId: number;
}

export interface EntryDto {
    id: number;
    term: string;
    pronunciation?: string;
    partOfSpeech?: string;
    meaning?: string;
    notes?: string;
    isFavorite: boolean;
    category: CategoryDto;
    createdAt: Date;
}