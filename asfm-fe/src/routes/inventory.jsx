import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout';
import BasicNavBar from '@/components/basicNavBar'
import SearchBar from '@/components/SearchBar'
import { ReusableTable } from '../components/table_components'
import { useEffect, useState } from 'react'
import apiClient from '../lib/axios';
import FilterSelect from '@/components/custom/FilterSelect';
import { Edit, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  const [filters, setFilters] = useState({ category: '', search: '' })
  const [inventory, setInventory] = useState([])
  const [allInventory, setAllInventory] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, itemsRes] = await Promise.all([
          apiClient.get('/inventory'),
          apiClient.get('/items'),
        ])

        const itemMap = {}
        const categoryMap = {}
        itemsRes.data.forEach(item => {
          itemMap[item.id] = item.name
          categoryMap[item.id] = item.category
        })

        const enrichedInventory = inventoryRes.data.map(inv => ({
          ...inv,
          item_name: itemMap[inv.item_id] || 'Unknown',
          category: categoryMap[inv.item_id] || 'Unknown',
        }))

        setAllInventory(enrichedInventory)
        setInventory(enrichedInventory)
        setCategories([...new Set(enrichedInventory.map(item => item.category))])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load inventory. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = allInventory

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    if (filters.search) {
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setInventory(filtered)
  }, [filters, allInventory])

  const handleEdit = (inventoryItem) => {
    // TODO: Implement edit functionality
    console.log('Edit:', inventoryItem)
  }

  const handleDelete = (inventoryItem) => {
    // TODO: Implement delete functionality
    console.log('Delete:', inventoryItem)
  }

  const inventoryColumns = [
    {
      accessorKey: "item_name",
      header: "Item Name",
      textSize: "sm",
      headClassName: "min-w-[180px]",
    },
    {
      accessorKey: "category",
      header: "Category",
      textSize: "sm",
      headClassName: "min-w-[180px]",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      textSize: "sm",
      headClassName: "min-w-[100px]",
    },
    {
      accessorKey: "expiration_date",
      header: "Expiration Date",
      textSize: "sm",
      headClassName: "min-w-[150px]",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1 hover:bg-blue-100 rounded"
            title="Edit"
          >
            <Edit size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ]

  if (error) return <div className="flex justify-center pt-8 text-red-500">{error}</div>

  return (
    <Layout navBar={<BasicNavBar />}>
      <div className='flex justify-center pt-2'>
        Inventory
      </div>
      {!loading && inventory.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">No inventory items found.</div>
      )}
      <ReusableTable
        columns={inventoryColumns}
        data={inventory}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName='overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full px-4 lg:px-8'
      />
    </Layout>
  )
}
