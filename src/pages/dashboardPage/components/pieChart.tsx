import React, { useEffect, useRef, useState } from 'react'
import * as echarts from "echarts";
import styles from '../styles.module.css';
import { List, Modal, Tag } from 'antd';
import { basePieOption, colorMap, TIUCNStatus } from '../const';


type EChartsOption = echarts.EChartsOption;

type SpeciesItem = {
    "species": string
    "Common Name": string
    "Threat Status": string
    "Family": string
    "Original Map Link": string

}

interface PiespeciesPros {
    title: string,
    data: SpeciesItem[]
}

const PieChart: React.FC<PiespeciesPros> = ({ data, title }) => {
    const chartRef = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [speciesList, setspeciesList] = useState<SpeciesItem[]>([])


    const initPiechart = (dataList: SpeciesItem[]) => {
        const chart = echarts.init(chartRef.current)

        const grouped = dataList.reduce((acc, item) => {
            const status = item["Threat Status"];
            if (!acc[status]) {
                acc[status] = {
                    value: 0,
                    name: TIUCNStatus[status],
                    species: [] as SpeciesItem[],
                    itemStyle: { color: colorMap[status] },
                };
            }
            acc[status].value += 1;
            acc[status].species.push(item);
            return acc;
        }, {} as Record<string, { value: number; name: string; species: SpeciesItem[]; itemStyle: { color: string } }>);


        const pieData = Object.values(grouped);
        const curOption: EChartsOption = {
            ...basePieOption,
            title: {
                ...basePieOption.title,
                text: title,
            },
            series: [
                {
                    ...(basePieOption.series as any)[0],
                    data: pieData
                }
            ]
        };

        chart.setOption(curOption)

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        chart.on("click", (params) => {
            const data = (params.data as { species: SpeciesItem[] })?.species
            data && showModal(data)
        });


    }
    useEffect(() => {
        data.length > 0 && initPiechart(data)
    }, [data])

    const showModal = (speciesList: SpeciesItem[]) => {
        setspeciesList(speciesList)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return <>
        <div className={styles.sunburstCard} ref={chartRef} style={{ width: '100%', height: '420px' }}></div>
        <Modal
            title="Species List"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <List
                itemLayout="horizontal"
                dataSource={speciesList}
                renderItem={(item) => (
                    <List.Item actions={item['Original Map Link'] ? [<a key="list-loadmore-edit" href={item['Original Map Link']}>more</a>] : undefined}
                    >
                        <List.Item.Meta
                            title={item.species}
                            description={
                                <div>
                                    {item['Common Name'] && <span>Common Name: {item['Common Name']}</span>} <br />
                                    {
                                        item.Family && <span>
                                            Family: <Tag>{item.Family}</Tag>
                                        </span>
                                    }
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    </>
}

export default PieChart