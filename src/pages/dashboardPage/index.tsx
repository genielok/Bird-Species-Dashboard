
import { useEffect, useState } from 'react';
import { Col, Row } from 'antd'

import InfoCard from '../../components/infoCard';
import BarChart from '../../components/barChart';
import { loadCSV, ModelSpeciesData, PanelInfoList, barBaseOption, basePieOption } from './const';

// import Sunburst from './components/sunburst';

import './index.css'
import styles from './styles.module.css';

const DashboardPage: React.FC = () => {
    const [L1Data, setL1Data] = useState<any[]>([])
    const [L3Data, setL3Data] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const dataL1 = await loadCSV('/L1Data.csv');
            const dataL3 = await loadCSV('/L3Data.csv');
            setL1Data(dataL1);
            setL3Data(dataL3);
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className={styles.title}>
                Info Panel
            </div>
            <Row gutter={16}>
                {
                    PanelInfoList.map((item, index) =>
                        <Col key={index} span={6}>
                            <InfoCard
                                count={(item.count).toLocaleString()}
                                backgroundImg={item.backgroundImg}
                                tooltipText={item?.tooltipText}
                                title={item.title}>
                            </InfoCard>
                        </Col>
                    )
                }
                <Col span={6}>
                    <BarChart options={barBaseOption} title='Species Captures by 3 Models' data={ModelSpeciesData}></BarChart>
                </Col>

            </Row>
            <div className={styles.subTitle}>
                IUCN Status
            </div>
            <Row gutter={16}>
                {/* <Col span={12}>
                    <PieChart options={basePieOption} data={L1Data} title='Species(≥1 Model)'></PieChart>
                </Col>
                <Col span={12}>
                    <PieChart options={basePieOption} data={L3Data} title='Species(≥2 Model)'></PieChart>
                </Col> */}
            </Row>
        </div >
    )
}
export default DashboardPage
