import * as React from 'react';
import { Card } from '../../components';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TrainingGraphicsProps {
    training: object; 
}
class TrainingGraphics extends React.Component<any, TrainingGraphicsProps> {

  render() {
    let HRspeed = [{HR: 0, speed: 0}];
    for (const tb of this.props.training.trainingBlocks) {
    for (const tbr of tb.result) {
      let date = {HR: tbr.HR, speed: tbr.speed };
      HRspeed.push(date);
    }
    }
    return (        
    <div>
    <Card title="HR - Speed">
        <ScatterChart width={300} height={300} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <XAxis dataKey={'HR'} type="number" name="HR" unit="bpm"/>
            <YAxis dataKey={'speed'} type="number" name="speed" unit="km/h"/>
            <CartesianGrid />
            <Scatter name="HR - speed" data={HRspeed} fill="#8884d8"/>
            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
        </ScatterChart>
    </Card>
   {/*} <Card title="HR2 - speed">
        <ScatterChart width={300} height={300} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <XAxis dataKey={'HR'} type="number" name="HR" unit="bpm"/>
            <YAxis dataKey={'speed'} type="number" name="speed" unit="km/h"/>
            <CartesianGrid />
            <Scatter name="HR - speed" data={HRspeed} fill="#8884d8"/>
            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
        </ScatterChart>
    </Card>*/}
    
    </div>   
    );
  }
}

export default TrainingGraphics;
