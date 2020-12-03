import React , { useEffect, useState	} from 'react'
import './NewClassified.css'
import axios from 'axios'
import { FaTrashAlt } from 'react-icons/fa'
import { BsUpload } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { ADDRESS } from '../Context'

const NewClassified = () => {
	
	const [region, setRegion] = useState({data: []})
	const [district, setDistrict] = useState({data: []})
	const [type, setType] = useState({data: []})
	const [room, setRoom] = useState({data: []})
	const [square, setSquare] = useState({value: ''})
	const [addres, setAddres] = useState({value: ''})
	const [title, setTitle] = useState({value: ''})
	const [price, setPrice] = useState({value: ''})
	const [body, setBody] = useState({value: ''})
	const [btn, setBtn] = useState(false)
	const [one, setOne] = useState({value: null, new: null})
	const [two, setTwo] = useState({value: null, new: null})
	const [three, setThree] = useState({value: null, new: null})
	const [four, setFour] = useState({value: null, new: null})
	const [five, setFive] = useState({value: null, new: null})
	const [six, setSix] = useState({value: null, new: null})

    useEffect(() => {
		;(async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Token': window.localStorage.getItem('access_token'),
			}
			const { data } = await axios.get(`${ADDRESS}/new`, { headers })
			if(data.data === null)  {
				window.localStorage.removeItem('access_token')
				window.location.pathname = '/login'
			}
		})()
	}, [])
	
	function buttonClick(e) {
		e.preventDefault()
		setBtn(true)
	}
	
	useEffect(() => {
		;(async () => {
			if(btn) {

				if( (one.value || two.value || three.value || four.value || five.value || six.value) && title.value.length >= 5 && price.value.length >= 1 && region.value && district.value && type.value && room.value && square.value.length >= 2 && addres.value.length >= 5 && body.value.length >= 5) {
					const headers = {
						'Token': window.localStorage.getItem('access_token'),
					}
					const classified = {
						region: region.value,
						district: district.value,
						title: title.value,
						price: price.value,
						room: room.value === 'more...' ? 7 : room.value,
						square: square.value,
						type: type.value,
						addres: addres.value,
						body: body.value,
						images: [one.value ? one.value : null, two.value ? two.value : null, three.value ? three.value : null, four.value ? four.value : null, five.value ? five.value : null, six.value ? six.value : null]
					}
					const { data } = await axios.post(`${ADDRESS}/new`, { classified }, { headers } )
					if(data) {
						window.location.pathname = '/'
						setBtn(false)
					}
				}
				else {
					alert('Classified not completed')
					setBtn(false)
				}
			}
		})()
	}, [region.value, district.value, type.value, room.value, square.value, title.value, addres.value, price.value, body.value, one, two, three, four, five, six, btn])

	useEffect(() => {
		;(async () => {
			const formData = new FormData()
			if(one.new) {
					formData.append('file', one.new)
					const { data } = await axios.post(`${ADDRESS}/newImg`, formData) 
					setOne({new: null, value: data.name})
			}
			if(two.new) {
					formData.append('file', two.new)
					const { data } = await axios.post(`${ADDRESS}/newImg`, formData) 
					setTwo({new: null, value: data.name})
			}
			if(three.new) {
					formData.append('file', three.new)
					const { data } = await axios.post(`${ADDRESS}/newImg`, formData) 
					setThree({new: null, value: data.name})
			}
			if(four.new) {
					formData.append('file', four.new)
					const { data } = await axios.post(`${ADDRESS}/newImg`, formData) 
					setFour({new: null, value: data.name})
			}
			if(five.new) {
					formData.append('file', five.new)
					const { data } = await axios.post(`${ADDRESS}/newImg`, formData) 
					setFive({new: null, value: data.name})
			}
			if(six.new) {
					formData.append('file', six.new)
					const { data } = await axios.post(`${ADDRESS}/newImg`, formData) 
					setSix({new: null, value: data.name})
			}
		})()

	}, [one, two ,three, four, five, six])
	
	useEffect(() => {
		;(async () => {
			const {data, status } = await axios.get(`${ADDRESS}`)
			if(status > 299) setRegion({data: [], error: 'error'})
			else {
				setRegion({data: data.regions})
			}
		})()
	}, [])

	useEffect(() => {
		;(async () => {
			const { data } = await axios.get(`${ADDRESS}`)
			if(region.value === 0 ) setDistrict({data: []})
			else {
				const districts = data.districts.filter(d => d.region_id === region.value)
				setDistrict({data: districts, value: 0})
			}
		})()
	}, [region.value])

	useEffect(() => {
			district.value === 0 ? setType({data: [], value: 0}) : setType({data: [1, 2], value: 0})
	}, [district.value])

	useEffect(() => {
			type.value === 0 ? setRoom({value: 0}) : setRoom({value: 0, data: [1, 2, 3, 4, 5, 6, "more..."]})
	}, [type.value])

    return (
        <>
		<div className="body">
			<div className="post_content">
				<form className="form" encType="multipart/form-data">
					<div className="post--wrapper">
						<div className="post_img">
							{
								one.value ?
								<div className="img">
									<img className="fileUpload" src={`${ADDRESS}/images/` + one.value} alt="img"/>
									<span onClick={(e => setOne({value: null}))}><FaTrashAlt/></span>
								</div>
								:
								<label className="fileUpload" htmlFor="one">
									<span>
										<BsUpload/>
									</span>
								</label>
							}
							<input onChange={e => setOne({ new: e.target.files[0], value: one.value})} id="one" type="file"/>

							{
								two.value ?
								<div className="img">
									<img className="fileUpload" src={`${ADDRESS}/images/` + two.value} alt="img"/>
									<span onClick={(e => setTwo({value: null}))}><FaTrashAlt/></span>
								</div>
								:
								<label className="fileUpload" htmlFor="two">
									<BsUpload/>
								</label>
							}
							<input onChange={e => setTwo({ new: e.target.files[0], value: two.value})} id="two" type="file"/>

							{
								three.value ?
								<div className="img">
									<img className="fileUpload" src={`${ADDRESS}/images/` + three.value} alt="img"/>
									<span onClick={(e => setThree({value: null}))}><FaTrashAlt/></span>
								</div>
								:
								<label className="fileUpload" htmlFor="three">
									<BsUpload/>
								</label>
							}
							<input onChange={e => setThree({ new: e.target.files[0], value: three.value})} id="three" type="file"/>

							{
								four.value ?
								<div className="img">
									<img className="fileUpload" src={`${ADDRESS}/images/` + four.value} alt="img"/>
									<span onClick={(e => setFour({value: null}))}><FaTrashAlt/></span>
								</div>
								:
								<label className="fileUpload" htmlFor="four">
									<BsUpload/>
								</label>
							}
							<input onChange={e => setFour({ new: e.target.files[0], value: four.value})} id="four" type="file"/>

							{
								five.value ?
								<div className="img">
									<img className="fileUpload" src={`${ADDRESS}/images/` + five.value} alt="img"/>
									<span onClick={(e => setFive({value: null}))}><FaTrashAlt/></span>
								</div>
								:
								<label className="fileUpload" htmlFor="five">
									<BsUpload/>
								</label>
							}
							<input onChange={e => setFive({ new: e.target.files[0], value: five.value})} id="five" type="file"/>

							{
								six.value ?
								<div className="img">
									<img className="fileUpload" src={`${ADDRESS}/images/` + six.value} alt="img"/>
									<span onClick={(e => setSix({value: null}))}><FaTrashAlt/></span>
								</div>
								:
								<label className="fileUpload" htmlFor="six">
									<BsUpload/>
								</label>
							}
							<input onChange={e => setSix({ new: e.target.files[0], value: six.value})} id="six" type="file"/>
						</div>
						
						<div className="post_info">
							<div className="post_header">
								<input className="post_title post_input" type="text" onKeyUp={e => setTitle({value: e.target.value})} placeholder="Title. . ."/>
								<input className="post_price post_input" type="number" onKeyUp={e => setPrice({value: e.target.value})} placeholder="Price. . ."/>
								<select disabled>
									<option value="1">Daily</option>
								</select>
							</div>

							<ul className="post_selects__list">
								<li>
									<select onChange={e => setRegion({data: region.data, value: e.target.value})}>
										<option value="0">Choose region</option>
										{
											region.data && region.data.map(region => (
												<option key={region.region_id} value={region.region_id}>{region.region_name}</option>
											))
										}
									</select> 
								</li>
								<li>
									<select onChange={e => setDistrict({data: district.data, value: e.target.value})}>
										<option value="0">Choose District</option>
										{
											district.data && district.data.map(d => (
												<option key={d.district_id} value={d.district_id}>{d.district_name}</option>
											))
										}
									</select>
								</li>
								<li>
									<select onChange={e => setType({data: type.data, value: e.target.value})}>
										<option value="0">Choose Type</option>
										{
											type.data && type.data.map(type => (
												<option key={type} value={type}>{type === 1 ? 'House' : 'Aparment'}</option>
											))
										}
									</select>
								</li>
								<li>
									<select onChange={e => setRoom({data: room.data, value: e.target.value})}>
										<option>Choose Rooms</option>
										{
											room.data && room.data.map(room => (
												<option key={room === "more" ? 7 : room}>{room === "more" ? "more..." : room}</option>
											))
										}
									</select>
								</li>
								<li>
									<input className="post_input" onKeyUp={e => setSquare({value: e.target.value})} type="number" placeholder="Rooms square... m2"/>
								</li>
								<li>
									<input className="post_input" onKeyUp={e => setAddres({value: e.target.value})} type="text" placeholder="Full addres"/>
								</li>
							</ul>

							<textarea onKeyUp={e => setBody({value: e.target.value})} className="post_body" cols="30" rows="10" placeholder="Additional information"></textarea>
							<div className="post_footer">
								<Link to="/account" className="cancel">Cancel</Link>
								<button onClick={e => buttonClick(e)} className="ok">OK</button>
							</div>
						</div>

					</div>
				</form>
			</div>        
		</div>
       
	    </>
    )
}


export default NewClassified