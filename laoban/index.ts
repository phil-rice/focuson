#!/usr/bin/env node
import {findLaoban, laobanFile} from "./src/Files";
import fs from "fs";
import {validateLaobanJson} from "./src/validation";
import {AppendToFileIf, CommandDecorators, GenerationDecorators, GenerationsDecorators, ScriptDecorators} from "./src/decorators";
import {execInSpawn, execJS, executeAllGenerations, ExecuteCommand, ExecuteGenerations, executeOneGeneration, ExecuteOneGeneration, executeScript, ExecuteScript, make, timeIt} from "./src/executors";
import {configProcessor} from "./src/configProcessor";
import * as fse from "fs-extra";
import {shellReporter} from "./src/report";
import {Cli} from "./src/laoban";

let laoban = findLaoban(process.cwd())
let rawConfig = JSON.parse(fs.readFileSync(laobanFile(laoban)).toString())
let issues = validateLaobanJson(rawConfig);
if (issues.length > 0) {
    issues.forEach(e => console.error(e))
    process.exit(2)
}

export function defaultExecutor(a: AppendToFileIf) { return make(execInSpawn, execJS, timeIt, CommandDecorators.normalDecorator(a))}

let config = configProcessor(laoban, rawConfig)
let appendToFiles: AppendToFileIf = (condition, name, contentGenerator) =>
    condition ? fse.appendFile(name, contentGenerator()) : Promise.resolve()

let executeOne: ExecuteCommand = defaultExecutor(appendToFiles)
let executeOneScript: ExecuteScript = ScriptDecorators.normalDecorators()(executeScript(executeOne))
let executeGeneration: ExecuteOneGeneration = GenerationDecorators.normalDecorators()(executeOneGeneration(executeOneScript))
let executeGenerations: ExecuteGenerations = GenerationsDecorators.normalDecorators()(executeAllGenerations(executeGeneration, shellReporter))

let cli = new Cli(config, executeGenerations);

cli.start(process.argv)
