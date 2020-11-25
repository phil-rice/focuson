import {LensProps} from "@phil-rice/lens";


export interface CpqData {
    make: MakeSelection,
    model: ModelSelection,
    upholstery: UpholsterySelection,
    externalPaint: PaintSelection,
    leasePeriod: LeasePeriod
}

export interface Selection {
    selected?: string,
    options: string []
}
type MakeSelection = Selection
type ModelSelection = Selection
type UpholsterySelection = Selection
type PaintSelection = Selection
type LeasePeriod = Selection

export let sampleCpq: CpqData = {
    make: {selected: "Audi", options: ["Tesla", "Audi"]},
    model: {options: ["Tesla", "Audi"]},
    upholstery: {options: ["Cotton", "Leather"]},
    externalPaint: {selected: "White", options: ["White", "Black"]},
    leasePeriod: {options: ["12m", "24m"]}
}
export class CpqDomain {}
type CpqProps<T> = LensProps<CpqDomain, CpqData, T>

function Cpq(props: CpqProps<CpqData>) {
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

function SimpleFilter(props: CpqProps<Selection>) {
    let filterJson = props.context.json();
    const onChange = (event: any) => {props.context.focusOn('selected').setJson(event.target.value) };
    let options = props.context.json().options.map(o => o == filterJson.selected ? (<option selected>{o}</option>) : (<option>{o}</option>))
    return (<select className='simpleFilter' onchange={onChange}>{options}</select>)
}

