//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
export interface ErrorHandler {handle(msg: string, e: any): any}

export class NullErrorHandler implements ErrorHandler {handle(msg: string, e: any): any { throw e;}}

export class ConsoleLogErrorHandler implements ErrorHandler {
    handle(msg: string, e: any): any {
        console.log(msg, e);
        throw e;
    }
}
