import React, { Component } from 'react';
import { GanttComponent, Inject, Selection, Toolbar, ExcelExport, PdfExport, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-gantt';
import { editingData, editingResources } from './data';
import csvFile from '../INR.csv'
import DataFrame from "dataframe-js";

const Papa = require('papaparse');

class Graph extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataframe: null,
            columns: [],
            graph: [],
            graphLabels: [],
          }

        this.taskFields = {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            child: 'subtasks',
            resourceInfo: 'resources'
        };
        this.resourceFields = {
            id: 'resourceId',
            name: 'resourceName'
        };
        this.splitterSettings = {
            columnIndex: 2
        };
        this.projectStartDate = new Date(2014, 2, 22)
        this.projectEndDate = new Date(2014, 4, 22)
        this.gridLines = 'Both';
        this.toolbar = ['ExcelExport', 'CsvExport', 'PdfExport'];
        this.timelineSettings = {
            topTier: {
                unit: 'Week',
                format: 'MMM dd, y',
            },
            bottomTier: {
                unit: 'Day',
            },
        };
        this.labelSettings = {
            leftLabel: 'TaskName',
            rightLabel: 'resources'
        };
    }

    async componentWillMount() {
        await this.loadCsv()
        await this.timeout(100)
        await this.getGanttGraph()
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

    async getGanttGraph(criterions) {
        console.log("this.state.dataframe")
        console.log(this.state.dataframe)
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
    
        let graph = []
        let labels = []
        let day = 1000*60*60*24
        let baseXPosition = new Date(2014, 2, 22)
        let widthOfCycleLife = 4
        let i = 1
        var lastRow = null;

        df.chain(row => {
            let cycleLifeIndex = cycleLifeCategories.indexOf(row.get("Etape Cycle de Vie"))
            let begXPosition = new Date(baseXPosition.getTime() + (widthOfCycleLife * cycleLifeIndex) * day)
            let endXPosition = new Date(baseXPosition.getTime() + (widthOfCycleLife * cycleLifeIndex) * day + widthOfCycleLife * day)
    
            let node = {
                TaskID: i,
                TaskName: row.get("Use Case"),
                StartDate: begXPosition,
                EndDate: endXPosition,
                subtasks: [],
            }
            if (lastRow != null && lastRow.get("Etape Cycle de Vie") != row.get("Etape Cycle de Vie")) {
                node["Predecessor"] = i - 1
            }

            graph.push(node)
            lastRow = row

            labels.push({
                resourceId: i++,
                resourceName: row.get("CRITERES")
            })
        })
        // graph[2]["Predecessor"] = 2
        console.log(graph)
    
        this.setState({
            graph: graph,
            graphLabels: labels,
        })
    }

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

    timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    toolbarClick(args) {
        if (args.item.id === "GanttExport_excelexport") {
            this.ganttInstance.excelExport();
        }
        else if (args.item.id === "GanttExport_csvexport") {
            this.ganttInstance.csvExport();
        }
        else if (args.item.id === "GanttExport_pdfexport") {
            this.ganttInstance.pdfExport();
        }
    }
    render() {
        console.log(editingResources)
        return (<div className='control-pane'>
        <div className='control-section'>
          <GanttComponent id='GanttExport' ref={gantt => this.ganttInstance = gantt} dataSource={this.state.graph} dateFormat={'MMM dd, y'} treeColumnIndex={1} allowExcelExport={true} allowPdfExport={true} allowSelection={true} showColumnMenu={false} highlightWeekends={true} allowUnscheduledTasks={true} projectStartDate={this.projectStartDate} projectEndDate={this.projectEndDate} splitterSettings={this.splitterSettings} taskFields={this.taskFields} timelineSettings={this.timelineSettings} labelSettings={this.labelSettings} toolbarClick={this.toolbarClick.bind(this)} height='410px' gridLines={this.gridLines} toolbar={this.toolbar} resourceFields={this.resourceFields} resources={editingResources}>
            <ColumnsDirective>
              <ColumnDirective field='TaskID' width='60'></ColumnDirective>
              <ColumnDirective field='TaskName' width='250'></ColumnDirective>
              <ColumnDirective field='StartDate'></ColumnDirective>
              <ColumnDirective field='EndDate'></ColumnDirective>
              <ColumnDirective field='Duration'></ColumnDirective>
              <ColumnDirective field='Predecessor'></ColumnDirective>
              <ColumnDirective field='resources'></ColumnDirective>
              <ColumnDirective field='Progress'></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Selection, Toolbar, ExcelExport, PdfExport]}/>
          </GanttComponent>
        </div>
      </div>);
    }
}

export default Graph;