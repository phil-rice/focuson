import {AppData, ShoppingCartProps, ShoppingCartContext, ShoppingCartDomain} from "./domain";
import {getElement, LensContext} from "@phil-rice/lens";
import {App} from "./components/App";
import ReactDOM from "react-dom";

let domain: ShoppingCartDomain = new ShoppingCartDomain(() => console.log("checkout pressed"))

let rootElement = getElement('root')
let setJson = LensContext.setJsonForReact<ShoppingCartDomain, AppData>(domain, 'game',
    c => (ReactDOM.render(<App context={c}/>, rootElement)))

setJson({
        inventory: {
            products: [
                {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "quantity": 2},
                {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "quantity": 10},
                {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "quantity": 5}
            ]
        }, cart: {total: "0", products: []}
    }
)

