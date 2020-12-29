import React,{FunctionComponent} from 'react';

import {
  RadialChart
} from 'react-vis';

import "./DonutChart.modules.scss";



interface topWord {
    word:string;
    count:number;
  }
  
    export interface DonutChartProps {
      topWordsData:Array<topWord>;
      allWords:number;
  }


const DonutChart: FunctionComponent<DonutChartProps> = (props) => {
    
 const myData = [{angle: 1,label:"xd"}, {angle: 5, padAngle: 35, label:"xd"}, {angle: 2}]
 const topWordsCountSum = props.topWordsData
  .map(el => el.count)
  .reduce((a,b) => a+b, 0);
    let  data = props.topWordsData.map(wordObj => {
        return {
            angle: wordObj.count / props.allWords,
            label: wordObj.word,
            subLabel: `${Math.ceil((wordObj.count / props.allWords) * 100)}%`
        }
    });
    const others = {
            angle: (props.allWords - topWordsCountSum) / props.allWords,
            label: `other words`,
            subLabel: `${Math.ceil((props.allWords - topWordsCountSum) / props.allWords * 100)}%`
        }
       const finalData = data.push(others);
    return (
      <>
        <div>
            
          <RadialChart
          className="donut-chart"
  data={data}
  width={300}
  height={300} 
  padAngle={0.02}

  showLabels={true}
  labelsAboveChildren={true}
  >
      <div className="center-circle"></div>
  </RadialChart>
        </div>
        
        </>
      );
  }

export default DonutChart;