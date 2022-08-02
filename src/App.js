import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';
import React, {Component} from 'react';
//import ReactDOM from 'react-dom/client';
import './App.css';

import { StyledEngineProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {
    LineChart,
    BarChart,
    Line,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from "recharts";



class App extends React.Component
{
    constructor(props){
        super(props);
        this.state = {  serverDate: "empty", 
                        serverUpTime: "empty", 
                        serverUpTimeInstance: "empty",
                        serverTotalMemory: "empty",
                        serverUsedMemory: "empty",
                        serverCPUUsage: "empty",
                        databaseReturnTable: []
                    };
    }

    componentDidMount(){
        //this.Connect();
        this.Retrieve();
    }

    componentWillUnmount(){
        // do stuff
    }

    /*
    Connect = async () => {
        const res = await fetch ('/Connect');
        const file = await res.json();

        if (res.status !== 200){
            throw Error(file.message);
        }

        return file;
    }
    */

    Retrieve = async () => {
        const res = await fetch ('/Retrieve');
        const file = await res.json();

        file.databaseReturnTable.forEach(item => {let temp = item.id; item.id = item._id; item._id = temp;})
        file.databaseReturnTable.forEach(item => {let temp = Math.floor((item.serverUsedMemory / item.serverTotalMemory) * 100); item.serverMemoryUsage = temp;})

        this.state.serverDate = file.serverDate;
        this.state.serverUpTime = file.serverUpTime;
        this.state.serverUpTimeInstance = file.serverUpTimeInstance;
        this.state.serverTotalMemory = file.serverTotalMemory;
        this.state.serverUsedMemory = file.serverUsedMemory;
        this.state.serverCPUUsage = file.serverCPUUsage;
        this.state.databaseReturnTable = file.databaseReturnTable;

        this.setState({state: this.State});
        
        return file;
    }

    render (){
        return(
            <div className="App">
                <p className="App-intro">{this.state.data}</p>
                <p className="TitleHeader">{"Most Recent Entry:"}</p>
                <p className="Date">{this.state.serverDate}</p>
                <p className="UpTime">{this.state.serverUpTime}</p>
                <p className="UpTimeInstance">{this.state.serverUpTimeInstance}</p>
                <p className="TotalMemory">{this.state.serverTotalMemory}</p>
                <p className="UsedMemory">{this.state.serverUsedMemory}</p>
                <p className="CPUUsage">{this.state.serverCPUUsage}</p>

                <LineChart
                    width={1000}
                    height={200}
                    data={this.state.databaseReturnTable}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serverDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="serverUpTime.timeTicks"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="serverUpTimeInstance.timeTicks" stroke="#82ca9d" />
                </LineChart>

                <LineChart
                    width={1000}
                    height={200}
                    data={this.state.databaseReturnTable}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serverDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="serverTotalMemory"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="serverUsedMemory" stroke="#82ca9d" />
                </LineChart>

                <BarChart
                    width={1000}
                    height={300}
                    data={this.state.databaseReturnTable}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serverDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="serverCPUUsage" fill="#8884d8" />
                    <Bar dataKey="serverMemoryUsage" fill="#82ca9d" />
                </BarChart>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">UpTime&nbsp;</TableCell>
                                <TableCell align="right">UpTime Instance&nbsp;</TableCell>
                                <TableCell align="right">Total Memory&nbsp;</TableCell>
                                <TableCell align="right">Used Memory&nbsp;</TableCell>
                                <TableCell align="right">CPU Usage&nbsp;(%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.databaseReturnTable.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="right">{row.serverDate != undefined
                                        ? row.serverDate.toString() : ""}</TableCell>
                                    <TableCell align="right">{row.serverUpTime != undefined
                                        ? row.serverUpTime.timeTicks.toString() : ""}</TableCell>
                                    <TableCell align="right">{row.serverUpTimeInstance != undefined
                                        ? row.serverUpTimeInstance.timeTicks.toString() : ""}</TableCell>
                                    <TableCell align="right">{row.serverTotalMemory != undefined
                                        ? row.serverTotalMemory.toString() : ""}</TableCell>
                                    <TableCell align="right">{row.serverUsedMemory != undefined
                                        ? row.serverUsedMemory.toString() : ""}</TableCell>
                                    <TableCell align="right">{row.serverCPUUsage != undefined
                                        ? row.serverCPUUsage.toString() : ""}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

    ErrorCatch(val){
        return val != undefined ? val.toString() : ""
    }
}

export default App;