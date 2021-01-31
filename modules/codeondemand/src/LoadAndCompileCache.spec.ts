import {digestorChecker, LoadAndCompileCache} from "./LoadAndCompileCache";
import {LoadAndCompileFixture} from "./LoadAndCompileFixture";
import {fromMap} from "@phil-rice/lens";


describe("digestChecker", () => {
    function digestor(s: String) {return s + "_dig"}
    let checker = digestorChecker(digestor)

    it("should not cause problems if the last segment is the digest of the value", () => {
        checker("/a/b/value_dig", "value")
        checker("/a/value_dig", "value")
        checker("/value_dig", "value")
        checker("value_dig", "value")
    })

    it("should cause an exception if the digest doesn't match", () => {
        expect(() => checker("value_dig", "wrongvalue")).toThrow("Digest mismatch for value_dig actually had [wrongvalue_dig] expected [value_dig].\nThe string was wrongvalue")
    })
})

describe("LoadAndCompileCache", () => {
    let fixture = new LoadAndCompileFixture()

    it("should find all render nameToUrl", () => {
        fixture.setUp(cache => {
            let renderUrls = cache.findAllRenderUrls(fixture.json).sort()
            expect(renderUrls).toEqual(fixture.allUrls)
            expect(cache.cache.size).toEqual(0)
        })
    })

    it("should 'loadFromBlob' which populates the cache", async () => {
            if (!fixture.loaderData) throw Error('null')
            return fixture.setUp(async cache => {
                if (!fixture.loaderData) throw Error('null')
                expect(cache.cache.size).toEqual(0);
                return await cache.loadFromBlob(fixture.json).then(() => {
                    expect(cache.cache.size).toEqual(5)
                    expect(Array.from(cache.cache.keys()).sort()).toEqual(fixture.allUrls)
                    Array.from(cache.cache.entries()).forEach(e => {
                        expect(e[1]).toEqual(fixture.compiler(fromMap(fixture.loaderData, e[0])))
                    })
                })
            })
        }
    )

    it(".getFromCache should load from cache if the cache has a value for the url", () => {
        return fixture.setUp(async cache => {
            cache.cache.set("someUrl", "someValue")
            return expect(cache.getFromCache("someUrl")).toBe("someValue")
        })
    })

    it(".getFromCache should throw an exception if the cache doesn't have a value for the url", () => {
        return fixture.setUp(async cache => {
            cache.cache.set("otherUrl", "someValue")
            return expect(() => cache.getFromCache("someUrl")).toThrow("Cannot find data for someUrl\nLegal values are otherUrl")
        })
    })

    it(".loadifNeededAndCheck(url) should compile and add to cache if not in", async () => {
        return fixture.setUp(async cache => {
            expect(cache.cache.size).toBe(0)
            let expected = fixture.compiler(fixture.classString('game'));
            await expect(cache.loadifNeededAndCheck(fromMap(fixture.nameToUrl, 'game'))).resolves.toBe(expected)
            expect(cache.cache.size).toBe(1)
            expect(cache.cache.get(fromMap(fixture.nameToUrl, 'game'))).toBe(expected)
        },)
    })

    it(".loadifNeededAndCheck(url) shouldnot compile if already in cache", async () => {
        function dontCompile(s: string) { throw Error('Should not  compile')}
        return fixture.setUp(async cache => {
            cache.cache.set("someUrl", "someValue")
            return expect(cache.loadifNeededAndCheck("someUrl")).resolves.toBe("someValue")
        }, dontCompile)
    })

    it("should 'check' using the checker", async () => {
        let error = Error('should fail with this');
        return fixture.setUp(async cache => {
            let url = fromMap(fixture.nameToUrl, 'game');
            return expect(cache.loadifNeededAndCheck(url)).rejects.toBe(error)
        }, fixture.compiler, (url, value) => {
            expect(url).toBe(url)
            expect(value).toBe(fixture.loaderData.get(url))
            throw error
        })
    })
})

