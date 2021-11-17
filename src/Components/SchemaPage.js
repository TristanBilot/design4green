import React, { Component } from 'react';
import Chart from "react-google-charts";
import '../Styles/articles.scss';
import csvFile from '../INR.csv'
const Papa = require('papaparse');
const puppeteer = require('puppeteer');


class SchemaPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      csv: null,
    }
  }

  async componentWillMount() {
      await this.loadCsv()
      await this.take_screen()
  }

  async loadCsv() {
    if (this.state.csv == null) {
      var binded = this.loadCsvBinded.bind(this)
      Papa.parse(csvFile, {
        download: true,
        complete: binded,
        encoding: 'UTF-8'
    });
  }
  }

  loadCsvBinded(input) {
    this.state.csv = input.data;
    console.log(this.state.csv)
  }

  async take_screen() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('/');
    await page.screenshot({ path: 'example.png' });
  
    await browser.close();
  } 

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
                    { type: 'date', label: 'Start Date' },
                    { type: 'date', label: 'End Date' },
                    { type: 'number', label: 'Duration' },
                    { type: 'number', label: 'Percent Complete' },
                    { type: 'string', label: 'Dependencies' },
                    ],
                    [
                    'Research',
                    'Find sources',
                    new Date(2015, 0, 1),
                    new Date(2015, 0, 5),
                    null,
                    100,
                    null,
                    ],
                    [
                    'Write',
                    'Write paper',
                    null,
                    new Date(2015, 0, 9),
                    3 * 24 * 60 * 60 * 1000,
                    25,
                    'Research,Outline',
                    ],
                    [
                    'Cite',
                    'Create bibliography',
                    null,
                    new Date(2015, 0, 7),
                    1 * 24 * 60 * 60 * 1000,
                    20,
                    'Research',
                    ],
                    [
                    'Complete',
                    'Hand in paper',
                    null,
                    new Date(2015, 0, 10),
                    1 * 24 * 60 * 60 * 1000,
                    0,
                    'Cite,Write',
                    ],
                    [
                    'Outline',
                    'Outline paper',
                    null,
                    new Date(2015, 0, 6),
                    1 * 24 * 60 * 60 * 1000,
                    100,
                    'Research',
                    ],
                ]}
                rootProps={{ 'data-testid': '1' }}
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
