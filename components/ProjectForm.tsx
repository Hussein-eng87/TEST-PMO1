
import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  initialData?: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    contractId: '',
    startDate: '',
    endDate: '',
    tfp: '',
    bocFp: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectName: initialData.projectName,
        contractId: initialData.contractId,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        tfp: initialData.tfp,
        bocFp: initialData.bocFp,
      });
    } else {
      // Reset form for new entry
      setFormData({
        projectName: '',
        contractId: '',
        startDate: '',
        endDate: '',
        tfp: '',
        bocFp: ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSubmit({ ...formData, id: initialData.id });
    } else {
      onSubmit(formData);
    }
  };

  const InputField: React.FC<{ name: keyof typeof formData; label: string; type?: string; required?: boolean }> = ({ name, label, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Project' : 'Add New Project'}</h2>
        <InputField name="projectName" label="Project Name" required />
        <InputField name="contractId" label="Contract / SO ID" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField name="startDate" label="Start Date" type="date" required />
            <InputField name="endDate" label="End Date" type="date" required />
        </div>
        <InputField name="tfp" label="TFP" required />
        <InputField name="bocFp" label="BOC FP" required />

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition"
            >
                {initialData ? 'Save Changes' : 'Create Project'}
            </button>
        </div>
    </form>
  );
};

export default ProjectForm;
