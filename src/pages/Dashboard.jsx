import React, { useState, useMemo } from 'react';
import {
  Award,
  Users,
  MessageSquareCode,
  Sparkles,
  ChevronDown,
  FileText,
  Zap,
  Target,
  Puzzle,
  TrendingUp,
  Check,
  AlertTriangle,
  Rocket,
  FileCheck
} from 'lucide-react';
import {
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { getAllStudents, getSpecializationTopScore } from '../utils/dataService';
import HalfGaugeChart from '../components/HalfGaugeChart';

export default function Dashboard() {
  const students = useMemo(() => getAllStudents(), []);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  // Layer Visibility Toggles
  const [showGD, setShowGD] = useState(true);
  const [showTech, setShowTech] = useState(true);
  const [showSoft, setShowSoft] = useState(true);
  const [showBenchmark, setShowBenchmark] = useState(true);

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const topScore = useMemo(() => {
    return getSpecializationTopScore(currentStudent.specialization);
  }, [currentStudent]);

  // Unified Radar Dataset for Single Radar Canvas (16 parameters without prefixes)
  const singleRadarData = useMemo(() => {
    const gd = currentStudent.gdBreakdown;
    const tech = currentStudent.techBreakdown;
    const soft = currentStudent.softBreakdown;

    return [
      // 5 GD Parameters
      { param: 'Opening', gdScore: Math.round((gd.opening / 20) * 100), techScore: 0, softScore: 0, benchmark: 95 },
      { param: 'Speaking', gdScore: Math.round((gd.speaking / 20) * 100), techScore: 0, softScore: 0, benchmark: 90 },
      { param: 'Teamwork', gdScore: Math.round((gd.teamwork / 20) * 100), techScore: 0, softScore: 0, benchmark: 95 },
      { param: 'Engagement', gdScore: Math.round((gd.engagement / 20) * 100), techScore: 0, softScore: 0, benchmark: 90 },
      { param: 'Closing', gdScore: Math.round((gd.closing / 20) * 100), techScore: 0, softScore: 0, benchmark: 95 },

      // 5 Technical Parameters
      { param: 'Tech Intro', gdScore: 0, techScore: Math.round((tech.intro / 15) * 100), softScore: 0, benchmark: 95 },
      { param: 'Internship', gdScore: 0, techScore: Math.round((tech.intern / 15) * 100), softScore: 0, benchmark: 90 },
      { param: 'Domain Know.', gdScore: 0, techScore: Math.round((tech.domain / 35) * 100), softScore: 0, benchmark: 98 },
      { param: 'Situational', gdScore: 0, techScore: Math.round((tech.situational / 20) * 100), softScore: 0, benchmark: 90 },
      { param: 'Industry Trends', gdScore: 0, techScore: Math.round((tech.industry / 15) * 100), softScore: 0, benchmark: 90 },

      // 6 Communication Parameters
      { param: 'Comm Intro', gdScore: 0, techScore: 0, softScore: Math.round((soft.intro / 20) * 100), benchmark: 95 },
      { param: 'Experience', gdScore: 0, techScore: 0, softScore: Math.round((soft.exp / 15) * 100), benchmark: 90 },
      { param: 'Body Language', gdScore: 0, techScore: 0, softScore: Math.round((soft.body / 15) * 100), benchmark: 90 },
      { param: 'STAR Method', gdScore: 0, techScore: 0, softScore: Math.round((soft.star / 20) * 100), benchmark: 95 },
      { param: 'Crispness', gdScore: 0, techScore: 0, softScore: Math.round((soft.crisp / 15) * 100), benchmark: 90 },
      { param: 'Personality', gdScore: 0, techScore: 0, softScore: Math.round((soft.pers / 15) * 100), benchmark: 90 },
    ];
  }, [currentStudent]);

  // Derived STAR Method breakdown (Situation, Task, Action, Result out of 20 each)
  const starData = useMemo(() => {
    const starBase = currentStudent.softBreakdown.star || 16;
    const situation = Math.min(20, Math.max(10, Math.round(starBase * 1.05)));
    const task = Math.min(20, Math.max(8, Math.round(starBase * 0.88)));
    const action = Math.min(20, Math.max(6, Math.round(starBase * 0.65)));
    const result = Math.min(20, Math.max(5, Math.round(starBase * 0.55)));

    return [
      { name: 'Situation', icon: Puzzle, score: situation, max: 20 },
      { name: 'Task', icon: Target, score: task, max: 20 },
      { name: 'Action', icon: Zap, score: action, max: 20 },
      { name: 'Result', icon: TrendingUp, score: result, max: 20 },
    ];
  }, [currentStudent]);

  // Derived CV Analysis report data
  const cvAnalysisData = useMemo(() => {
    const isHigh = currentStudent.scores.overall >= 75;

    return {
      atsScore: isHigh ? 84 : 76,
      relevanceScore: isHigh ? 82 : 72,
      formattingScore: isHigh ? 74 : 65,
      impactScore: isHigh ? 61 : 52,
      skills: [
        { name: 'Financial modeling', match: true },
        { name: 'Valuation', match: true },
        { name: 'SQL', match: false }
      ],
      strength: 'Strong alignment with finance domain projects.',
      improvement: 'Include quantifiable metric results in internship bullet points.'
    };
  }, [currentStudent]);

  return (
    <div id="student-dashboard-report" className="p-6 w-full space-y-6 bg-slate-50/60 min-h-full font-sans text-slate-800">
      
      {/* 1. Header Banner & Candidate Selector */}
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentStudent.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {currentStudent.campus}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 pt-0.5 flex-wrap">
            <span>Specialization: <strong className="text-slate-700">{currentStudent.specialization}</strong></span>
            <span>•</span>
            <span className="truncate">Email: <span className="text-slate-600 font-mono text-[11px]">{currentStudent.email}</span></span>
          </div>
        </div>

        {/* Student Switcher & Attendance Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Attendance Indicators */}
          <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 p-2 rounded-md border border-slate-200/60">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Attendance:</span>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
              currentStudent.attendance.technical === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              Tech: {currentStudent.attendance.technical}
            </span>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
              currentStudent.attendance.softSkills === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              Comm: {currentStudent.attendance.softSkills}
            </span>
          </div>

          {/* Candidate Select Dropdown */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium py-2 px-3 pr-8 rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.specialization})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Layout: Side-by-Side Overall Performance & Single Stacked Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side (5 cols): Overall Gauge + 3 Secondary Category Score Cards */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Overall Performance Half-Gauge Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col items-center justify-between flex-1">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Performance</span>
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <HalfGaugeChart
              score={currentStudent.scores.overall}
              topScore={topScore}
              label="Aggregate Score"
            />
          </div>

          {/* 3 Secondary Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* GD Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">GD Score</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentStudent.scores.gd} <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(currentStudent.scores.gd, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Technical PI Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Technical PI</span>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                  <MessageSquareCode className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentStudent.scores.technical} <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(currentStudent.scores.technical, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Behavioral PI Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Behavioral PI</span>
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentStudent.scores.softSkills} <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(currentStudent.scores.softSkills, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side (7 cols): Single Radar Base with 3 Stacked Layers alongside Overall Performance */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between">
          
          {/* Minimalist Header & Layer Toggles */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-800">
              Skill Radar
            </h3>

            {/* Minimalist Layer Visibility Toggles */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setShowGD(!showGD)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  showGD
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>GD</span>
              </button>

              <button
                onClick={() => setShowTech(!showTech)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  showTech
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Tech</span>
              </button>

              <button
                onClick={() => setShowSoft(!showSoft)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  showSoft
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Communication</span>
              </button>

              <button
                onClick={() => setShowBenchmark(!showBenchmark)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  showBenchmark
                    ? 'bg-slate-100 text-slate-700 font-semibold'
                    : 'bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Benchmark</span>
              </button>
            </div>
          </div>

          {/* Single Radar Chart Canvas */}
          <div className="w-full h-[360px] pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={singleRadarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis
                  dataKey="param"
                  tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />

                {/* Benchmark Layer */}
                {showBenchmark && (
                  <Radar
                    name="Top Benchmark"
                    dataKey="benchmark"
                    stroke="#94A3B8"
                    fill="#CBD5E1"
                    fillOpacity={0.1}
                    strokeDasharray="4 4"
                  />
                )}

                {/* GD Layer */}
                {showGD && (
                  <Radar
                    name="GD Layer"
                    dataKey="gdScore"
                    stroke="#059669"
                    fill="#10B981"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                )}

                {/* Technical Layer */}
                {showTech && (
                  <Radar
                    name="Technical Layer"
                    dataKey="techScore"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                )}

                {/* Communication Layer */}
                {showSoft && (
                  <Radar
                    name="Communication Layer"
                    dataKey="softScore"
                    stroke="#D97706"
                    fill="#F59E0B"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                )}

                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

      {/* 3, 4 & 5. 2-Column Grid: Left Column (STAR 65% + Trainer Feedback 35%), Right Column (Resume CV Diagnostic) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (7 cols): STAR Breakdown (65%) + Trainer Feedback (35%) */}
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
          
          {/* STAR Method Breakdown Card (65% Height) */}
          <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 flex-[65]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                STAR method breakdown
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Behavioral response scoring across four stages
              </p>
            </div>

            <div className="space-y-4 pt-1 flex-1 flex flex-col justify-center">
              {starData.map((item) => {
                const Icon = item.icon;
                const isStrong = item.score >= 14;
                return (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    {/* Left Icon & Label */}
                    <div className="flex items-center gap-2.5 w-28 shrink-0">
                      <Icon className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    </div>

                    {/* Horizontal Progress Bar */}
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isStrong ? 'bg-lime-600' : 'bg-amber-600'
                        }`}
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      ></div>
                    </div>

                    {/* Score */}
                    <div className="w-10 text-right text-xs font-semibold text-slate-700 font-mono">
                      {item.score}/{item.max}
                    </div>

                    {/* Status Badge Pill */}
                    <div className="w-24 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isStrong
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isStrong ? 'Strong' : 'Needs practice'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trainer Feedback Section (35% Height directly below STAR) */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 flex-[35]">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
              Trainer Feedback
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 items-center">
              {/* Technical Remarks */}
              <div className="p-3 rounded-md border border-slate-200/70 bg-slate-50/30 flex flex-col justify-between space-y-1.5 h-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Technical Evaluation</span>
                  {currentStudent.techBreakdown.interviewer && (
                    <span className="text-slate-400 font-mono text-[10px]">
                      {currentStudent.techBreakdown.interviewer}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentStudent.techBreakdown.remarks || 'No specific technical remarks recorded.'}
                </p>
              </div>

              {/* Communication Remarks */}
              <div className="p-3 rounded-md border border-slate-200/70 bg-slate-50/30 flex flex-col justify-between space-y-1.5 h-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Communication Evaluation</span>
                  {currentStudent.softBreakdown.interviewer && (
                    <span className="text-slate-400 font-mono text-[10px]">
                      {currentStudent.softBreakdown.interviewer}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentStudent.softBreakdown.remarks || 'No specific communication remarks recorded.'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Resume and CV Diagnostic Card (Tight & Clean Spacing) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs flex flex-col space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Resume and CV diagnostic
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Score breakdown and detected skill matches
            </p>
          </div>

          {/* Top 3 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Card 1: Resume Relevance */}
            <div className="bg-slate-50/70 border border-slate-200/60 p-3 rounded-lg flex flex-col justify-between space-y-2">
              <div className="p-1.5 bg-slate-100 w-fit rounded text-slate-700">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Relevance
                </span>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {cvAnalysisData.relevanceScore}%
                </span>
              </div>
            </div>

            {/* Card 2: Formatting and Layout */}
            <div className="bg-slate-50/70 border border-slate-200/60 p-3 rounded-lg flex flex-col justify-between space-y-2">
              <div className="p-1.5 bg-slate-100 w-fit rounded text-slate-700">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Formatting
                </span>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {cvAnalysisData.formattingScore}%
                </span>
              </div>
            </div>

            {/* Card 3: Impact and Action Verbs */}
            <div className="bg-slate-50/70 border border-slate-200/60 p-3 rounded-lg flex flex-col justify-between space-y-2">
              <div className="p-1.5 bg-slate-100 w-fit rounded text-slate-700">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Impact Verbs
                </span>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {cvAnalysisData.impactScore}%
                </span>
              </div>
            </div>

          </div>

          {/* Lower Area: Detected Skills & Descriptions (Left) + ATS Score Metric Card (Right) */}
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 pt-1">
            
            {/* Left: Detected Skills & Description Bullets */}
            <div className="flex-1 space-y-3">
              {/* Detected Skills */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900">Detected skills</h4>
                <div className="flex flex-wrap items-center gap-1.5">
                  {cvAnalysisData.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900 text-white shadow-2xs"
                    >
                      <span>{skill.name}</span>
                      {skill.match ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullet Feedback Items */}
              <div className="space-y-1 text-[11px] italic font-medium">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>{cvAnalysisData.strength}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>{cvAnalysisData.improvement}</span>
                </div>
              </div>
            </div>

            {/* Right: ATS Score Metric Card (Same width as above 3-column cards) */}
            <div className="bg-slate-50/70 border border-slate-200/60 p-3 rounded-lg flex flex-col justify-between space-y-2 w-full sm:w-[calc(33.333%-0.5rem)] shrink-0">
              <div className="p-1.5 bg-slate-100 w-fit rounded text-slate-700">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  ATS Score
                </span>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {cvAnalysisData.atsScore}%
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
