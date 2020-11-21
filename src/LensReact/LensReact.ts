import {LensContext} from "@phil-rice/lens/src/optics/LensContext";
import {Lens} from "@phil-rice/lens/src/optics/optics";

/** This is the 'make it so that when I change the json things get rendered properly' configuration
 * The 'setJson' method is typically used to render a react component onto a html element. Whenever the json is changed by the child components, suitable rendering takes place
 */
export class LensReact {
    static setJson = <Domain, Main>(domain: Domain, element: HTMLElement, fn: (lc: LensContext<Domain, Main, Main>) => void): (m: Main) => void =>
        (main: Main) => {
            console.log('setJson', main)
            return fn(new LensContext(domain, main, LensReact.setJson(domain, element, fn), Lens.identity()));
        }

}