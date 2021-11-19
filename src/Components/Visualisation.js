import React from 'react';
import './css/Visualisation.css';

class Visualisation extends React.Component{
    render(){
    return <div id="products_visu" className="row list-group">
        <div className="thumbnail_v">
          <div className="caption">
            <h4 className="group inner list-group-item-heading"> CRITERE </h4>
            <p className="group inner list-group-item-text">
              CATEGORIE (Priorité)
            </p>
        </div>
      </div>
    </div>
    }
}

export default Visualisation;
