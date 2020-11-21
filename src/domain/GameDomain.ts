import {RestProperties} from "../reactrest/ReactRestElements";
import React from "react";
import {Lens} from "../optics/optics";


export type GameRest<Main,Parent, Child> = RestProperties<React.ReactElement, GameDomain, Main, Parent, Child>

export interface Link {
    href: string
}
export interface SelfLink {
    _links: { _self: Link }
}
export type NoughtOrCross = "O" | "X" | ""

export interface GameData extends SelfLink {
    state: NoughtOrCross
    _embedded: { board: BoardData }
    _render: { _self: string }
    _links: { _self: Link, game1: Link, game2: Link }
}

export interface BoardData extends SelfLink {
    squares: SquareData
    _render: { _self: string, square: string }
}
export type SquareData = NoughtOrCross[]

export interface HasStateLens<Main> {
    stateLens: Lens<Main, NoughtOrCross>
}

export class GameDomain {
    invert(n: NoughtOrCross): NoughtOrCross {return (n === "X") ? "O" : "X"}
    nextState: NoughtOrCross = "X"
    toggleNextState() {return this.nextState = (this.nextState === "X") ? "O" : "X"}
    getAndToggleNextState(): NoughtOrCross {
        let result = this.nextState;
        this.toggleNextState();
        return result;
    }
}

