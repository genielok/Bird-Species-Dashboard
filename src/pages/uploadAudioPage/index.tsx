import React, { useState } from 'react';
import { Button, message, Upload, type UploadFile, type UploadProps } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../utils/api';
import { analyzeAudioFiles } from '../../utils/analyze';
import AnalyzeList from './AnalyzeList';

const { Dragger } = Upload;



const UploadAudioPage: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: `${BASE_URL}/analyze`,
        beforeUpload: (file) => {
            setFileList(currentList => [...currentList, file]);
            return false;
        },
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        fileList,
    };

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'File(s) uploaded successfully, please reload the analysis records.',
        });
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning('Please select a file to upload.');
            return;
        }
        setUploading(true);

        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file as any);
        });


        try {
            await analyzeAudioFiles(formData)
            success()
            setFileList([])
        } catch (error) {
            console.error('Upload Error:', error);
        } finally {
            setUploading(false);
        }
    };


    return (
        < div >
            {contextHolder}
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag audio file(s) to this area to upload</p>
                <p className="ant-upload-hint">
                </p>
            </Dragger>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
                icon={<UploadOutlined />}
            >
                {uploading ? 'Uploading...' : 'Start Upload'}
            </Button>
            <AnalyzeList />

        </div >
    )
}

export default UploadAudioPage