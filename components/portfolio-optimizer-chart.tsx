import { ResponsivePie } from '@nivo/pie'

export function PortfolioOptimizerChart({ weights }: { weights: { [symbol: string]: number } }) {
  const data = Object.entries(weights).map(([symbol, weight]) => ({
    id: symbol,
    label: symbol,
    value: weight * 100,
  }))

  if (!data.length) return null

  return (
    <div style={{ height: 300 }} className="my-6">
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={5}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#555"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            justify: false,
            translateX: 80,
            translateY: 0,
            itemsSpacing: 4,
            itemWidth: 60,
            itemHeight: 18,
            itemTextColor: '#555',
            symbolSize: 18,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  )
}
