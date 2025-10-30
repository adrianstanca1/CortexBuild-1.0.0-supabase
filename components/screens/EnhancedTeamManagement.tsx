/**
 * Enhanced Team Management - Market-Leading Team Dashboard
 * Advanced team oversight with performance tracking and resource allocation
 */

import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    Award,
    TrendingUp,
    Clock,
    Target,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Download,
    Mail,
    Phone,
    MapPin,
    Briefcase
} from 'lucide-react';
import { User } from '../../types';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    avatar?: string;
    status: 'active' | 'on-leave' | 'busy';
    currentProject?: string;
    tasksCompleted: number;
    tasksActive: number;
    hoursThisWeek: number;
    performanceScore: number;
    certifications: string[];
    skills: string[];
}

interface EnhancedTeamManagementProps {
    currentUser: User;
    goBack: () => void;
}

export const EnhancedTeamManagement: React.FC<EnhancedTeamManagementProps> = ({ currentUser, goBack }) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            name: 'John Smith',
            role: 'Project Manager',
            email: 'john.smith@construction.com',
            phone: '+1 555-0101',
            status: 'active',
            currentProject: 'Downtown Plaza',
            tasksCompleted: 45,
            tasksActive: 8,
            hoursThisWeek: 38,
            performanceScore: 95,
            certifications: ['PMP', 'OSHA 30', 'LEED AP'],
            skills: ['Project Management', 'Scheduling', 'Budgeting']
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            role: 'Site Supervisor',
            email: 'sarah.j@construction.com',
            phone: '+1 555-0102',
            status: 'active',
            currentProject: 'Riverside Complex',
            tasksCompleted: 67,
            tasksActive: 12,
            hoursThisWeek: 42,
            performanceScore: 98,
            certifications: ['OSHA 30', 'First Aid', 'Forklift'],
            skills: ['Site Management', 'Safety', 'Quality Control']
        },
        {
            id: '3',
            name: 'Mike Davis',
            role: 'Superintendent',
            email: 'mike.d@construction.com',
            phone: '+1 555-0103',
            status: 'busy',
            currentProject: 'Harbor Development',
            tasksCompleted: 89,
            tasksActive: 15,
            hoursThisWeek: 45,
            performanceScore: 92,
            certifications: ['OSHA 30', 'CPR', 'Scaffold'],
            skills: ['Construction', 'Coordination', 'Inspections']
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterRole === 'all' || member.role === filterRole;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: TeamMember['status']) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            'on-leave': 'bg-gray-100 text-gray-800',
            busy: 'bg-yellow-100 text-yellow-800'
        };
        return colors[status];
    };

    const getPerformanceColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="h-8 w-8 text-blue-600" />
                                <h1 className="text-4xl font-bold text-gray-900">Team Management</h1>
                            </div>
                            <p className="text-gray-600 text-lg">
                                Manage your construction workforce with advanced analytics
                            </p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                            <UserPlus className="h-5 w-5" />
                            Add Team Member
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">{teamMembers.length}</span>
                        </div>
                        <p className="text-sm text-gray-600">Total Members</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <Target className="h-8 w-8 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">94%</span>
                        </div>
                        <p className="text-sm text-gray-600">Avg Performance</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="h-8 w-8 text-purple-600" />
                            <span className="text-2xl font-bold text-gray-900">125h</span>
                        </div>
                        <p className="text-sm text-gray-600">Hours This Week</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <CheckCircle className="h-8 w-8 text-orange-600" />
                            <span className="text-2xl font-bold text-gray-900">201</span>
                        </div>
                        <p className="text-sm text-gray-600">Tasks Completed</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search team members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Site Supervisor">Site Supervisor</option>
                            <option value="Superintendent">Superintendent</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-3 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-3 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Team Members Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(member.status)}`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span>{member.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{member.phone}</span>
                                </div>
                                {member.currentProject && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{member.currentProject}</span>
                                    </div>
                                )}
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{member.tasksCompleted}</div>
                                    <div className="text-xs text-gray-600">Completed</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{member.tasksActive}</div>
                                    <div className="text-xs text-gray-600">Active</div>
                                </div>
                            </div>

                            {/* Performance Score */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Performance</span>
                                    <span className={`text-lg font-bold ${getPerformanceColor(member.performanceScore)}`}>
                                        {member.performanceScore}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                                        style={{ width: `${member.performanceScore}%` }}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                                {member.skills.slice(0, 3).map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

