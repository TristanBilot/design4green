import React, { Component } from "react";
import { Link } from "react-router-dom";

class Recommandation extends Component {
  constructor(props) {
    super(props)

    console.log(props.recommandation)

    this.state = {
      recommandation: props.recommandation,
      basketMethod: props.basketMethod,
      isHovering: false,
    };
  }

  handleEnter = () => {
    this.setState({ isHovering: true });
  };

  handleLeave = () => {
    this.setState({ isHovering: false });
  };

  render() {
    // const { movie } = this.props;
    return (
      // <Link to={"/" + this.state.recommandation} style={{color:"black"}}>
      <div onClick={this.state.basketMethod}>
        <div
          className="movie-card"
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
        >
          
            <p style={{color:"black",whiteSpace: "nowrap",overflow: "hidden",textOverflow:"clip", overflowwrap: "breakWord"}}>
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
