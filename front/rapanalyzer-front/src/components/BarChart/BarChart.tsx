import React,{FunctionComponent} from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  LabelSeries
} from 'react-vis';



interface topWord {
  word:string;
  count:number;
}

  export interface BarChartProps {
    topWordsData:Array<topWord>
}

  const BarChart: FunctionComponent<BarChartProps> = ({
    topWordsData
  }) => {
    
    const barData = topWordsData.map(wordObj => { return {
      x: wordObj.word,
      y: wordObj.count
    }})

    const labelData:any[] = barData.map((d, idx) => (
      d.x
 ));

    return (
        <div>
          <XYPlot xType="ordinal" width={300} height={200} xDistance={200}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <VerticalBarSeries  barWidth={.5} data={barData} />
            <LabelSeries data={labelData}  />
          </XYPlot>
        </div>
      );
  }

export default BarChart;