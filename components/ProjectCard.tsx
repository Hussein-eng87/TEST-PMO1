import React from 'react';
import { Project } from '../types';
import { EditIcon } from './Icons';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
}

const calculateDaysLeft = (endDateString: string): number => {
  if (!endDateString) return 0;
  const today = new Date();
  const endDate = new Date(endDateString);
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInMs = endUTC - todayUTC;
  return Math.ceil(diffInMs / oneDay);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

const DaysLeftIndicator: React.FC<{ days: number }> = ({ days }) => {
  let bgColor = 'bg-green-100 dark:bg-green-900/50';
  let textColor = 'text-green-800 dark:text-green-300';
  let text = `${days} days left`;

  if (days < 0) {
    bgColor = 'bg-red-100 dark:bg-red-900/50';
    textColor = 'text-red-800 dark:text-red-300';
    text = `${Math.abs(days)} days overdue`;
  } else if (days <= 7) {
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/50';
    textColor = 'text-yellow-800 dark:text-yellow-300';
  } else if (days <= 30) {
    bgColor = 'bg-blue-100 dark:bg-blue-900/50';
    textColor = 'text-blue-800 dark:text-blue-300';
  }
  
  if (days === 0) {
    text = 'Due today';
  }
  if (days === 1) {
    text = '1 day left';
  }

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${bgColor} ${textColor}`}>
      {text}
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const daysLeft = calculateDaysLeft(project.endDate);

  const DetailItem: React.FC<{label: string; value: string}> = ({label, value}) => (
    <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{value}</p>
    </div>
  );

  return (
    <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg border border-slate-200/80 dark:border-slate-700/50 transition-all p-4" aria-labelledby={`project-name-${project.id}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Main Info */}
            <div className="flex-1 min-w-0">
                <h2 id={`project-name-${project.id}`} className="text-lg font-bold text-slate-900 dark:text-white truncate">{project.projectName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">ID: {project.contractId}</p>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <DaysLeftIndicator days={daysLeft} />
                <button
                    onClick={onEdit}
                    className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Edit project ${project.projectName}`}
                >
                    <EditIcon className="h-5 w-5" />
                </button>
            </div>
        </div>

        {/* Details Section */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
           <DetailItem label="Start Date" value={formatDate(project.startDate)} />
           <DetailItem label="End Date" value={formatDate(project.endDate)} />
           <DetailItem label="TFP" value={project.tfp} />
           <DetailItem label="BOC FP" value={project.bocFp} />
        </div>
    </article>
  );
};

export default ProjectCard;