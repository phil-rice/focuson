import {ScriptInContext} from "./config";
import {derefenceToUndefined} from "./configProcessor";
import * as path from "path";
import {Promise} from "core-js";
import {chain, partition, writeTo} from "./utils";
import {splitGenerationsByLinks} from "./generations";
import * as fs from "fs";
import {CommandDetails, ExecuteCommand, ExecuteGeneration, ExecuteGenerations, ExecuteScript, Generations, ShellCommandDetails, ShellResult} from "./executors";
import {monitorCommandDecorator, monitorGenerationDecorator, monitorScriptDecorator} from "./monitor";

export type CommandDecorator = (e: ExecuteCommand) => ExecuteCommand
export type ScriptDecorator = (e: ExecuteScript) => ExecuteScript
export type GenerationDecorator = (e: ExecuteGeneration) => ExecuteGeneration
export type GenerationsDecorator = (e: ExecuteGenerations) => ExecuteGenerations

export type AppendToFileIf = (condition: any | undefined, name: string, content: () => string) => Promise<void>

interface ToFileDecorator {
    appendCondition: (d: ShellCommandDetails<CommandDetails>) => any | undefined
    filename: (d: ShellCommandDetails<CommandDetails>) => string
    content: (d: ShellCommandDetails<CommandDetails>, res: ShellResult) => string
}

interface GuardDecorator {
    guard: (d: ShellCommandDetails<CommandDetails>) => any | undefined
    valid: (guard: any, d: ShellCommandDetails<CommandDetails>) => any
}

interface StdOutDecorator {
    condition: (d: ShellCommandDetails<CommandDetails>) => any | undefined,
    pretext: (d: ShellCommandDetails<CommandDetails>) => string,
    transform: (sr: ShellResult) => ShellResult,
    posttext: (d: ShellCommandDetails<CommandDetails>, sr: ShellResult) => string
}
const shouldAppend = (d: ShellCommandDetails<CommandDetails>) => !d.scriptInContext.dryrun;
const dryRunContents = (d: ShellCommandDetails<CommandDetails>) => {
    let trim = trimmedDirectory(d.scriptInContext)
    return `${trim(d.details.directory).padEnd(d.scriptInContext.dirWidth)} ${d.details.commandString}`;
}



function calculateVariableText(d: ShellCommandDetails<CommandDetails>): string {
    let dic = d.details.dic
    let simplerdic = {...dic}
    delete simplerdic.scripts
    return [`Raw command is [${d.details.command.command}] became [${d.details.commandString}]`,
        "legal variables are",
        JSON.stringify(simplerdic, null, 2)].join("\n") + "\n"
}

interface GenerationsDecoratorTemplate {
    condition: (scd: ScriptInContext) => boolean,
    transform: (scd: ScriptInContext, g: Generations) => Generations
}

function trimmedDirectory(sc: ScriptInContext) {
    return (dir: string) => dir.substring(sc.config.laobanDirectory.length + 1)
}


export class ScriptDecorators {
    static normalDecorators(): ScriptDecorator {
        return chain([this.shellDecoratorForScript, monitorScriptDecorator])
    }
    static shellDecoratorForScript: ScriptDecorator = e => scd => {
        if (scd.scriptInContext.shell && !scd.scriptInContext.dryrun)
            writeTo(scd.streams, '*' + scd.detailsAndDirectory.directory + '\n')
        return e(scd)
    }
}

export class GenerationDecorators {
    static normalDecorators(): GenerationDecorator {
        return monitorGenerationDecorator
    }
}

export class GenerationsDecorators {
    static normalDecorators(): GenerationsDecorator {
        return chain([this.PlanDecorator, this.ThrottlePlanDecorator, this.LinkPlanDecorator].map(this.applyTemplate))
    }

    static PlanDecorator: GenerationsDecoratorTemplate = {
        condition: scd => {
            return scd.genPlan
        },
        transform: (sc, gens) => {
            let trim = trimmedDirectory(sc)
            if (sc.dryrun) {
                gens.forEach((gen, i) => {
                    console.log("Generation", i)
                    gen.forEach(scd => {
                        if (scd.scriptInContext.details.commands.length == 1)
                            console.log('   ', trim(scd.detailsAndDirectory.directory), scd.scriptInContext.details.commands[0].command)
                        else {
                            console.log('   ', trim(scd.detailsAndDirectory.directory))
                            scd.scriptInContext.details.commands.forEach(c => console.log('       ', c.command))
                        }
                    })
                })
            } else gens.forEach((gen, i) => console.log("Generation", i, gen.map(scd => trim(scd.detailsAndDirectory.directory)).join(", ")))
            return []
        }
    }
    static ThrottlePlanDecorator: GenerationsDecoratorTemplate = {
        condition: scd => scd.throttle > 0,
        transform: (scd, gens) => [].concat(...(gens.map(gen => partition(gen, scd.throttle))))
    }

