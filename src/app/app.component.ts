import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import * as XLSX from 'xlsx';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { Pipe, PipeTransform } from '@angular/core';


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { posix } from 'path';
import { slice } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'importexcel';
  public progress: number;
  public message: string;
  public excelData: ExcelData[];
  public require: any
  public result: {};
  public combineArray: {};
  public countpos: number;
  public countneg: number;
  public countneutral: number;
  public count: number;
  public distinctArray: {};
  public customeruniquearray= {};
  public positivearr = {};
  public negativearr = {};
  public neutralarr = {};
  public positivuniqueearr = {};
  public negativuniqueearr = {};
  public neutraluniquearr = {};
  public chart: AmChart;
  public showDiv = {
    previous: false,
    current: false,
    next: false,
    start:true
  }
  public customerOCN: "";
  public iterator: number;
  public resultantarray: {};
  public a = 0;
  public b = 0;
  public c = 0;

  constructor(private http: HttpClient , private AmCharts: AmChartsService) { }
  data = [];
  onFileChange(evt: any) {
    //debugger
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length == 1) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        console.log(wb);
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }

 

  uploadfile() {

    
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    var array = require('array');
    var uniquecount = new array();
    
    this.countpos = 0;
    this.countneg = 0;
    this.countneutral = 0;
    this.iterator = 0;


    let keys = this.data.shift();
    let resArr = this.data.map((e) => {
      let obj = {};
      keys.forEach((key, i) => {
        obj[key] = e[i];
        if (key == "OCN") {
          uniquecount.push(e[i]);
        }
      });
      return obj;
    });
    this.excelData = resArr;

    //this.distinctArray = uniquecount.filter((n, i) => uniquecount.indexOf(n) === i);
 

    let resArr2 = this.data.map((e) => {
      let obj2 = {};
      keys.forEach((key, i) => {
        obj2[key] = e[i];
        if (key == "COMMENTSLONG") {
          obj2[key] = sentiment.analyze(e[i]);
          if (obj2[key].score > 0) {
            obj2[key].score = "positive";
            this.positivearr[this.countpos] = obj2;
            this.countpos = this.countpos + 1;
          }
          else {
            if (obj2[key].score < 0) {
              obj2[key].score = "negative";
              this.negativearr[this.countneg] = obj2;
              this.countneg = this.countneg + 1;
            }
            else {
              obj2[key].score = "neutral";
              this.neutralarr[this.countneutral] = obj2;
              this.countneutral = this.countneutral + 1;
            }
          }
        }
     
        if (key == "OCN") {
          if (obj2[key] == this.customerOCN && obj2[key] != undefined) {
              this.customeruniquearray[this.iterator] = obj2;
            this.iterator = this.iterator + 1;
          
            }
          
          }
        
      });
      return obj2;
    });
    this.count = this.countneg + this.countneutral + this.countpos;
    this.combineArray = resArr2;
  

    ////////////////////////////////////////////////
     
    for (let i in this.customeruniquearray) {
      if (this.customeruniquearray[i].COMMENTSLONG.score == "positive") {
        this.positivuniqueearr[this.a] = this.customeruniquearray[i]; this.a = this.a + 1;
      }
      
      if (this.customeruniquearray[i].COMMENTSLONG.score == "negative") {
        this.negativuniqueearr[this.b] = this.customeruniquearray[i]; this.b = this.b + 1;

      }
      if (this.customeruniquearray[i].COMMENTSLONG.score == "neutral") {
        this.neutraluniquearr[this.c] = this.customeruniquearray[i]; this.c = this.c + 1;
       } 

    }
   
   
    /////////////////////////////////////////////////
    var combinearr = Object.keys(this.combineArray).map(key => ({ type: key, value: this.combineArray[key] }));
    this.combineArray = combinearr;

    var posarr = Object.keys(this.positivearr).map(key => ({ type: key, value: this.positivearr[key] }));
    this.positivearr = posarr;

    var negarr = Object.keys(this.negativearr).map(key => ({ type: key, value: this.negativearr[key] }));
    this.negativearr = negarr;

    var neuarr = Object.keys(this.neutralarr).map(key => ({ type: key, value: this.neutralarr[key] }));
    this.neutralarr = neuarr;


    var cuniquearr = Object.keys(this.customeruniquearray).map(key => ({ type: key, value: this.customeruniquearray[key] }));
    this.customeruniquearray = cuniquearr;

    var puniquearr = Object.keys(this.positivuniqueearr).map(key => ({ type: key, value: this.positivuniqueearr[key] }));
    this.positivuniqueearr = puniquearr;

    var neguniquearr = Object.keys(this.negativuniqueearr).map(key => ({ type: key, value: this.negativuniqueearr[key] }));
    this.negativuniqueearr = neguniquearr;

    var neuniquearr = Object.keys(this.neutraluniquearr).map(key => ({ type: key, value: this.neutraluniquearr[key] }));
    this.neutraluniquearr = neuniquearr;


    /////////////////////////////////////////////////////
    if (this.iterator == 0) {
      this.resultantarray = this.combineArray;
      this.distinctArray = uniquecount.filter((n, i) => uniquecount.indexOf(n) === i);

     
    }
    else {
      this.resultantarray = this.customeruniquearray;
      this.positivearr = this.positivuniqueearr;
      this.negativearr = this.negativuniqueearr;
      this.neutralarr = this.neutraluniquearr;
      this.countneg = this.b;
      this.countpos = this.a;
      this.countneutral = this.c;
      this.count = this.a + this.b + this.c;
    }
  //  console.log(this.resultantarray);
    //////////////////////////////////////////////////////
    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "theme": "light",
      "dataProvider": [{
        "comment": "Positive",
        "count": this.countpos
        //add id reference
      }, {
        "comment": "Negative",
        "count": this.countneg
      }, {
        "comment": "Neutral",
        "count": this.countneutral
      }],
      "valueField": "count",
      "titleField": "comment",
      "balloon": {
        "fixedPosition": true
      },
      "listeners": [{
        "event": "clickSlice",
        "method": function (e) {
          var dp = e.dataItem.dataContext
          console.log(dp);
         // if (dp[this.chart.titleField] === "positive")
           // console.log("hello from positive");
          if (dp.comment == "Positive") {
           
            console.log("hello from positive")
          }
          else {
            if (dp.comment == "Negative")
            {
              console.log("hello from negative")
            }
            else
            {
              console.log("hello from neutral")
            }
          }
          e.chart.validateData();
        }
      }]
    });
    
    /////////////////////////////////////////////////////

    console.log(this.resultantarray);
    console.log(this.positivearr);
    console.log(this.negativearr);
    console.log(this.neutralarr);
    console.log(this.countpos);
    console.log(this.countneg);
    console.log(this.countneutral);
    console.log(this.count);
    }

 
  
  }


  




 



interface ExcelData {
  [index: number]: {
    RID: string; COLTREFERENCE: string; COMPANYNAME: string; OCN: string; TICKETTYPE: string;
    TICKETSTATUS: string; URGENCY: string; FIRSTNAME: string; LASTNAME: string;
    EMAILADDR: string; AUID: string; TODOCD: string; COMMENTSLONG: string
  };
}



