//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {LoadAndCompileCache} from "./LoadAndCompileCache";
import React, {useContext} from "react";
import {Lens} from "@phil-rice/lens";
import {LensProps, LensState, setJsonForFlux} from "@phil-rice/state";
import {ComponentCacheContext} from "./ComponentCacheProvider";


export function loadJsonFromUrl<Main>(description: string, cache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>, processContext: (cache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>, c: LensState<Main, Main>) => void): (url: string) => Promise<void> {
    return url => {
        return fetch(url).then(r => r.json()).then(json =>
            cache.loadFromBlob(json).then(() => setJsonForFlux<Main, void>(description, c => processContext(cache, c))(json)))
    }
}

interface LensPropsWithRender<Main, T, Child> extends LensProps<Main, T> {
    render: string
    lens: Lens<T, Child>
}

export interface MakeComponentFromServer<ReactElement> {<Main, T>(props: LensState<Main, T>): ReactElement}

function findRenderUrl(name: string, child: any): string {
    if (child._render && name in child._render) return child._render[name]
    console.log("cannot find renderurl", name, child)
    throw Error(`Cannot find renderUrl for  [${name}] in [${JSON.stringify(child, null, 2)}]`)
}

export function ComponentFromServer<Main, T>({context}: LensProps<Main, T>) {
    const cache = useContext(ComponentCacheContext);
    let renderUrl = findRenderUrl("_self", context.json())
    let makeComponent = cache.getFromCache(renderUrl)
    console.log("makecomponent", makeComponent)
    let result = makeComponent(context);
    console.log("madecomponent", result)
    return result
}

export function ChildFromServer<Main, T, Child>({context, render, lens}: LensPropsWithRender<Main, T, Child>) {
    const cache = useContext(ComponentCacheContext);
    let parentJson = context.json()
    let renderUrl = findRenderUrl(render, parentJson)
    let makeComponent = cache.getFromCache(renderUrl)
    return makeComponent(context.chainLens(lens))
}
