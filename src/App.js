import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap-grid.css'

import '@blueprintjs/core/lib/css/blueprint.css';

import MapChart from './Components/MapChart';

function App() {
  return (
    <div className="App">
      <MapChart 
        datalink="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv" 
        title="CSSE COVID-19: Confirmed (per capita)"
        min={0}
        max={50}
        intent="warning"
      />
      <MapChart 
        datalink="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv" 
        title="CSSE COVID-19: Deaths (per capita)"
        min={0}
        max={10}
        intent="danger"
      />

    </div>
  );
}

export default App;
