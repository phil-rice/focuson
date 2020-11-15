import {ReactRestCache} from "./reactRest";

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
let digestorData = makeMapsFromNames(n => nameToUrl.get(n), n => nameToSha.get(n))

function loader(url: string) {return Promise.resolve(loaderData.get(url))}
function digestor(s: string) {return Promise.resolve(digestorData.get(s))}

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
    function setUp<X>(fn: (cache: ReactRestCache) => X) {
        fn(new ReactRestCache(loader, digestor))
    }

    it("should find all render nameToUrl", () => {
        setUp(cache => {
            let renderUrls = cache.findAllRenderUrls(json).sort()
            expect(renderUrls).toEqual(allUrls)
        })

    })
})
