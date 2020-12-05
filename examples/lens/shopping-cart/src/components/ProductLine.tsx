import React from "react";
import {AppData, BasicProductData, ShoppingCartContext} from "../domain";
import {Lens, LensContext} from "@phil-rice/lens";

interface ProductLineProps<P extends BasicProductData> {
    context: ShoppingCartContext<P>,
    quantityL: Lens<P, number>,
    onClick: () => void,
    children: JSX.Element
}

export function ProductLine<P extends BasicProductData>(props: ProductLineProps<P>) {
    let p = props.context.json()
    let quantity = props.quantityL.get(p)

    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{quantity ? ` x ${quantity}` : null}
        <button onClick={props.onClick}>{props.children}</button>
    </div>)
}