import * as readline from "readline";
import {CommandDecorator, GenerationDecorator, ScriptDecorator} from "./decorators";
import * as fs from "fs";
import {Config} from "./config";

let ch = '0123456789abcdefghijklmnopqrstuvwxyz'


export class Status {
    directoryToLogName: (dir: string) => string
    generations: GenerationStatus[] = []
    gen: number = -1
    config: Config;

    constructor(config: Config, directoryToLogName: (dir: string) => string) {this.config = config, this.directoryToLogName = directoryToLogName;}
    genStatus() {return this.generations[this.gen]}
    dirStatus(dir: string) {return this.genStatus().directories.get(dir)}

    generationStart() {
        this.gen = this.gen + 1;
        this.generations[this.gen] = {directories: new Map()}
    }
    scriptStart(directory: string) {
        let status = this.genStatus()
        status.directories.set(directory, {commands: [], finished: false})
    }
    scriptEnd(directory: string) {
        let status = this.dirStatus(directory)
        status.finished = true
    }

    commandStart(directory: string, command: string) {
        let status = this.dirStatus(directory)
        status.commands.push({name: command, startTime: new Date()})
    }
    commandFinished(directory: string, command: string) {
        let status = this.dirStatus(directory)
        status.commands[status.commands.length - 1].endTime = new Date()

    }
    commandStatusString(s: CommandStatus[]) {
        let now = new Date()
        function duration(s: CommandStatus) {return Math.round(((s.endTime ? s.endTime : now).getTime() - s.startTime.getTime()) / 1000)}
        return s.map(s => `${s.name}(${duration(s)})`).join(', ')
    }
    dumpStatus() {
        console.clear()
        this.generations.forEach((gen, geni) => {
            console.log("generation", geni);
            [...gen.directories.keys()].sort().forEach((dir, i) => {
                let status = gen.directories.get(dir);
                console.log('  ', this.getPrefix(geni, i), dir + (status.finished ? ' finished' : ''))
                console.log('    ', this.commandStatusString(status.commands))
            })
        })
    }

    logStatus() {
        console.clear()
        this.generations.forEach((gen, geni) => {
            console.log("generation", geni);
            [...gen.directories.keys()].sort().forEach((dir, i) => {
                let status = gen.directories.get(dir);
                console.log('  ' + this.getPrefix(geni, i), this.directoryToLogName(dir) + (status.finished ? ' finished' : ''))
            })
        })
    }
    private getPrefix(geni: number, i: number) {
        return geni == this.gen ? `(${i})` : '';
    }
    help() {
        console.log('Welcome to the status screen for Laoban')
        console.log('   Press ? for this help')
        console.log('   Press (capital) S for overall status')
        console.log('   Press (capital) L for information about where the logs are');
        console.log('   Press a number or letter to get the tail of the log file which has that number or letter in the status')
        let directories = this.genStatus().directories;
        [...directories.keys()].sort().forEach((dir, i) => console.log('       ', ch.charAt(i), 'tail of the log for ', dir))
    }
    tailLog(index: number) {
        console.clear()
        let gen = this.genStatus();
        let directories = gen.directories;
        let keys = [...directories.keys()].sort()
        let dir = keys[index]
        if (dir) {
            let status = gen.directories.get(dir);
            console.log(dir + (status.finished ? ' finished' : ''))
            console.log('  ', this.commandStatusString(status.commands))
            console.log()
            console.log(this.directoryToLogName(dir))
            console.log(''.padStart(this.directoryToLogName(dir).length, '-'))
            fs.readFile(this.directoryToLogName(dir), (err, data) => {
                if (err) console.error(err)
                let slicedText = data.toString().split('\n').slice(-10).join('\n');
                console.log(slicedText)
            })

        } else {
            console.log('cannot find tail of', index)
            console.log()
            this.help()
        }
    }

}

interface GenerationStatus {
    directories: Map<string, DirectoryStatus>
}
interface DirectoryStatus {
    commands: CommandStatus[]
    finished: boolean
}

interface CommandStatus {
    name: string,
    startTime: Date,
    endTime?: Date
}


export let monitorGenerationDecorator: GenerationDecorator = e => d => {
    if (d.length > 0) {
        let status = d[0].scriptInContext.status;
        status.generationStart()
    }
    return e(d)
}

export let monitorScriptDecorator: ScriptDecorator = e => d => {
    let status = d.scriptInContext.status
    let directory = d.detailsAndDirectory.directory;
    status.scriptStart(directory)
    return e(d).then((r) => {
        status.scriptEnd(directory);
        return r
    })
}

export let monitorCommandDecorator: CommandDecorator = e => d => {
    let status = d.scriptInContext.status
    let directory = d.detailsAndDirectory.directory
    let command = d.details.commandString;
    status.commandStart(directory, command)
    return e(d).then(r => {
        status.commandFinished(directory, command)
        return r
    })
}
export function monitor(status: Status, promise: Promise<void>) {
    readline.emitKeypressEvents(process.stdin);
    promise.then(() => process.exit(0))
    process.stdin.setRawMode(true);
    process.stdin.resume()
    process.stdin.on('keypress', (str, key) => {
        try {
            switch (str) {
                case '?':
                    console.clear()
                    status.help();
                    break
                case 'S':
                    console.clear()
                    status.dumpStatus();
                    break;
                case 'L':
                    console.clear()
                    status.logStatus();
                    break;

            }
            let index = ch.indexOf(str)
            if (index >= 0) {
                status.tailLog(index)
            }
            if (key.sequence == '\x03') {
                process.kill(process.pid, 'SIGINT')
            }
        } catch (e) {
            console.clear()
            console.error('unexpected error. Press ? for help')
            console.error()
            console.error(e)
        }
    })
}
