import React from 'react';
import './css/GridCriteres.css';
import Critere from './Critere';

class GridCriteres extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            dataframe: props.dataframe,
            recommandation: props.recommandation,
            criterions: [],
        }
    }

    componentDidMount() {
        this.loadCriterions()
    }

    loadCriterions() {
        let criterions = this.state.dataframe.filter(row =>
          row.get("RECOMMANDATION") === this.state.recommandation)
          .select("ID", "CRITERES", "Famille d'origine", "RECOMMANDATION", "CRITERES", "JUSTIFICATIONS", 
          "Etape Cycle de Vie", "incontournables", "Use Case", "Priorité")
    
        let rows = []
        let i = 0
        criterions.chain(row => {
            let priority = row.get("Priorité")
            let id = row.get("ID")
            rows.push(
            <div className="col" id="critereItem" key={(i++).toString()}>
                <Critere id={id} priority={priority}></Critere>
            </div>)
            return row
        })

        let divs = []
        for (let i = 0; i < rows.length / 4; i++)
            divs.push(<div className="row" key={i.toString()}>{rows.slice(i * 4, i * 4 + 4)}</div>)

        this.setState({
            criterions: criterions,
        })
      }

    // load() {
    //     let n = 18
    //     var items = [];
    //     for (let i = 0; i < n; i++)
    //         items.push(<div className="col" id="critereItem" key={i.toString()}><Critere></Critere></div>)

    //     let rows = []
    //     for (let i = 0; i < items.length / 4; i++)
    //         rows.push(<div className="row" key={i.toString()}>{items.slice(i * 4, i * 4 + 4)}</div>)

    //     return rows;
    // }

    render()
    {
        return (
        <div className="container" >
            { this.state.criterions }
        </div>);
    }
}

export default GridCriteres;