import {CommandDefn, Config, ProjectDetailsAndDirectory, RawConfig, ScriptDefn} from "./config";
import * as fs from "fs";
import * as path from "path";

function check(context: string, expectedType, json: any): (fieldName: string) => string[] {
    return fieldName => {
        if (!(json[fieldName])) return [`${context} ${fieldName} not found`]
        if (typeof json[fieldName] !== expectedType) return [`${context} ${fieldName} is a ${typeof [json[fieldName]]} and not ${expectedType}`]
        return []
    }
}

export function validateCommand(context: string, scriptName, command: any): string[] {
    if (typeof command === 'string') return []
    if (typeof command !== 'object') return [`${context} ${scriptName} comamnds is not object or a string`]
    let cont = context + " " + scriptName;
    return check(cont, 'string', command)('command')
}

export function validateScript(context: string, scriptName: string, json: any): string[] {
    let cont = context + " scripts " + scriptName
    return [].concat(...[
        check(cont, 'string', json)('description'),
        check(cont, 'object', json)('commands'),
        Array.isArray(json.commands) ? [] : [`${cont} commands is not an array`],
        ...(json.commands ? json.commands.map(c => validateCommand(context, scriptName, c)) : [])
    ])
}

export function validateLaobanJson(json: any): string[] {
    let context = 'laoban.json';
    let cs = check(context, 'string', json)
    return [].concat(...[
        cs('templateDir'),
        cs('versionFile'),
        cs('log'),
        cs('status'),
        cs('profile'),
        cs('packageManager'),
        check(context, 'object', json)('scripts'),
        ...(json.scripts ? Object.keys(json.scripts).map(k => validateScript(context, k, json.scripts[k])) : [])
    ])
}


export function validateTemplateFile(c: Config, d: ProjectDetailsAndDirectory): string[] {
    try {
        let templateDir = path.join(c.templateDir, d.projectDetails.template);
        return checkDirectoryExists(`project.json.details in ${d.directory} has template ${d.projectDetails.template}. `, templateDir)
    } catch (e) {return [`Could not access project.details.json. TemplateDir is [${c.templateDir}] template is [${d.projectDetails.template}]`]}
}
export function validateProjectDetails(c: Config, d: ProjectDetailsAndDirectory): ProjectDetailsIssues {
    let context = `${d.directory}/project.details.json`;
    let cs = check(context, 'string', d.projectDetails)
    let templateFileIssues = validateTemplateFile(c, d);

    let issues: string[] = templateFileIssues.length > 0 ? templateFileIssues : [].concat(...[
        templateFileIssues,
        cs('name'),
        cs('description'),
        cs('template'),
        check(context, 'object', d.projectDetails)('details')
    ])
    return {
        directory: d.directory,
        issues: issues
    }
}

export function reportValidation(p: ValidationIssues) {
    if (p.laobanJsonIssues.length > 0) {
        console.log('Issues in laoban.json')
        p.laobanJsonIssues.forEach(i => console.log('  ', i))
    }
    p.projectDetailsIssues.forEach(i => {
        if (i.issues.length > 0) {
            console.log('Issues in project.details.json for ', i.directory)
            i.issues.forEach(x => console.log('   ', x))
        }
    })

}

function checkDirectoryExists(context: string, dir: string): string[] {
    function error() { return [`${context} ${dir} does not exist`]}
    try {
        if (!fs.lstatSync(dir).isDirectory()) return error();
        return []
    } catch (e) { return error()}
}

interface ProjectDetailsIssues {
    directory: string,
    issues: string[]
}
interface ValidationIssues {
    laobanJsonIssues: string[],
    projectDetailsIssues: ProjectDetailsIssues[]
}

export function validateConfigOnHardDrive(c: Config, pds: ProjectDetailsAndDirectory[]): ValidationIssues {
    let laobanJsonIssues: string[] = [].concat(...[
        checkDirectoryExists('Laoban directory', c.laobanDirectory),
        checkDirectoryExists('template directory', c.templateDir)
    ])
    let projectDetailsIssues: ProjectDetailsIssues[] = pds.map(pd => validateProjectDetails(c, pd))
    return {laobanJsonIssues: laobanJsonIssues, projectDetailsIssues: projectDetailsIssues}
}