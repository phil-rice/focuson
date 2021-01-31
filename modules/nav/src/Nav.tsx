export interface NavProps<Data> {
    "jsonFiles": string[],
    fetch: (url: string) => Promise<Data>
    setData: (data: Data) => void
}

export function Nav<Data>({jsonFiles, fetch, setData}: NavProps<Data>) {
    const onClick = (url: string) => () => fetch(url).then(data => setData(data))
    let group = jsonFiles.map(url =>
        (<li className='navitem' key={url} onClick={onClick(url)}>{url}</li>))
    return (<ul className='nav'>{group}</ul>)
}
