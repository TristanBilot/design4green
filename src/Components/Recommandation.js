import React, { Component } from "react";
import { Link } from "react-router-dom";

class Recommandation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      recommandation: props.recommandation,
      basketMethod: props.basketMethod,
      category: props.category,
      isHovering: false,
    };
  }

  handleEnter = () => {
    this.setState({ isHovering: true });
  };

  handleLeave = () => {
    this.setState({ isHovering: false });
  };

  getColor() {
    let colors = {
      "STRATEGIE": "#1b5e20",
      "SPECIFICATIONS": "#00695c",
      "UX/UI": "#0097a7",
      "CONTENUS": "#039be5",
      "ARCHITECTURE": "#2196f3",
      "FRONTEND": "#5c6bc0",
      "BACKEND": "#9575cd",
      "HEBERGEMENT": "#ce93d8",
    }
    return colors[this.state.category]
  }

  render() {
    return (
      <div onClick={this.state.basketMethod}>
        <div
          className="movie-card"
          style={{backgroundColor: this.getColor()}}
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
        >
          
            <p className="recommandationLabel">
              {this.state.recommandation}
            </p>
          {this.state.isHovering && (
            <h3 className="movie-title">
            </h3>
          )}
        </div>
        </div>
      // </Link>
    );
  }
}

export default Recommandation
