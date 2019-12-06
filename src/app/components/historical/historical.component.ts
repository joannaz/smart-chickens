/**
 * Parent page for  historical data.
 * 
 * @author Joanna Zhang, Damon Sweeney
 * @version 19-01-2019
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service'
import { DoorService } from '../../services/door.service'
import { Subscription } from 'rxjs'
import { GoogleChartComponent, ChartErrorEvent } from 'angular-google-charts';

@Component({
    selector: 'historical',
    templateUrl: './historical.component.html',
    styleUrls: ['./historical.component.less']
})
export class HistoricalComponent implements OnInit, OnDestroy {
    //----------------------------------------------------------------------
    // Graph Settings for PRESSURE
    //----------------------------------------------------------------------
    public presData: Array<any> = [
        { data: [], label: 'Pressure / mBar' }
    ]
    public presLabels: Array<any> = []

    public presColors: Array<any> = [
        {
            backgroundColor: 'rgba(67, 160, 71, 0.45)',
            borderColor: 'rgba(67, 160, 71, 0.65)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ]


    //----------------------------------------------------------------------
    // Graph Settings for DUST
    //----------------------------------------------------------------------

    public dustData: Array<any> = [
        { data: [], label: 'Dust / ug/m3' }
    ]
    public dustLabels: Array<any> = []

    public dustColors: Array<any> = [
        {
            backgroundColor: 'rgba(38, 166, 154, 0.45)',
            borderColor: 'rgba(38, 166, 154, 0.65)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ]

    //----------------------------------------------------------------------
    // Graph Settings for TEMPERATURE
    //----------------------------------------------------------------------

    public tempData: Array<any> = [
        { data: [], label: 'Temperature / C' }
    ]
    public tempLabels: Array<any> = []

    public tempColors: Array<any> = [
        {
            backgroundColor: 'rgba(239, 83, 80, 0.45)',
            borderColor: 'rgba(239, 83, 80, 0.65)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ]

    //----------------------------------------------------------------------
    // Graph Settings for HUMIDITY
    //----------------------------------------------------------------------
    public humidData: Array<any> = [
        { data: [], label: 'Humidity / %' }
    ]
    public humidLabels: Array<any> = []

    public humidColors: Array<any> = [
        {
            backgroundColor: 'rgba(121, 134, 203, 0.45)',
            borderColor: 'rgba(121, 134, 203, 0.65)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ]

    //----------------------------------------------------------------------
    // Graph Settings for DOOR
    //----------------------------------------------------------------------

    public timeLineType = "Timeline"
    public doorData = [ ]

    public doorColumnNames = [{ type: 'string', id: 'Sensor' }, { type: 'string', id: 'State' }, { type: 'date', id: 'Start' }, { type: 'date', id: 'End' }]

    public doorOptions = {

    }

    @ViewChild('chart')
    chart: GoogleChartComponent;

    //----------------------------------------------------------------------
    // Graph Settings for WATER
    //----------------------------------------------------------------------

    public waterData = [ ]

    public waterColumnNames = [{ type: 'string', id: 'Sensor' }, { type: 'string', id: 'State' }, { type: 'date', id: 'Start' }, { type: 'date', id: 'End' }]

    public waterOptions = {
        
    }

    @ViewChild('waterChart')
    waterChart: GoogleChartComponent;

    //----------------------------------------------------------------------
    // Graph Settings for all graphs
    //----------------------------------------------------------------------

    public lineChartLegend: boolean = false;
    public lineChartType: string = 'line';
    public lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'time',
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 3
                },
                time: {
                    displayFormats: {
                      millisecond: 'MMM DD',
                      second: 'MMM DD',
                      minute: 'MMM DD',
                      hour: 'MMM DD',
                      day: 'MMM DD',
                      week: 'MMM DD',
                      month: 'MMM DD',
                      quarter: 'MMM DD',
                      year: 'MMM DD',
                    }
                }
            }]
        }

    }

    /* Section for unsubscribing from Subscriptions to avoid
      memory leaks */
    subscription: Subscription = new Subscription()

    /**
     * Constructor for the Historical Data Component displaying graphs
     * @param dataService 
     */
    constructor(private dataService: DataService, private doorService: DoorService) { }

    /**
     * Get the last 10 readings and put them in a graph
     */
    ngOnInit(): void {
        // Formats door data to work with Google Charts
        this.subscription.add(this.doorService.getDoorStatusPastDay().subscribe(res => {
            let pastDate
            let pastVal
            for (var iter in res) {
                let data = res[iter]
                if (!pastDate) {
                    pastDate = data.date
                    pastVal = data.value
                } else {
                    if(pastVal !== data.value.toString()){
                        let addData = ['Door', pastVal, this.df(new Date(pastDate)), this.df(new Date(data.date))]
                        this.doorData.push(addData)
                        pastDate = data.date
                        pastVal = data.value
                    }                    
                }
            }

            let addData = ['Door', pastVal, this.df(new Date(pastDate)), this.df(new Date())]
            this.doorData.push(addData)
            this.doorData = Object.assign([], this.doorData)
            
        }))

        this.subscription.add(this.dataService.getWaterValues(10).subscribe(res => {

            let pastDate
            let pastVal
            for (var iter in res.data) {
                let data = res.data[iter]

                if (!pastDate) {
                    pastDate = data.date
                    pastVal = data.value ? "present" : "low"
                } else {
                    if(pastVal !== data.value.toString()){
                        let addData = ['Water', pastVal, this.df(new Date(pastDate)), this.df(new Date(data.date))]
                        this.waterData.push(addData)
                        pastDate = data.date
                        pastVal = data.value ? "present" : "low"
                    }
                }
            }
            let addData = ['Water', pastVal, this.df(new Date(pastDate)), this.df(new Date())]
            this.waterData.push(addData)
            this.waterData = Object.assign([], this.waterData)
        }
        ))


        this.subscription.add(this.dataService.getDustValues(10).subscribe(x => {
            x.data.forEach(element => {
                this.dustData[0].data.push(element.value),
                    this.dustLabels.push((new Date(element.date)))
            })

            // Needed to auto update chart for dynamic datasets
            // Trick: Reassign to the exposed dataset property into your
            // component so it triggers change detection
            // https://github.com/valor-software/ng2-charts/issues/959#issuecomment-367171535
            this.dustData[0].data.reverse()
            this.dustLabels.reverse()
            this.dustData = Object.assign([], this.dustData);
        }
        ))


        this.subscription.add(this.dataService.getHumidValues(10).subscribe(x => {
            x.data.forEach(element => {
                this.humidData[0].data.push(element.value),
                    this.humidLabels.push((new Date(element.date)))
            })
            this.humidData[0].data.reverse()
            this.humidLabels.reverse()
            this.humidData = Object.assign([], this.humidData);
        }
        ))


        this.subscription.add(this.dataService.getTempValues(10).subscribe(x => {
            x.data.forEach(element => {
                this.tempData[0].data.push(element.value),
                    this.tempLabels.push((new Date(element.date)))
            })
            this.tempData[0].data.reverse()
            this.tempLabels.reverse()
            this.tempData = Object.assign([], this.tempData);
        }
        ))

        this.subscription.add(this.dataService.getPressureValues(10).subscribe(x => {
            x.data.forEach(element => {
                this.presData[0].data.push(element.value),
                    this.presLabels.push((new Date(element.date)))
            })
            this.presData[0].data.reverse()
            this.presLabels.reverse()
            this.presData = Object.assign([], this.presData);
            }
        ))
    }

    /**
     * Formate date to remove milliseconds
     * @param date date to format
     */
    df(date: Date): Date {
        date.setMilliseconds(0)
        return date
    }

    updateChartData(newData: Array<Array<string | Date>>) { 
        this.doorData = newData; 
    }

    /**
     * Format x axis labels nicely
     * @param dateTime Format
     * @returns string of nice date
     */
    formatDateTime(dateTime): string {
        let x = new Date(dateTime)
        if(x.getMinutes() < 10){
            return (x.getDate() + " " + this.getFriendlyMonth(x.getMonth()) + " " + x.getHours() + ":0" + x.getMinutes())    
        }
        return (x.getDate() + " " + this.getFriendlyMonth(x.getMonth()) + " " + x.getHours() + ":" + x.getMinutes())
    }

    /**
     * Returns a user friendly month name
     * @param month the month number
     * @returns friendly month
     */
    getFriendlyMonth(month): string {
        switch (month) {
            case 0: return "Jan"
            case 1: return "Feb"
            case 2: return "Mar"
            case 3: return "April"
            case 4: return "May"
            case 5: return "June"
            case 6: return "July"
            case 7: return "Aug"
            case 8: return "Sep"
            case 9: return "Oct"
            case 10: return "Nov"
            case 11: return "Dec"
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
