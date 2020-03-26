import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap-grid.css'
import '@blueprintjs/core/lib/css/blueprint.css';
import MapChart from './Components/MapChart';
import { Callout } from '@blueprintjs/core';
import { Container} from 'reactstrap';

function App() {
  return (
    <div className="App">
      <Container className="mt-3">
        <Callout intent="primary">I threw this page together for a friend, and you probably shouldn't rely on it for, well, anything at all. The data used is fetched directly from the <a href="https://github.com/CSSEGISandData/COVID-19/">2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository by Johns Hopkins CSSE</a> GitHub repository. Feel free to improve this page by <a href="https://github.com/willosof/covid-19">sending me a pull request</a>!</Callout>
      </Container>

      <MapChart 
        datalink="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv" 
        title="COVID-19: Confirmed per capita"
        min={0}
        max={50}
        intent="warning"
      />

      <MapChart 
        datalink="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv" 
        title="COVID-19: Deaths per capita"
        min={0}
        max={10}
        intent="danger"
      />
    </div>
  );
}

export default App;
