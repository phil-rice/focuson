import {fromMap, identity} from "../utils";
import {LoadAndCompileCache, UrlAndValueChecker} from "./LoadAndCompileCache";


export class ReactFixture {
    names: string[];
    nameToSha: Map<string, string>;
    nameToUrl: Map<string, string>;
    allUrls: string[];
    loaderData: Map<string, string>;
    digestorData: Map<string, string>;
    json: any;


    constructor(names?: string[]) {
        this.names = names ? names : ['game', 'board', 'square', 'r1', 'r2']

        this.nameToSha = this.makeMapsFromNames(identity, name => name + "Sha")
        this.nameToUrl = this.makeMapsFromNames(identity, name => `api/${name}/${this.nameToSha.get(name)}`)
        this.allUrls = Array.from(this.nameToUrl.values()).sort()
        this.loaderData = this.makeMapsFromNames(n => fromMap(this.nameToUrl, n), this.classString)
        if (!this.loaderData) throw Error('null')
        this.digestorData = this.makeMapsFromNames(this.classString, n => fromMap(this.nameToSha, n))
        this.json = {
            "_links": {"_self": {"href": "created/gameJson1.json"}, "game1": {"href": "created/gameJson1.json"}, "game2": {"href": "created/gameJson2.json"}},
            "_render": {"_self": this.nameToUrl.get('game')},
            "more": [
                {"_render": {"r1": this.nameToUrl.get('r1')}},
                {"_render": {"r2": this.nameToUrl.get('r2')}},
            ],
            "_embedded": {
                "board": {
                    "_links": {"_self": {"href": "/not/Used/Yet"}},
                    "_render": {
                        "_self": this.nameToUrl.get('board'),
                        "square": this.nameToUrl.get('square')
                    },
                    "squares": [1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }
        }
    }

    loader(url: string): Promise<string> {
        if (!this) throw Error('this ' + this)

        if (!this.loaderData) throw Error('this.loaderData ' + this.loaderData)
        var l = this.loaderData
        return Promise.resolve(fromMap(l, url))
    }
    digestor(s: string): string {return fromMap(this.digestorData, s)}
    compiler(s: string) {return s + "_compiled"}


    setUp<X>(fn: (cache: LoadAndCompileCache<string>) => X, comp: (s: string) => any = this.compiler, checker: UrlAndValueChecker = n => {}): X {
        if (!this.loaderData) throw Error(this.loaderData)
        return fn(new LoadAndCompileCache(url => this.loader(url), checker, comp))
    }
    makeMapsFromNames<K, V>(keyfn: (name: string) => K, valuefn: (name: string) => V): Map<K, V> {
        let result = new Map<K, V>()
        this.names.forEach(name => {
            let key = keyfn(name)
            let value = valuefn(name)
            result.set(key, value)
        })
        return result
    }
    classString(className: string) {
        return `function Square(props) {return React.createElement('button',{ className: '${className}'},props.value);};Square;`
    }
}