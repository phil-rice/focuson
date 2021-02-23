//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {lens} from "@focuson/lens";

export let a1b2ca3 = {a: 1, b: 2, c: {a: 3}}
export let list123 = [1, 2, 3]
export let lensToc = lens<any, any>(f => f.c, (m, c) => ({...m, c}), 'toC')
export let lenscToa = lens<any, any>(f => f.a, (m, a) => ({...m, a}), 'toa')
export let letnstoca = lensToc.chainWith(lenscToa)
export let dragon: Dragon = {body: {chest: {stomach: {contents: ["the adventurer"]}}}}
export let dragon2: Dragon = {body: {chest: {stomach: {contents: ["the adventurer", "moreGoodness"]}}}}
export interface Dragon {body: Body}
export interface Body {chest: Chest}
export interface Chest {stomach: Stomach}
export interface Stomach {contents: any []}

export class DragonDomain{

}