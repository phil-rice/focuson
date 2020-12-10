import * as cp from 'child_process'
import {CommandDefn, Envs, ProjectDetailsAndDirectory, ScriptInContext, ScriptInContextAndDirectory, ScriptInContextAndDirectoryWithoutStream} from "./config";
import {cleanUpEnv, derefence} from "./configProcessor";
import * as path from "path";
import {Promise} from "core-js";
import {chain, writeTo} from "./utils";
import {Writable} from "stream";
import {CommandDecorator} from "./decorators";

export interface RawShellResult {
    err: any
}
export interface ShellResult extends RawShellResult {
    details: ShellCommandDetails<CommandDetails>
    duration: number
}

export interface ScriptResult {
    scd: ScriptInContextAndDirectory,
    results: ShellResult[],
    duration: number
}

export type  Generation = ScriptInContextAndDirectory[]
export type  Generations = Generation[]
export type GenerationResult = ScriptResult[]
export type GenerationsResult = GenerationResult[]


export interface ShellCommandDetails<Cmd> {
    scriptInContext: ScriptInContext,
    detailsAndDirectory: ProjectDetailsAndDirectory
    details: Cmd,
    streams: Writable[]
}

export interface CommandDetails {
    command: CommandDefn,
    dic: any, //All the things that can be used to deference variables
    env: Envs //The envs with their variables dereferenced
    directory: string, // the actual directory that the command will be executed in
    commandString: string
}

function calculateDirectory(directory: string, command: CommandDefn) { return (command.directory) ? path.join(directory, command.directory) : directory;}

export function streamNamefn(sessionDir: string, sessionId: string, scriptName: string, directory: string) {
    return path.join(sessionDir,
        sessionId,
        directory.replace(/\//g, '_')) + '.' + scriptName + '.log'
}
export function streamName(scd: ScriptInContextAndDirectoryWithoutStream) {
    return streamNamefn(scd.scriptInContext.config.sessionDir, scd.scriptInContext.sessionId, scd.scriptInContext.details.name, scd.detailsAndDirectory.directory)
}


export function buildShellCommandDetails(scd: ScriptInContextAndDirectory): ShellCommandDetails<CommandDetails>[] {
    return scd.scriptInContext.details.commands.map(cmd => {
        let directory = calculateDirectory(scd.detailsAndDirectory.directory, cmd)
        let dic = {...scd.scriptInContext.config, projectDirectory: scd.detailsAndDirectory.directory, projectDetails: scd.detailsAndDirectory.projectDetails}
        let env = cleanUpEnv(dic, scd.scriptInContext.details.env);
        let result: ShellCommandDetails<CommandDetails> = {
            ...scd,
            details: ({
                command: cmd,
                commandString: derefence(dic, cmd.command),
                dic: dic,
                env: env,
                directory: derefence(dic, directory),
            })
        };
        return result
    })
}

export let executeOneGeneration: (e: ExecuteScript) => ExecuteOneGeneration = e => gen => Promise.all(gen.map(x => e(x)))

export function executeAllGenerations(executeOne: ExecuteOneGeneration, reporter: (GenerationResult) => Promise<void>): ExecuteGenerations {
    let fn = (gs, sofar) => {
        if (gs.length == 0) return Promise.resolve(sofar)
        return executeOne(gs[0]).then(gen0Res => {
            return reporter(gen0Res).then(() => fn(gs.slice(1), [...sofar, gen0Res]))
        })
    }
    return gs => fn(gs, [])
}

export let executeScript: (e: ExecuteCommand) => ExecuteScript = e => (scd: ScriptInContextAndDirectory) => {
    let startTime = new Date().getTime()
    return executeOneAfterTheOther(e)(buildShellCommandDetails(scd)).then(results => ({results: [].concat(...results), scd, duration: new Date().getTime() - startTime}))
}

function executeOneAfterTheOther<From, To>(fn: (from: From) => Promise<To>): (froms: From[]) => Promise<To[]> {
    return froms => froms.reduce((res, f) => res.then(r => fn(f).then(to => [...r, to])), Promise.resolve([]))
}


export type RawCommandExecutor = (d: ShellCommandDetails<CommandDetails>) => Promise<RawShellResult>
export type ExecuteCommand = (d: ShellCommandDetails<CommandDetails>) => Promise<ShellResult[]>
export type ExecuteScript = (s: ScriptInContextAndDirectory) => Promise<ScriptResult>
export type ExecuteGeneration = (generation: Generation) => Promise<GenerationResult>
export type ExecuteOneGeneration = (generation: Generation) => Promise<GenerationResult>
export type ExecuteGenerations = (generations: Generations) => Promise<GenerationsResult>

type Finder = (c: ShellCommandDetails<CommandDetails>) => ExecuteCommand

function jsOrShellFinder(js: ExecuteCommand, shell: ExecuteCommand): Finder {
    return c => (c.details.commandString.startsWith('js:')) ? js : shell
}
export function timeIt(e: RawCommandExecutor): ExecuteCommand {
    return d => {
        let startTime = new Date()
        return e(d).then(res => [{...res, details: d, duration: (new Date().getTime() - startTime.getTime())}]);
    }
}

export function make(shell: RawCommandExecutor, js: RawCommandExecutor, timeIt: (e: RawCommandExecutor) => ExecuteCommand, ...decorators: CommandDecorator[]): ExecuteCommand {
    let decorate = chain(decorators)
    let decoratedShell = decorate(timeIt(shell))
    let decoratedJs = decorate(timeIt(js))
    let finder = jsOrShellFinder(decoratedJs, decoratedShell)
    return c => finder(c)(c)
}

export let execInSpawn: RawCommandExecutor = (d: ShellCommandDetails<CommandDetails>) => {
    let options = d.details.env ? {cwd: d.details.directory, env: {...process.env, ...d.details.env}} : {cwd: d.details.directory}
    return new Promise<RawShellResult>((resolve, reject) => {
        let child = cp.spawn(d.details.commandString, {...options, shell: true})
        child.stdout.on('data', data => writeTo(d.streams, data))
        child.stderr.on('data', data => writeTo(d.streams, data))
        child.on('close', (code) => {resolve({err: code == 0 ? null : code})})
    })
}

//** The function passed in should probably not return a promise. The directory is changed, the function executed and then the directory is changed back
function executeInChangedDir<To>(dir: string, block: () => To): To {
    let oldDir = process.cwd()
    try {
        process.chdir(dir);
        return block()
    } finally {process.chdir(oldDir)}
}
//** The function passed in should probably not return a promise. The env is changed, the function executed and then the env changed back
function executeInChangedEnv<To>(env: Envs, block: () => To): To {
    let oldEnv = process.env
    try {
        if (env) process.env = env;
        return block()
    } finally {process.env = oldEnv}
}


export let execJS: RawCommandExecutor = d => {
    try {
        let res = executeInChangedEnv<any>(d.details.env, () => executeInChangedDir(d.details.directory,
            () => Function("return  " + d.details.commandString.substring(3))().toString()))
        let result = res.toString();
        writeTo(d.streams, result + '\n')
        return Promise.resolve({err: null, stdout: result, stderr: ""})
    } catch (e) {
        let result =
            `Error: ${e} Command was [${d.details.commandString}]`
        ;
        writeTo(d.streams, result + '\n')
        return Promise.resolve({err: e, stdout: result, stderr: ""})
    }
}
