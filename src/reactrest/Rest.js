import React from 'react';

/** This is the component that the client should directly use.
 *
 * It renders itself from the react-rest media type compliant json that it is given
 *
 * */

export const RestContext = React.createContext();

export function Rest({children}) {
    const value = {} // The value will hold the state and the functions for the children.
    return (<RestContext.Provider value={value}>{children}</RestContext.Provider>)
}

