import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import BasicNavBar from '@/components/basicNavBar';
import { ReusableTable } from '@/components/table_components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/custom/CustomBadge';
import { useBoundStore } from '@/store';
import { PawPrint, Plus } from 'lucide-react';
import { STATUS_COLORS, SPECIES_OPTIONS, STATUS_OPTIONS } from '@/constants/animalConstants';

export const Route = createFileRoute('/animals/')({
  component: AnimalListPage,
});

function AnimalListPage() {
  const navigate = useNavigate();
  const animals = useBoundStore((state) => state.animals);
  const animalsLoading = useBoundStore((state) => state.animalsLoading);
  const animalsError = useBoundStore((state) => state.animalsError);
  const fetchAnimals = useBoundStore((state) => state.fetchAnimals);

  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const filtered = useMemo(() => {
    return animals.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [animals, search, speciesFilter, statusFilter]);

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'species', header: 'Species' },
    { accessorKey: 'breed', header: 'Breed' },
    { accessorKey: 'sex', header: 'Sex' },
    {
      accessorKey: 'statusBadge',
      header: 'Status',
      headClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      accessorKey: 'actions',
      header: '',
      headClassName: 'w-[80px]',
    },
  ];

  const tableData = filtered.map((animal) => ({
    ...animal,
    statusBadge: (
      <CustomBadge
        text={animal.status}
        badgeClassName={STATUS_COLORS[animal.status]}
      />
    ),
    actions: (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate({ to: '/animals/$animalId', params: { animalId: animal.id } })}
      >
        View
      </Button>
    ),
  }));

  // Calculate stats for dashboard
  // TODO: Memoize these calculations if performance becomes an issue with large animal lists
  const totalAnimals = animals.length;
  const availableCount = animals.filter(a => a.status === 'available').length;
  const quarantineCount = animals.filter(a => a.status === 'quarantine').length;
  const speciesCount = [...new Set(animals.map(a => a.species))].length;

  if (animalsError) {
    return (
      <Layout navBar={<BasicNavBar />}>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl text-red-500">{animalsError}</p>
          <Button variant="outline" onClick={() => fetchAnimals()}>
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navBar={<BasicNavBar />}>
      <div className="space-y-6">
        {/* Dashboard Header Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/50 shrink-0 shadow-2xl">
                <PawPrint className="size-6 sm:size-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                  My Animals Dashboard
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Monitor and manage your shelter animals and their status.
                </p>
              </div>
            </div>
            <Button onClick={() => navigate({ to: '/animals/add' })} size="lg" className="shrink-0 sm:self-start gap-2">
              <Plus className="size-5" />
              Add Animal
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-60"
          />
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              {SPECIES_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!animalsLoading && filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No animals match your search.</p>
        ) : (
          <ReusableTable
            columns={columns}
            data={tableData}
            isLoading={animalsLoading}
            headerClassName="bg-secondary text-primary-foreground"
            tablebodyRowClassName="bg-white hover:bg-secondary/20"
            containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
          />
        )}
      </div>
    </Layout>
  );
}
