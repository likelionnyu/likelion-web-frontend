import { useEffect, useState } from 'react';
import PublicNav from '../components/PublicNav';

const STATUS_CONFIG = {
  planning:    { label: 'Planning',    bg: 'bg-green-500'  },
  in_progress: { label: 'In Progress', bg: 'bg-blue-500'   },
  completed:   { label: 'Completed',   bg: 'bg-yellow-500' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/retrieve-all-projects`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const renderProjectCard = (project) => {
    const thumbnail = project.photos?.[0]?.photo_url;

    return (
      <div
        key={project.project_id}
        className="bg-white border-2 border-gray-200 rounded-[16px] md:rounded-[20px] overflow-hidden flex flex-col"
      >
        {/* Thumbnail */}
        {thumbnail && (
          <img
            src={thumbnail}
            alt={project.project_name}
            className="w-full h-36 md:h-48 object-cover shrink-0"
          />
        )}

        <div className="p-4 md:p-8 flex flex-col flex-1">
          {/* Project Name + Status */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-[22px] md:text-[28px] font-bold leading-snug min-w-0">
              {project.project_name}
            </h3>
            {project.status && STATUS_CONFIG[project.status] && (
              <span className={`${STATUS_CONFIG[project.status].bg} text-white px-3 py-1 rounded-full text-[11px] md:text-[12px] font-semibold whitespace-nowrap shrink-0 mt-1`}>
                {STATUS_CONFIG[project.status].label}
              </span>
            )}
          </div>

          {/* Team Name */}
          <p className="text-gray-500 text-[13px] md:text-[14px] mb-3">{project.team_name}</p>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-[13px] md:text-[15px] mb-4 flex-1">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.tech_stack?.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((t, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-[5px] rounded-full text-[12px] md:text-[13px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {project.members?.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Team Members
              </p>
              <div className="flex flex-wrap gap-2">
                {project.members.map((m) => (
                  <span
                    key={m.member_id}
                    className="bg-nyu-purple bg-opacity-10 text-nyu-purple px-3 py-[5px] rounded-full text-[12px] md:text-[13px] font-medium"
                  >
                    {m.english_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          {(project.start_date || project.end_date) && (
            <p className="text-gray-400 text-[11px] md:text-[12px] mb-3">
              {project.start_date}{project.end_date ? ` ~ ${project.end_date}` : ''}
            </p>
          )}

          {/* GitHub Link */}
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-nyu-purple text-[13px] md:text-[14px] font-medium hover:underline self-start"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNav />

      {/* Header Section */}
      <section className="py-10 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-[36px] md:text-[64px] font-bold mb-4 md:mb-6 leading-tight">
            Our <span className="text-nyu-purple">Projects</span>
          </h1>
          <p className="text-gray-600 text-[15px] md:text-[20px] max-w-2xl mx-auto leading-relaxed">
            Explore the innovative projects our talented teams are working on. From AI-powered solutions to campus management tools, we're building the future together.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-10 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <p className="text-center text-gray-500 text-[15px] py-12">Loading projects...</p>
          )}
          {error && (
            <p className="text-center text-red-500 text-[15px] py-12">{error}</p>
          )}
          {!loading && !error && projects.length === 0 && (
            <p className="text-center text-gray-500 text-[15px] py-12">No projects found.</p>
          )}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-10">
              {projects.map((project) => renderProjectCard(project))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-200">
        <a
          href="https://instagram.com/nyu_likelion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 hover:text-opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
