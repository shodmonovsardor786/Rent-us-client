import React , { useEffect, useState } from 'react'
import './Account.css'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { FaComment, FaFileUpload, FaTrashAlt, FaEye } from 'react-icons/fa'
import { BsPlus } from 'react-icons/bs';
import { HiLogout } from 'react-icons/hi';
import {  } from 'react-icons/gr';
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import { ADDRESS } from '../Context'

const Account = () => {
	
	const [title, setTitle] = useState('')
	const [price, setPrice] = useState('')
	const [regions, setRegion] = useState({data: [], value: ''})
	const [districts, setDistrict] = useState({data: [], value: ''})
	const [room, setRoom ] = useState({data: [1, 2, 3, 4, 5, 6, 7], value: ''})
	const [type, setType ] = useState('')
	const [square, setSquare ] = useState('')
	const [addres, setAddres ] = useState('')
	const [body, setBody ] = useState('')
	const [editBtn, setEditBtn] = useState(false)
	const [classifieds, setClassifieds] = useState({ data: [], comments: null, modal: null, images: [], modalImages: false})
	const [closedModal, setCloseModal] = useState(false)

	const [closedCommentsModal, setCloseCommentsModal] = useState(false)

	const [closeImagesModal, setCloseImagesModal] = useState(false);
	
	function logout(e) {
		if(e) {
			window.localStorage.removeItem('access_token')
			window.location.pathname = '/'
		}
	}


    useEffect(() => {
		;(async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Token': window.localStorage.getItem('access_token'),
			}
			const { data } = await axios.get(`${ADDRESS}/account`, { headers })
			if(data.data === null)  {
				window.localStorage.removeItem('access_token')
				window.location.pathname = '/login'
			}
			else {
				const img = data.images.filter(img => data.data.find(cls => cls.classified_id === img.classified_id))
				setClassifieds({data: data.data, images: img})
			}
		})()
	}, [])

	useEffect(() => {
		if(title) {
			console.log(title)
		}
		if(price) {
			console.log(price)
		}
		if(regions.value) {
			console.log(regions.value)
		}
		if(districts.value) {
			console.log(districts.value)
		}
		if(room.value) {
			console.log(room.value)
		}
		if(type) {
			console.log(type)
		}
		if(square) {
			console.log(square)
		}
		if(addres) {
			console.log(addres)
		}
		if(body) {
			console.log(body)
		}
	}, [title, price, regions.value, districts.value, room.value, type, square, addres, body, editBtn])

	useEffect(() => {
		;(async () => {
			if(regions.value > 0) {
				const { data } = await axios.post('http://localhost:4000', {region: regions.value})
				setDistrict({data: data.districts})
			}
		})()
	}, [regions.value])

	// function openModal(index) {
	// 	;(async () => {
	// 		const { data } = await axios.post('http://localhost:4000', {index})
	// 		setClassifieds({data: classifieds.data, modal: data.classified})
	// 		setCloseModal(false)
	// 	})()
	// }
	
	function imagesModal(index) {
			;(async () => {
			const { data } = await axios.post(`${ADDRESS}`, {index})
				if(data.images) {
					setClassifieds({data: classifieds.data, modal: classifieds.modal, images: classifieds.images, modalImages: data.images})
				}
				setCloseImagesModal(false)
			})()
	}

	function imageModalActive(index) {
		if(index) {
			return closeImagesModal ? 'none' : 'images_modal'
		}
		
	}

	function closeImages(e) {
		if(e.target.className === 'images_modal') setCloseImagesModal(true)
	}

	function modalActive(index) {
		if(index) {
			return closedModal ? "none" : "editModal"
		}
	}

	function closeModal(e) {
		if(e.target.className === "editModal") setCloseModal(true)
	}

	function openModalComments(index) {
		;(async () => {
			const { data } = await axios.post(`${ADDRESS}`, {index})
			setClassifieds({data: classifieds.data, comments: data.comments, commentIndex: index, images: classifieds.images})
			setCloseCommentsModal(false)
		})()
	}

	function commentsModalActive(index) {
		if (index) {
			return closedCommentsModal ? "none" : "openComments"
		}
	}

	function closeCommentsModal(e) {
		if(e.target.className === "openComments") setCloseCommentsModal(true)
	}

	function deleteFn(deleteId) {
		;(async () => {
			const yes = prompt('Are you sure', 'YES')
			if(yes === 'YES') {
				const { data } = await axios.post(`${ADDRESS}/account`, { deleteId })
				if(data) {
					window.location.reload()
					alert('Classified has deleted')
				}
			}
			else {
				alert('If you delete this classified write "YES" ')
			}
		})()
	}
	
    return (
        <>
		<div className="header">
			<Link className="exitAccount" to="/"><HiLogout/></Link>
			<h1 className="title">My Classifieds</h1>		
			<button onClick={e => logout(e)} className="logout">Log Out</button>
			<Link className="new" to="/new"><BsPlus/></Link>
		</div>

		<ul className="my_classifieds_list">
			{
				classifieds.data.length > 0 ? classifieds.data.map((cls) => (
					<li className="my_classified_item" key={cls.classified_id}>
							<div className="my_classified_main">
								<div className="my_img-wrapper">
										{
											classifieds.images && classifieds.images.map(img => (
												img.classified_id === cls.classified_id &&
												<img key={img.image_id} src={`${ADDRESS}/images/` + img.image_path} alt="classified_image" width="300" height="250"/>
											))
										}
										<div onClick={e => imagesModal(cls.classified_id)}>
											<span className="eye"><FaEye/></span>
										</div>
								</div>
								<div className="my_classified_info">
									<div className="my_cls_header">
										<h1 className="my_classified_title">{cls.classified_title}</h1>
										<p className="my_classified_price">{cls.classified_price}$</p>
									</div>
									<div className="my_classified-info">
										<p>Region: {cls.region_name}</p>
										<p>District: {cls.district_name}</p>
										<p>Rooms: {cls.classified_room > 6 ? 'more than 6' : cls.classified_room}</p>
										<p>Type: {cls.classified_type === 1 ? "House" : "Apertmant"}</p>
										<p>Square: {cls.classified_square}</p>
									</div>
									<p className="my_classified_addres">{cls.classified_addres}</p>
									<div className="my_cls_footer">
										<p className="my_time">{moment(cls.created_at).fromNow()}</p>
										<p className="my_commentBtn" onClick={() => {openModalComments(cls.classified_id)}}><FaComment/></p>
										{/* <p className="edit" onClick={() => {openModal(cls.classified_id)}}><FaPenNib/></p> */}
										<p className="delete" onClick={() => { deleteFn(cls.classified_id)}}><FaTrashAlt/></p>
									</div>
								</div>
							</div>
					</li>
				))
			:
			<p className="empty-classifieds">No classified yet</p>
			}
		</ul>
		
		{
			classifieds.comments &&
			
			<div className={commentsModalActive(classifieds.commentIndex)} onClick={closeCommentsModal}>
				<div>
					<ul className="my_comments_list">
						{ 
							classifieds.comments.length ? classifieds.comments.map(c => (
								<li className="my_comments" key={c.comment_id}>
									<p className="user_username">{c.user_username}</p>
									<p>{c.comment_body}</p>
								</li>
								))
								: <li className="no_comment">No comment yet</li>
							}
					</ul>
					<button className="comments_close" onClick={() => setCloseCommentsModal(closedCommentsModal => !(closedCommentsModal))}>Cancel</button>
				</div>
			</div>
	
		}


		{
			classifieds.modal &&

			<div key={classifieds.modal.classified_id} className={modalActive(classifieds.modal.classified_id)} onClick={closeModal}>
				<div className="my_modal_content">
					<div className="my_content--wrapper">

						<div className="edit_img">
							<label className="fileUpload" htmlFor="one">
								<FaFileUpload/>
							</label>

							<label className="fileUpload" htmlFor="two">
								<FaFileUpload/>
							</label><input id="two" type="file"/>

							<label className="fileUpload" htmlFor="three">
								<FaFileUpload/>
							</label><input id="three" type="file"/>

							<label className="fileUpload" htmlFor="four">
								<FaFileUpload/>
							</label><input id="four" type="file"/>

							<label className="fileUpload" htmlFor="five">
								<FaFileUpload/>
							</label><input id="five" type="file"/>

							<label className="fileUpload" htmlFor="six">
								<FaFileUpload/>
							</label><input id="six" type="file"/>
						</div>

						<div className="edit_classified_info--modal">
							<div className="edit_cls_header--modal">
								<input onKeyUp={e => setTitle(e.target.value)} className="edit_classified_title" defaultValue={classifieds.modal.classified_title} type="text"/>
								<input onKeyUp={e => setPrice(e.target.value)} className="edit_classified_price" defaultValue={classifieds.modal.classified_price} type="number"/>
								<select disabled><option>Daily</option></select>
							</div>
							<div className="classified-info classified-info--modal">
								<ul className="edit_selects__list">
									<li>
										<select onChange={e => setRegion({data: regions.data, value: e.target.value})}>
											<option key='0' value='0'>Choose Region</option>
											{
												regions.data && regions.data.map(region => (
													<option key={region.region_id} value={region.region_id}>{region.region_name}</option>
												))
											}
										</select>
									</li>
									<li>
										<select onChange={e => setDistrict({value: e.target.value})}>
											<option key='0' value='0'>Choose District</option>
											{
												districts.data && districts.data.map(district => (
													<option key={district.district_id} value={district.district_id}>{district.district_name}</option>
													))
											}
										</select>
									</li>
									<li>
										<select onChange={e => setType(e.target.value)}>
											<option value={classifieds.modal.classified_type === 1 ? 1 : 2}>{classifieds.modal.classified_type === 1 ? 'House' : 'Apartment'}</option>
											<option value={classifieds.modal.classified_type === 2 ? 2 : 1}>{classifieds.modal.classified_type === 1 ? 'Apartment' : 'House'}</option>
										</select>
									</li>
									<li>
										<select onChange={e => setRoom({data: room.data, value: e.target.value})}>
											{
												room.data.map(room => (
													room === classifieds.modal.classified_room ?
													<option key={room} value={room}>{room === 7 ? 'more...' : room}</option> :
													<option key={room} value={room}>{room === 7 ? 'more...' : room}</option>
													))
												}
										</select>
									</li>
									<li>
										<input onKeyUp={e => setSquare(e.target.value)} type="number" defaultValue={classifieds.modal.classified_square} placeholder="Rooms square... m2"/>
									</li>
									<li>
										<input onKeyUp={e => setAddres(e.target.value)} type="text" defaultValue={classifieds.modal.classified_addres} placeholder="Full addres"/>
									</li>
								</ul>
								<textarea onKeyUp={e => setBody(e.target.value)} defaultValue={classifieds.modal.classified_body} className="edit_classified_body" cols="30" rows="10" placeholder="Additional information"></textarea>
							</div>
							<div className="edit_classified_footer">
								<button onClick={ setEditBtn(true)} className="edit_ok">OK</button>
								<button className="edit_modal-cancel" onClick={() => setCloseModal(closedModal => !(closedModal))}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		
		}	


		{
			classifieds.modalImages && 
			<div className={imageModalActive(classifieds.modalImages)} onClick={closeImages}>
					<ul>
						<Slide scale={1}>
						{ 
							classifieds.modalImages.map(img => (
								<li key={img.image_id}>
									<img src={`${ADDRESS}/images/` + img.image_path} alt="img" width="500" height="500"/>
								</li>
							))
						}
						</Slide>
						<li>
							<button className="comments_close image_btn" onClick={() => setCloseImagesModal(closeImagesModal => !(closeImagesModal))}>Cancel</button>
						</li>
					</ul>
			</div>
		}
	    </>
    )
}


export default Account