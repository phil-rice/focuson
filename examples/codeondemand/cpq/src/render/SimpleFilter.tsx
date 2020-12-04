import React from "react";
import { CpqProperties, CqpFilter } from "../CpqDomain";



export function SimpleFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value) };
    let filterJson = props.context.json();
    let options = filterJson.legalValues.map(o => (<option key={o}>{o}</option>))
    return (<div className="simpleFilterContainer"><select className='simpleFilter'
        value={filterJson.selected ? filterJson.selected : ''}
        key={props.context.json().filterName}
        id={props.context.json().filterName}
        onChange={onChange}>{options}</select></div>);

}
