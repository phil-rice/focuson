import {StringAndWidth, Strings} from "./utils";
import * as fs from "fs";

function readOrBlank(file: string): string {
    try {
        return fs.readFileSync(file).toString()
    } catch (e) {return ""}
}
export function compactStatus(statusFile: string): Map<string, string> {
    let lines = readOrBlank(statusFile)
    let map = new Map<string, string>()
    lines.split("\n").forEach(line => {
        let groups = line.split(" ")
        if (groups && groups[2]) map.set(groups[2], line)
    })
    return map
}

export function writeCompactedStatus(statusFile: string, statusMap: Map<string, string>) {
    let keys = [...statusMap.keys()].sort()
    let compacted = keys.map(k => statusMap.get(k)).join("\n") + "\n"
    fs.writeFile(statusFile, compacted, err => {
        if (err) console.log('error compacting status', statusFile, statusMap, compacted)
    })
}


export function printStatus(directory: string, statusMap: Map<string, string>) {
    let regex = /^([^ ]*) ([^ ]*) (.*)/
    let keys = [...statusMap.keys()]
    keys.sort()
    let width = 10// Strings.maxLength(keys)
    console.log(directory)
    keys.forEach(k => {
        let value = statusMap.get(k)
        let groups = value.match(regex)
        if (groups)
            console.log('  ', k.padEnd(width), groups[2].padEnd(5), groups[1])
        else
            console.log('  Status file error', value)
    })
}

interface StatusDetails {
    directory: string,
    command: string,
    status: string,
    timestamp: string
}
interface CommandAndStatusDetails {
    command: string,
    details: StatusDetails[]
}

export interface DirectoryAndCompactedStatusMap {
    directory: string,
    compactedStatusMap: Map<string, string>
}


function stringToStatusDetails(directory: string, s: string): StatusDetails {
    let regex = /^([^ ]*) ([^ ]*) (.*)/
    let groups = s.match(regex)
    let result = {directory: directory, timestamp: groups[1], status: groups[2], command: groups[3]};
    return result
}
export function toStatusDetails(ds: DirectoryAndCompactedStatusMap[]): StatusDetails[] {
    let result: StatusDetails[][] = ds.map(d => [...d.compactedStatusMap.keys()].map(command => stringToStatusDetails(d.directory, d.compactedStatusMap.get(command))))
    return [].concat(...result)
}


interface PrettyPrintStatusData {
    commandsTitles: StringAndWidth[]
    directories: string[]
    directoriesWidth: number
    directoryToCommandToData: Map<string, Map<string, string>>
}
export function toPrettyPrintData(sds: StatusDetails[]): PrettyPrintStatusData {
    let directories = [...new Set(sds.map(sd => sd.directory))]
    let directoriesWidth = Strings.maxLength(directories)
    let commandTitles = [...new Set(sds.map(sd => sd.command))].sort()
    let commandsTitles = ['', ...commandTitles].map(d => ({value: d, width: Math.max(5, d.length)}))  //later might want more sophisticated
    let directoryToCommandToData = new Map<string, Map<string, string>>()
    sds.forEach(sd => {
        let existingCommandToData = directoryToCommandToData.get(sd.directory)
        let map: Map<string, string> = existingCommandToData ? existingCommandToData : new Map<string, string>()
        map.set(sd.command, sd.status)
        directoryToCommandToData.set(sd.directory, map)
    })
    return ({commandsTitles: commandsTitles, directories: directories, directoriesWidth: directoriesWidth, directoryToCommandToData: directoryToCommandToData})
}
export function prettyPrintData(pretty: PrettyPrintStatusData) {
    console.log(''.padEnd(pretty.directoriesWidth), pretty.commandsTitles.map(ct => ct.value.padEnd(ct.width)).join(' '))
    pretty.directories.forEach(d => console.log(d.padEnd(pretty.directoriesWidth), pretty.commandsTitles.map(ct => {
        let value = pretty.directoryToCommandToData.get(d).get(ct.value);
        return (value ? value : "").padEnd(ct.width)
    }).join(' ')))
}

