import {LensProps} from "@phil-rice/lens";


export interface CpqData {
    make: MakeSelection,
    model: ModelSelection,
    upholstery: UpholsterySelection,
    externalPaint: PaintSelection,
    leasePeriod: LeasePeriod
}

export interface SimpleFilterData {
    selected?: string,
    options: string []
}
type MakeSelection = SimpleFilterData
type ModelSelection = SimpleFilterData
type UpholsterySelection = SimpleFilterData
type PaintSelection = SimpleFilterData
type LeasePeriod = SimpleFilterData

export let sampleCpq: CpqData = {
    make: {selected: "Audi", options: ["Tesla", "Audi"]},
    model: {options: ["Tesla", "Audi"]},
    upholstery: {options: ["Cotton", "Leather"]},
    externalPaint: {selected: "White", options: ["White", "Black"]},
    leasePeriod: {options: ["12m", "24m"]}
}
export class CpqDomain {}
type CpqProps<T> = LensProps<CpqDomain, CpqData, T>

export function Cpq(props: CpqProps<CpqData>) {
    return (
        <div>
            <SimpleFilter context={props.context.focusOn('make')}/>
            <SimpleFilter context={props.context.focusOn('model')}/>
            <SimpleFilter context={props.context.focusOn('upholstery')}/>
            <SimpleFilter context={props.context.focusOn('externalPaint')}/>
            <SimpleFilter context={props.context.focusOn('leasePeriod')}/>
        </div>
    )
}

function SimpleFilter(props: CpqProps<SimpleFilterData>) {
    let filterJson = props.context.json();
    console.log("SimpleFilter", props.context.main, filterJson)
    const onChange = (event: any) => {props.context.focusOn('selected').setJson(event.target.value) };
    let options = props.context.json().options.map(o => (<option key={o}>{o}</option>))
    return (<select value={filterJson.selected?filterJson.selected:''} className='simpleFilter' key={props.context.lens.description} id={props.context.lens.description} onChange={onChange}>{options}</select>)
}

