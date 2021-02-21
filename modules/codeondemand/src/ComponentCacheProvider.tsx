import React, {createContext, ReactElement} from "react";
import {ILoadAndCompileCache} from "./LoadAndCompileCache";
import {MakeComponentFromServer} from "./ComponentFromServer";

function defaultCache<Result>(): ILoadAndCompileCache<MakeComponentFromServer<Result>> {
    return ({
        loadFromBlob(jsonBlob: any) {throw Error('ComponentCacheContext.Provider probably not created')},
        getFromCache(url: string) {throw Error('ComponentCacheContext.Provider probably not created')}
    });
}


export const ComponentCacheContext = createContext<ILoadAndCompileCache<MakeComponentFromServer<ReactElement>>>(defaultCache());