import React, {Component} from 'react';
//import ReactDOM from 'react-dom/client';
import './index.css';

class App extends React.Component
{
    constructor(props){
        super(props);
        this.state = {  serverDate: "empty", 
                        serverUpTime: "empty", 
                        serverUpTimeInstance: "empty"};
    }

    componentDidMount(){
        //this.Connect();
        this.Retreive();
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

    Retreive = async () => {
        const res = await fetch ('/Retrieve');
        const file = await res.json();

        this.state.serverDate = file.serverDate;
        this.state.serverUpTime = file.serverUpTime;
        this.state.serverUpTimeInstance = file.serverUpTimeInstance;

        this.setState({state: this.State});
        
        return file;
    }

    render (){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">{this.state.data}</p>
                <p className="Date">{this.state.serverDate}</p>
                <p className="UpTime">{this.state.serverUpTime}</p>
                <p className="UpTimeInstance">{this.state.serverUpTimeInstance}</p>
            </div>
        );
    }
}

export default App;