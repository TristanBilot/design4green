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
    }
  }

  async componentWillMount() {
      await this.loadCsv()
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

    this.state.columns = columns
    this.state.dataframe = df

    this.getGanttInfoAsDataframe([
      "L'entreprise est-elle ouverte à une démarche NR qui pourrait fédérer les énergies autour d'un projet novateur ?",
      "Le besoin métier est-il exprimé ?"
    ])
  }

  /* dataframe getters */

  getGanttInfoAsDataframe(criterions) {
    let dfs = []
    criterions.forEach(criterion => {
      let df = this.state.dataframe.filter(row => row
        .get("CRITERES") === criterion)
        .select("CRITERES", "Etape Cycle de Vie", "incontournables", "Use Case", "JUSTIFICATIONS", "Priorité");
      dfs.push(df)
    })
    
    let totalDf = new DataFrame([]);
    dfs.forEach(df => {
      totalDf = totalDf.union(df)
    })
    totalDf = totalDf.chain(this.translatePriorityToInteger)
    console.log(totalDf)
    return totalDf
  }

  getGanttGraph(criterions) {

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

  // timeout(delay) {
  //     return new Promise( res => setTimeout(res, delay) );
  // }

  render() {
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
  data={[
    [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    [
      '2014Spring',
      'Spring 2014',
      'spring',
      new Date(2014, 2, 22),
      new Date(2014, 5, 20),
      null,
      100,
      null,
    ],
    [
      '2014Summer',
      'Summer 2014',
      'summer',
      new Date(2014, 5, 21),
      new Date(2014, 8, 20),
      null,
      100,
      null,
    ],
    [
      '2014Autumn',
      'Autumn 2014',
      'autumn',
      new Date(2014, 8, 21),
      new Date(2014, 11, 20),
      null,
      100,
      null,
    ],
    [
      '2014Winter',
      'Winter 2014',
      'winter',
      new Date(2014, 11, 21),
      new Date(2015, 2, 21),
      null,
      100,
      null,
    ],
    [
      '2015Spring',
      'Spring 2015',
      'spring',
      new Date(2015, 2, 22),
      new Date(2015, 5, 20),
      null,
      50,
      null,
    ],
    [
      '2015Summer',
      'Summer 2015',
      'summer',
      new Date(2015, 5, 21),
      new Date(2015, 8, 20),
      null,
      0,
      null,
    ],
    [
      '2015Autumn',
      'Autumn 2015',
      'autumn',
      new Date(2015, 8, 21),
      new Date(2015, 11, 20),
      null,
      0,
      null,
    ],
    [
      '2015Winter',
      'Winter 2015',
      'winter',
      new Date(2015, 11, 21),
      new Date(2016, 2, 21),
      null,
      0,
      null,
    ],
    [
      'Football',
      'Football Season',
      'sports',
      new Date(2014, 8, 4),
      new Date(2015, 1, 1),
      null,
      100,
      null,
    ],
    [
      'Baseball',
      'Baseball Season',
      'sports',
      new Date(2015, 2, 31),
      new Date(2015, 9, 20),
      null,
      14,
      null,
    ],
    [
      'Basketball',
      'Basketball Season',
      'sports',
      new Date(2014, 9, 28),
      new Date(2015, 5, 20),
      null,
      86,
      null,
    ],
    [
      'Hockey',
      'Hockey Season',
      'sports',
      new Date(2014, 9, 8),
      new Date(2015, 5, 21),
      null,
      89,
      null,
    ],
  ]}
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
