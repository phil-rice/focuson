import React from "react";
import {ShoppingCartContext} from "../domain";
import {Lens} from "@phil-rice/lens";
import {ItemsAndIndex} from "@phil-rice/lens/src/optics/ItemAndIndex";


interface OneProductProps<P> {
    context: ShoppingCartContext<ItemsAndIndex<P>>,
    quantityL: Lens<P, number>,
    onClick: (c: ShoppingCartContext<ItemsAndIndex<P>>) => void,
    button: string
}

//I don't know how (in a tsx) to say <P extends BasicProductData> and have it compile
export function OneProduct<P>(props: OneProductProps<P>) {
    let p: any = props.context.json().item()
    let quantity = props.quantityL.get(p)
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{quantity ? ` x ${quantity}` : null}
        <button onClick={() => props.onClick(props.context)}>{props.button}</button>
    </div>)
}