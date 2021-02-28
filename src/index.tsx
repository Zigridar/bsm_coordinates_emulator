import {render} from 'react-dom'
import React from 'react'
import {Card, Col, Layout, Row} from 'antd'
import 'antd/dist/antd.css'
import './css/FullHeight.css'
import {Provider} from "react-redux"
import store from "./redux/store"
import CommandHeaderWithState from './components/CommandHeader'
import LeftMapWithState from './components/LeftMap'
import RightMapWithState from './components/RightMap'

const { Footer, Content } = Layout

const App: React.FC = () => {

    const cardPadding: number = 15

    return (
        <Layout style={{ height: '100vh' }}>
            <CommandHeaderWithState/>
            <Content  className='full-height' style={{padding: '10px'}}>
                <Row gutter={16} className='full-height'>
                    <Col span={12} className='full-height'>
                        <Card className='full-height' bodyStyle={{ padding: '0px' }} style={{ padding: `${cardPadding}px` }}>
                            <LeftMapWithState cardPadding={cardPadding} />
                        </Card>
                    </Col>
                    <Col span={12} className='full-height'>
                        <Card className='full-height' bodyStyle={{ padding: '0px' }} style={{ padding: `${cardPadding}px` }}>
                            <RightMapWithState cardPadding={cardPadding}/>
                        </Card>
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2021 Created by Max Safonenko</Footer>
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