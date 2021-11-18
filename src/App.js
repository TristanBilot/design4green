import ListsOfMovies from "./Components/ListOfMovies";
import GraphPage from "./Components/GraphPage";
import MainPage from "./Components/MainPage";
import './Components/css/app.scss'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import './App.css';
import '@fortawesome/fontawesome-free/js/brands'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/fontawesome'

function App() {
  return (
    <Router>
      <div id="app-root">
        <Switch>
          <Route path="/list">
          <ListsOfMovies></ListsOfMovies>
            {/* <Tsp />
            <TspScript /> */}
          </Route>

          <Route path='/'>
            {/* <GraphPage></GraphPage> */}
            <MainPage></MainPage>
            {/* here are the components */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
