import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaTimesCircle, FaUserPlus } from 'react-icons/fa'
import axios from 'axios'
import './Create.css'
import Tilt from 'react-vanilla-tilt'
import { ADDRESS } from '../Context'

const Create = () => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ verify, setVerify ] = useState('')
    const [ button, setButton ] = useState({disabled: true, click: false})
    const [ message, setMessage ] = useState()

    const [ classEmail, setClassEmail ] = useState('')
    const [ classUsername, setClassUsername ] = useState('')
    const [ classPassword, setClassPassword ] = useState('')
    const [ classNumber, setClassNumber ] = useState('')
    const [ classVerify, setClassVerify ] = useState('')

    useEffect(() => {
        const token = window.localStorage.getItem('access_token')
        if(token) {
            window.location.pathname = '/'
        }
    }, [])

    useEffect(() => {
        ;(async () => {
            if(username && username.length < 5) {
                setClassUsername('warning')
                setMessage('Username must be greater than 5')
                setTimeout(() => setMessage(''), 2000)
            }
            else if(username && username.length > 5){
                setClassUsername('')
                const { data } = await axios.post(`${ADDRESS}/create`, {username: username.trim()})
                if(data.data) {
                    setClassUsername('success')
                }
                else {
                    setMessage('Username has already declared')
                    setClassUsername('warning')
                    setTimeout(() => setMessage(''), 2000)
                }
            }
        })()
    }, [username])

    useEffect(() => {
        ;(async () => {
            setClassPassword('')
            if(password && password.length < 8) {
                setClassPassword('warning')
                setMessage('Password must be greater than 8')
                setTimeout(() => setMessage(''), 2000)
            }
            else if (password && password.length >= 8) {
                setClassPassword('success')
            }
        })()
    }, [password])

    useEffect(() => {
        ;(async () => {
            setClassEmail('')
            if(email && email.length >= 12) {
                const stringArray = email.split('')
                const dog = stringArray.find(i => i === '@')
                const fulstap = stringArray.find(i => i === '.')
                if(dog && fulstap) {
                    setClassEmail('')
                    const { data } = await axios.post(`${ADDRESS}/create`, { email })
                    if(data.data) {
                        setClassEmail('success')
                    }
                    else {
                        setMessage('This email already in use by another account')
                        setClassEmail('warning')
                        setTimeout(() => setMessage(''), 2000)
                    }
                }
                else {
                    setClassEmail('warning')
                    setMessage('Invalid email')
                    setTimeout(() => setMessage(''), 2000)
                }
            }
        })()
    }, [email])

    useEffect(() => {
        ;(async () => {
            setClassNumber('')
            if(number && number.length > 9 && number.length < 9) {
                setClassNumber('warning')
                setMessage('Only AB AAA BB CC')
                setTimeout(() => setMessage(''), 2000)
            }
            else if(number && number.length === 9){
                setClassNumber('')
                const { data } = await axios.post(`${ADDRESS}/create`, {number})
                if(data.data) {
                    setClassNumber('success')
                }
                else {
                    setMessage('This phone number already in use by another account')
                    setClassNumber('warning')
                    setTimeout(() => setMessage(''), 2000)
                }
            }
        })()
    }, [number])
    
    useEffect(() => {
        ;(async () => {
            if(classUsername === 'success' && classPassword === 'success' && classEmail === 'success' && classNumber === 'success') {
                const { data } = await axios.post(`${ADDRESS}/create`, { 
                    username: username.trim(), 
                    password: password.trim(), 
                    email: email.trim(), 
                    number: number.trim() 
                })
                setMessage(data.message)
            }
        })()
    }, [classUsername, classPassword, classEmail, classNumber, username, password, email, number, setMessage])
    
    useEffect(() => {
        ;(async () => {
            if(classUsername === 'success' && classPassword === 'success' && classEmail === 'success' && classNumber === 'success') {
                setClassVerify('')
                setButton({disabled: true})
                if(verify.length === 6) {
                    const { data } = await axios.post(`${ADDRESS}/create`, { 
                        verify: verify.trim()
                    })
                    if(data.data) {
                        setClassVerify('success')
                        setMessage(data.message)
                        setTimeout(() => setMessage(''), 1000);
                        setButton({disabled: false})
                    }
                    else {
                        setButton({disabled: true})
                        setClassVerify('warning')
                        setMessage('Wrong code')
                    }
                }
            }
        })()
    }, [classUsername, classPassword, classEmail, classNumber, username, password, email, number, verify, setMessage])

    useEffect(() => {
        ;(async () => {
            if(button.click) {
                if(classUsername === 'success' && classPassword === 'success' && classEmail === 'success' && classNumber === 'success') {
                    const { data } = await axios.post(`${ADDRESS}/create`, {
                        button: true,
                        username: username.trim(),
                        password: password.trim(),
                        number: number.trim(),
                        email: email.trim(),
                        verify: verify.trim()
                    })
                    console.log(data)
                }
            }
        })()
    }, [button.click, classUsername, classPassword, classEmail, classNumber, username, password, number, email, verify])

    function buttonClick(e) {
        e.preventDefault()
        return setButton({disabled: true, click: true})
    }

    return (
        <>
            <Link className="exit" to="/"><FaTimesCircle/></Link>
            <div className="create_container">
                <form>
                    <Tilt id="tilt">
                        <h1>Sign Up</h1>

                        <label htmlFor="username">Username</label>
                        <input className={classUsername} onKeyUp={e => {setUsername(e.target.value)}} id="username" type="text" autoComplete="false" placeholder="Username" minLength="3" required/>


                        <label htmlFor="password">Password</label>
                        <input className={classPassword} onKeyUp={e => {setPassword(e.target.value)}} id="password" type="password" autoComplete="false" placeholder="Password" minLength="6" required/>

                        <label htmlFor="number">Phone number (AB AAA BB CC)</label>
                        <input className={classNumber} onKeyUp={e => {setNumber(e.target.value)}} id="number" type="number" autoComplete="false" placeholder="Phone number" minLength="9" maxLength="9" required/>

                        <label htmlFor="email">Email</label>
                        <input className={classEmail} onKeyUp={e => {setEmail(e.target.value)}} id="email" type="mail" placeholder="Email"/>

                        <label htmlFor="verify">Verify code</label>
                        <input className={classVerify} onKeyUp={e => {setVerify(e.target.value)}} id="verify" type="number" autoComplete="false" placeholder="Verify code" required/>

                        <p className="message">{message}</p>

                        <Link className="loginLink" to="/login">Sign In</Link>
                        <button disabled={button.disabled} onClick={e => buttonClick(e)} className="createBtn"><p>Create</p><FaUserPlus/></button>
                    </Tilt>
                </form>
            </div>
        </>
    )
}

export default Create