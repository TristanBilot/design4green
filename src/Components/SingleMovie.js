import React, { Component } from "react";
import { Link } from "react-router-dom";

class SingleMovie extends Component {
  state = {
    isHovering: false
  };

  handleEnter = () => {
    this.setState({ isHovering: true });
  };

  handleLeave = () => {
    this.setState({ isHovering: false });
  };

  render() {
    const { movie } = this.props;
    return (
      <Link to={"/" + movie.id} style={{color:"black"}}>
        <div
          className="movie-card"
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
        >
          
          <p style={{width:"180px"}}>
          <p style={{color:"black",whiteSpace: "nowrap",overflow: "hidden",textOverflow:"clip", color:"white"}}>
          {movie.title}
          </p>
          </p>
          {this.state.isHovering && (
            <h3 className="movie-title">
            </h3>
          )}
        </div>
      </Link>
    );
  }
}

export default SingleMovie
