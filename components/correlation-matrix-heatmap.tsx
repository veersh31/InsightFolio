import { ResponsiveHeatMap } from '@nivo/heatmap'

export function CorrelationMatrixHeatmap({ matrix, symbols }: { matrix: number[][], symbols: string[] }) {
  if (!Array.isArray(symbols) || !Array.isArray(matrix) || !matrix.length || !symbols.length) return null
  // Nivo 0.99.0 expects: [{ id, data: [{ x, y }, ...] }, ...]
  const data = symbols.map((row, i) => ({
    id: row,
    data: symbols.map((col, j) => ({ x: col, y: matrix[i][j] }))
  }))
  return (
    <div style={{ height: 400 }} className="my-6">
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        forceSquare={true}
        axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -45, legend: '', legendOffset: 36 }}
        axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: -40 }}
        colors={{ type: 'diverging', scheme: 'red_yellow_blue', divergeAt: 0.5, minValue: -1, maxValue: 1 }}
  borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        animate={true}
        isInteractive={true}
        hoverTarget="cell"
        tooltip={({ cell }: any) => (
          <div className="p-2 bg-white text-black rounded shadow text-xs">
            <strong>{cell.x} / {cell.serieId}</strong>: {cell.value}
          </div>
        )}
      />
    </div>
  )
}
