export function removeNullProperties<T>(obj: any): T {
    const resultObject: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) resultObject[key] = value; 
    } 
    
    return resultObject as T;
}