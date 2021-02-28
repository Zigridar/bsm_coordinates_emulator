import {Header} from 'antd/es/layout/layout'
import React from 'react'
import {connect} from 'react-redux'
import {fabric} from 'fabric'
import {Button} from "antd";
import {Dispatch} from "redux";
import {addFabricObjectAction, removeFabricObjectAction} from "../redux/actionCreators";

interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    addBsmToCanvas: (bsm: fabric.Object) => void
    removeBsmFromCanvas: (bsm: fabric.Object) => void
}

const mapStateToProps = () => {
    const props: StateProps = {

    }
    return props
}

const mapDispatchToProps = (dispatch: Dispatch<FabricObjectAction>) => {
    const props: DispatchProps = {
        addBsmToCanvas: (bsm: fabric.Object) => {
            dispatch(addFabricObjectAction(bsm))
        },
        removeBsmFromCanvas: (bsm: fabric.Object) => {
            dispatch(removeFabricObjectAction(bsm))
        }
    }
    return props
}

type CommandHeaderProps = OwnProps & StateProps & DispatchProps

const createBsm = () => {
    const circle = new fabric.Circle({
        radius: 20,
        // angle: 63,
        // hasBorders: false,
        fill: '#ff6620',
        // hasControls: false
    })

    const text = new fabric.Text('kek', {

    })

    const group = new fabric.Group([circle, text], {
        hasControls: false,
        // hasBorders: false
    })

    return group
}

const CommandHeader: React.FC<CommandHeaderProps> = (props: CommandHeaderProps) => {

    const addBsm = (e: React.MouseEvent) => {
        e.preventDefault()
        props.addBsmToCanvas(createBsm())
    }

    const removeBsm = (e: React.MouseEvent, bsm: fabric.Object) => {
        e.preventDefault()
    }

    return(
        <Header>
            <Button
                onClick={addBsm}
            >
                add BSM
            </Button>
            <Button
                onClick={addBsm}
            >
                remove BSM
            </Button>
        </Header>
    )
}

const CommandHeaderWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CommandHeader)

export default CommandHeaderWithState