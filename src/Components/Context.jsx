import React, { createContext, useState, useContext } from "react"

const FilterContext = createContext()

//                 port ozgarmidi 4000
// const ADDRESS = 'https://rent-house-server.herokuapp.com/'
const ADDRESS = 'https://192.168.1.149:4000'

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
const useFilter = (setterOnly, second) => {
    const {state, setState, filter, setFilter} = useContext(FilterContext)
    return second ? [filter, setFilter] : setterOnly ? [setState, filter, setFilter] : [state, filter]
} 
    
export {
    FilterProvider, 
    useFilter,
    ADDRESS
}