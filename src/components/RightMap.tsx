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

type RightMapProps = OwnProps & StateProps & DispatchProps

const RightMap: React.FC<RightMapProps>= (props: RightMapProps) => {

    return(<GeoZoneMapWithState bsmList={[]} cardPadding={props.cardPadding}/>)
}

const RightMapWithState = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(RightMap)

export default RightMapWithState