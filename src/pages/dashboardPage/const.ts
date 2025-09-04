import type { EChartsOption } from "echarts";
import YelloBlock from '@assets/block-yellow.png'
import PinkBlock from '@assets/block-pink.png'
import PurpleBlock from '@assets/block-purple.png'
import Papa from "papaparse";
import * as echarts from 'echarts';

export const StatusData = [
    {
        IUCNStatusAcrynom: "NE",
        IUCNStatus: "Not Evaluated",
        count: 0,
        percentage: '0%'
    },
    {
        IUCNStatusAcrynom: "DD",
        IUCNStatus: "Data Deficient",
        count: 0,
        percentage: '0%'
    },
    {
        IUCNStatusAcrynom: "LC",
        IUCNStatus: "Least Concern",
        count: 634,
        percentage: '91.09%'
    },
    {
        IUCNStatusAcrynom: "NT",
        IUCNStatus: "Near Threatened",
        count: 35,
        percentage: '5.03%'
    },
    {
        IUCNStatusAcrynom: "VU",
        IUCNStatus: "Vulnerable",
        count: 18,
        percentage: '2.59%'
    },
    {
        IUCNStatusAcrynom: "EN",
        IUCNStatus: "Endangered",
        count: 7,
        percentage: '1.01%'
    },
    {
        IUCNStatusAcrynom: "CR",
        IUCNStatus: "Critically Endangered",
        count: 2,
        percentage: '0.29%'
    },
    {
        IUCNStatusAcrynom: "EW",
        IUCNStatus: "Extinct in the Wild",
        count: 0,
        percentage: '0%'
    },
    {
        IUCNStatusAcrynom: "EX",
        IUCNStatus: "Extinct",
        count: 0,
        percentage: '0%'
    }
]

export function getRandomColor() {
    const letters = "89ABCDEF"; // 限制在浅色范围
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

export async function loadCSV(filePath: string) {
    const response = await fetch(filePath);  // 前端通过 fetch 读取
    const csvText = await response.text();

    const { data } = Papa.parse(csvText, {
        header: true,    // 把第一行作为 key
        skipEmptyLines: true
    });

    return data; // 直接得到 JSON 数组
}

export const Option = {
    title: {
        text: 'Top 10 Species by Capture Amount',
        left: 'center',
        padding: 4

    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}' // {b} = name, {c} = value
    },
    series: {
        type: 'sunburst',
        sort: null,
        radius: [60, '90%'],
        minAngle: 1,
        label: {
            show: false
        },
        emphasis: {
            focus: 'ancestor'
        },

        levels: [
            {},
            {
                r0: '20%',
                r: '50%',
                label: {
                    align: 'right'
                }
            },
            {
                r0: '50%',
                r: '70%',
                label: {
                    show: false
                },
                itemStyle: {
                    borderWidth: 2
                }
            }
        ]
    }
};

export const ModelSpeciesData = [{
    name: "BirdNet",
    value: 278,
}, {
    name: "Custom",
    value: 296,
}, {
    name: "Perch",
    value: 531,
}]

export const PanelInfoList = [{
    title: 'Total Number of Captures',
    count: 293094,
    backgroundImg: PinkBlock
},
{
    title: 'Species Count(≥1 Model)',
    count: 531,
    backgroundImg: YelloBlock,
    tooltipText: "Species registered by one or more model"
},
{
    title: 'Species Count(≥2 Model)',
    count: 249,
    backgroundImg: PurpleBlock,
    tooltipText: "Speceis must be captured by two or more of the models"
}]
export const TIUCNStatus: Record<string, string> = {
    NE: "Not Evaluate",
    DD: "Data Deficient",
    LC: "Least Concern",
    NT: "Near Threatened",
    VU: "Vulnerable",
    EN: "Endangered",
    CR: "Critically Endangere",
    EW: "Extinct in the Wild",
    EX: "Extinct"
}

export const barBaseOption: echarts.EChartsOption = {
    title: {
        left: 'center',
        top: '0%',
        textStyle: { fontSize: 13, color: '#333' }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(50,50,50,0.8)',
        textStyle: { color: '#fff' }
    },
    grid: { left: '10%', right: '10%', bottom: '15%', top: '15%' },
    xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLabel: { rotate: 0, fontSize: 12 },
        axisLine: { show: false }
    },
    yAxis: { show: false },
    series: [
        {
            type: 'bar',
            barWidth: '30%',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#4c9aff' },
                    { offset: 1, color: '#1e3edb' }
                ]),
                borderRadius: [10, 10, 10, 10]
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#1e3edb' },
                        { offset: 1, color: '#4c9aff' }
                    ])
                }
            }
        }]

};

export const colorMap: Record<string, string> = {
    EX: '#d73027',   // Extinct 红
    EW: '#f46d43',   // Extinct in the Wild 橙红
    CR: '#fdae61',   // Critically Endangered 橙
    EN: '#fee08b',   // Endangered 黄橙
    VU: '#ffd966',   // Vulnerable 浅黄
    NT: '#a6d96a',   // Near Threatened 绿
    LC: '#66bd63',   // Least Concern 绿
    DD: '#3288bd',   // Data Deficient 蓝
    NE: '#5e4fa2'    // Not Evaluated 蓝紫
};

export const basePieOption: EChartsOption = {
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
        top: "middle"
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
                    formatter: '{b|{b}:} {per|{d}%} \n {Detail|Detail}' // 🚀 hover 才展示
                }
            },
        }]

}