import React, { Component } from 'react';
import SelectionList from "./SelectionList";
import csvFile from '../INR.csv'
import DataFrame from "dataframe-js";
import './css/mainPage.css'
import './css/basketPage.scss'
import BasketPage from './BasketPage';
import GridCriteres from './GridCriteres';
import GraphPage from './GraphPage';

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
            shouldDisplayGraph: false,
            selectedRecommandation: null,
        }
        this.displayGraphMethodBinded = this.displayGraphMethod.bind(this)
        this.rmToBasketBinded = this.rmToBasket.bind(this)
        this.close=this.close.bind(this)
        this.displayModal = this.displayModal.bind(this)
        this.addToBasket = this.addToBasket.bind(this)
        this.closeCart = this.closeCart.bind(this)
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
                        <SelectionList recommandations={distinctRecommandations} category={cat} basketMethod={this.displayModal}
                        addToBasketMethod={this.addToBasket} rmToBasketMethod={this.rmToBasketBinded}/>
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

    displayModal(recommandation) {
        this.setState({
            isDisplayed: !this.state.isDisplayed,
            selectedRecommandation: recommandation,
        })
        document.querySelectorAll('.dModal').forEach(item => {
            item.classList.add('two');
        });
    }

    close() {
        document.querySelectorAll('.dModal').forEach(item => {
            item.classList.remove('two');
        });
        this.displayModal();
    }

    openCart() {
        document.querySelectorAll('.dCart').forEach(item => {
            item.classList.add('two');
        });
    }

    closeCart() {
        document.querySelectorAll('.dCart').forEach(item => {
            item.classList.remove('two');
        });
        this.setState({isDisplayed:true})
        //this.displayModal();
    }

    displayGraphMethod() {
        this.setState({
            shouldDisplayGraph: true,
        })
    }

    addToBasket(id) {
        let element = this.state.dataframe.filter(row =>
            row.get("ID") === id)
        let items = []
        element.chain(row => {
            items.push(this.formatBasketItem(row))
            return row
        })
        let newItem = items[0]
        this.setState(() => {
            this.state.basket.push(newItem)
        })
    }

    rmToBasket(element) {
        this.setState(() => {
            this.state.basket.push(element)
        })
    }

    render() 
    {
        return (this.state.shouldDisplayGraph ?
            <div>
                <GraphPage dataframe={this.state.dataframe} basket={this.state.basket}></GraphPage>
            </div>
            :
             ( <div style={{background:"white"}}>
            {!this.state.isDisplayed?
            <div id="modal-container" class="two dModal">
            <div class="modal-background">
                <div class="modal">
                    <div onClick={this.close} id="close_modal_action"><i class="fas fa-times close_modal"></i></div>
                        {/* <h1>enzaro</h1> tu boss sur la fermeture de la page ? */}
                        <GridCriteres dataframe={this.state.dataframe} recommandation={this.state.selectedRecommandation} addToBasketMethod={this.addToBasket} closeCartMethod={this.closeCart}></GridCriteres>
                </div>
            </div>
        </div>
            :
            <div>
                {/* <div className={"modal-background" + (this.state.isDisplayed ? "visible": "hidden")}></div> */}
                <h2 className="margin30">Choix des critères</h2>
                <h5 className="margin30greyed">Veuillez sélectionner parmi les thématiques les bonnes pratiques que vous souhaitez intégrer à votre projet.</h5>
                <button onClick={this.openCart} class="button basket-btn button-after">Go to cart</button>
                { this.state.categories }
                <BasketPage closeCart={this.closeCart} basket={this.state.basket} displayGraphMethod={this.displayGraphMethodBinded}></BasketPage>
            </div>
    }
    
    <div className="hezight"></div>
    </div>
        
        )); 

        /*let body = (this.state.shouldDisplayGraph ?
            <div>
                <GraphPage dataframe={this.state.dataframe} basket={this.state.basket}></GraphPage>
            </div>
            :
            <div>
                <h2 className="margin30">Choix des critères</h2>
                <h5 className="margin30greyed">Veuillez sélectionner parmi les thématiques les bonnes pratiques que vous souhaitez intégrer à votre projet.</h5>
                <button id="two" class="link-button button basket-btn button-after">Voir le panier</button>
                { this.state.categories }
                <BasketPage id="modal-container" basket={this.state.basket} displayGraphMethod={this.displayGraphMethodBinded}></BasketPage>
            </div>
        );
        return <div style={{backgroundColor: "#fff"}}>
            {body}
            <div className="hezight"></div>
        </div>
    }*/
}
}

export default SelectionPage;
