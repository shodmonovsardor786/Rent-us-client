import React from 'react'
import './App.css'
import Header from './Components/Header/Header'
import Filter from './Components/Filter/Filter'
import Classifieds from './Components/Classifieds/Classifieds'
import NewClassified from './Components/NewClassified/NewClassified'
import Login from './Components/Login/Login'
import Create from './Components/Create/Create'
import Account from './Components/Account/Account'
import { Switch, Route } from 'react-router-dom'

function App() {
	return (
	<>
		<Switch>
			<Route path="/" exact>
				<Header/>
				<Filter/>
				<Classifieds/>
			</Route>
			
			<Route path="/account" exact>
				<Account/>
			</Route>

			<Route path="/login" exact>
				<Login/>
			</Route>

			<Route path="/create" exact>
				<Create/>
			</Route>

			<Route path="/new" exact>
				<NewClassified/>
			</Route>
		</Switch>
	</>
	)
}

export default App
