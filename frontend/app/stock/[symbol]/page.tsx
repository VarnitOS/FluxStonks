import StockDetails from '@/components/StockDetails'

export default function StockPage({ params }: { params: { symbol: string } }) {
  return <StockDetails symbol={params.symbol} />
} 