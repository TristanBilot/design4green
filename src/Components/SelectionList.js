import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Recommandation from "./Recommandation.js";

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

class SelectionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
        movies: [],
        movie: {},
        recommandations: props.recommandations,
        category: props.category,
        basketMethod: props.basketMethod,
      };
  }

  componentDidMount() {
    this.loadRecommandations()
  }

  loadRecommandations() {
    let recommandationDivs = []
    let i = 0
    this.state.recommandations.chain(recommandation => {
      recommandationDivs.push(
          <div className="menu-item" key={i++}>
              <Recommandation recommandation={recommandation} category={this.state.category} basketMethod={this.state.basketMethod} />
          </div>
      )
    })

    this.setState({
      recommandations: recommandationDivs
    })
  }

  formatText(text) {
    text = text.toLowerCase()
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  render() {
    return (
      <div style={{
        backgroundColor: "white",
        color: "black",
      }}
       className="lists" >
        <br/>
        <div style={{marginLeft:"20px",marginBottom:"-35px",width:"8px",height:"30px",backgroundColor:"rgb(143, 204, 115)"}}/>
          <h2 style={{marginLeft:"25px"}}>{this.formatText(this.state.category)}
        </h2><br/>
        <ScrollMenu
          data={this.state.recommandations}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          dragging={true}
          wheel={false}
          alignCenter={false}
          clickWhenDrag={false}
        />
      </div>
    );
  }
}

export default SelectionList;
