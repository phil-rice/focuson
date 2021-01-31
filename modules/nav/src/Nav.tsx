//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
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
