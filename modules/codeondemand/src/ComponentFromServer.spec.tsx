//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {render, screen} from "@testing-library/react";
import {ComponentFromServer, MakeComponentFromServer} from "./ComponentFromServer";
import {lensContext} from "../../lens"; //changed from @phil-rice/lens;
import {ILoadAndCompileCache} from "./LoadAndCompileCache";
import {ComponentCacheContext} from "./ComponentCacheProvider";


interface MainForTest {
    value: string,
    _render: { _self: string }
}

type R = MakeComponentFromServer<React.ReactElement>
interface MainDomainForTest {
    cache: ILoadAndCompileCache<R>
}

let cache: ILoadAndCompileCache<R> = {
    loadFromBlob(jsonBlob: any): Promise<R[]> {return Promise.resolve([])},
    getFromCache(url: string): R {
        if (url !== 'someCompUrl') throw Error('fail: url was' + url)
        return props => (<div>{url}</div>)
    }
}

let context = lensContext<MainForTest>({value: "someTestValue", _render: {_self: "someCompUrl"}}, jest.fn(), 'mainForTest')

describe("ComponentFromServer", () => {
    it('renders the component generated from the cache', () => {
        render(
            <ComponentCacheContext.Provider value={cache}>
                <ComponentFromServer<MainForTest, MainForTest> context={context}/>
            </ComponentCacheContext.Provider>)
        const linkElement = screen.getByText(/someCompUrl/i);
    });

})
