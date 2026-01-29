import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import api from './api/client';

// Profile Page Component
function ProfilePage({ profile, topSkills, onEdit, onSkillClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || '',
      skills: profile?.skills?.join(', ') || '',
      github: profile?.links?.github || '',
      linkedin: profile?.links?.linkedin || '',
      portfolio: profile?.links?.portfolio || '',
    });
    setIsEditing(true);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const updatedProfile = {
        name: editForm.name,
        email: editForm.email,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
        links: {
          github: editForm.github || null,
          linkedin: editForm.linkedin || null,
          portfolio: editForm.portfolio || null,
        }
      };
      await api.updateProfile(updatedProfile);
      setIsEditing(false);
      onEdit();
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold border border-white/30 shadow-2xl">
            {profile?.name?.charAt(0) || 'P'}
          </div>
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile?.name}</h1>
            <p className="text-white/80 text-lg">{profile?.email}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {profile.links?.github && (
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
              )}
              {profile.links?.linkedin && (
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  LinkedIn
                </a>
              )}
              {profile.links?.portfolio && (
                <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* About Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Profile Details
              </h2>
              {!isEditing ? (
                <button onClick={startEditing} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-sm font-medium">Cancel</button>
                  <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-emerald-500/30">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 text-sm font-medium block mb-2">Name</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-500 text-sm font-medium block mb-2">Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-sm font-medium block mb-2">Skills (comma separated)</label>
                  <input type="text" value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} placeholder="Python, React, MongoDB..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-500 text-sm font-medium block mb-2">GitHub URL</label>
                    <input type="url" value={editForm.github} onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} placeholder="https://github.com/..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-500 text-sm font-medium block mb-2">LinkedIn URL</label>
                    <input type="url" value={editForm.linkedin} onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })} placeholder="https://linkedin.com/..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-500 text-sm font-medium block mb-2">Portfolio URL</label>
                    <input type="url" value={editForm.portfolio} onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })} placeholder="https://..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${profile.email}`} className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">{profile.email}</a>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Skills</p>
                    <p className="text-slate-700 font-medium">{profile.skills?.length || 0} technologies</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          {profile.education?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
                Education
              </h2>
              <div className="space-y-4">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-gradient-to-br before:from-amber-400 before:to-orange-500 before:rounded-full before:shadow-lg before:shadow-amber-500/30">
                    <h3 className="text-slate-800 font-semibold">{edu.degree}</h3>
                    <p className="text-amber-600 font-medium">{edu.institution}</p>
                    <p className="text-slate-400 text-sm">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {profile.work?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                Work Experience
              </h2>
              <div className="space-y-6">
                {profile.work.map((work, idx) => (
                  <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-gradient-to-br before:from-emerald-400 before:to-teal-500 before:rounded-full before:shadow-lg before:shadow-emerald-500/30">
                    <h3 className="text-slate-800 font-semibold">{work.title}</h3>
                    <p className="text-emerald-600 font-medium">{work.company}</p>
                    <p className="text-slate-400 text-sm">{work.duration}</p>
                    {work.description && <p className="text-slate-600 mt-2 text-sm leading-relaxed">{work.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              Top Skills
            </h2>
            <div className="space-y-3">
              {topSkills.map((item, idx) => (
                <button key={idx} onClick={() => onSkillClick(item.skill)} className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all group">
                  <span className="text-slate-700 group-hover:text-indigo-700 font-medium transition-colors">{item.skill}</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg shadow-violet-500/30">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </span>
              All Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, idx) => (
                <button key={idx} onClick={() => onSkillClick(skill)}
                  className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-indigo-100 hover:to-purple-100 text-slate-700 hover:text-indigo-700 rounded-full text-sm font-medium transition-all border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10">
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Page Component
function ProjectsPage({ projects, profile, onRefresh }) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', links: '', skills: '' });
  const [saving, setSaving] = useState(false);
  const [skillFilter, setSkillFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const skill = params.get('skill');
    if (skill) {
      setSkillFilter(skill);
      setFilteredProjects(projects.filter(p => p.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))));
    } else {
      setSkillFilter('');
      setFilteredProjects(projects);
    }
  }, [location.search, projects]);

  const addProject = async () => {
    try {
      setSaving(true);
      const projectToAdd = {
        title: newProject.title,
        description: newProject.description,
        links: newProject.links.split(',').map(l => l.trim()).filter(l => l),
        skills: newProject.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const updatedProjects = [...(profile?.projects || []), projectToAdd];
      await api.updateProfile({ projects: updatedProjects });
      setNewProject({ title: '', description: '', links: '', skills: '' });
      setShowAddProject(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to add project:', err);
      alert('Failed to add project.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (index) => {
    if (!confirm('Delete this project?')) return;
    try {
      const updatedProjects = profile.projects.filter((_, i) => i !== index);
      await api.updateProfile({ projects: updatedProjects });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const clearFilter = () => navigate('/projects');

  return (
    <div>
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-8 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            {skillFilter && <p className="text-white/80">Filtered by: <span className="font-semibold">{skillFilter}</span></p>}
            <p className="text-white/60 text-sm mt-1">{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex gap-3">
            {skillFilter && (
              <button onClick={clearFilter} className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all text-sm font-medium">
                Clear Filter
              </button>
            )}
            <button onClick={() => setShowAddProject(true)} className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all text-sm font-semibold flex items-center gap-2 shadow-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </button>
          </div>
        </div>
      </div>

      {showAddProject && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Create New Project</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 text-sm font-medium block mb-2">Project Title</label>
              <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="My Awesome Project"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium block mb-2">Technologies Used</label>
              <input type="text" value={newProject.skills} onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })} placeholder="Python, React, MongoDB"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="text-slate-500 text-sm font-medium block mb-2">Description</label>
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} rows={4} placeholder="Describe what your project does, the problems it solves, and your role..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="text-slate-500 text-sm font-medium block mb-2">Project Links</label>
              <input type="text" value={newProject.links} onChange={(e) => setNewProject({ ...newProject, links: e.target.value })} placeholder="https://github.com/..., https://demo.com/..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowAddProject(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-medium">Cancel</button>
            <button onClick={addProject} disabled={saving || !newProject.title || !newProject.description} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl transition-all font-semibold shadow-lg shadow-emerald-500/30">
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group relative">
            <button onClick={() => deleteProject(idx)} className="absolute top-4 right-4 p-2.5 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-600 text-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mb-4 shadow-lg shadow-indigo-500/30">
              {project.title?.charAt(0) || 'P'}
            </div>

            <h3 className="text-lg font-bold text-slate-800 pr-10 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
            <p className="text-slate-500 mt-2 text-sm line-clamp-3 leading-relaxed">{project.description}</p>

            {project.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.skills.slice(0, 4).map((skill, sIdx) => (
                  <span key={sIdx} className="px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-lg text-xs font-semibold border border-indigo-100">{skill}</span>
                ))}
                {project.skills.length > 4 && (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium">+{project.skills.length - 4}</span>
                )}
              </div>
            )}

            {project.links?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3">
                {project.links.map((link, lIdx) => (
                  <a key={lIdx} href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1.5 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Project
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">No projects found{skillFilter && ` with "${skillFilter}"`}</p>
          <button onClick={() => setShowAddProject(true)} className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all">
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}

// Enhanced Search Page Component
function SearchPage({ onSkillClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [recentSearches] = useState(['Python', 'React', 'API', 'Database']);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    try {
      setSearching(true);
      const data = await api.search(searchQuery);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      {/* Search Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 p-8 md:p-12 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Search</h1>
          <p className="text-white/80 text-lg mb-8">Find skills, projects, and experience instantly</p>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full px-6 py-5 pl-14 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-slate-800 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all placeholder-slate-400"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg">
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-white/60 text-sm">Try:</span>
            {recentSearches.map((term, idx) => (
              <button key={idx} onClick={() => handleQuickSearch(term)} className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-all backdrop-blur-sm">
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {searching && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      )}

      {results && !searching && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Results for "<span className="text-purple-600">{results.query}</span>"
            </h2>
            <p className="text-slate-500 mt-1">
              Found {(results.matches.skills?.length || 0) + (results.matches.projects?.length || 0) + (results.matches.work?.length || 0)} matches
            </p>
          </div>

          {results.matches.skills?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </span>
                Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.matches.skills.map((skill, idx) => (
                  <button key={idx} onClick={() => onSkillClick(skill)} className="px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-purple-700 rounded-xl text-sm font-semibold transition-all border border-purple-200 hover:shadow-lg hover:shadow-purple-500/10">
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.matches.projects?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
                Matching Projects
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.matches.projects.map((project, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-lg transition-all">
                    <h4 className="text-slate-800 font-semibold">{project.title}</h4>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.matches.work?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                Matching Experience
              </h3>
              <div className="space-y-4">
                {results.matches.work.map((work, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <h4 className="text-slate-800 font-semibold">{work.title}</h4>
                    <p className="text-emerald-600 font-medium">{work.company}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!results.matches.skills?.length && !results.matches.projects?.length && !results.matches.work?.length && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-500 text-xl font-medium">No results found for "{results.query}"</p>
              <p className="text-slate-400 mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}

      {!results && !searching && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-xl font-medium">Start searching</p>
          <p className="text-slate-400 mt-2">Enter a search term to find skills, projects, and experience</p>
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, projectsData, topSkillsData] = await Promise.all([
        api.getProfile(),
        api.getProjects(),
        api.getTopSkills(5),
      ]);
      setProfile(profileData);
      setProjects(projectsData.projects || []);
      setTopSkills(topSkillsData.top_skills || []);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = (skill) => {
    navigate(`/projects?skill=${encodeURIComponent(skill)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-10 max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Connection Error</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <button onClick={loadData} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all font-semibold shadow-xl shadow-purple-500/30">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/40 transition-all">
                {profile?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{profile?.name || 'Profile'}</h1>
                <p className="text-slate-500 text-sm">{profile?.email}</p>
              </div>
            </NavLink>

            {/* Navigation */}
            <nav className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl">
              <NavLink to="/" className={({ isActive }) => `px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-white text-purple-700 shadow-lg' : 'text-slate-600 hover:text-slate-800'}`}>
                Profile
              </NavLink>
              <NavLink to="/projects" className={({ isActive }) => `px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-white text-purple-700 shadow-lg' : 'text-slate-600 hover:text-slate-800'}`}>
                Projects
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => `px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-white text-purple-700 shadow-lg' : 'text-slate-600 hover:text-slate-800'}`}>
                Search
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<ProfilePage profile={profile} topSkills={topSkills} onEdit={loadData} onSkillClick={handleSkillClick} />} />
          <Route path="/projects" element={<ProjectsPage projects={projects} profile={profile} onRefresh={loadData} />} />
          <Route path="/search" element={<SearchPage onSkillClick={handleSkillClick} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/50 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">Candidate Profile Playground</p>
          <p className="text-slate-400 text-xs mt-1">Built with FastAPI + React + TailwindCSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
