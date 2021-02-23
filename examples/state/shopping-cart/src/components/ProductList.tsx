//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from "react";
import {ProductData, removeFromContextAddToList} from "../domain";
import {Lens} from "@focuson/lens";
import {LensState} from "@focuson/state";

interface ProductProps<Main> {
    addToListLens: Lens<Main, ProductData[]>,
    button: string,
    state: LensState<Main, ProductData[]>
}

interface OneProductProps<Main> extends ProductProps<Main> {
    index: number,
}
export function ProductList<Main>({addToListLens, button, state}: ProductProps<Main>) {
    return (<div>
        {state.json().map((p: ProductData, i: number) =>
            <OneProduct key={p.id} state={state} index={i} addToListLens={addToListLens} button={button}/>)}
    </div>);
}

export function OneProduct<Main>({addToListLens, button, state, index}: OneProductProps<Main>) {
    let p = state.json()[index]
    let onClick = (() => removeFromContextAddToList<Main>(state, addToListLens, index))
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{p.quantity ? ` x ${p.quantity}` : null}
        <button onClick={onClick}> {button}</button>
    </div>)
}