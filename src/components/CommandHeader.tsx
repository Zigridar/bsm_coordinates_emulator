import {Header} from 'antd/es/layout/layout'
import React from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button, Space} from 'antd'
import {Dispatch} from 'redux'
import {addObjectAction, changeSelectionAction, removeObjectAction} from '../redux/actionCreators'
import {DeleteOutlined} from '@ant-design/icons/lib'
import CreateBSMDialog from './CreateBSMDialog'

interface OwnProps {

}

interface StateProps {
    selection: fabric.Object
    observable: IObservable
}

interface DispatchProps {
    addBsmToCanvas: (bsm: BSM) => void
    removeSelected: (object: fabric.Object) => void
}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {
        selection: state.selection,
        observable: state.observable
    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        addBsmToCanvas: (bsm: BSM) => {
            dispatch(addObjectAction(bsm))
        },
        removeSelected: (object: fabric.Object) => {
            dispatch(removeObjectAction(object))
            dispatch(changeSelectionAction(null))
        }
    }
    return props
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    return(
        <Header>
            <Space size={'middle'}>
                <CreateBSMDialog addBsmToCanvas={props.addBsmToCanvas}/>
                <Button
                    danger={true}
                    shape={'circle'}
                    onClick={() => props.removeSelected(props.selection)}
                    disabled={!props.selection || props.selection === props.observable.object}
                    icon={<DeleteOutlined/>}
                    size={"large"}
                />
            </Space>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState