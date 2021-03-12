import React from 'react'
import {Button, Space, Tooltip, Upload} from 'antd'
import {SaveOutlined, UploadOutlined} from '@ant-design/icons'
import {UploadChangeParam} from 'antd/lib/upload/interface'
import {fileToBase64URL} from '../utils'
import {connect} from 'react-redux'
import {RootState} from '../redux/store'
import {saveBackground, uploadBackground} from '../redux/ActionCreators'
import {fabric} from 'fabric'

interface OwnProps {

}

interface StateProps {
    backgroundImg: fabric.Image
}

interface DispatchProps {
    uploadBackground: (image: fabric.Image) => void
    saveBackground: () => void
}

const mapStateToProps = (state: RootState) => {
    const props: StateProps = {
        backgroundImg: state.fabric.uploadLayerURL
    }
    return props
}

const mapDispatchToProps: DispatchProps = {
    uploadBackground,
    saveBackground
}

type BackImgDialogProps = OwnProps & StateProps & DispatchProps

const BackImageDialog: React.FC<BackImgDialogProps> = (props: BackImgDialogProps) => {

    const onChange = (info: UploadChangeParam) => {
        fileToBase64URL(info.file.originFileObj)
            .then((imgURL: string) => {
                fabric.Image.fromURL(imgURL, (image: fabric.Image) => {
                    props.uploadBackground(image)
                })
            })
    }

    const onClick = () => props.saveBackground()

    return(
        <Space
            size={'middle'}
        >
            {!props.backgroundImg &&
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
            }
            {props.backgroundImg &&
                <Tooltip
                    title={'Сохранить положение подложки'}
                >
                    <Button
                        size={'large'}
                        shape={'circle'}
                        icon={<SaveOutlined />}
                        onClick={onClick}
                    />
                </Tooltip>
            }
        </Space>
    )
}

const BackgroundImageDialog = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BackImageDialog)

export default BackgroundImageDialog