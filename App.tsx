import React, { useState, useEffect } from 'react';
import { Project } from './types';
import ProjectCard from './components/ProjectCard';
import Modal from './components/Modal';
import ProjectForm from './components/ProjectForm';
import { PlusIcon } from './components/Icons';

// FIX: Changed component definition by removing React.FC to fix type inference issue.
// The original definition caused a cascading type error, leading to all subsequent scope errors.
const App = () => {
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
        // If no projects are stored, initialize with sample projects
        setProjects([
          { id: '1', projectName: 'IBCP', contractId: 'C-98765', startDate: '2024-01-01', endDate: '2024-12-31', tfp: 'Project Lead', bocFp: 'Client Manager' },
          { id: '2', projectName: 'TOC', contractId: 'C-12345', startDate: '2024-03-15', endDate: '2025-03-14', tfp: 'Tech Lead', bocFp: 'Business Analyst' },
        ]);
      }
    } catch (error) {
      console.error("Failed to load projects from local storage", error);
       // In case of error, start with default projects to prevent a crash
       setProjects([
        { id: '1', projectName: 'IBCP', contractId: 'C-98765', startDate: '2024-01-01', endDate: '2024-12-31', tfp: 'Project Lead', bocFp: 'Client Manager' },
        { id: '2', projectName: 'TOC', contractId: 'C-12345', startDate: '2024-03-15', endDate: '2025-03-14', tfp: 'Tech Lead', bocFp: 'Business Analyst' },
      ]);
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

  const handleOpenModal = (project: Project | null = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      // Editing existing project
      setProjects(projects.map(p => p.id === editingProject.id ? { ...editingProject, ...projectData } : p));
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

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
        setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <button
            onClick={() => handleOpenModal()}
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
                onEdit={() => handleOpenModal(project)}
                onDelete={() => handleDeleteProject(project.id)}
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