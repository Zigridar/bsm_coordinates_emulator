import {render} from 'react-dom'
import React from "react"

const App: React.FC = () => {
    return (
        <div>
            <div className="container">
                <h1>Webpack</h1>
            </div>
            <hr/>

            <div className="logo"/>

            <hr/>

            <pre/>
        </div>
    )
}

render(<App />, document.getElementById('app'))