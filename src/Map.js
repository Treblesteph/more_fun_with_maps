import React from 'react'
import './Map.css';


const Map = props => {

  const handleClick = (name, id) => {
    const countries = document.querySelectorAll('.country')
    countries.forEach(c => c.style = `fill: ${props.color}`)
    if (props.lastClicked === name) {
      props.handleCountryClick('')
    } else {
      const thisCountry = document.querySelector(`.${id}`)
      thisCountry.style = 'fill: grey'
      props.handleCountryClick(name)  
    }
  }

  return (
    <div>
      <svg width={ 800 } height={ 500 } viewBox="0 0 800 600">
        <g className="countries">
          {
            props.data.map((d, i) => (
              <path
                key={ `path-${ i }` }
                d={ props.projection(d) }
                className={`country ${d.id}`}
                fill={ props.color }
                stroke={ `white` }
                strokeWidth={ 1 }
                onClick={ () => handleClick(d.properties.name, d.id) }
              />
            ))
          }
        </g>
      </svg>
    </div>
  )
}

export default Map