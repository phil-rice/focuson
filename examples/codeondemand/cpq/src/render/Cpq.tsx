import {CpqData, CpqProperties} from "../CpqDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";
import {Lens} from "@phil-rice/lens";

function Cpq<Main>(props: CpqProperties<Main, CpqData>) {
    const filters = props.context.json().filters.map((f, i) =>
        (<ComponentFromServer context={props.context.focusOn('filters').withChildLens(Lens.nth(i))}/>))
    let price: string = props.context.json().price.toString()
    return (<div className='cpq'>
        <div className='summary'>Price: {price}</div>
        <div className='filters'>{filters}</div>
    </div>)
}

