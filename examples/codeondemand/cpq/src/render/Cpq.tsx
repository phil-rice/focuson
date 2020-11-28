import {CpqData, CpqProperties} from "../CpqDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";
import {Lens} from "@phil-rice/lens";

export function Cpq<Main>(props: CpqProperties<Main, CpqData>) {
    const filters = props.context.json().filters.map((f, i) =>
        (<ComponentFromServer key={i} context={props.context.focusOn('filters').withChildLens(Lens.nth(i))}/>))
    let price: string = props.context.json().price.toString()
    return (<div className='cpq'>
        <div key='summary' className='summary'>Price: {price}</div>
        <div  key='filters' className='filters'>{filters}</div>
    </div>)
}

