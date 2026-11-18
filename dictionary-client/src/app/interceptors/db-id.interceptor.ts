import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {DictionaryService} from "../dictionaries/dictionary.service";

export const dbIdInterceptor: HttpInterceptorFn = (req, next) => {
    const dbIdKey = "db-id";
    
    if (req.headers.has(dbIdKey)) return next(req);
    
    const dictionaryService = inject(DictionaryService);
    const dbId = dictionaryService.getDbId();
    
    if (dbId) {
        req = req.clone({
            setHeaders: {
                [dbIdKey]: dbId
            }
        });
    }
    
    return next(req);
};