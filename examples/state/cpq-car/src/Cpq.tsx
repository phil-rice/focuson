//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {LensProps} from "@phil-rice/state";


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


type CpqProps<T> = LensProps< CpqData, T>

export function Cpq({context}: CpqProps<CpqData>) {
    return (
        <div className='cpq'>
            <div className='two'>
                <SimpleFilter context={context.focusOn('make')}/>
                <SimpleFilter context={context.focusOn('model')}/>
                <SimpleFilter context={context.focusOn('upholstery')}/>
                <SimpleFilter context={context.focusOn('externalPaint')}/>
                <SimpleFilter context={context.focusOn('leasePeriod')}/>
            </div>
        </div>
    )
}

function SimpleFilter({context}: CpqProps<SimpleFilterData>) {
    let filterJson = context.json();
    // console.log("SimpleFilter", filterJson, filterJson.filterName)
    const onChange = (event: any) => {context.focusOn('selected').setJson(event.target.value) };
    let options = context.json().options.map(o => (<option key={o}>{o}</option>))
    if (filterJson === undefined)
        return null;
    else
        return (<select className='simpleFilter'
                        value={filterJson.selected ? filterJson.selected : ''}
                        key={context.json().filterName}
                        id={context.json().filterName}
                        onChange={onChange}>{options}</select>)
}

