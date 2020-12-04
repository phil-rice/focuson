import React from "react";
import { CpqProperties, CqpFilter } from "../CpqDomain";
import { Lens } from "@phil-rice/lens";


export function SimpleFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    let context = props.context;
    const onChange = (event: any) => context.focusOn('selected').setJson(event.target.value);
    let filterJson = props.context.json();
    let options = filterJson.legalValues.map(o => (<option key={o}>{o}</option>))
    return (<div className="simpleFilterContainer"><select className='simpleFilter'
        value={filterJson.selected ? filterJson.selected : ''}
        key={props.context.json().filterName}
        id={props.context.json().filterName}
        onChange={onChange}>{options}</select></div>);

}
