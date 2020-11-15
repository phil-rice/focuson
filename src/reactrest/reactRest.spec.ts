import {ReactRestCache} from "./reactRest";
import exp from "constants";

let names = ['game', 'board', 'square', 'r1', 'r2']
function makeMapsFromNames<K, V>(keyfn: (name: string) => K, valuefn: (name: string) => V): Map<K, V> {
    let result = new Map<K, V>()
    names.forEach(name => {
        let key = keyfn(name)
        let value = valuefn(name)
        result.set(key, value)
    })
    return result
}

function classString(className: string) {
    return `function Square(props) {return React.createElement('button',{ className: '${className}'},props.value);};Square;`
}

let nameToSha = makeMapsFromNames(name => name, name => name + "Sha")
let nameToUrl = makeMapsFromNames(name => name, name => `api/${name}/${nameToSha.get(name)}`)
let allUrls = Array.from(nameToUrl.values()).sort()
let loaderData = makeMapsFromNames(n => nameToUrl.get(n), classString)
let digestorData = makeMapsFromNames(classString, n => nameToSha.get(n))

function loader(url: string) {return Promise.resolve(loaderData.get(url))}
function digestor(s: string) {if (digestorData.has(s)) return digestorData.get(s); else throw Error(`Cannot find digest for ${s}. Legal values are ${Array.from(digestorData.keys())}`)}
function compiler(s: string) {return s + "_compiled"}
let json = {
    "_links": {"_self": {"href": "created/gameJson1.json"}, "game1": {"href": "created/gameJson1.json"}, "game2": {"href": "created/gameJson2.json"}},
    "_render": {"_self": nameToUrl.get('game')},
    "more": [
        {"_render": {"r1": nameToUrl.get('r1')}},
        {"_render": {"r2": nameToUrl.get('r2')}},
    ],
    "_embedded": {
        "board": {
            "_links": {"_self": {"href": "/not/Used/Yet"}},
            "_render": {
                "_self": nameToUrl.get('board'),
                "square": nameToUrl.get('square')
            },
            "squares": [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }
}


describe("ReactRestCache", () => {
    function setUp<X>(fn: (cache: ReactRestCache) => X, comp: (s: string) => any = compiler): X {
        return fn(new ReactRestCache(loader, digestor, comp))
    }

    it("should find all render nameToUrl", () => {
        setUp(cache => {
            let renderUrls = cache.findAllRenderUrls(json).sort()
            expect(renderUrls).toEqual(allUrls)
            expect(cache.cache.size).toEqual(0)
        })
    })
    it("should 'loadFromBlob' which populates the cache", async () => {
            return setUp(async cache => {
                expect(cache.cache.size).toEqual(0);
                return await cache.loadFromBlob(json).then(() => {
                    expect(cache.cache.size).toEqual(5)
                    expect(Array.from(cache.cache.keys()).sort()).toEqual(allUrls)
                    Array.from(cache.cache.entries()).forEach(e => {
                        expect(e[1]).toEqual(compiler(loaderData.get(e[0])))
                    })
                })
            })
        }
    )

    it(".getFromCache should load from cache if the cache has a value for the url", () => {
        return setUp(async cache => {
            cache.cache.set("someUrl", "someValue")
            return expect(cache.getFromCache("someUrl")).toBe("someValue")
        })
    })

    it(".getFromCache should throw an exception if the cache doesn't have a value for the url", () => {
        return setUp(async cache => {
            cache.cache.set("otherUrl", "someValue")
            return expect(() => cache.getFromCache("someUrl")).toThrow("The cache does not know how to render someUrl\nLegal values are otherUrl")
        })
    })

    it(".loadifNeededAndCheck(url) should compile and add to cache if not in", async () => {
        return setUp(async cache => {
            expect(cache.cache.size).toBe(0)
            let expected = compiler(classString('game'));
            await expect(cache.loadifNeededAndCheck(nameToUrl.get('game'))).resolves.toBe(expected)
            expect(cache.cache.size).toBe(1)
            expect(cache.cache.get(nameToUrl.get('game'))).toBe(expected)
        },)
    })

    it(".loadifNeededAndCheck(url) shouldnot compile if already in cache", async () => {
        function dontCompile(s: string) { throw Error('Should not  compile')}
        return setUp(async cache => {
            cache.cache.set("someUrl", "someValue")
            return expect(cache.loadifNeededAndCheck("someUrl")).resolves.toBe("someValue")
        }, dontCompile)
    })
})
