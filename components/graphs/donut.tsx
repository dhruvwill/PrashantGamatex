import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

interface DonutChartProps {
  sections: { percentage: number; color: string; label: string }[];
  radius: number;
  strokeWidth: number;
  textColor: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  sections,
  radius,
  strokeWidth,
  textColor,
}) => {
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  let cumulativePercentage = 0;

  const calculateArc = (percentage: number, startAngle: number) => {
    const endAngle = startAngle + (percentage / 100) * 360;
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = percentage > 50 ? 1 : 0;

    return `
      M ${radius} ${radius}
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      Z
    `;
  };

  const polarToCartesian = (radius: number, angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: radius + radius * Math.cos(rad),
      y: radius + radius * Math.sin(rad),
    };
  };

  return (
    <View className='w-full flex flex-col'>
      {/* Pie Chart */}
      {sections[0].percentage === 0 && (
        <View className='flex items-center mt-5'>
          <Text style={{ fontSize: 16, color: textColor }}>No data to display</Text>
        </View>
      )}
      <View className='flex items-center'>
        <Svg
          width={radius * 2 + 150}  // Increased width for space
          height={radius * 2 + 100} // Increased height for space
          viewBox={`0 0 ${radius * 2} ${radius * 2 + 30}`} // Adjusted viewBox
        >
          <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
            {sections.map((section, index) => {
              const startAngle = cumulativePercentage * 3.6;
              const pathData = calculateArc(section.percentage, startAngle);
              cumulativePercentage += section.percentage;

              return (
                <Path key={index} d={pathData} fill={section.color} stroke="none" />
              );
            })}
          </G>
        </Svg>
      </View>

      {/* Legend */}
      <View className='mt-3'>
        {sections.map((section, index) => (
          <View key={index} className='flex flex-row items-center mb-2'>
            <View style={{
              width: 20,
              height: 20,
              backgroundColor: section.color,
              marginRight: 10
            }} />
            <Text style={{ fontSize: 16, color: textColor }}>{section.label} - {section.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DonutChart;
