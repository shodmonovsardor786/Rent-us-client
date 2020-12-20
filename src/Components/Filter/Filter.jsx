import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Filter.css'
import { useFilter } from '../Context'
import { ADDRESS } from '../Context'
import { AiOutlineClose } from 'react-icons/ai'
import { BsArrowRight } from 'react-icons/bs'

const Filter = () => {

	const [setState, filter, setFilter] = useFilter(true)

	const [region, setRegion] = useState({data: [], value: 0})
	const [district, setDistrict] = useState({data: [], value: 0})
	const [type, setType] = useState({value: 0})
	const [room, setRoom] = useState({value: 0})
	const [priceFrom, setPriceFrom] = useState('')
	const [priceTo, setPriceTo] = useState('')


	useEffect(() => {
		;(async () => {
			const {data } = await axios.get(`${ADDRESS}/home`)
			setRegion({data: data.regions})
		})()
	}, [setRegion])

	useEffect(() => {
		if(region.value < 1) {
			setState({data: []})
		}
		setDistrict({value: 0})
	}, [region.value, setState])
	
	useEffect(() => {
		;(async () => {
			if(region.value > 0 && district.value > 0 && type.value > 0 && room.value > 0 && priceFrom.length > 0 && priceTo.length > 0) {
				const { data } = await axios.post(`${ADDRESS}/home`, {region: region.value, district: district.value, type: type.value, room: room.value, priceFrom: priceFrom, priceTo: priceTo})
				setState({data: data.classifieds})
			}
			else if(region.value > 0 && district.value > 0 && type.value > 0 && room.value > 0 && priceFrom.length > 0) {
				const { data } = await axios.post(`${ADDRESS}/home`, {region: region.value, district: district.value, type: type.value, room: room.value, priceFrom: priceFrom})
				setState({data: data.classifieds})
			}
			else if(region.value > 0 && district.value > 0 && type.value > 0 && room.value > 0) {
				const { data } = await axios.post(`${ADDRESS}/home`, {region: region.value, district: district.value, type: type.value, room: room.value})
				setState({data: data.classifieds})
			}			
			else if(region.value > 0 && district.value > 0 && type.value > 0) {
				setRoom({value: 0})
				const { data } = await axios.post(`${ADDRESS}/home`, {region: region.value, district: district.value, type: type.value})
				setState({data: data.classifieds})
			}
			else if(region.value > 0 && district.value > 0) {
				const { data } = await axios.post(`${ADDRESS}/home`, {region: region.value, district: district.value})
				setState({data: data.classifieds})
			}
			else if(region.value > 0) {
				const { data } = await axios.post(`${ADDRESS}/home`, {region: region.value})
				setDistrict({data: data.districts})
				setState({data: data.classifieds, images: data.images})
			}
		})()
	}, [region.value, district.value, type.value, room.value, priceFrom, priceTo, setState])

	return (
		<>
		<form>
			<ul className={ filter ? 'filter_list close_filter' : 'filter_list'}>
				<li onClick={() => setFilter(true)} className={filter ? "none" : "open_close_filter"}>
					<span><AiOutlineClose/></span>
				</li>
				<li onClick={() => setFilter(false)} className={filter ? "open_close_filter" : "none"}>
					<span><BsArrowRight/></span>
				</li>
				<li className="filter_item">
					<label htmlFor="turist">Turists</label>
					<select className="filter_select" id="turist" disabled={true}>
						<option key="0">For Turists</option>
					</select>
				</li>
				
				<li className="filter_item">
					<label htmlFor="regions">Regions</label>
					<select className="filter_select" id="regions" onChange={e => setRegion({data: region.data, value: e.target.value})}>
						<option key="0" value="0">Choose Region</option>
						{
							region.data && region.data.map(r => (
								<option key={r.region_id} value={r.region_id}>{r.region_name}</option>
							))
						}
					</select>
				</li>
				
				<li className="filter_item">
					<label htmlFor="districts">Districts</label>
					<select className="filter_select" id="districts" onChange={e => setDistrict({data: district.data, value: e.target.value})}>
						<option value="0">Choose District</option>
						{
							district.data && district.data.map(d => (
								<option key={d.district_id} value={d.district_id}>{d.district_name}</option>
							))
						}
					</select>
				</li>

				<li className="filter_item">
					<label htmlFor="type">Types</label>
					<select className="filter_select" id="type" onChange={e => setType({data: type.data, value: e.target.value})}>
						<option key="0" value="0">Choose Type</option>
						<option key="1" value="1">House</option>
						<option key="2" value="2">Apartment</option>
					</select>
				</li>

				<li className="filter_item">
					<label htmlFor="rooms">Rooms</label>
					<select className="filter_select" id="rooms" onChange={e => setRoom({value: e.target.value})}>
						<option key="0" value="0">Choose Rooms</option>
						<option key="1" value="1">1</option>
						<option key="2" value="2">2</option>
						<option key="3" value="3">3</option>
						<option key="4" value="4">4</option>
						<option key="5" value="5">5</option>
						<option key="6" value="6">6</option>
						<option key="7" value="7">more...</option>
					</select>
				</li>
				<li className="filter_item">
					<label htmlFor="price_from">Price from</label>
					<input className="filter_input" id="price_from" onKeyUp={e => setPriceFrom(e.target.value)} type="number" placeholder="Price from..."/>
				</li>
				<li className="filter_item">
					<label htmlFor="price_to">Price to</label>
					<input className="filter_input" id="price_to" onKeyUp={e => setPriceTo(e.target.value)} type="number" placeholder="Price to..."/>
				</li>
				<li className="filter_item">
					<label htmlFor="dayly">D/M</label>
					<select className="filter_select" id="dayly" disabled={true}>
						<option key="0">Daily</option>
					</select>
				</li>
			</ul>
		</form>
		</>
		)
	}
	
export default Filter