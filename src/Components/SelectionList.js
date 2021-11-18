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

    this.mounted = false;

    this.state = {
        movies: [],
        movie: {},
        recommandations: props.recommandations,
        category: props.category,
      };
  }

  componentDidMount() {
    this.mounted = true;
    // this.random=Math.floor(Math.random() * 100) + 1  ;
    // const url =
    //   typeof this.props.apiCall === "number"
    //     ? `https://api.themoviedb.org/3/discover/movie?api_key=17117ab9c18276d48d8634390c025df4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_genres=${
    //         this.props.apiCall
    //       }&page=${this.random}&include_adult=false`
    //     : `https://api.themoviedb.org/3/movie/${this.props.apiCall}?api_key=17117ab9c18276d48d8634390c025df4&language=en-US&page=1&include_adult=false`;

    // fetch(url)
    //   .then(r => r.json())
    //   .then(data => {
    //     if (this.mounted) this.setState({ movies: data.results });
    //   })
    //   .catch(err => console.log(err));
    this.loadRecommandations()
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadRecommandations() {
    let recommandationDivs = []
    let i = 0
    this.state.recommandations.chain(recommandation => {
      recommandationDivs.push(
          <div className="menu-item" key={i++}>
              <Recommandation recommandation={recommandation} category={this.state.category} />
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
    console.log("this.state.categoru")
    console.log(this.state.category)
    return (
      <div style={{
        backgroundColor: "white",
        color: "black",
        // texAlign: "center",
        // textOverflow: "hidden"
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
