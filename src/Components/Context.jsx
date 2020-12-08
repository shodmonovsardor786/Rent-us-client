import React, { createContext, useState, useContext } from "react"

const FilterContext = createContext()

//                 port ozgarmidi 4000
const ADDRESS = 'http://localhost:4000'

const FilterProvider = ({children}) => {

    const [state, setState] = useState()
    const [filter, setFilter] = useState(false)

    
    const value = {
        state, setState,
        filter, setFilter
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
    const {state, setState, filter, setFilter} = useContext(FilterContext)
    return setterOnly ? [setState, filter, setFilter] : [state, filter]
} 
    
export {
    FilterProvider, 
    useFilter,
    ADDRESS
}