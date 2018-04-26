import * as React from 'react';
import { Card } from '../../components';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer } from 'recharts';

interface TrainingGraphicsProps {
    training: object; 
}
class TrainingGraphics extends React.Component<any, TrainingGraphicsProps> {

  render() {
    let type = localStorage.getItem('type');
    let w = 400;
    if (type === 'USER') {
        w = 600;
    }
    let HRspeed = [{HR: 0, speed: 0}];
    for (const tb of this.props.training.trainingBlocks) {
    for (const tbr of tb.result) {
      let date = {HR: tbr.HR, speed: tbr.speed, distance: tbr.distance };
      HRspeed.push(date);
    }
    }
    return (        
    <div>
    <Card title="HR - Speed">
        <ScatterChart width={w} height={300} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <XAxis dataKey={'HR'} type="number" name="HR" unit="bpm"/>
            <YAxis dataKey={'speed'} type="number" name="speed" unit="m/s"/>
            <CartesianGrid />
            <Scatter name="HR - speed" data={HRspeed} fill="#8884d8"/>
            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
        </ScatterChart>
    </Card>
    <Card title="Distance">
    <ResponsiveContainer width="100%" height={100}>
        <LineChart data={HRspeed}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={'distance'} name="Distance" unit="m"/>
              <Line type="monotone" dataKey={'HR'} name="HR" unit="bpm" stroke="#4286f4" strokeWidth={2} />
        </LineChart>
    </ResponsiveContainer>
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
