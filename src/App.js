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
          <Route path="/genetic-tsp">
            {/* <Tsp />
            <TspScript /> */}
          </Route>

          <Route path='/'>
            {/* here are the components */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
