import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart'

export function CountsPie({ counts }){
    return(
        <PieChart
        series={[
            {
                data:[
                    {id: 0, value: counts[0], label: 'Negative', color: "#ff0000"},
                    { id: 1, value: counts[1], label: 'Neutral', color: "#e49400" },
                    { id: 2, value: counts[2], label: 'Positive', color: "#02aa0a" },
                ],
            },
        ]}
        width={200}
        height={200}
        />
    );
}

export function ConfidenceBar({ confidence }){
    return (
    <BarChart
      height={300}
      yAxis={[{ scaleType: 'band', data: ['Red', 'Green', 'Blue'], categoryGapRatioGapRatio: 0.3 }]}
      series={[{ data: confidence }]}
      layout="horizontal"
    /> 
    );

}