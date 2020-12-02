import React, { createContext, useState, useContext } from "react"

const FilterContext = createContext()

const ADDRESS = 'http://localhost:4000'

const FilterProvider = ({children}) => {

    const [state, setState] = useState()
    
    const value = {
        state, setState
    }
    
    return (
        <FilterContext.Provider value={value}>
            <FilterContext.Consumer>
                {
                    () => children
                }
            </FilterContext.Consumer>
        </FilterContext.Provider>
    )
}
const useFilter = (setterOnly) => {
    const {state, setState} = useContext(FilterContext)
    return setterOnly ? [setState] : [state, setState]
} 
    
export {
    FilterProvider, 
    useFilter,
    ADDRESS
}