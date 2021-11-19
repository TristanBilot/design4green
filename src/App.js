import MainPage from "./Components/MainPage";
import './Components/css/app.scss'
import './Components/css/selectionPage.css'
import SelectionPage from "./Components/SelectionPage";
import Cart from "./Components/Cart";
import GridCriteres from "./Components/GridCriteres";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import '@fortawesome/fontawesome-free/js/brands'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/fontawesome'

function App() {
  return (
    <Router>
      <div id="app-root">
        <Switch>
          <Route path="/list">
            <SelectionPage></SelectionPage>
          </Route>

          <Route path="/cart">
            <Cart></Cart>
          </Route>

          <Route path='/'>
            <MainPage></MainPage>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
