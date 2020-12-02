import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import { FilterProvider } from './Components/Context'

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<FilterProvider>
				<App />
			</FilterProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
	)
	
reportWebVitals()