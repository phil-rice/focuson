//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import PropTypes from 'prop-types'

import {CartData, ProductData} from "../domain";
import React from 'react';

import {Lens} from "@focuson/lens";
import {LensState} from "@focuson/state";
import {ProductList} from "./ProductList";


/** This would normally be injected by (say) a context. As we are focusing on state management, I've not added to the complexity by doin that */
function onCheckoutClicked() { console.log("Checkout clicked")}


interface CartProps<Main> {
    state: LensState<Main, CartData>,
    addToListLens: Lens<Main, ProductData[]>
}

export function Cart<Main>({state, addToListLens}: CartProps<Main>) {
    let products = state.json().products
    const nodes = products.length > 0 ?
        (<ProductList state={state.focusOn('products')}
                            addToListLens={addToListLens}
                            button='Remove From Cart'/>) :
        (<em>Please add some products to cart.</em>)
    return (
        <div>
            <h3>Your Cart</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{state.json().total}</p>
            <button onClick={onCheckoutClicked} disabled={products.length == 0}> Checkout</button>
        </div>
    )
}

Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
