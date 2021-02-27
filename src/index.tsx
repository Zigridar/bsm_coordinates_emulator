import {render} from 'react-dom'
import React from 'react'
import {Card, Col, Layout, Row} from 'antd'
import 'antd/dist/antd.css'
import GeoZoneMap from './components/GeoZoneMap'
import './css/FullHeight.css'

const { Header, Footer, Content } = Layout

const App: React.FC = () => {

    const cardPadding: number = 15

    return (
        <Layout style={{ height: '100vh' }}>
            <Header/>
            <Content  className='full-height' style={{padding: '10px'}}>
                <Row gutter={16} className='full-height'>
                    <Col span={12} className='full-height'>
                        <Card className='full-height' bodyStyle={{ padding: '0px' }} style={{ padding: `${cardPadding}px` }}>
                            <GeoZoneMap cardPadding={cardPadding} />
                        </Card>
                    </Col>
                    <Col span={12} className='full-height'>
                        <Card className='full-height' bodyStyle={{ padding: '0px' }} style={{ padding: `${cardPadding}px` }}>
                            <GeoZoneMap cardPadding={cardPadding}/>
                        </Card>
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2021 Created by Max Safonenko</Footer>
        </Layout>
    )
}

render(<App />, document.getElementById('app'))