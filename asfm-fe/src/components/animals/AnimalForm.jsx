import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPECIES_OPTIONS, SEX_OPTIONS, STATUS_OPTIONS } from '@/constants/animalConstants';

const EMPTY_FORM = {
  name: '',
  species: '',
  breed: '',
  sex: '',
  dob: '',
  status: '',
  description: '',
};

const REQUIRED_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'species', label: 'Species' },
  { key: 'sex', label: 'Sex' },
  { key: 'status', label: 'Status' },
];

function validate(form) {
  const errors = {};
  for (const { key, label } of REQUIRED_FIELDS) {
    if (!form[key] || !form[key].trim()) {
      errors[key] = `${label} is required.`;
    }
  }
  return errors;
}

export default function AnimalForm({ formId, onSubmit, initialValues = {}, error }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const setInput = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    onSubmit(form);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4 w-full min-w-0">
  {error && <p className="text-sm text-red-500">{error}</p>}
  {Object.keys(fieldErrors).length > 0 && (
    <p className="text-sm text-red-500">Please fix the highlighted fields below.</p>
  )}

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">
      Name <span className="text-red-500">*</span>
    </label>
    <Input className={`w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
      value={form.name}
      onChange={setInput('name')}
      placeholder="Animal name"
    />
    {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">
        Species <span className="text-red-500">*</span>
      </label>
      <Select value={form.species} onValueChange={set('species')}>
        <SelectTrigger className={`w-full ${fieldErrors.species ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select species" />
        </SelectTrigger>
        <SelectContent>
          {SPECIES_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldErrors.species && <p className="text-xs text-red-500">{fieldErrors.species}</p>}
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">
        Sex <span className="text-red-500">*</span>
      </label>
      <Select value={form.sex} onValueChange={set('sex')}>
        <SelectTrigger className={`w-full ${fieldErrors.sex ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select sex" />
        </SelectTrigger>
        <SelectContent>
          {SEX_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldErrors.sex && <p className="text-xs text-red-500">{fieldErrors.sex}</p>}
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">
        Status <span className="text-red-500">*</span>
      </label>
      <Select value={form.status} onValueChange={set('status')}>
        <SelectTrigger className={`w-full ${fieldErrors.status ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldErrors.status && <p className="text-xs text-red-500">{fieldErrors.status}</p>}
    </div>
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">Breed</label>
    <Input className="w-full"
      value={form.breed}
      onChange={setInput('breed')}
      placeholder="Breed"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">Description</label>
    <Textarea
      value={form.description}
      onChange={setInput('description')}
      placeholder="Brief description..."
      rows={3}
    />
  </div>
</form>

 );
}
