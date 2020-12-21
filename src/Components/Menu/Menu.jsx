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
	const [classname, setClass] = useState()
	const [userImg, setUserImg] = useState(false)

	useEffect(() => {
		;(async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Token': window.localStorage.getItem('access_token'),
			}
			const { data } = await axios.get(`${ADDRESS}/new`, { headers })
			if(data.data === null)  {
				window.localStorage.removeItem('access_token')
				setAccount('/login')
				setNewAdd('/login')
			}
			else {
				setUserImg(data.data.user_path)
			}
		})()
	}, [])
	

	useEffect(() => {
		if(window.location.pathname === '/home') {
			setClass(true)
		}
		else {
			setClass(false)
		}
	}, [])

	return (
		<>
		<div className="menu">
			<div className="container">
				<Link to="/home" onClick={() => setFilter(!filter)} className={classname ? 'link' : 'none'}><HiMenuAlt1/></Link>
				<Link className={classname ? 'none' : 'link'} onClick={() => setFilter(true)} to="/home"><FaHome/></Link>
				{
					userImg ?
					<Link className="link" to={account}>
						<img src={`${ADDRESS}/images/` + userImg} alt="account_img" width="30" height="30"/>
					</Link>
					:
					<Link className="link" to={account}><FaUserCircle/></Link>
				}
				<Link className="link" to={newAdd}><FiPlusCircle/></Link>
			</div>
		</div>
			
		</>
	)
}

export default Menu