import React, { Component } from 'react';
import { feature } from "topojson-client"
import {
  geoMercator,
  geoAzimuthalEqualArea,
  geoConicConformal,
  geoPath
} from "d3-geo"
import './App.css';
import Map from './Map'

class App extends Component {
  constructor() {
    super()
    this.state = {
      mapdata: [],
      lastClicked: '',
      activeContinent: 'northamerica',
      color: 'slateblue',
      createProjection: (dat) => geoPath().projection(geoConicConformal().rotate([98, 2]).scale(365).parallels([29.5, 45.5]).precision(.1).center([40, 57]))(dat)
    }
  }

  async componentDidMount() {
    const mapdata = await this.getData('northamerica')
    this.setState({ mapdata })
  }

  getData = async continent => {
    try {
      const response = await fetch(`/${continent}.json`)
      try {
        const data = await response.json()
        return feature(data, data.objects[`continent${continent}`]).features
      } catch(err1) {
        console.warn(`Error parsing map data: ${err1}`)
      }
    } catch(err0) {
      console.warn(`Error fetching map data: ${err0}`)
    }
  }

  handleCountryClick = name => this.setState({ lastClicked: name })

  changeContinent = async e => {
    const continent = e.target.dataset.continent
    const color = e.target.dataset.color
    this.chooseProjection(continent)
    const mapdata = await this.getData(continent)
    console.log(`continent: ${continent} color: ${color}`)
    this.setState({
      color,
      mapdata
    })
  }

  chooseProjection = (continent) => {
    const cont = continent || this.state.activeContinent
    console.log(`continent: ${cont}`)
    if (cont === 'northamerica') {
      this.setState({ createProjection: (dat) => geoPath().projection(geoConicConformal().rotate([98, 2]).scale(365).parallels([29.5, 45.5]).precision(.1).center([40, 57]))(dat) })
    } else if (cont === 'southamerica') {
      this.setState({ createProjection: (dat) => geoPath().projection(geoAzimuthalEqualArea().center([-25, -15]).scale(420))(dat) })
    } else if (cont === 'europe') {
      this.setState({ createProjection: (dat) => geoPath().projection(geoAzimuthalEqualArea().scale(750).center([40, 62]))(dat) })
    } else if (cont === 'africa') {
      this.setState({ createProjection: (dat) => geoPath().projection(geoAzimuthalEqualArea().scale(460).center([47, 7]))(dat) })
    } else if (cont === 'oceania') {
      this.setState({ createProjection: (dat) => geoPath().projection(geoConicConformal().rotate([-132, 0]).scale(356).parallels([-18, -36]).precision(.1).center([60, -10]))(dat) })
    } else if (cont === 'asia') {
      this.setState({ createProjection: (dat) => geoPath().projection(geoMercator().rotate([-92, 0]).scale(170).center([30, 70]))(dat) })
    }
  }

  render() {
    return (
      <div className="app">
        <div className="wrapper">
          <Map
            lastClicked={this.state.lastClicked}
            projection={this.state.createProjection}
            continent={this.state.activeContinent}
            handleCountryClick={this.handleCountryClick}
            data={this.state.mapdata}
            color={this.state.color}
            />
          <div className="text">
            {this.state.lastClicked.length > 0 ? <p>you clicked on {this.state.lastClicked}</p> : <p>click a country to start!</p>}
          </div>
        </div>
        <div className='continent-btns'>
          <a
            onClick={(e) => this.changeContinent(e)}
            data-color='slateblue'
            data-continent='northamerica'
            className="continent-btn northamerica"
            >NORTH AMERICA</a>
          <a
            onClick={(e) => this.changeContinent(e)}
            data-color='orange'
            data-continent='southamerica'
            className="continent-btn southamerica"
            >SOUTH AMERICA</a>
          <a
            onClick={(e) => this.changeContinent(e)}
            data-color='teal'
            data-continent='europe'
            className="continent-btn europe"
            >EUROPE</a>
          <a
            onClick={(e) => this.changeContinent(e)}
            data-color='hotpink'
            data-continent='africa'
            className="continent-btn africa"
            >AFRICA</a>
          <a
            onClick={(e) => this.changeContinent(e)}
            data-color='dodgerblue'
            data-continent='asia'
            className="continent-btn asia"
            >ASIA</a>
          <a
            onClick={(e) => this.changeContinent(e)}
            data-color='tomato'
            data-continent='oceania'
            className="continent-btn oceania"
            >OCEANIA</a>
        </div>
      </div>
    );
  }
}

export default App;
