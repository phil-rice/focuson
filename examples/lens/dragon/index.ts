//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
export let dragon: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}


export type Hitpoint = number
export interface Dragon {
    body: Body,
    head: Head,
}

export interface Body {
    chest: Chest,
    leftWing: Wing,
    rightWing: Wing
}
export interface Head {
    leftEye: Eye,
    rightEye: Eye
    hitpoints: Hitpoint
}
export interface Eye {color: Color}
export type Color = 'blue' | 'green'
export interface Chest {
    stomach: Stomach,
    hitpoints: Hitpoint
}
export interface Stomach {contents: any[]}
export interface Wing {
    hitpoints: Hitpoint
}
