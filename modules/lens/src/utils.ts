//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS

export function checkIsFunction(functionToCheck: any) {
    if (!(typeof functionToCheck === "function")) throw Error('getter should be a function, instead is ' + JSON.stringify(functionToCheck))
}
export function identity<T>(t: T): T {return t}
export interface Tuple2<T1, T2> {
    one: T1,
    two: T2
}
export interface Tuple3<T1, T2, T3> {
    one: T1,
    two: T2,
    three: T3
}


