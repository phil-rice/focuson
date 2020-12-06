import { CpqData, CpqProperties } from "../CpqDomain";
import { ComponentFromServer } from "@phil-rice/codeondemand";
import { Lens } from "@phil-rice/lens";

export function Cpq<Main>({context}: CpqProperties<Main, CpqData>) {
    const filters = context.json().filters.map((f, i) =>
        (<ComponentFromServer key={i} context={context.focusOn('filters').withChildLens(Lens.nth(i))} />))
    let price: string = context.json().price.toString()
    return (<div className='cpq'>
        <div key='summary' className='summary'>Price: {price}</div>
        <div key='filters' className='filters'>{filters}</div>
    </div>)
}

