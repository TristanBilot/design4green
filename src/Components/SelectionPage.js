import React, { Component } from 'react';
import SelectionList from "./SelectionList";
import csvFile from '../INR.csv'
import DataFrame from "dataframe-js";
import './css/mainPage.css'
import './css/basketPage.scss'
import BasketPage from './BasketPage';

const Papa = require('papaparse');

class SelectionPage extends Component {
    constructor(props) {
        super(props)

        this.state =  {
            dataframe: null,
            columns: [],
            categories: [],
            isDisplayed: true,
            basket: [],
        }
        this.diplayModalBinded = this.diplayModal.bind(this)
    }

    async componentWillMount() {
        await this.loadCsv()
        await this.timeout(200)
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

    formatBasketItem(row) {
        let id = row.get("ID")
        let family = row.get("Famille d'origine")
        let recommandation = row.get("RECOMMANDATION")
        let criterion = row.get("CRITERES")
        let justifs = row.get("JUSTIFICATIONS")
        let cycle = row.get("Etape Cycle de Vie")
        let mandatory = row.get("incontournables") === "INCONTOURNABLE"
        let useCase = row.get("Use Case")

        return {
            id: id,
            family: family,
            recommandation: recommandation,
            criterion: criterion,
            justifs: justifs,
            cycle: cycle,
            mandatory: mandatory,
            useCase: useCase,
        }
    }
    
    loadCsvBinded(input) {
        let csv = input.data
        let columns = csv[0]
        let data = csv.slice(1)
        let df = new DataFrame(data, columns)
    
        // df = df.chain(row => row.get("Etape Cycle de Vie") != "N/A")

        let mandatoryCriterions = df.filter(row => 
            row.get("incontournables") === "INCONTOURNABLE").select(
                "ID", "CRITERES", "Famille d'origine", "RECOMMANDATION", "CRITERES", "JUSTIFICATIONS", 
                "Etape Cycle de Vie", "incontournables", "Use Case"
            )
        let basketItems = []
        mandatoryCriterions.chain(row => {
            basketItems.push(this.formatBasketItem(row))
            return row
        })

        this.setState({
          columns: columns,
          dataframe: df,
          basket: basketItems
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
            let cat = category.get("Famille d'origine")
            if (cat !== "") {
                let recommandationsWithCategories = this.state.dataframe.filter(row => row.get("Famille d'origine") === cat).select("Famille d'origine", "RECOMMANDATION")
                let distinctRecommandations = recommandationsWithCategories.distinct("RECOMMANDATION")
                
                categoryDivs.push(
                    <div key={i++}>
                        <SelectionList recommandations={distinctRecommandations} category={cat} basketMethod={this.diplayModalBinded} />
                    </div>
                )
            }
        })

        this.setState({
            categories: categoryDivs
        })
    }

    timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    diplayModal() {
        this.setState({
            isDisplayed: !this.state.isDisplayed
        })
    }

    render() {
        return (
            <div>
                {/* <div className={"modal-background" + (this.state.isDisplayed ? "visible": "hidden")}></div> */}
                <button id="two" class="link-button button">Basket</button>
                { this.state.categories }
                <BasketPage id="modal-container" basket={this.state.basket}></BasketPage>
            </div>
        );
    }
}

export default SelectionPage;
