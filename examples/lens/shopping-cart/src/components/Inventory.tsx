import {InventoryData, ProductData, ShoppingCartProps} from "../domain";
import React from "react";
import {ItemsAndIndex} from "@phil-rice/lens/src/optics/ItemAndIndex";
import {LensContext} from "@phil-rice/lens";

export function Inventory(props: ShoppingCartProps<InventoryData>) {
    let d = props.context.json()
    return (<div>
        <h3>Inventory</h3>
        <div>{d.products.map((p, i) =>
            <InventoryItem key={p.id} context={ItemsAndIndex.makeContext(props.context.focusOn('products'), i)}/>)}
        </div>
    </div>)
}

function InventoryItem(props: ShoppingCartProps<ItemsAndIndex<ProductData>>) {
    let domain = props.context.domain
    let p = props.context.json().item()
    function onClick() { LensContext.tuple(domain.toCartsProductL, props.context).transform(domain.takeFromItemsAndAddToMain)}
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{p.quantity ? ` x ${p.quantity}` : null}
        <button onClick={onClick}>{'Add to cart'}</button>
    </div>)

}