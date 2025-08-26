import { ResponsiveLine } from '@nivo/line'

export function BacktestChart({ dates, values }: { dates: string[]; values: number[] }) {
  if (!dates.length || !values.length) return null
  const data = [
    {
      id: 'Portfolio Value',
      data: dates.map((date, i) => ({ x: date, y: values[i] }))
    }
  ]
  return (
    <div style={{ height: 300 }} className="my-6">
      <ResponsiveLine
        data={data}
        margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        axisBottom={{ tickRotation: -45, legend: 'Date', legendOffset: 40, legendPosition: 'middle' }}
        axisLeft={{ legend: 'Portfolio Value', legendOffset: -50, legendPosition: 'middle' }}
        colors={{ scheme: 'category10' }}
        pointSize={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={true}
        useMesh={true}
        tooltip={({ point }) => (
          <div className="p-2 bg-white text-black rounded shadow text-xs">
            <strong>{point.data.xFormatted}</strong>: ${point.data.yFormatted}
          </div>
        )}
      />
    </div>
  )
}
