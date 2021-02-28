import {Header} from 'antd/es/layout/layout'
import React from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button, Space} from 'antd'
import {Dispatch} from 'redux'
import {addObjectAction, changeSelectionAction, removeObjectAction} from '../redux/actionCreators'
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons/lib'

interface OwnProps {

}

interface StateProps {
    selection: fabric.Object
}

interface DispatchProps {
    addBsmToCanvas: (bsm: BSM) => void
    removeSelected: (object: fabric.Object) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        selection: state.selection
    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        addBsmToCanvas: (bsm: BSM) => {
            dispatch(addObjectAction(bsm))
        },
        removeSelected: (object: fabric.Object) => {
            dispatch(removeObjectAction({object, setText: () => {}}))
            dispatch(changeSelectionAction(null))
        }
    }
    return props
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const createBsm: () => BSM = () => {
    const circleObject = new fabric.Circle({
        radius: 20,
        originX: 'center',
        originY: 'center',
        fill: '#ff6620'
    })

    const textObject = new fabric.Text('', {
        fontSize: 10,
        originX: 'center',
        originY: 'center'
    })

    const group = new fabric.Group([circleObject, textObject], {
        hasControls: false,
        left: 0,
        top: 0
    })

    return {
        object: group,
        setText: (text: string) => {
            textObject.set('text', text)
        }
    }
}

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    return(
        <Header>
            <Space size={'middle'}>
                <Button
                    shape={'circle'}
                    onClick={() => props.addBsmToCanvas(createBsm())}
                    icon={<PlusOutlined/>}
                    size={"large"}

                />
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.removeSelected(props.selection)}
                    disabled={!props.selection}
                    icon={<DeleteOutlined/>}
                    size={"large"}
                />
            </Space>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState