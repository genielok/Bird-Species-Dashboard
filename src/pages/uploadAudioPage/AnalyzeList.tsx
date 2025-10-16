import { Button, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { getAnalyzeList } from '../../utils/analyze';
import { columns, type AnalyzeDataType } from './const.tsx';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
const { Title } = Typography;

export default function AnalyzeList() {

    const [dataList, setDataList] = useState<any>([])

    const getData = async () => {
        try {
            setHistoryLoading(true)

            const res = await getAnalyzeList()
            setDataList(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setHistoryLoading(false)
        }

    }

    useEffect(() => {
        getData()
    }, []);

    const [historyLoading, setHistoryLoading] = useState(true);

    return (
        <div >
            <div className='mt-4 mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}><HistoryOutlined style={{ marginRight: 8 }} /> Historical analysis records</Title>
                <Button
                    onClick={getData}
                    loading={historyLoading}
                    icon={<SyncOutlined />}
                >
                    Reload
                </Button>
            </div>
            <Table<AnalyzeDataType> columns={columns} dataSource={dataList} />;
        </div>
    )
}
