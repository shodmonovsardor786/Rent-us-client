import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ADDRESS } from '../Context'
import './Menu.css'
import { Link } from 'react-router-dom'
import { FaHome, FaUserCircle } from 'react-icons/fa'
import { FiPlusCircle } from 'react-icons/fi'
import { HiMenuAlt1 } from 'react-icons/hi'
import { useFilter } from '../Context'

const Menu = () => {

	const [ filter, setFilter] = useFilter(true, true)
	
	const [account, setAccount] = useState('/account')
	const [newAdd, setNewAdd] = useState('/new')

	useEffect(() => {
		;(async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Token': window.localStorage.getItem('access_token'),
			}
			const { data } = await axios.get(`${ADDRESS}/account`, { headers })
			if(data.data === null)  {
				window.localStorage.removeItem('access_token')
				setAccount('/login')
				setNewAdd('/login')
			}
		})()
	}, [])

	return (
		<>
		<div className="menu">
			<div className="container">
				<Link to="/" onClick={() => setFilter(!filter)} className="link"><HiMenuAlt1/></Link>
				<Link className="link" to="/"><FaHome/></Link>
				<Link className="link" to={account}><FaUserCircle/></Link>
				<Link className="link" to={newAdd}><FiPlusCircle/></Link>
			</div>
		</div>
			
		</>
	)
}

export default Menu