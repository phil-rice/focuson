import {Config} from "./config";
import * as fs from "fs";
import * as path from "path";
import {StringAndWidth, Strings} from "./utils";

export function loadProfile(config: Config, directory: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(directory, config.profile), (err, data) => {
            if (err) resolve("")
            if (data)
                resolve(data.toString())
        })
    })
}

export interface ProfileMap {
    [key: string]: number[]
}
export interface Profile {
    [key: string]: ProfileStats
}
export interface ProfileAndDirectory {
    directory: string,
    profile: Profile

}

interface ProfileStats {
    count: number,
    average: number,
    latest: number
}
interface ProfileTempData {
    [key: string]: number
}
export function findProfilesFromString(s: string): Profile {
    if (s) {
        let count: ProfileTempData = {}
        let total: ProfileTempData = {}
        let latest: ProfileTempData = {}
        s.split('\n').filter(l => l.length > 0).forEach(line => {
            let parts = line.split(" ")
            let key = parts[1]
            let duration = Number(parts[2])
            if (duration > 0) {
                latest[key] = duration
                count[key] = (count[key] ? count[key] + 1 : 1)
                total[key] = (total[key] ? total[key] : 0) + duration
            }
        })
        let result: Profile = {}
        for (let k in count) {
            result[k] = ({count: count[k], average: Math.round(total[k] / count[k]), latest: latest[k]})
        }
        return result
    } else return ({})
}

interface PrettyProfleData {
    directoryWidth: number,
    commandTitlesAndWidths: StringAndWidth[],
    data: ProfileAndDirectory[]
}


export function prettyPrintProfileData(profiles: ProfileAndDirectory[]): PrettyProfleData {
    let directories = profiles.map(pd => pd.directory)
    let directoryWidth = Strings.maxLength(directories)
    // let x = [...new Set(profiles.map(p => Object.keys(p.profile)))]


    let commandTitles = new Set<string>()
    profiles.forEach(p => Object.keys(p.profile).forEach(k => commandTitles.add(k)))
    let commandTitlesAndWidths = [...commandTitles].sort().map(t => ({value: t, width: Math.max(7, t.length)}))
    return ({directoryWidth: directoryWidth, commandTitlesAndWidths: commandTitlesAndWidths, data: profiles})

}


function getValueToDisplay(fn: (s: ProfileStats) => any, pd: ProfileAndDirectory, cw: StringAndWidth) {
    if (cw) if (pd.profile[cw.value])return fn(pd.profile[cw.value])
    return ""
}
export function prettyPrintProfiles(title: string, p: PrettyProfleData, fn: (s: ProfileStats) => any) {
    if (p.commandTitlesAndWidths.length == 0)
        console.log(title.padEnd(p.directoryWidth), "no profile data available")
    else
        console.log([[title.padEnd(p.directoryWidth), ...p.commandTitlesAndWidths.map(ct => ct.value.padStart(ct.width))].join(' '),
            ...p.data.map(pd => [pd.directory.padEnd(p.directoryWidth),
                ...p.commandTitlesAndWidths.map(cw => getValueToDisplay(fn, pd, cw).toString().padStart(cw.width))].join(' '))
        ].join('\n'))

}