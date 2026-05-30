/** Plugin Chart.js : texte centré dans un donut */
export const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, chartArea } = chart
    if (!chartArea) return
    const meta = chart.getDatasetMeta(0)
    if (!meta?.data?.length) return

    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2
    const text = chart.config.options?.plugins?.centerText?.text ?? ''

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1a2234'
    ctx.font = '600 13px Inter, sans-serif'
    ctx.fillText('Total', centerX, centerY - 8)
    ctx.font = '700 22px Inter, sans-serif'
    ctx.fillText(text, centerX, centerY + 14)
    ctx.restore()
  },
}
