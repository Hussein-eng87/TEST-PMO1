import React, { useState, useEffect } from 'react';
import { Project } from './types';
import ProjectCard from './components/ProjectCard';
import Modal from './components/Modal';
import ProjectForm from './components/ProjectForm';
import { PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    // Load projects from local storage on initial render
    try {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
         // Add some sample data if no projects are stored
        setProjects([
          { id: '1', projectName: 'Website Redesign', contractId: 'C-12345', startDate: '2024-07-01', endDate: '2024-09-30', tfp: 'John Doe', bocFp: 'Jane Smith' },
          { id: '2', projectName: 'Mobile App Development', contractId: 'SO-67890', startDate: '2024-06-15', endDate: '2024-12-20', tfp: 'Peter Jones', bocFp: 'Mary Lee' },
        ]);
      }
    } catch (error) {
      console.error("Failed to load projects from local storage", error);
    }
  }, []);

  useEffect(() => {
    // Save projects to local storage whenever they change
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to local storage", error);
    }
  }, [projects]);

  const handleOpenModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if(window.confirm('Are you sure you want to delete this project?')) {
        setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'> & { id?: string }) => {
    if (projectData.id) {
      // Editing existing project
      setProjects(projects.map(p => p.id === projectData.id ? { ...p, ...projectData } as Project : p));
    } else {
      // Adding new project
      const newProject: Project = {
        ...projectData,
        id: new Date().toISOString() + Math.random(), // simple unique id
      };
      setProjects([...projects, newProject]);
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            <PlusIcon />
            <span>Add Project</span>
          </button>
        </header>

        {projects.length > 0 ? (
          <main className="space-y-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </main>
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No Projects Found</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Click "Add Project" to get started!</p>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ProjectForm
            onSubmit={handleSaveProject}
            onCancel={handleCloseModal}
            initialData={editingProject}
          />
        </Modal>
      </div>
    </div>
  );
};

export default App;