import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';

const BASE = process.env.REACT_APP_API_URL;

const EMPTY_FORM = {
  project_name: '', team_name: '', description: '',
  tech_stack: '', member_ids: [], github_link: '', start_date: '', end_date: '',
  status: 'planning',
};

const STATUS_CONFIG = {
  planning:    { label: 'Planning',     bg: 'bg-green-600' },
  in_progress: { label: 'In Progress',  bg: 'bg-blue-600'  },
  completed:   { label: 'Completed',    bg: 'bg-yellow-600'},
};

const GITHUB_ICON = (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

/* ── Member picker: click to toggle ── */
function MemberPicker({ allMembers, selectedIds, onChange }) {
  const toggle = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  if (allMembers.length === 0) {
    return <p className="text-gray-600 text-[13px]">No members available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allMembers.map((m) => {
        const selected = selectedIds.includes(m.member_id);
        return (
          <button
            key={m.member_id}
            type="button"
            onClick={() => toggle(m.member_id)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
              selected
                ? 'bg-nyu-purple text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            {m.english_name}
          </button>
        );
      })}
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allMembers, setAllMembers] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [creatingSaving, setCreatingSaving] = useState(false);

  const [toast, setToast] = useState(null);

  /* ── Toast ── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch projects ── */
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE}/api/retrieve-all-projects`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch all members for picker ── */
  const fetchAllMembers = async () => {
    try {
      const res = await fetch(`${BASE}/api/adminpage/members_list`);
      if (!res.ok) return;
      const data = await res.json();
      setAllMembers((data.members ?? []).filter((m) => m.is_active));
    } catch {
      // non-critical: picker just stays empty
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchAllMembers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Edit ── */
  const handleEdit = (project) => {
    setEditingId(project.project_id);
    setEditForm({
      project_name: project.project_name ?? '',
      team_name: project.team_name ?? '',
      description: project.description ?? '',
      tech_stack: (project.tech_stack ?? []).join(', '),
      member_ids: (project.members ?? []).map((m) => m.member_id),
      github_link: project.github_link ?? '',
      start_date: project.start_date ?? '',
      end_date: project.end_date ?? '',
      status: project.status ?? 'planning',
    });
  };

  const handleFormChange = (field, value) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleCancelEdit = () => setEditingId(null);

  const parseTechStack = (str) =>
    str.split(',').map((s) => s.trim()).filter(Boolean);

  /* ── Save → PATCH /api/projects/:id ── */
  const handleSave = async (projectId) => {
    setSaving(true);
    try {
      const body = {
        project_name: editForm.project_name.trim(),
        team_name: editForm.team_name.trim(),
        description: editForm.description.trim(),
        tech_stack: parseTechStack(editForm.tech_stack),
        member_ids: editForm.member_ids,
        github_link: editForm.github_link.trim(),
        start_date: editForm.start_date || null,
        end_date: editForm.end_date || null,
        status: editForm.status,
      };
      const res = await fetch(`${BASE}/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      setEditingId(null);
      showToast(`"${body.project_name}" saved.`);
      await fetchProjects();
    } catch (err) {
      showToast(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Create → POST /api/projects ── */
  const handleCreateChange = (field, value) =>
    setCreateForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = async () => {
    if (!createForm.project_name.trim()) {
      showToast('Project name is required.', 'error');
      return;
    }
    setCreatingSaving(true);
    try {
      const body = {
        project_name: createForm.project_name.trim(),
        team_name: createForm.team_name.trim(),
        description: createForm.description.trim(),
        tech_stack: parseTechStack(createForm.tech_stack),
        github_link: createForm.github_link.trim(),
        start_date: createForm.start_date || null,
        end_date: createForm.end_date || null,
        status: createForm.status,
      };
      if (createForm.member_ids.length > 0) body.member_ids = createForm.member_ids;

      const res = await fetch(`${BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setCreateForm(EMPTY_FORM);
      setCreating(false);
      showToast(`"${data.project.project_name}" created.`);
      await fetchProjects();
    } catch (err) {
      showToast(`Failed to create: ${err.message}`, 'error');
    } finally {
      setCreatingSaving(false);
    }
  };

  /* ── Delete → DELETE /api/projects/:id ── */
  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.project_name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${BASE}/api/projects/${project.project_id}`, { method: 'DELETE' });
      if (res.status !== 204 && !res.ok) throw new Error(`Server error: ${res.status}`);
      setProjects((prev) => prev.filter((p) => p.project_id !== project.project_id));
      showToast(`"${project.project_name}" deleted.`);
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, 'error');
    }
  };

  /* ── Text/date fields (excluding member picker) ── */
  const TEXT_FIELDS = [
    { label: 'Project Name *', field: 'project_name', type: 'input' },
    { label: 'Team Name', field: 'team_name', type: 'input' },
    { label: 'Description', field: 'description', type: 'textarea' },
    { label: 'Status', field: 'status', type: 'select' },
    { label: 'Tech Stack (comma-separated)', field: 'tech_stack', type: 'input' },
    { label: 'GitHub Link', field: 'github_link', type: 'input' },
    { label: 'Start Date', field: 'start_date', type: 'date' },
    { label: 'End Date', field: 'end_date', type: 'date' },
  ];

  const renderTextField = (formValues, onChange) => ({ label, field, type }) => (
    <label key={field} className="flex flex-col gap-1 text-gray-400 text-[13px]">
      {label}
      {type === 'textarea' ? (
        <textarea
          rows={3}
          className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 text-white text-[15px] focus:outline-none focus:border-nyu-purple resize-none"
          value={formValues[field]}
          onChange={(e) => onChange(field, e.target.value)}
        />
      ) : type === 'select' ? (
        <div className="relative">
          <select
            className="w-full appearance-none bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 pr-9 text-white text-[15px] focus:outline-none focus:border-nyu-purple cursor-pointer"
            value={formValues[field]}
            onChange={(e) => onChange(field, e.target.value)}
          >
            {Object.entries(STATUS_CONFIG).map(([val, { label: lbl }]) => (
              <option key={val} value={val}>{lbl}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      ) : (
        <input
          type={type === 'date' ? 'date' : 'text'}
          className="bg-[#0a0a0a] border border-gray-600 rounded-[8px] px-3 py-2 text-white text-[15px] focus:outline-none focus:border-nyu-purple"
          value={formValues[field]}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}
    </label>
  );

  const renderForm = (formValues, onChange, onSubmit, submitLabel) => (
    <>
      {TEXT_FIELDS.map(renderTextField(formValues, onChange))}

      {/* Member Picker */}
      <div className="flex flex-col gap-2">
        <span className="text-gray-400 text-[13px]">
          Team Members
          {formValues.member_ids.length > 0 && (
            <span className="text-gray-600 ml-1">({formValues.member_ids.length} selected)</span>
          )}
        </span>
        <MemberPicker
          allMembers={allMembers}
          selectedIds={formValues.member_ids}
          onChange={(ids) => onChange('member_ids', ids)}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={submitLabel === 'Saving...' || submitLabel === 'Creating...'}
        className="py-[10px] bg-nyu-purple text-white rounded-full text-[15px] font-semibold hover:opacity-80 disabled:opacity-50 transition-opacity mt-1"
      >
        {submitLabel}
      </button>
    </>
  );

  /* ── Card ── */
  const renderCard = (project) => {
    const isEditing = editingId === project.project_id;
    const thumbnail = project.photos?.[0]?.photo_url;

    return (
      <div
        key={project.project_id}
        className="bg-[#1a1a1a] border border-gray-700 rounded-[20px] overflow-hidden flex flex-col"
      >
        {!isEditing && thumbnail && (
          <img src={thumbnail} alt={project.project_name} className="w-full h-36 md:h-44 object-cover" />
        )}

        <div className="p-4 md:p-8 flex flex-col gap-4 flex-1">
          {isEditing ? (
            <>
              <p className="text-nyu-purple text-[13px] font-semibold uppercase tracking-wider">
                Editing Project #{project.project_id}
              </p>
              {renderForm(
                editForm,
                handleFormChange,
                () => handleSave(project.project_id),
                saving ? 'Saving...' : 'Save',
              )}
              <button
                onClick={handleCancelEdit}
                className="py-[10px] border border-gray-600 text-gray-300 rounded-full text-[15px] hover:bg-[#2a2a2a] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[22px] md:text-[28px] font-bold text-white mb-1 leading-snug">
                    {project.project_name}
                  </h3>
                  <p className="text-gray-400 text-[13px] md:text-[14px]">{project.team_name}</p>
                </div>
                {project.status && STATUS_CONFIG[project.status] && (
                  <span className={`${STATUS_CONFIG[project.status].bg} text-white px-3 py-1 rounded-full text-[11px] md:text-[12px] font-semibold whitespace-nowrap shrink-0 mt-1`}>
                    {STATUS_CONFIG[project.status].label}
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed flex-1">
                {project.description}
              </p>

              {project.tech_stack?.length > 0 && (
                <div>
                  <p className="text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((t, i) => (
                      <span key={i} className="bg-[#2a2a2a] text-gray-300 px-3 py-[5px] rounded-full text-[12px] md:text-[13px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.members?.length > 0 && (
                <div>
                  <p className="text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                    Team Members
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.members.map((m) => (
                      <span key={m.member_id} className="bg-nyu-purple bg-opacity-20 text-purple-300 px-3 py-[5px] rounded-full text-[12px] md:text-[13px] font-medium">
                        {m.english_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(project.start_date || project.end_date) && (
                <p className="text-gray-500 text-[12px]">
                  {project.start_date}{project.end_date ? ` ~ ${project.end_date}` : ''}
                </p>
              )}

              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-nyu-purple text-[13px] font-medium hover:underline self-start"
                >
                  {GITHUB_ICON}
                  GitHub
                </a>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 py-[10px] border border-gray-600 text-gray-300 rounded-full text-[14px] md:text-[15px] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="flex-1 py-[10px] border border-red-700 text-red-400 rounded-full text-[14px] md:text-[15px] hover:bg-red-900 hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-[32px] md:text-[56px] font-bold text-white leading-tight">
            Projects <span className="text-nyu-purple">Management</span>
          </h1>
          <button
            onClick={() => { setCreating((v) => !v); setCreateForm(EMPTY_FORM); }}
            className="shrink-0 mt-1 md:mt-3 px-4 md:px-6 py-2 md:py-3 bg-nyu-purple text-white rounded-full text-[13px] md:text-[15px] font-semibold hover:opacity-80 transition-opacity"
          >
            {creating ? 'Cancel' : '+ New Project'}
          </button>
        </div>
        <p className="text-gray-400 text-[14px] md:text-[18px] mb-8 md:mb-12">
          Add, edit, or delete projects via the API.
        </p>

        {/* ── Create Form ── */}
        {creating && (
          <div className="bg-[#1a1a1a] border border-nyu-purple rounded-[20px] p-4 md:p-8 mb-8 md:mb-10 flex flex-col gap-4">
            <p className="text-nyu-purple text-[13px] font-semibold uppercase tracking-wider">
              New Project
            </p>
            {renderForm(
              createForm,
              handleCreateChange,
              handleCreate,
              creatingSaving ? 'Creating...' : 'Create Project',
            )}
          </div>
        )}

        {loading && (
          <p className="text-gray-400 text-[15px] text-center py-16">Loading projects...</p>
        )}
        {error && (
          <p className="text-red-400 text-[15px] text-center py-16">{error}</p>
        )}
        {!loading && !error && projects.length === 0 && (
          <p className="text-gray-500 text-[15px] text-center py-16">No projects found.</p>
        )}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
            {projects.map(renderCard)}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-4 md:right-8 left-4 md:left-auto px-5 py-3 rounded-[12px] text-white text-[14px] shadow-lg z-50 ${
            toast.type === 'error' ? 'bg-red-700' : 'bg-green-700'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
