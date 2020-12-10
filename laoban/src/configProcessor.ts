import {CommandDefn, Config, Envs, RawConfig, ScriptDefn, ScriptDefns, ScriptDetails} from "./config";
import * as path from "path";
import {loabanConfigName} from "./Files";
import * as os from "os";

/** if dic has a.b.c, then if s is a.b.c, this return dic.a.b.c. Or undefined */
function find(dic: any, s: string) {
    return dic[s]
}


/** ref is like ${xxx} and this returns dic[xxx]. If the variable doesn't exist it is left alone... */
function replaceVar(dic: any, ref: string): string {
    if (ref === undefined) return undefined
    let i = ref.slice(2, ref.length - 1);
    let parts = i.split('.')
    try {
        let result = parts.reduce((acc, part) => acc[part], dic)
        return result !== undefined ? result : ref
    } catch (e) {return ref}
}
/** If the string has ${a} in it, then that is replaced by the dic entry */
export function derefence(dic: any, s: string) {
    const regex = /(\$\{[^}]*\})/g
    let groups = s.match(regex)
    return groups ? groups.reduce((acc, v) => acc.replace(v, replaceVar(dic, v)), s) : s;
}

export function replaceVarToUndefined(dic: any, ref: string): string | undefined {
    if (ref === undefined) return undefined
    let i = ref.slice(2, ref.length - 1);
    let parts = i.split('.')
    try {
        return parts.reduce((acc, part) => acc[part], dic)
    } catch (e) {return undefined}
}
export function derefenceToUndefined(dic: any, s: string) {
    const regex = /(\$\{[^}]*\})/g
    let groups = s.match(regex)
    if (groups) {
        return groups.reduce((acc, v) => {
            let repl = replaceVarToUndefined(dic, v)
            return acc.replace(v, repl ? repl : "")
        }, s)
    }
    return undefined
}

// function cleanUpCommandString(dic: any): (s: string) => string {
//     return s => derefence(dic, s)
// }
function isCommand(x: (string | CommandDefn)): x is CommandDefn {
    return typeof x === 'object'
}
export function cleanUpCommand(command: (string | CommandDefn)): CommandDefn {
    return isCommand(command) ?
        ({...command, command: command.command}) :
        ({name: '', command: command})
}
export function cleanUpEnv(dic: any, env: Envs): Envs {
    if (env) {
        let result: Envs = {}
        Object.keys(env).forEach(key => result[key] = derefence(dic, env[key].toString()))
        return result
    }
    return env
}
function cleanUpScript(dic: any): (scriptName: string, defn: ScriptDefn) => ScriptDetails {
    return (scriptName, defn) => ({
        name: derefence(dic, scriptName),
        description: derefence(dic, defn.description),
        guard: defn.guard,
        osGuard: defn.osGuard,
        pmGuard: defn.pmGuard,
        guardReason: defn.guardReason,
        inLinksOrder: defn.inLinksOrder,
        commands: defn.commands.map(cleanUpCommand),
        env: cleanUpEnv(dic, defn.env)
    })
}
function addScripts(dic: any, scripts: ScriptDefns) {
    var result: ScriptDetails[] = []
    for (const scriptName in scripts)
        result.push(cleanUpScript(dic)(scriptName, scripts[scriptName]))
    return result;
}
export function configProcessor(laoban: string, rawConfig: RawConfig): Config {
    var result: any = {laobanDirectory: laoban, laobanConfig: path.join(laoban, loabanConfigName)}
    function add(name: string, raw: any) {
        result[name] = derefence(result, raw[name])
    }
    add("templateDir", rawConfig)
    add("versionFile", rawConfig)
    add("log", rawConfig)
    add("status", rawConfig)
    add("profile", rawConfig)
    add("packageManager", rawConfig)
    result.sessionDir = rawConfig.sessionDir ? rawConfig.sessionDir : path.join(laoban, '.session')
    result.throttle = rawConfig.throttle ? rawConfig.throttle : 0
    for (const k in rawConfig.variables) add(k, rawConfig.variables)
    result.scripts = addScripts(result, rawConfig.scripts);
    result.os = os.type()
    return result

}

