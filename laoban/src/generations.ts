import {ProjectDetailsAndDirectory, ScriptInContextAndDirectory} from "./config";

interface Tree {
    [name: string]: Set<string>
}

interface GenerationCalc {
    existing: string[],
    generations: string[][]
}
interface Generations {
    generations: ProjectDetailsAndDirectory[][],
    errors?: string
}

export function calculateAllGenerations(scds: ScriptInContextAndDirectory[]) {
    return calcAllGenerationRecurse(scds, {existing: [], generations: []})
}

export function splitGenerationsByLinks(scds: ScriptInContextAndDirectory[]): ScriptInContextAndDirectory[][] {
    let map = new Map()
    scds.forEach(scd => {
        let projectDetails = scd.detailsAndDirectory.projectDetails;
        if (!projectDetails) throw new Error(`Cannot calculate generations as we have a directory without project.details.json [${scd.detailsAndDirectory.directory}]`)
        return map.set(projectDetails.name, scd)
    })
    if (scds.length !== map.size) throw new Error('Cannot calculate generations: multiple projects with the same name')
    let genNames = calculateAllGenerations(scds).generations
    return genNames.map(names => names.map(n => map.get(n)))

}

export function calcAllGenerationRecurse(scds: ScriptInContextAndDirectory[], start: GenerationCalc): GenerationCalc {
    let newGen = getChildrenRecurse(scds, start.existing)
    if (newGen.length == 0) return start;
    return calcAllGenerationRecurse(scds, {existing: [...start.existing, ...newGen], generations: [...start.generations, newGen]})
}
export function prettyPrintGenerations(scds: ScriptInContextAndDirectory[], gen: GenerationCalc) {
    gen.generations.forEach((g, i) => {
        console.log('Generation', i)
        console.log('  ', g.join(", "))
    })
    let thisTree = {}
    let missing = new Set(scds.map(p => p.detailsAndDirectory.projectDetails.name))
    gen.generations.forEach(g => g.forEach(n => missing.delete(n)))
    if (missing.size > 0) {
        console.log()
        console.log("Missing: can't put in a generation")
        console.log(missing)
    }
}

function getChildrenRecurse(pds: ScriptInContextAndDirectory[], existing: string[]) {
    let thisTree = {}
    pds.forEach(p => thisTree[p.detailsAndDirectory.projectDetails.name] = new Set(p.detailsAndDirectory.projectDetails.details.links))
    for (let k in thisTree) {
        if (existing.includes(k)) delete thisTree[k]
        else {
            let values = thisTree[k]
            existing.forEach(e => values.delete(e))
        }
    }
    for (let k in thisTree) {
        if (thisTree[k].size > 0)
            delete thisTree[k]
    }
    return [...Object.keys(thisTree)].sort()
}
