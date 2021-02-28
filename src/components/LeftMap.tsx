import GeoZoneMapWithState from './GeoZoneMap'
import React from 'react'
import {connect} from 'react-redux'

interface OwnProps {
    cardPadding: number
}

interface StateProps {

}

interface DispatchProps {

}

const mapStateToProps = (state: FabricState) => {
    const props: StateProps = {

    }
    return props
}

const mapDispatchToProps = () => {
    const props: DispatchProps = {

    }
    return props
}

type LeftMapProps = OwnProps & StateProps & DispatchProps

const LeftMap: React.FC<LeftMapProps>= (props: LeftMapProps) => {



    return(<GeoZoneMapWithState cardPadding={props.cardPadding}/>)
}

const LeftMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(LeftMap)

export default LeftMapWithState