//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {AppData, ProductData} from "./domain";
import {Lenses} from "@focuson/lens";
import {getElement, setJsonWithLongTransformation} from "@focuson/state";
import ReactDOM from "react-dom";
import {ShoppingCartApp} from "./components/ShoppingCartApp";

let rootElement = getElement('root')

let getProducts = Lenses.build<AppData>('App').focusOn('cart').focusOn('products').get
let priceLens = Lenses.build<AppData>('App').focusOn('cart').focusOn('total')


/** Why does this return a promise? Because many pricing engines/validation etc often require a round trip to a server */
function calculatePrice(appData: AppData) {
    let price = getProducts(appData).reduce((acc:number, v: ProductData) => acc + v.quantity * v.price, 0)
    return Promise.resolve(priceLens.set(appData, price.toFixed(2)))
}

let setJson= setJsonWithLongTransformation( 'game',
    s => (ReactDOM.render(<ShoppingCartApp state={s}/>, rootElement)), calculatePrice)


setJson({
        inventory: {
            products: [
                {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "quantity": 2},
                {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "quantity": 10},
                {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "quantity": 5}
            ]
        }, cart: {total: "", products: []}
    }
)

