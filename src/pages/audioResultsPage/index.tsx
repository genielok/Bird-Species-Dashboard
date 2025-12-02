import { Button, Col, Row } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { downloadBlobFile, getAnalyzeDetail, getNPIReport, type EnrichedData, type Session } from '../../utils/analyze'
import styles from './styles.module.css';
import { ModelSpeciesData, PanelInfoList, barBaseOption } from './const';
import InfoCard from '../../components/infoCard';
import BarChart from '../../components/barChart';
import PieChart from '../../components/pieChart';
import GaugeChart from '../../components/gaugeChart';

import PinkBlock from '@assets/block-pink.png'


const AudioResultsPage = () => {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const [sessionData, setSessionData] = useState<Session>()
    const [enrichedData, setEnrichedData] = useState<EnrichedData>()

    const getDetailData = async () => {
        try {
            const { data } = await getAnalyzeDetail(sessionId || '')
            data?.session && setSessionData(data.session)
            data?.enriched_data && setEnrichedData(data.enriched_data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getDetailData()
    }, [])

    const ModelsData = useMemo(() =>
        ModelSpeciesData.map(item => {
            let length = 0;
            if (item.key === 'birdnet') {
                length = enrichedData?.birdnet?.length || 0
            }
            else if (item.key === 'perch') {
                length = enrichedData?.perch?.length || 0
            }
            return {
                ...item,
                value: length
            }
        }), [enrichedData])

    const handleNPIReportDownload = async () => {
        try {
            if (!sessionData || !sessionId) return;
            const projectName = sessionData['projectName'] || 'project';
            await downloadBlobFile(
                () => getNPIReport(sessionId),
                `${projectName}_NPI_Report.csv`
            );
        } catch (e) {
            alert("Failed to download NPI CSV");
        }
    };

    return (
        <>
            <div className='flex align-middle justify-between'>
                <div className={styles.title}>
                    Info Panel
                </div>
                <div>
                    <Button type='primary' className='mr-2' onClick={() => handleNPIReportDownload()}>Download NPI CSV</Button>
                    <Button onClick={() => navigate(-1)}>Back</Button>

                </div>
            </div>
            <Row gutter={16}>
                <Col span={6}>
                    <InfoCard
                        count={
                            sessionData ? sessionData.total_detections : 0
                        }
                        backgroundImg={PinkBlock}
                        title={'Total Number of Captures'}
                    >
                    </InfoCard>
                </Col>
                <Col span={6}>
                    <BarChart title='Species Captures by 3 Models' data={ModelsData} options={barBaseOption}></BarChart>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        // width: '100%',
                        // height: '420px'
                    }}>
                        <GaugeChart gaugeValue={sessionData?.npi?.score || 0} />
                    </div>
                </Col>
            </Row>
            <div className={styles.subTitle}>
                Statistic
            </div>
            <Row gutter={16}>
                {enrichedData && (enrichedData?.comparison?.detected_by_at_least_one?.length > 0) ?
                    <Col span={12}>
                        <PieChart data={enrichedData.comparison?.detected_by_at_least_one} title='Species(= 1 Model)' />
                    </Col>
                    : null}
                {enrichedData && (enrichedData?.comparison?.detected_by_at_least_two?.length > 0) ?
                    <Col span={12}>
                        <PieChart data={enrichedData.comparison?.detected_by_at_least_two} title='Species(≥ 1 Model)' />
                    </Col>
                    : null}
            </Row>
        </>

    )
}

export default AudioResultsPage


