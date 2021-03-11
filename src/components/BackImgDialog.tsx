import React from 'react'
import {Button, Tooltip, Upload} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {UploadChangeParam} from 'antd/lib/upload/interface'
import {rileToBase64URL} from '../utils'
import {connect} from 'react-redux'
import {RootState} from '../redux/store'
import {uploadBackground} from '../redux/ActionCreators'

interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    uploadBackground: (imgURL: string) => void
}

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {

    }
    return props
}

const mapDispatchToProps: DispatchProps = {
    uploadBackground
}

type BackImgDialogProps = OwnProps & StateProps & DispatchProps

const BackImageDialog: React.FC<BackImgDialogProps> = (props: BackImgDialogProps) => {

    const onChange = (info: UploadChangeParam) => {
        rileToBase64URL(info.file.originFileObj)
            .then(props.uploadBackground)
    }

    return(
        <Tooltip
            title={'Загрузить подложку'}
        >
            <Upload
                onChange={onChange}
            >
                <Button
                    icon={<UploadOutlined/>}
                />
            </Upload>
        </Tooltip>
    )
}

const BackgroundImageDialog = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BackImageDialog)

export default BackgroundImageDialog