//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {LensContext, LensProps} from "@phil-rice/lens";


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


export interface RootFilterData<T> {
    filterName: string,
    selected?: string,
    options: T []

}
export interface SimpleFilterData extends RootFilterData<string> {
}
export interface ImageFilterData extends RootFilterData<ImageFilterOption> {
}

export interface ImageFilterOption {
    name: string,
    img: string
}
export class CpqDomain {}
type CpqProps<T> = LensProps<CpqDomain, CpqData, T>

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

function displayIfPresent<T, Result>(context: LensContext<CpqDomain, CpqData, T>, fn: () => Result): Result | null {
    return context.json() ? fn() : null;
}


function RootFilter<T>({context}: CpqProps<RootFilterData<T>>, findDisplayTextFn: (option: any) => string) {
    let filterJson = context.json();
    const onChange = (event: any) => {context.focusOn('selected').setJson(event.target.value) };
    let options = context.json().options.map(o => (<option key={findDisplayTextFn(o)}>{findDisplayTextFn(o)}</option>))
    return displayIfPresent(context, () =>
        <select className='simpleFilter'
                value={filterJson.selected ? filterJson.selected : ''}
                key={context.json().filterName}
                id={context.json().filterName}
                onChange={onChange}>{options}</select>)
}

function ImagedDropDownFilter({context}: CpqProps<ImageFilterData>) {
    return RootFilter<ImageFilterOption>({context}, o => o.name)
}
function SimpleFilter({context}: CpqProps<SimpleFilterData>) {
    return RootFilter<string>({context}, s => s)
}
