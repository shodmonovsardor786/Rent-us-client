import React, { useEffect, useState } from 'react'
import './Login.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaTimesCircle, FaSignInAlt } from 'react-icons/fa'
import { ADDRESS } from '../Context'

const Login = () => {

	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ button, setButton ] = useState({disabled: true, click: false})
	const [ message, setMessage ] = useState()
		
	useEffect(() => {
		const token = window.localStorage.getItem('access_token')
		if(token) {
			window.location.pathname = '/'
		}
	}, [])

	useEffect(() => {
		;(async () => {
			if(username.length > 3 && password.length > 5) {
				setButton({disabled: false})
			}
			if(button.click) {
				const { data } = await axios.post(`${ADDRESS}/login`, {username, password})
				setMessage(data.message)
				if(data.access_token) {
					window.localStorage.setItem('access_token', data.access_token)
					setTimeout(() => {  window.location.pathname = '/account'   })
				}
				setTimeout(() => setMessage(''), 2000)
			}
		})()
	}, [button.click, setButton, username, password, setMessage])
		
	function buttonClick(e) {
		e.preventDefault()
		return setButton({disabled: false, click: true})
	}

	return (
		<>
			<Link className="exit" to="/"><FaTimesCircle/></Link>
			<div className="login_container">
				<form className="login_form">
					<h1>Sign In</h1>
					<label htmlFor="username">Username</label>
					<input onKeyUp={e => {setUsername(e.target.value)}} id="username" type="email" autoComplete="false" placeholder="Username" required/>
					<label htmlFor="password">Password</label>
					<input onKeyUp={e => {setPassword(e.target.value)}} id="password" type="password" autoComplete="false" placeholder="Password" required/>
					<p className="message">{message}</p>
					<Link to="/create" className="create">Sign Up</Link>
					<button disabled={button.disabled} onClick={e => buttonClick(e)} className="login"><p>Login</p><FaSignInAlt/></button>
				</form>
			</div>
		</>
	)
}

export default Login