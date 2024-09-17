import React from "react";
import { Card, Typography, Empty } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

interface PieChartCardProps {
    title: string;
    data: { name: string; value: number }[];
    colors: string[];
    activeIndex: number | null;
    onPieEnter: (data: any, index: number) => void;
    onPieLeave: () => void;
    renderCustomizedLabel: (props: any) => JSX.Element;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
    title,
    data,
    colors,
    activeIndex,
    onPieEnter,
    onPieLeave,
    renderCustomizedLabel
}) => {
    return (
        <Card>
            <div style={{ minHeight: 85 }}>
                <Title level={4} style={{ textAlign: 'center' }}>{title}</Title>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                {data.length > 0 ? (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            activeIndex={activeIndex ?? -1}
                            activeShape={{
                                fill: '#82ca9d',
                            }}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]} />
                    </PieChart>
                ) : (
                    <Empty description="Không có dữ liệu" />
                )}
            </ResponsiveContainer>
        </Card>
    );
};

export default PieChartCard;