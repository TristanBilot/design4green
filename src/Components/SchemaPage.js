import React, { Component } from 'react';
import Chart from "react-google-charts";
import '../Styles/articles.scss';
import csvFile from '../INR.csv'
import DataFrame from "dataframe-js";
const Papa = require('papaparse');
// const puppeteer = require('puppeteer');


class SchemaPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataframe: null,
      columns: [],
      graph: [],
    }
  }

  async componentWillMount() {
      await this.loadCsv()
      await this.timeout(100)
      await this.getGanttGraph()
      // await this.take_screen()
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

    this.state.columns = columns
    this.state.dataframe = df
  }

  /* dataframe getters */

  getGanttInfoAsDataframe(ids) {
    let dfs = []

    // for each id, fetch the required column infos 
    ids.forEach(id => {
      let df = this.state.dataframe.filter(row => row
        .get("ID") === id)
        .select("CRITERES", "Etape Cycle de Vie", "incontournables", "Use Case", "JUSTIFICATIONS", "Priorité");
      dfs.push(df)
    })
    
    // merge all the rows dataframes in one dataframe
    let totalDf = new DataFrame([]);
    dfs.forEach(df => {
      totalDf = totalDf.union(df)
    })

    // parse the priority to integers
    totalDf = totalDf.chain(this.translatePriorityToInteger)
    totalDf = this.sortDataframe(totalDf)
    return totalDf
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

  async getGanttGraph(criterions) {
    if (this.state.dataframe == null)
      return []
    let df = this.getGanttInfoAsDataframe([
      "STR-1.07",
      "STR-1.C09",
      "STR-1.16",
      "STR-3.C06",
      "STR-3.C05",
      "STR-3.07"
    ])

    let cycleLifeCategories = [ 'Acquisition', 'Conception', 'Réalisation', 'Déploiement', 'Administration', 
     'Utilisation', 'Maintenance', 'Fin de Vie', 'Revalorisation' ]
    let baseXPosition = new Date(2014, 2, 22)
    let widthOfCycleLife = 4

    let graph = [[
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ]]
    df.chain(row => {
      let cycleLifeIndex = cycleLifeCategories.indexOf(row.get("Etape Cycle de Vie"))
      let begXPosition = new Date(baseXPosition.getTime() + (widthOfCycleLife * cycleLifeIndex) * 1000*60*60*24)
      let endXPosition = new Date(baseXPosition.getTime() + (widthOfCycleLife * cycleLifeIndex) * 1000*60*60*24 * 2)

      graph.push([
        row.get("CRITERES"),
        'Spring 2014',
        'spring',
        begXPosition,
        endXPosition,
        null,
        100,
        null,
      ])
      // console.log()
    })

    this.setState({
      graph: graph,
  })
    return graph
  }

  /* helpers */

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

  // get() {
  //   let cols = this.state.dataframe.filter(row => row
  //     .get("Etape Cycle de Vie") === "Conception")
  //     .select("JUSTIFICATIONS");
  // }

  // async take_screen() {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto('/');
  //   await page.screenshot({ path: 'example.png' });
  
  //   await browser.close();
  // } 

  timeout(delay) {
      return new Promise( res => setTimeout(res, delay) );
  }

  render() {
    console.log(this.state.graph)
    return (
      <div className="header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2 col-1"></div>
            <div className="col-sm-8 col-10">
                
            <Chart
  width={'100%'}
  height={'400px'}
  chartType="Gantt"
  loader={<div>Loading Chart</div>}
  data={ this.state.graph }
  options={{
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  }}
  rootProps={{ 'data-testid': '2' }}
/>
            </div>
            <div className="col-sm-2 col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default SchemaPage;
