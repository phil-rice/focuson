import {LensProps} from "@phil-rice/lens";


export interface CpqData {
    make: MakeSelection,
    model: ModelSelection,
    upholstery: UpholsterySelection,
    externalPaint: PaintSelection,
    leasePeriod: LeasePeriod
}
type MakeSelection = SimpleFilterData
type ModelSelection = SimpleFilterData
type UpholsterySelection = SimpleFilterData
type PaintSelection = SimpleFilterData
type LeasePeriod = SimpleFilterData

export interface SimpleFilterData {
    filterName: string,
    selected?: string,
    options: string []
}

export class CpqDomain {}
type CpqProps<T> = LensProps<CpqDomain, CpqData, T>

export function Cpq(props: CpqProps<CpqData>) {
    return (
        <div className='cpq'>
            <div className='two'>
            <SimpleFilter context={props.context.focusOn('make')}/>
            <SimpleFilter context={props.context.focusOn('model')}/>
            <SimpleFilter context={props.context.focusOn('upholstery')}/>
            <SimpleFilter context={props.context.focusOn('externalPaint')}/>
            <SimpleFilter context={props.context.focusOn('leasePeriod')}/>
        </div></div>
    )
}

function SimpleFilter(props: CpqProps<SimpleFilterData>) {
    let filterJson = props.context.json();
    // console.log("SimpleFilter", filterJson, filterJson.filterName)
    const onChange = (event: any) => {props.context.focusOn('selected').setJson(event.target.value) };
    let options = props.context.json().options.map(o => (<option key={o}>{o}</option>))

    return (<select className='simpleFilter'
                    value={filterJson.selected ? filterJson.selected : ''}
                    key={props.context.json().filterName}
                    id={props.context.json().filterName}
                    onChange={onChange}>{options}</select>)
}

