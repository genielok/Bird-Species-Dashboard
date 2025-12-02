import React, { useState } from 'react'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal, Upload, type UploadFile, type UploadProps } from 'antd';
import { getPresignedUrl, startAnalysis, uploadFileToS3 } from '../../utils/analyze';
import styles from './styles.module.css'
const { Dragger } = Upload;

interface Props {
    isOpen: boolean,
    handleClose: () => void;
}

type FieldType = {
    projectName?: string;
};

const UploadForm: React.FC<Props> = ({ isOpen, handleClose }) => {
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [uploadForm] = Form.useForm();

    const handleSuccess = () => {
        onClose()
        messageApi.open({
            type: 'success',
            content: 'File(s) uploaded successfully, please reload the analysis records.',
        });
    };

    const onClose = () => {
        setFileList([])
        uploadForm.resetFields()
        handleClose()
    }

    const props: UploadProps = {
        accept: "audio/*",
        name: 'file',
        multiple: true,
        beforeUpload: () => false,
        onChange: ({ fileList }) => setFileList(fileList),
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        fileList,

    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleUpload = async () => {
        try {
            const values = await uploadForm.validateFields()
            setUploading(true)
            const files = fileList.map(f => ({
                filename: f.name,
                contentType: f.type,
            }));
            const data = await getPresignedUrl(values.projectName, files)
            await uploadFileToS3(data, fileList)
            const s3Keys = data.urls.map((u: { s3_key: string; }) => u.s3_key)
            await startAnalysis(s3Keys, values.projectName)
            handleSuccess()
        } catch (error) {
            console.log(error)
        }
        setUploading(false);
    };

    return (
        <div>{contextHolder}
            <Modal
                centered
                onCancel={onClose}
                title={'Create Audio analyzation project'}
                open={isOpen} onOk={handleUpload}
                okText={uploading ? 'Uploading...' : 'Start Upload'}
                okButtonProps={{
                    loading: uploading,
                    style: { marginTop: 16 },
                    icon: <UploadOutlined />
                }}
            >
                <Form form={uploadForm} name="uploadForm" >
                    <Form.Item<FieldType>
                        label="Project Name"
                        name="projectName"
                        rules={[{ required: true, message: 'Please input project name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true, message: 'Please select a file to upload.' }]}
                        name="files"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Dragger
                            name="files"
                            {...props}
                            className={styles.uploadDraggerWithScroll}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag audio file(s) to this area to upload
                            </p>
                            <p className="ant-upload-hint"></p>
                        </Dragger>
                    </Form.Item>

                </Form>
            </Modal>
        </div >
    )
}
export default UploadForm
