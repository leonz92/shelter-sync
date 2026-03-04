import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout'
import BasicNavBar from '@/components/basicNavBar'
import { ReusableTable } from '../components/table_components'
import { useEffect, useState } from 'react'
import { Edit } from 'lucide-react'
import { mockLoanedItems } from '../features/mockLoanedItems'

export const Route = createFileRoute('/loans')({
  component: RouteComponent,
})

function RouteComponent() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Mock data is synchronous, set directly
    try {
      setLoans(mockLoanedItems)
      setLoading(false)
    } catch (err) {
      console.error('Error loading loans:', err)
      setError('Failed to load active loans. Please try again.')
      setLoading(false)
    }
  }, [])

  const handleEdit = (loan) => {
    console.log('Edit loan:', loan)
  }

  const loansColumns = [
    {
      accessorKey: 'itemDescription',
      header: 'Item Description',
      textSize: 'sm',
      headClassName: 'min-w-[200px]',
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'animalId',
      header: 'Animal ID',
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'loanedAt',
      header: 'Loaned At',
      textSize: 'sm',
      headClassName: 'min-w-[130px]',
    },
    {
      accessorKey: 'expectedReturnDate',
      header: 'Expected Return Date',
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
    },
    {
      accessorKey: 'loanType',
      header: 'Loan Type',
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'loanStatus',
      header: 'Loan Status',
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'inventoryTransactionId',
      header: 'Inventory Transaction ID',
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => handleEdit(row.original)}
          className="p-1 hover:bg-blue-100 rounded"
          title="Edit"
        >
          <Edit size={18} className="text-blue-600" />
        </button>
      ),
    },
  ]

  if (error)
    return <div className="flex justify-center pt-8 text-red-500">{error}</div>

  return (
    <Layout navBar={<BasicNavBar />}>
      <div className="flex justify-center pt-2">Shelter's Loaned Items</div>
      {!loading && loans.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">
          No active loans found.
        </div>
      )}
      <ReusableTable
        columns={loansColumns}
        data={loans}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full px-4 lg:px-8"
      />
    </Layout>
  )
}
