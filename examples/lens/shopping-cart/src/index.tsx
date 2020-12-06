import {AppData, ShoppingCartDomain} from "./domain";
import {getElement, Lens, LensContext} from "@phil-rice/lens";

import ReactDOM from "react-dom";
import {App} from "./components/App";

let domain: ShoppingCartDomain = new ShoppingCartDomain(() => console.log("checkout pressed"))

let rootElement = getElement('root')

let getProducts = Lens.build<AppData>('App').then('cart').then('products').get
let priceLens = Lens.build<AppData>('App').then('cart').then('total')


/** Why does this return a promise? Because many pricing engines/validation etc often require a round trip to a server */
function calculatePrice(appData: AppData) {
    let price = getProducts(appData).reduce((acc, v) => acc + v.quantity * v.price, 0)
    return Promise.resolve(priceLens.set(appData, price.toFixed(2)))
}

let setJson= LensContext.setJsonForReact<ShoppingCartDomain, AppData>(domain, 'game',
    c => (ReactDOM.render(<App context={c}/>, rootElement)), calculatePrice)


setJson({
        inventory: {
            products: [
                {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
                {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
                {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
            ]
        }, cart: {total: "", products: []}
    }
)

