//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import PropTypes from 'prop-types'

import {CartData, productDataQuantityLens, CartProps} from "../domain";
import React from 'react';
import {ProductList} from "./ProductList";

export function Cart({context}: CartProps<CartData>) {
    let products = context.json().products
    let domain = context.domain;
    const nodes = products.length > 0 ?
        (<ProductList context={context.focusOn('products')}
                      quantityL={productDataQuantityLens}
                      onClick={domain.takeFromCartPutInInventory} button='Remove From Cart'/>) :
        (<em>Please add some products to cart.</em>)
    return (
        <div>
            <h3>Your Cart</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{context.json().total}</p>
            <button onClick={domain.onCheckoutClicked} disabled={products.length == 0}> Checkout</button>
        </div>
    )
}

Cart.propTypes = {
    products: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}
