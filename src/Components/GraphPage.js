import React, { Component } from 'react';
import { GanttComponent, Inject, Selection, Toolbar, ExcelExport, PdfExport, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-gantt';
import { editingResources } from './scripts/graph_data';
import DataFrame from "dataframe-js";
import './css/graph.css'

class GraphPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataframe: props.dataframe,
            basket: props.basket,
            columns: [],
            graph: [],
            graphLabels: [],
          }

        this.taskbarWithColorBinded = this.taskbarWithColor.bind(this)

        this.taskBarColors = {
            "STRATEGIE": "#1b5e20",
            "SPECIFICATIONS": "#00695c",
            "UX/UI": "#0097a7",
            "CONTENUS": "#039be5",
            "ARCHITECTURE": "#2196f3",
            "FRONTEND": "#5c6bc0",
            "BACKEND": "#9575cd",
            "HEBERGEMENT": "#ce93d8",
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
        this.projectStartDate = new Date()
        let projectNbDays = 40
        this.projectEndDate = new Date(Date.now()+ (1000*60*60*24) * projectNbDays)
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
            // leftLabel: 'TaskName',
            rightLabel: 'resources'
        };
    }

    async componentWillMount() {
        await this.getGanttGraph()
    }

    async getGanttGraph(criterions) {
        if (this.state.dataframe == null)
            return []

        let cycleLifeCategories = [ 'Acquisition', 'Conception', 'R??alisation', 'D??ploiement', 'Administration', 
            'Utilisation', 'Maintenance', 'Fin de Vie', 'Revalorisation' ]
    
        let graph = []
        let labels = []
        let day = 1000*60*60*24
        let baseXPosition = this.projectStartDate
        let widthOfCycleLife = 4
        let i = 1
        var lastCycle = null;

        this.state.basket.forEach(element => {
            let cycleLifeIndex = cycleLifeCategories.indexOf(element.cycle)
            let begXPosition = new Date(baseXPosition.getTime() + (widthOfCycleLife * cycleLifeIndex) * day)
            let endXPosition = new Date(baseXPosition.getTime() + (widthOfCycleLife * cycleLifeIndex) * day + widthOfCycleLife * day)
    
            let node = {
                TaskID: i,
                TaskName: element.useCase,
                StartDate: begXPosition,
                EndDate: endXPosition,
                subtasks: [],
                category: element.family,
                useCase: element.useCase
            }
            if (lastCycle != null && lastCycle != element.cycle) {
                node["Predecessor"] = i - 1
            }

            graph.push(node)
            lastCycle = element.cycle

            labels.push({
                resourceId: i++,
                resourceName: element.criterion
            })
        })
    
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
            .select("Famille d'origine", "CRITERES", "Etape Cycle de Vie", "incontournables", "Use Case", "JUSTIFICATIONS", "Priorit??");
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

    translatePriorityToInteger(row) {
        let priority = row.get("Priorit??")
        let priorities = {
          "Low": 1,
          "Medium": 2,
          "High": 3,
          "": 4,
        }
        row = row.set("Priorit??", priorities[priority])
        return row
    }

    translateCycleLifeToInteger(row) {
        let cycleLife = row.get("Etape Cycle de Vie")
        let priorities = [ 'Acquisition', 'Conception', 'R??alisation', 'D??ploiement', 'Administration', 
         'Utilisation', 'Maintenance', 'Fin de Vie', 'Revalorisation' ]
    
         row = row.set("Cycle life priority", priorities.indexOf(cycleLife))
         return row
      }

    sortDataframe(df) {
        // add a new colum with an integer representing the priority based on cycle life
        df = df.withColumn("Cycle life priority")
        df = df.chain(this.translateCycleLifeToInteger)
    
        // sort first by priority and then by cycle life to make groups
        df = df.sortBy("Priorit??")
        df = df.sortBy("Cycle life priority")
        return df
    }

    timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    taskbarWithColor(props) {
        return (
        <div className="e-gantt-child-taskbar e-custom-moments" style={{ height: "100%", borderRadius: "5px", backgroundColor:this.taskBarColors[props.taskData.category], textAlign: "center" }}>
            <div>
              <span className="e-task-label" style={{textOoverflow: "ellipsis", height: "90%", overflow: "hidden", color: "white", fontSize: "10px" }}>{props.taskData.useCase}</span>
            </div>
        </div>)
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

    loadLegend() {
        let colors = { "STRATEGIE": "#1b5e20",
            "SPECIFICATIONS": "#00695c",
            "UX/UI": "#0097a7",
            "CONTENUS": "#039be5",
            "ARCHITECTURE": "#2196f3",
            "FRONTEND": "#5c6bc0",
            "BACKEND": "#9575cd",
            "HEBERGEMENT": "#ce93d8",
        }
        let elements = []
        for (const [label, color] of Object.entries(colors)) {
            elements.push(
                <div className="row">
                    <div className="col legend" style={{backgroundColor: color}}></div>
                    <div className="col">{label}</div>
                    <div className="col"></div>
                    <div className="col"></div>
                </div>
            )
        }
        return elements
    }

    render() {
        return (<div className='control-pane'>
        <a href = "/list"> <button class="link-button button basket-btn button-before">Retour</button></a>
        <div>
        <h2 className="margin30">Diagramme de Gantt</h2>
            <div className='control-section'>
            <GanttComponent id='GanttExport' ref={gantt => this.ganttInstance = gantt} height='700px' rowHeight={45} taskbarHeight={35} dataSource={this.state.graph} dateFormat={'MMM dd, y'} treeColumnIndex={1} allowExcelExport={true} allowPdfExport={true} allowSelection={true} showColumnMenu={false} highlightWeekends={true} allowUnscheduledTasks={true} projectStartDate={this.projectStartDate} projectEndDate={this.projectEndDate} splitterSettings={this.splitterSettings} taskFields={this.taskFields} timelineSettings={this.timelineSettings} labelSettings={this.labelSettings} toolbarClick={this.toolbarClick.bind(this)} height='410px' gridLines={this.gridLines} toolbar={this.toolbar} resourceFields={this.resourceFields} resources={editingResources} taskbarTemplate={this.taskbarWithColorBinded}>
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
            <div className="margin30">
            <h3>L??gende</h3>
                { this.loadLegend() }
                <div className="legend"></div>
            </div>
        </div>
      </div>);
    }
}

export default GraphPage;