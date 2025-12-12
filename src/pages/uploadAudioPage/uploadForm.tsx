import React, { useState, useRef } from 'react';
import { InboxOutlined, CloudUploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { Form, Input, message, Upload, Button, Card, Typography, Progress, Alert } from 'antd';
import type { UploadProps } from 'antd';
import { uploadData } from 'aws-amplify/storage';
import pLimit from 'p-limit';
import styles from './styles.module.css';

const { Dragger } = Upload;
const { Title, Text } = Typography;

interface Props {
    onUploadSuccess?: () => void;
}

const UploadForm: React.FC<Props> = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [rawFiles, setRawFiles] = useState<File[]>([]);

    const [progress, setProgress] = useState({ total: 0, current: 0, percent: 0 });
    const [messageApi, contextHolder] = message.useMessage();
    const [uploadForm] = Form.useForm();

    // WakeLock 引用 (防止屏幕休眠)
    const wakeLockRef = useRef<any>(null);

    // 请求屏幕常亮
    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                console.log('Screen Wake Lock active');
            }
        } catch (err) {
            console.warn('Wake Lock failed:', err);
        }
    };

    const releaseWakeLock = () => {
        if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
        }
    };

    const handleSuccess = (count: number) => {
        messageApi.open({
            type: 'success',
            content: `Done! ${count} files uploaded. Analysis starting...`,
            duration: 10,
        });
        setRawFiles([]);
        setProgress({ total: 0, current: 0, percent: 0 });
        uploadForm.resetFields();
        releaseWakeLock();
        if (onUploadSuccess) onUploadSuccess();
    };

    const props: UploadProps = {
        accept: ".wav,audio/wav",
        name: 'file',
        multiple: true,
        directory: true,
        showUploadList: false,
        beforeUpload: (file) => {
            setRawFiles(prev => [...prev, file]);
            return false;
        },
        fileList: [],
    };

    const handleUpload = async () => {
        try {
            const values = await uploadForm.validateFields();

            const validFiles = rawFiles.filter(f => f.name.toLowerCase().endsWith('.wav'));
            if (validFiles.length === 0) throw new Error("No .wav files selected.");

            setUploading(true);
            await requestWakeLock(); // in case of long upload

            const total = validFiles.length;
            let completed = 0;
            setProgress({ total, current: 0, percent: 0 });

            // parallel limit
            const limit = pLimit(5);

            console.log(`Starting massive upload: ${total} files...`);

            const uploadTasks = validFiles.map((file) => {
                return limit(async () => {
                    const s3Path = `public/raw_uploads/${values.projectName}/audio/${file.name}`;
                    try {
                        await uploadData({
                            path: s3Path,
                            data: file,
                        }).result;

                        completed++;
                        setProgress({
                            total,
                            current: completed,
                            percent: Math.round((completed / total) * 100)
                        });

                        return s3Path;
                    } catch (err) {
                        console.error(`Failed: ${file.name}`, err);
                        return null;
                    }
                });
            });

            const results = await Promise.all(uploadTasks);
            const successfulKeys = results.filter((k): k is string => k !== null);

            if (successfulKeys.length === 0) throw new Error("All uploads failed.");

            const manifestPath = `public/raw_uploads/${values.projectName}/manifest.json`;
            await uploadData({
                path: manifestPath,
                data: JSON.stringify({
                    project_name: values.projectName,
                    timestamp: new Date().toISOString(),
                    file_count: successfulKeys.length,
                    audio_files: successfulKeys,
                    status: "uploaded_complete"
                }),
                options: { contentType: 'application/json' }
            }).result;

            handleSuccess(successfulKeys.length);

        } catch (error: any) {
            console.error(error);
            messageApi.error(error.message || "Upload failed.");
            releaseWakeLock();
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
            {contextHolder}
            <Card className={styles.uploadCard}>
                <div style={{ marginBottom: 24, textAlign: 'center' }}>
                    <Title level={2}>Audio Files Upload</Title>
                </div>

                <Form form={uploadForm} layout="vertical" onFinish={handleUpload}>
                    <Form.Item
                        label="Project Name"
                        name="projectName"
                        rules={[{ required: true, message: 'Required' }, { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Invalid format' }]}
                    >
                        <Input prefix={<FileTextOutlined />} placeholder="e.g. Amazon_50GB_Batch1" />
                    </Form.Item>

                    <div style={{ marginBottom: 24 }}>
                        <Dragger {...props} height={200}>
                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                            <p className="ant-upload-text">Drag audio folder here</p>
                            <p className="ant-upload-hint">
                                Selected: {rawFiles.length} files
                            </p>
                        </Dragger>
                    </div>

                    {/* processbar */}
                    {uploading && (
                        <div style={{ marginBottom: 24 }}>
                            <Alert
                                message="Do not close this tab!"
                                description="Uploading huge dataset. Screen wake lock actsive."
                                type="warning"
                                showIcon
                            />
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text strong>Uploading...</Text>
                                    <Text>{progress.current} / {progress.total} files</Text>
                                </div>
                                <Progress
                                    percent={progress.percent}
                                    status="active"
                                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                />
                            </div>
                        </div>
                    )}

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={uploading}
                        disabled={rawFiles.length === 0}
                        icon={<CloudUploadOutlined />}
                    >
                        {uploading ? 'Processing...' : `Start Upload (${rawFiles.length} files)`}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default UploadForm;