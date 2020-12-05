import {InventoryData, ItemsAndIndex, ProductData, ShoppingCartContext, ShoppingCartProps, TwoListData} from "../domain";
import React from "react";
import {TwoListButton} from "./TwoListButton";
import {Lens, LensContext} from "@phil-rice/lens";

export function Inventory(props: ShoppingCartProps<InventoryData>) {
    let d = props.context.json()
    return (<div>
        <h3>Inventory</h3>
        <div>{d.products.map((p, i) =>
            <InventoryItem key={p.id} context={ItemsAndIndex.makeContext(props.context.focusOn('products'), i)}/>)}
        </div>
    </div>)
}
function withNth<Domain, Main, T>(l: LensContext<Domain, Main, T[]>, n: number) {
    return l.withChildLens(Lens.nth(n))
}

function InventoryItem(props: ShoppingCartProps<ItemsAndIndex<ProductData>>) {
    let context = props.context;
    let itemsAndIndex = context.json()
    let p = itemsAndIndex.items[itemsAndIndex.index]
    let domain = context.domain
    let newContext: ShoppingCartContext<TwoListData> = context.withLens(TwoListData.makeLens(domain.toCartsProductL, context.lens));
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{p.quantity ? ` x ${p.quantity}` : null}
        <TwoListButton context={newContext} normalText='Add to cart' emptyText='Sold Out' onClick={context.domain.takeFromItemsAndAddToMain}/>
    </div>)
}

