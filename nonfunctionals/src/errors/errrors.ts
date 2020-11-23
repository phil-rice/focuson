export interface ErrorHandler {handle(msg: string, e: any): any}

export class NullErrorHandler implements ErrorHandler {handle(msg: string, e: any): any { throw e;}}

export class ConsoleLogErrorHandler implements ErrorHandler {
    handle(msg: string, e: any): any {
        console.log(msg, e);
        throw e;
    }
}
