import React, { useEffect, useRef, useState } from 'react'
import * as echarts from "echarts";
import { Button, List, Modal } from 'antd';
import { colorMap, TIUCNStatus } from '../consts/Dashboard';
import type { Species } from '../utils/analyze';

type EChartsOption = echarts.EChartsOption;

interface PiespeciesPros {
    title: string,
    data: Species[],
}

const basePieOption: EChartsOption = {
    title: {
        left: 'center',
        padding: 4

    },
    tooltip: {
        trigger: "item",
        formatter: (params: any) => {
            const { name, value } = params;
            return `
      <b>${name}</b><br/>
      Amount: ${value}<br/>
    `;
        }
    },
    legend: {
        orient: "vertical",
        left: "right",
        top: "bottom"
    },
    series: [
        {
            type: 'pie',
            radius: ['30%', '60%'],
            padAngle: 5,
            minAngle: 2,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: true,
                position: "outside",
                formatter: '{b|{b}: } {per|{d}%}',
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 12,
                padding: [3, 3],
                rich: {
                    b: {
                        color: '#4C5058',
                        lineHeight: 33,
                    },
                    per: {
                        fontWeight: 'bold',
                    },
                    Detail: {
                        height: 30,
                        color: '#fff',
                        backgroundColor: '#276BF0',
                        padding: [0, 20],
                        borderRadius: 8,
                        align: 'center',
                    },
                }
            },
            labelLine: {
                show: true,
                length: 10,
                length2: 20,
            },
            emphasis: {
                label: {
                    backgroundColor: '#F6F8FC',
                    borderColor: '#EBEEFF',
                    show: true,
                    fontWeight: 'bold',
                    formatter: '{b|{b}:} {per|{d}%} \n {Detail|Detail}'
                }
            },
        }]

}

const PieChart: React.FC<PiespeciesPros> = ({ data, title }) => {
    const chartRef = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [speciesList, setspeciesList] = useState<Species[]>([])

    const initPiechart = (dataList: Species[]) => {
        const chart = echarts.init(chartRef.current)

        const grouped = dataList.reduce((acc, item) => {
            const status = item?.iucn.category || '';
            if (!acc[status]) {
                acc[status] = {
                    value: 0,
                    name: TIUCNStatus[status],
                    species: [] as Species[],
                    itemStyle: { color: colorMap[status] },
                };
            }
            acc[status].value += 1;
            acc[status].species.push(item);

            return acc;
        }, {} as Record<string, { value: number; name: string; species: Species[]; itemStyle: { color: string } }>);


        const pieData = Object.values(grouped);
        const curOption: EChartsOption = {
            ...basePieOption,
            title: {
                ...basePieOption?.title,
                text: title,
            },
            series: [
                {
                    ...(basePieOption?.series as any)?.[0],
                    data: pieData
                }
            ]
        };

        chart.setOption(curOption)

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        chart.on("click", (params) => {
            const data = (params.data as { species: Species[] })?.species
            data && showModal(data)
        });


    }
    useEffect(() => {
        data?.length > 0 && initPiechart(data);
    }, [data])

    const showModal = (speciesList: Species[]) => {
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
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            width: '100%',
            height: '400px'
        }}
            ref={chartRef} />
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
                    <List.Item actions={[<Button key="list-loadmore-edit" onClick={() => window.open(item.iucn.url)}>more</Button>]}
                    >
                        <List.Item.Meta
                            title={`Common Name: ${item.common_name}`}
                            description={
                                <div>
                                    Scientific Name: {item.scientific_name}
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