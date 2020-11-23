import {lens} from "./Lens";

export let a1b2ca3 = {a: 1, b: 2, c: {a: 3}}
export let list123 = [1, 2, 3]
export let lensToc = lens<any, any>(f => f.c, (m, c) => ({...m, c}), 'toC')
export let lenscToa = lens<any, any>(f => f.a, (m, a) => ({...m, a}), 'toa')
export let letnstoca = lensToc.andThen(lenscToa)
export let dragon: Dragon = {body: {chest: {stomach: {contents: ["the adventurer"]}}}}
export let dragon2: Dragon = {body: {chest: {stomach: {contents: ["the adventurer", "moreGoodness"]}}}}
export interface Dragon {body: Body}
export interface Body {chest: Chest}
export interface Chest {stomach: Stomach}
export interface Stomach {contents: any []}

export class DragonDomain{

}