import React, { Component } from 'react';
import SelectionList from "./SelectionList";
import csvFile from '../INR.csv'
import DataFrame from "dataframe-js";

const Papa = require('papaparse');

class SelectionPage extends Component {
    constructor(props) {
        super(props)

        this.state =  {
            dataframe: null,
            columns: [],
            categories: [],
        }
        // this.movies = {
        //     upcoming: {
        //         apiCall: "upcoming",
        //         header:
        //         "Stratégie"
        //     },
        //     topRated: {
        //         apiCall: "top_rated",
        //         header: "Spécifications"
        //     },
        //     action: {
        //         apiCall: 28,
        //         header: "Ux/Ui"
        //     },
        //     adventure: {
        //         apiCall: 12,
        //         header: "Contenus"
        //     },
        //     animation: {
        //         apiCall: 16,
        //         header: "Front-end"
        //     },
        //     comedy: {
        //         apiCall: 35,
        //         header: "Architecture"
        //     },
        //     crime: {
        //         apiCall: 80,
        //         header: "Back-end"
        //     },
        //     mystery: {
        //         apiCall: 878,
        //         header: "Hebergement"
        //     }
        // };
    }

    async componentWillMount() {
        await this.loadCsv()
        await this.timeout(100)
        await this.loadCategories()
    }

    async loadCsv() {
        if (this.state.dataframe == null) {
            var binded = this.loadCsvBinded.bind(this)
            Papa.parse(csvFile, {
              download: true,
              complete: binded,
              encoding: 'UTF-8'
          });
        }
    }
    
    loadCsvBinded(input) {
        let csv = input.data
        let columns = csv[0]
        let data = csv.slice(1)
        let df = new DataFrame(data, columns)
    
        // df = df.chain(row => row.get("Etape Cycle de Vie") != "N/A")
        this.setState({
          "columns": columns,
          "dataframe": df
        })
    }

    translateCycleLifeToInteger(row) {
        let cycleLife = row.get("Etape Cycle de Vie")
        let priorities = [ 'Acquisition', 'Conception', 'Réalisation', 'Déploiement', 'Administration', 
         'Utilisation', 'Maintenance', 'Fin de Vie', 'Revalorisation' ]
    
         row = row.set("Cycle life priority", priorities.indexOf(cycleLife))
         return row
      }
    sortDataframe(df) {
        // add a new colum with an integer representing the priority based on cycle life
        df = df.withColumn("Cycle life priority")
        df = df.chain(this.translateCycleLifeToInteger)
    
        // sort first by priority and then by cycle life to make groups
        df = df.sortBy("Priorité")
        df = df.sortBy("Cycle life priority")
        return df
    }
    translatePriorityToInteger(row) {
        let priority = row.get("Priorité")
        let priorities = {
          "Low": 1,
          "Medium": 2,
          "High": 3,
          "": 4,
        }
        row = row.set("Priorité", priorities[priority])
        return row
    }
    translateCycleLifeToInteger(row) {
        let cycleLife = row.get("Etape Cycle de Vie")
        let priorities = [ 'Acquisition', 'Conception', 'Réalisation', 'Déploiement', 'Administration', 
         'Utilisation', 'Maintenance', 'Fin de Vie', 'Revalorisation' ]
    
         row = row.set("Cycle life priority", priorities.indexOf(cycleLife))
         return row
      }

    async loadCategories() {
        let categories = this.state.dataframe.distinct("Famille d'origine")
        let categoryDivs = []
        var i = 0
        categories.chain(category => {
            let recommandationsWithCategories = this.state.dataframe.filter(row => row.get("Famille d'origine") === category.get("Famille d'origine")).select("Famille d'origine", "RECOMMANDATION")
            let distinctRecommandations = recommandationsWithCategories.distinct("RECOMMANDATION")
            
            categoryDivs.push(
                <div key={i++}>
                    <SelectionList recommandations={distinctRecommandations} category={category.get("Famille d'origine")} />
                </div>
            )
        })

        this.setState({
            categories: categoryDivs
        })
    }

    timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    render() {
        console.log(this.state.dataframe)
        return (
            <div>
                { this.state.categories }
                {/* {Object.keys(this.movies).map((item, i) => (
                    
            ))} */}
            </div>
        );
    }
}

export default SelectionPage;
