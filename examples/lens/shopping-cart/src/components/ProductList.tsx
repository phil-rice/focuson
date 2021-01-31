//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
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


export function OneProduct({context, quantityL, button, onClick}: OneProductProps<BasicProductData>) {
    let p = context.json().item()
    let quantity = quantityL.get(p)
    return (<div style={{marginBottom: 20}}>{p.title} - &#36;{p.price}{quantity ? ` x ${quantity}` : null}
        <button onClick={() => onClick(context)}>{button}</button>
    </div>)
}