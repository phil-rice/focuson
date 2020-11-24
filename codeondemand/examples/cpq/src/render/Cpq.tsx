import {CpqData, CpqProperties} from "../CpqDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";
import {Lens} from "@phil-rice/lens";


function Cpq<Main>(props: CpqProperties<Main, CpqData>) {
    const filters = props.context.json().filters.map((f, i) =>
        (<ComponentFromServer context={props.context.focusOn('filters').withChildLens(Lens.nth(i))}/>))

    return (<div className='cpq'>{filters}</div>)
}
