import {render, screen} from "@testing-library/react";
import {ComponentFromServer, MakeComponentFromServer} from "./ComponentFromServer";
import {LensContext} from "@phil-rice/lens";
import {ILoadAndCompileCache, LoadAndCompileCache} from "./LoadAndCompileCache";


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

let domain: MainDomainForTest = {cache: cache}
let context = LensContext.main<MainDomainForTest, MainForTest>(domain, {value: "someTestValue", _render: {_self: "someCompUrl"}}, jest.fn(), 'mainForTest')

describe("ComponentFromServer", () => {
    it('renders the component generated from the cache', () => {
        render(<ComponentFromServer<React.ReactElement, MainForTest, MainForTest> context={context}/>)
        const linkElement = screen.getByText(/someCompUrl/i);
    });

})
