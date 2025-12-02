import { Button, DatePicker, Form, Input, Table, Typography, type TableProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { delay, downloadBlobFile, getAnalyzeList, getAudioResults, type Detection, type TSearchParams } from '../../utils/analyze';
import { columns, type AnalyzeDataType } from './const.tsx';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UploadForm from './uploadForm';

const { Title } = Typography;
const { RangePicker } = DatePicker;


export default function AnalyzeList() {
    const [dataList, setDataList] = useState<AnalyzeDataType[]>([])
    const [historyLoading, setHistoryLoading] = useState(true);
    const [recordForm] = Form.useForm<{ projectName: string, timeRange: any[] }>()
    const [searchParams, setSearchParams] = useState<TSearchParams>()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const getData = async (params?: TSearchParams) => {
        try {
            setHistoryLoading(true)
            const res = await getAnalyzeList(params)
            setDataList(res.data)
            delay(1000)
        } catch (error) {
            console.log(error)
        }
        setHistoryLoading(false)
    }

    const handleOpenCreateModal = () => {
        setIsOpen(true)
    }

    const handleSearch = async () => {
        try {
            const value = recordForm.getFieldsValue()
            const time = value?.timeRange ? {
                startTime: value?.timeRange[0]?.valueOf(),
                endTime: value?.timeRange[1]?.valueOf()
            } : undefined
            const params: any = { ...time };
            if (value?.projectName) {
                params.projectName = value.projectName;
            }
            setSearchParams(params)
            getData(params)
        } catch (error) {
            console.log(error)
        }
    }

    const handleReset = () => {
        setSearchParams(undefined)
        recordForm.resetFields()
        getData()
    }

    const handleResultDownload = async ({ name, sessionId }: { name: string, sessionId: string }) => {
        try {
            if (!sessionId) return;
            await downloadBlobFile(
                () => getAudioResults(sessionId),
                `${name}_Audio_Results.csv`
            );
        } catch (e) {
            alert("Failed to download CSV");
        }
    };


    const curColums: TableProps<AnalyzeDataType>['columns'] = useMemo(() => {
        const col = columns || []
        return [
            ...col,
            {
                title: 'Action',
                width: 210,
                fixed: 'right',
                render: (_, record) => {
                    const handleDetail = (sessionId: string) => {
                        navigate(`/upload/detail/${sessionId}`)
                    }
                    return <>
                        <Button className='mr-2' type='primary' disabled={record.status !== 'COMPLETED'} onClick={() => handleDetail(record.session_id)}> Detail </Button>
                        <Button disabled={record.status !== 'COMPLETED'} onClick={() => handleResultDownload({ name: record.projectName, sessionId: record.session_id })}> Download </Button>
                    </>
                },
            },
        ]
    }, [columns])

    useEffect(() => {
        getData()
    }, []);

    return (
        <div>
            <Title level={4} style={{ margin: 0 }}><HistoryOutlined style={{ marginRight: 8 }} /> Historical analysis records</Title>
            <div className='mt-4 mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type='primary' onClick={handleOpenCreateModal}>Create Project</Button>
                <Button
                    onClick={() => getData(searchParams)}
                    loading={historyLoading}
                    icon={<SyncOutlined />}
                >
                    Reload
                </Button>
            </div>
            <Form className='flex' form={recordForm}>
                <Form.Item className='flex-1' style={{ marginRight: 8 }}
                    label="Project Name" name="projectName">
                    <Input />
                </Form.Item>
                <Form.Item
                    className='flex-1'
                    style={{ marginLeft: 8 }}
                    label="Time"
                    name="timeRange"
                >
                    <RangePicker showTime className='w-full' />
                </Form.Item>
            </Form>
            <div className='flex place-content-center mb-4'>
                <Button className='mr-4' type='primary' onClick={handleSearch}>Search</Button>
                <Button onClick={handleReset}>Reset</Button>
            </div>
            <Table<AnalyzeDataType>
                scroll={{ x: 'max-content' }}
                rowKey="session_id"
                columns={curColums}
                dataSource={dataList}
                loading={historyLoading}
            />
            <UploadForm isOpen={isOpen} handleClose={() => setIsOpen(false)}></UploadForm>

        </div>
    )
}
