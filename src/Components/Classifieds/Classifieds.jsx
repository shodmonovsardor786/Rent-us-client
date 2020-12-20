import React, {useState, useEffect } from 'react'
import './Classifieds.css'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useFilter } from '../Context'
import { ADDRESS } from '../Context'
import { FaComment, FaEye, FaPaperPlane, FaUser, FaPlus } from 'react-icons/fa'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

const Classifieds = () => {

	const [ link, setLink] = useState("/account")
	const [ linkNew, setLinkNew] = useState("/new")

	const [	state, filter] = useFilter()
	const [classifiedsClass, setClassifiedsClass] = useState('classifieds_list');
	const [	classifieds, setClassifieds] = useState({data: [], loading: false, modal: null, comments: null})
	const [	closedModal, setCloseModal] = useState(false)
	const [	closedCommentsModal, setCloseCommentsModal] = useState(false)
	const [ commentInput, setCommentInput] = useState(false)
	const [ newComment, setNewComment] = useState('')
	const [ commentInputBtn, setCommentInputBtn] = useState(false)
	const [ orderBtn, setOrderBtn ] = useState(false)
	
    useEffect(() => {
		;(async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Token': window.localStorage.getItem('access_token'),
			}
			const { data } = await axios.get(`${ADDRESS}/new`, { headers })
			if(data.data === null)  {
				window.localStorage.removeItem('access_token')
				setLink("/login")
				setLinkNew("/login")
			}
			else {
				setCommentInput(true)
			}
		})()
    }, [setLink])

	useEffect(() => {
		;(async () => {
			if(filter) {
				if(window.innerWidth > 900) {
					setClassifiedsClass('classifieds_list classifieds_list--wd')
				}
			}
			else {
				setClassifiedsClass('classifieds_list')
			}
		})()
	}, [filter])

	useEffect(() => {
		;(async () => {
			if(state) {
				const { data } = await axios.get(`${ADDRESS}`)
				if(data.images) {
					const img = data.images.filter(img => state.data.find(cls => cls.classified_id === img.classified_id))
					setClassifieds({data: state.data, loading: false, images: img}) 
				}
				else {
					setClassifieds({data: state.data, loading: false, images: null}) 
				}
			}
		})()
	}, [state])

	useEffect(() => {
		
		;(async () => {
			if(commentInputBtn.id && newComment && newComment.length >= 1 && commentInputBtn.click) {
				const headers = {
					'Content-Type': 'application/json',
					'Token': window.localStorage.getItem('access_token'),
				}
				const { data } = await axios.post(`${ADDRESS}`, { newComment: newComment.trim(), id: commentInputBtn.id}, { headers })				
				if(data) {
					setCommentInputBtn({click: false, id: 0})
					setCloseCommentsModal(true)
					setNewComment('')
				}
			}
		})()
	}, [commentInputBtn, newComment])

	function buttonClick(e, id) {
		e.preventDefault() 
		setCommentInputBtn({click: true, id: id})
	}

	function showInput (commentInput) {
		if(commentInput) {
			return "add__comment"
		}
		else {
			return "none"
		}
	}

	function openModal(index) {
		;(async () => {
			const { data } = await axios.post(`${ADDRESS}`, { index })
			if(data.images.length > 0 ) {
				setClassifieds({data: classifieds.data, modal: data.classified, modalImg: data.images, images: classifieds.images})
			}
			else {
				setClassifieds({data: classifieds.data, modal: data.classified, modalImg: null, images: classifieds.images})
			}
			setCloseModal(false)
		})()
	}
	
	function modalActive(index) {
		if(index) {
			return closedModal ? "none" : "classified_modal"
		}
	}

	function closeModal(e) {
		if(e.target.className === "classified_modal") setCloseModal(true)
	}

	function openModalComments(index) {
		;(async () => {
			const { data } = await axios.post(`${ADDRESS}`, {index})
			setClassifieds({data: classifieds.data, modal: classifieds.modal, comments: data.comments, commentIndex: index, images: classifieds.images})
			setCloseCommentsModal(false)
		})()
	}

	function commentsModalActive(index) {
		if (index) {
			return closedCommentsModal ? "none" : "classified_comments__modal"
		}
	}

	function closeCommentsModal(e) {
		if(e.target.className === "classified_comments__modal") setCloseCommentsModal(true)
	}


	function order(orderId) {
		;(async () => {
			setOrderBtn(true)
			const orderToken = window.localStorage.getItem('access_token')
			if(orderToken) {
				const { data } = await axios.post(`${ADDRESS}`, { orderId, orderToken })
				if(data.data) {
					alert('They will call you')
					setCloseModal(true)
					setTimeout(() => {
						setOrderBtn(false)
					}, 60000)
				}
				if(data.data === null)  {
					window.location.pathname = '/login'
					window.localStorage.removeItem('access_token')
				}
			}
			else {
				window.location.pathname = '/login'
				window.localStorage.removeItem('access_token')
			}
		})()
	}

  return (
    <>
    {  classifieds.data.length === 0 ? <p className="empty-classified">Empty</p> : null } 
	<div className="links">
		<Link to={link} className="account"><FaUser/></Link>
		<Link to={linkNew} className="add"><FaPlus/></Link>
	</div>

	<ul className={classifiedsClass}>
		{
			classifieds.data.length > 0 ? classifieds.data.map((cls) => (
				<li className="classified_item" key={cls.classified_id}>
					<div className="classified_main">
							<div className="img-wrapper">
								{	
									classifieds.images && classifieds.images.map(img => (
										img.classified_id === cls.classified_id &&
											<img key={img.image_id} src={`${ADDRESS}/images/` + img.image_path} alt="classified_image" height="300"/>
										))
								}
							</div>
							<div className="classified_info">
								<div className="classified_header">
									<h1 className="classified_title">{cls.classified_title}</h1>
									<p className="classified_price">{cls.classified_price} $</p>
								</div>
								<div className="classified_mini-info">
									<p>Rooms: {cls.classified_room > 6 ? 'more than 6' : cls.classified_room}</p>
									<p>Type: {cls.classified_type === 1 ? "House" : "Apertmant"}</p>
									<p>Square: {cls.classified_square}</p>
								</div>
								<p className="classified_addres">{cls.classified_addres}</p>
								<div className="classified_footer">
									<p className="classified_time">{moment(cls.created_at).fromNow()}</p>
									<p className="classified_comments" onClick={() => {openModalComments(cls.classified_id)}}><FaComment/></p>
									<p className="classified_view" onClick={() => {openModal(cls.classified_id)}}><FaEye/></p>
								</div>
							</div>
						</div>
			</li>
		))
		:
		<li className="logo-div">
			<div className="div">
				<img src="https://www.zg66.ru/media/com_jbusinessdirectory/pictures/companies/555/vebinarysmarthome-1536063127.png" alt="img" width="250" height="250"/>
				<p className="rent">Rent House</p>
			</div>
			<div className={window.innerWidth > 900 ? 'info': 'none'}>Welcome to our "Rent house" platform. Here you can find the house you need to rent. Use the filter on the left. On the right is a button to place your account and a new ad.</div>
			<div  className={window.innerWidth < 900 ? 'info': 'none'}>Welcome to our "Rent house" platform. Here you can find the house you need to rent. Use the filter on the menu. On the bottom is a button to place your account and a new ad.</div>
		</li>
		}

	</ul>
	{
		classifieds.comments &&
		<div className={commentsModalActive(classifieds.commentIndex)} onClick={closeCommentsModal}>
			<div className="comments">
				<div className={showInput(commentInput)}>
					<input onKeyUp={e => setNewComment(e.target.value)} defaultValue={''} className="comment_input" type="text" placeholder="your comment..."/>
					<button onClick={e => buttonClick(e, classifieds.commentIndex)} className="comment_input--btn"><FaPaperPlane/></button>
				</div>
				<p className={commentInput ? "none" : "comments_text"}>Comments</p>
				<ul className="comments_list">
					{ 
						classifieds.comments.length ? classifieds.comments.map(c => (
							<li className="comments_item" key={c.comment_id}>
								<p className="user_username">{c.user_username}</p>
								<p>{c.comment_body}</p>
							</li>
							))
							: <li className="no_comment">No comment yet</li>
						}
					<button className="comments_close" onClick={() => setCloseCommentsModal(closedCommentsModal => !(closedCommentsModal))}>Cancel</button>
				</ul>
			</div>
		</div>
	}

	{
		classifieds.modal &&
		<div key={classifieds.modal.classified_id} className={modalActive(classifieds.modal.classified_id)} onClick={closeModal}>
			<div className="classified_content__modal">
				<div className="modal_wrapper">
					<div className="modal_img">
						{	
						classifieds.modalImg ?
							<Slide scale={0.1}>
								{
									classifieds.modalImg.map(img => (
										<img key={img.image_id} src={`${ADDRESS}/images/` + img.image_path} alt="classified_image" height="300"/>
									))
								}
							</Slide>
							:
							<img src='http://placehold.it/500/500' alt="classified_image" height="300"/>
						}
					</div>
					<div className="modal_info--wrapper">
						<div className="modal_header">
							<h1 className="modal_title">{classifieds.modal.classified_title}</h1>
							<p className="modal_price">{classifieds.modal.classified_price} $</p>
						</div>
						<div className="modal_info">
							<p>Region: {classifieds.modal.region_name}</p>
							<p>District: {classifieds.modal.district_name}</p>
							<p>Rooms: {classifieds.modal.classified_room > 6 ? 'more than 6' : classifieds.modal.classified_room}</p>
							<p>Type: {classifieds.modal.classified_type === 1 ? "House" : "Apertmant"}</p>
							<p>Square: {classifieds.modal.classified_square}</p>
							<p>Addres: {classifieds.modal.classified_addres}</p>
						</div>
						<div className="modal_body">
							<p>{classifieds.modal.classified_body}</p>
						</div>
						<div className="modal_footer">
							<button disabled={orderBtn} className="modal_order" onClick={e => order(classifieds.modal.classified_id)}>Order</button>
							<button className="modal_cancel" onClick={() => setCloseModal(closedModal => !(closedModal))}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
    </>
  )
}

export default Classifieds