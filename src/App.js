import React, { useEffect, useState } from 'react'

export default function App() {
	const [showRegionFilter, setShowRegionFilter] = useState(false)
	const [countries, setCountries] = useState([])
	const [selectedRegion, setSelectedRegion] = useState('All')
	const [query, setQuery] = useState('')
	const [selectedCountry, setSelectedCountry] = useState(null)

	useEffect(() => {
		fetch('https://restcountries.com/v3.1/all')
			.then(response => response.json())
			.then(data => {
				setCountries(data)
			})
			.catch(error => {
				console.error('Error during API Loading...', error)
			})
	}, [])

	return (
		<div className='App'>
			<Nav />
			{!selectedCountry ? (
				<div>
					<SearchEngine
						showRegionFilter={showRegionFilter}
						setShowRegionFilter={setShowRegionFilter}
						selectedRegion={selectedRegion}
						setSelectedRegion={setSelectedRegion}
						query={query}
						setQuery={setQuery}
					/>
					<Country
						countries={countries}
						selectedRegion={selectedRegion}
						query={query}
						onCountrySelect={setSelectedCountry}
					/>
				</div>
			) : (
				<CountryDetail country={selectedCountry} onClose={() => setSelectedCountry(null)} />
			)}
		</div>
	)
}

function CountryDetail({ country, onClose }) {
	return (
		<div className='wrapper'>
			<div className='country-detail'>
				<button onClick={onClose} className='back-btn'>
					<i class='fa-solid fa-arrow-left'></i> Back
				</button>
				<div className='country-info'>
					<img src={country.flags.svg} alt={country.name.common} className='flag' />

					<div className='country-extended-info'>
						<h2 className='country-name'>{country.name.common}</h2>
						<div className='country-details-extended'>
							<div className='first-country-details'>
								<p>
									Native Name: <span>{country.name.common}</span>
								</p>
								<p>
									Population: <span>{country.population}</span>
								</p>
								<p>
									Region: <span>{country.region}</span>
								</p>
								<p>
									Sub Region: <span>{country.subregion}</span>
								</p>
								<p>
									Capital: <span>{country.capital}</span>
								</p>
							</div>
							<div className='second-country-details'>
								<p>
									Top Level Domain: <span>{country.tld[0]}</span>
								</p>
								<p>
									Currencies: <span>{country.currencies[Object.keys(country.currencies)[0]].name}</span>
								</p>
								<p>
									Languages: <span>{Object.values(country.languages).join(', ')}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function Nav() {
	return (
		<nav className='nav'>
			<div className='wrapper'>
				<div className='nav-items'>
					<h1>Where in the world?</h1>
					<button>
						<i className='fa-solid fa-moon'></i> Dark mode
					</button>
				</div>
			</div>
		</nav>
	)
}

function SearchEngine({ showRegionFilter, setShowRegionFilter, selectedRegion, setSelectedRegion, query, setQuery }) {
	const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

	const handleRegionChange = region => {
		setSelectedRegion(region)
	}

	return (
		<div className='search-items'>
			<div className='wrapper'>
				<div className='searching'>
					<div className='search-item'>
						<i className='fa-solid fa-magnifying-glass'></i>
						<input
							type='text'
							id='name'
							placeholder='Search for a country...'
							value={query}
							onChange={e => setQuery(e.target.value)}
						/>
					</div>
					<div className='filter-item' typeof='button' onClick={() => setShowRegionFilter(is => !is)}>
						<p>
							Filter by region <span className='current-region'>({selectedRegion})</span>{' '}
						</p>
						<i className={`fa-solid fa-angle-down ${showRegionFilter ? 'show-filter' : 'hide-filter'}`}></i>
						{showRegionFilter && (
							<div className='filter-region'>
								{regions.map(region => (
									<p key={region} onClick={() => handleRegionChange(region)}>
										{region}
									</p>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

function Country({ countries, selectedRegion, query, onCountrySelect }) {
	const filteredCountries = countries.filter(country => {
		return (
			(selectedRegion === 'All' || country.region === selectedRegion) &&
			country.name.common.toLowerCase().includes(query.toLowerCase())
		)
	})

	return (
		<div className='wrapper'>
			<div className='countries-wrapper'>
				{filteredCountries.map((country, index) => (
					<div className='country-container' key={index} onClick={() => onCountrySelect(country)}>
						<img src={country.flags.png} alt={country.name.common} className='flag' />
						<div className='country-description'>
							<p>{country.name.common.length > 20 ? `${country.name.common.slice(0, 20)}...` : country.name.common}</p>
							<p>
								Population: <span>{country.population}</span>
							</p>
							<p>
								Region: <span>{country.region}</span>
							</p>
							<p>
								Capital: <span>{country.capital}</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