    static LinkPlanDecorator: GenerationsDecoratorTemplate = {
        condition: scd => scd.links || scd.details.inLinksOrder,
        transform: (scd, g) => [].concat(...g.map(splitGenerationsByLinks))
    }

    static applyTemplate: (t: GenerationsDecoratorTemplate) => GenerationsDecorator = t => e => gens => {
        if (gens.length > 0 && gens[0].length > 0) {
            let scd: ScriptInContext = gens[0][0].scriptInContext;
            if (t.condition(scd)) {
                return e(t.transform(scd, gens))
            }
        }
        return e(gens)
    }
}


export class CommandDecorators {

    static normalDecorator(a: AppendToFileIf): CommandDecorator {
        return chain([
            ...[CommandDecorators.guard].map(CommandDecorators.guardDecorate),
            CommandDecorators.dryRun,
            CommandDecorators.log,
            monitorCommandDecorator,
            ...[CommandDecorators.status, CommandDecorators.profile].map(CommandDecorators.fileDecorate(a)),
            CommandDecorators.quietDisplay,
            ...[CommandDecorators.variablesDisplay, CommandDecorators.shellDisplay].map(CommandDecorators.stdOutDecorator)
        ])
    }

    static fileDecorate: (a: AppendToFileIf) => (fileDecorator: ToFileDecorator) => CommandDecorator = appendIf => dec => e =>
        d => e(d).then(res => Promise.all(res.map(r => appendIf(dec.appendCondition(d) && shouldAppend(d), dec.filename(d), () => dec.content(d, r)))).then(() => res))


    static status: ToFileDecorator = {
        appendCondition: d => d.details.command.status,
        filename: d => path.join(d.detailsAndDirectory.directory, d.scriptInContext.config.status),
        content: (d, res) => `${d.scriptInContext.timestamp.toISOString()} ${res.err === null} ${d.details.command.name}\n`
    }
    static profile: ToFileDecorator = {
        appendCondition: d => d.details.command.name,
        filename: d => path.join(d.detailsAndDirectory.directory, d.scriptInContext.config.profile),
        content: (d, res) => `${d.scriptInContext.details.name} ${d.details.command.name} ${res.duration}\n`
    }
    static log: CommandDecorator = e => d => {
        let log = path.join(d.detailsAndDirectory.directory, d.scriptInContext.config.log)
        let logStream = fs.createWriteStream(log, {flags: 'a'})
        logStream.write(`${d.scriptInContext.timestamp.toISOString()} ${d.details.commandString}\n`)
        let newD = {...d, streams: [...d.streams, logStream]}
        return e(newD).then(sr => {
            sr.forEach(res => logStream.write(`Took ${res.duration}${res.err ? `, Error was [${res.err}]` : ''}\n`))
            return sr
        })
    }

    static dryRun: CommandDecorator = e => d => {
        if (d.scriptInContext.dryrun) {
            let value = dryRunContents(d);
            writeTo(d.streams, value + '\n')
            return Promise.resolve([{duration: 0, details: d, stdout: value, err: null, stderr: ""}])
        } else return e(d)
    }
    static stdOutDecorator: (dec: StdOutDecorator) => CommandDecorator = dec => e => d => {
        if (dec.condition(d)) {
            writeTo(d.streams, dec.pretext(d))
            return e(d).then(sr => sr.map(r => {
                writeTo(r.details.streams, dec.posttext(d, r))
                return r
            }))
        } else return e(d)
    }

    static shellDisplay: StdOutDecorator = {
        condition: d => d.scriptInContext.shell && !d.scriptInContext.dryrun,
        pretext: d => '*   ' + d.details.commandString + '\n',
        transform: sr => sr,
        posttext: (d, sr) => ''
    }

    static variablesDisplay: StdOutDecorator = {
        condition: d => d.scriptInContext.variables,
        pretext: d => calculateVariableText(d),
        transform: sr => sr,
        posttext: (d, sr) => ''
    }

    static quietDisplay: CommandDecorator = e => d =>
        d.scriptInContext.quiet ? e(d).then(sr => sr.map(r => ({...r, stdout: ''}))) : e(d)


    static guardDecorate: (guardDecorator: GuardDecorator) => CommandDecorator = dec => e =>
        d => {
            let guard = dec.guard(d)
            return (!guard || dec.valid(guard, d)) ? e(d) : Promise.resolve([])
        }

    static guard: GuardDecorator = {
        guard: d => d.scriptInContext.details.guard,
        valid: (g, d) => derefenceToUndefined(d.details.dic, g) != ''
    }
}