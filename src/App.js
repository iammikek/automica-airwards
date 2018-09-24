import React, {Component} from 'react';
import './assets/App.css';

import Airwards from './components/Airwards';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header>Automica Airways</header>
                <Airwards></Airwards>
                <footer>
                    an <a href="https://automica.io">automica.io</a> project
                </footer>
            </div>
        );
    }
}

export default App;
