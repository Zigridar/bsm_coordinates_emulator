import {render} from 'react-dom'
import React from 'react'
import {Card, Col, Layout, Row} from 'antd'
import 'antd/dist/antd.css'
import './css/FullHeight.css'
import {Provider} from 'react-redux'
import store from './redux/store'
import CommandHeaderWithState from './components/CommandHeader'
import GeoZoneMap from './components/GeoZoneMap'

const { Content } = Layout

import MyWorker from "worker-loader!./workers/learn.worker"

const worker = new MyWorker();

worker.postMessage({ a: 1 });
worker.onmessage = (event) => {
    console.log(event)
};

worker.addEventListener("message", (event) => {});

const App: React.FC = () => {

    const cardPadding: number = 15

    return (
        <Layout style={{ height: '100vh' }}>
            <CommandHeaderWithState/>
            <Content  className='full-height' style={{padding: '10px'}}>
                <Row gutter={16} className='full-height'>
                    <Col span={24} className='full-height'>
                        <Card className='full-height' bodyStyle={{ padding: '0px' }} style={{ padding: `${cardPadding}px` }}>
                            <GeoZoneMap cardPadding={cardPadding} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

const AppWithReduxProvider = () => {
    return(
        <Provider store={store}>
            <App/>
        </Provider>
    )
}

render(<AppWithReduxProvider />, document.getElementById('app'))