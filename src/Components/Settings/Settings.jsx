import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { FiCamera } from 'react-icons/fi'
import { HiLogout } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ADDRESS } from '../Context'
import './Settings.css'

const Settings = () => {

    const [user, setUser] = useState({})
    const [username, setUsername] = useState()
    const [number, setNumber] = useState()
    const [password, setPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    
    const [usernameClass, setUsernameClass] = useState('change_input')
    const [numberClass, setNumberClass] = useState('change_input')
    const [passwordClass, setPasswordClass] = useState('change_input')
    const [newPasswordClass, setNewPasswordClass] = useState('change_input')

    const [verify, setVerify] = useState(false)
    const [verifyCode, setVerifyCode] = useState()
    const [verifyClass, setVerifyClass] = useState()

    useEffect(() => {
		;(async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Token': window.localStorage.getItem('access_token'),
            }
            const { data } = await axios.get(`${ADDRESS}/account/settings`, { headers })
			if(data.data === null)  {
				window.localStorage.removeItem('access_token')
				window.location.pathname = '/login'
			}
			else {
                setUser(data.data)
			}
		})()
    }, [])
    

    useEffect(() => {
        ;(async () => {
            setUsernameClass('change_input')
            if(username && username.length >= 4){
                const { data } = await axios.post(`${ADDRESS}/create`, {username: username.trim()})
                if(data.data) {
                    setUsernameClass('change_input success')
                }
                else {
                    setUsernameClass('change_input warning')
                }
            }
        })()
    }, [username])

     useEffect(() => {
        ;(async () => {
            setNumberClass('change_input')
            if(number && number.length > 9) {
                setNumberClass('change_input warning')
            }
            else if(number && number.length === 9){
                setNumberClass('')
                const { data } = await axios.post(`${ADDRESS}/create`, {number})
                if(data.data) {
                    setNumberClass('change_input success')
                }
                else {
                    setNumberClass('change_input warning')
                }
            }
        })()
    }, [number])
    
    useEffect(() => {
        ;(async () => {
            setPasswordClass('change_input')
            if (password && password.length >= 8) {
                const { data } = await axios.post(`${ADDRESS}/account/settings`, { password: password.trim() })
                if (data.data) {
                    setPasswordClass('change_input success')
                    setNewPasswordClass('change_input')
                    if(newPassword && newPassword.length > 7) {
                        setNewPasswordClass('chage_input')
                        const { data } = await axios.post(`${ADDRESS}/account/settings`, { password, newPassword: newPassword.trim() })
                        if(data.data) {
                            setNewPasswordClass('change_input success')
                        }
                    }
                    else {
                        setNewPasswordClass('change_input warning')
                    }
                }
                else {
                    setPasswordClass('change_input warning')
                }
            }
        })()
    }, [password, newPassword])

    useEffect(() => {
        ;(async () => {
            if(verifyCode &&  verifyCode.trim().length === 6) {
                const { data } = await axios.post(`${ADDRESS}/account/settings`, {verifyCode: verifyCode.trim()})
                if(data.data) {
                    setVerifyClass('success_v')
                }
                else {
                    setVerifyClass('warning')
                }
            }
        })()
    }, [verifyCode])

    function submit () {

        ;(async () => {
            if(usernameClass === 'change_input success') {
                const { data } = await axios.post(`${ADDRESS}/account/settings`, {button: true, username, id: user.user_id})
                if(data.data) {
                    setUser(data.data)
                    window.localStorage.setItem('access_token', data.access_token)
					window.location.reload()
                }
            }

            if(numberClass === 'change_input success') {
                const { data } = await axios.post(`${ADDRESS}/account/settings`, {button: true, number, id: user.user_id})
                if(data.data) {
                    setUser(data.data)
                    window.localStorage.setItem('access_token', data.access_token)
                    window.location.reload()
                }
            }

            if(passwordClass === 'change_input success' && newPasswordClass === 'change_input success') {
                const { data } = await axios.post(`${ADDRESS}/account/settings`, {button: true, password, newPassword, id: user.user_id})
                if(data.data) {
                    console.log(data);
                    setUser(data.data)
                    window.localStorage.setItem('access_token', data.access_token)
                    window.location.reload()
                }
            }
        })()
    }   

    function logout() {
        window.location.pathname = '/home'
        window.localStorage.removeItem('access_token')
    }

    function deleteAcc (a, b) {
        ;(async () => {
            if(a) {
                setVerify(true)
                await axios.post(`${ADDRESS}/account/settings`, {userDel: user})
            }
            if(b) {
                if(verifyClass === 'success_v') {
                    const { data } = await axios.post(`${ADDRESS}/account/settings`, {verifyCode, user})
                    if(data.data) {
                        setVerify(false)
                        window.localStorage.removeItem('access_token')
                        window.location.pathname = "/home"
                    }
                }
            }
        })()
    }

    return(
        <>
            <div className="settings">
                <div className="container">
                    <div className="card_setting">
                        <Link className="exit-account" to="/account"><HiLogout/></Link>
                        <div className="account_image">
                            {
                                user.user_path ?
                                <div className="have_img">
                                    <img src="http://picsum.photos/200/200" alt="account_img" width="200" height="200"/>
                                    <label htmlFor="file_input" className="upload">
                                        <span><FiCamera/></span>
                                    </label>
                                </div>
                                :
                                <div className="no_img">
                                    <span><FaUser/></span>
                                    <label htmlFor="file_input" className="upload">
                                        <span><FiCamera/></span>
                                    </label>
                                </div>
                            }
                            <input id="file_input" className="none" type="file"/>
                        </div>
                        <div className="user_info">
                            <div>
                                <p>{user.user_username}</p>
                                <input onKeyUp={e => setUsername(e.target.value)} className={usernameClass} type="text" placeholder="New username"/>
                            </div>
                            <div>
                                <p>{user.user_phone}</p>
                                <input onKeyUp={e => setNumber(e.target.value)} className={numberClass} type="number" placeholder="9* ABC AA BB"/>
                            </div>
                            <div>
                                <p>Your password</p>
                                <input onKeyUp={e => setPassword(e.target.value)} className={passwordClass} type="password" placeholder="Old password"/>
                            </div><div>
                                <p>New password</p>
                                <input onKeyUp={e => setNewPassword(e.target.value)} className={newPasswordClass} type="password" placeholder="New password"/>
                            </div>
                        </div>
                        <div className="buttons">
                            <button onClick={() => logout()} className="logout-btn">Log out</button>
                            <button onClick={() => deleteAcc(true, false)} className="delete_account">Delete account</button>
                            <button onClick={() => submit()} className="submit">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            {
                <div className={verify ? "verify_del" : "none"}>
                    <div className="del_content">
                        <span className="close_verify" onClick={() => setVerify(false)}><AiFillCloseCircle/></span>
                        <input className={verifyClass} onKeyUp={e => setVerifyCode(e.target.value)} type="number" placeholder="Code"/>
                        <button onClick={() => deleteAcc(false, true)} className="delete_account">Delete account</button>
                    </div>
                </div>
            }
        </>
    )
}

export default Settings