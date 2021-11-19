import React from 'react';
import './css/Critere.css';

class Critere extends React.Component{
    constructor(props) {
      super(props)
      
      this.id = props.id
      this.priority = props.priority
      this.addToBasketMethod = props.addToBasketMethod
    }

    render(){
    return <div id="products" className="row list-group">
        <div className="thumbnail">
          <div className="caption">
            <h4 className="group inner list-group-item-heading"> {this.id} </h4>
            <p className="group inner list-group-item-text">
              {this.priority}
            </p>
            <div className="row">
              <div className="col-xs-12 col-md-6">
                <button onClick={ () => this.addToBasketMethod(this.id)} className="btn btn-success">
                  Ajouter
                </button>
              </div>

          </div>
        </div>
      </div>
    </div>
    }
}

export default Critere;
