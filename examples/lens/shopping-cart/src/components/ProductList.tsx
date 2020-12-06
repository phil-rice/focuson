import React from "react";
import {BasicProductData, ShoppingCartContext} from "../domain";
import {Lens} from "@phil-rice/lens";
import {ItemsAndIndex} from "@phil-rice/lens/src/optics/ItemAndIndex";

export function contextForOneProduct(context: ShoppingCartContext<BasicProductData[]>, i: number) {
    let result = ItemsAndIndex.makeContext(context, i);
    console.log('contextForOneProduct', result)
    return result;
}

interface ShartedProductProps<P> {
    quantityL: Lens<P, number>,
    onClick: (c: ShoppingCartContext<ItemsAndIndex<P>>) => void,
    button: string

}
interface ProductListProps<P> extends ShartedProductProps<P> {
    context: ShoppingCartContext<P[]>,
}

interface OneProductProps<P> extends ShartedProductProps<P> {
    context: ShoppingCartContext<ItemsAndIndex<P>>
}

export function ProductList<P>(props: ProductListProps<P>) {
    // @ts-ignore//I don't know how (in a tsx function) to say <P extends BasicProductData> and have it compile. Let me know if you can do this
    let typeCastProps: ProductListProps<BasicProductData> = props
    let products = typeCastProps.context.json()
    return (<div>{products.map((p, i) =>
        <OneProduct key={p.id}
                    context={contextForOneProduct(typeCastProps.context, i)}
                    quantityL={typeCastProps.quantityL}
                    onClick={typeCastProps.onClick}
                    button={typeCastProps.button}/>)}</div>)
}


export function OneProduct(props: OneProductProps<BasicProductData>) {
    let p = props.context.json().item()
    let quantity = props.quantityL.get(p)
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{quantity ? ` x ${quantity}` : null}
        <button onClick={() => props.onClick(props.context)}>{props.button}</button>
    </div>)
}