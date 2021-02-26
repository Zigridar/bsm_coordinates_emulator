import {render} from 'react-dom'
import React from "react"
import {Layout, Menu} from 'antd'
import 'antd/dist/antd.compact.css'

const { Header, Footer, Content } = Layout

const App: React.FC = () => {
    return (
        <Layout>
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
            </Header>
            <Content>
                <div>Content</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2021 Created by Max Safonenko</Footer>
        </Layout>
    )
}

render(<App />, document.getElementById('app'))