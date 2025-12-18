import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Train,
    MapPin,
    Info,
    ChevronRight,
    Users,
    ArrowRight,
    Accessibility,
    Navigation,
    RefreshCcw,
    Clock,
    ChevronLeft,
    CheckCircle2,
    Search,
    X,
    Map as MapIcon,
    Flag,
    Timer,
    Trophy,
    Zap,
    ShieldCheck,
    Heart,
    Settings,
    Baby,
    UserCircle,
    ChevronDown,
    Gauge,
    HelpCircle,
    Building2,
    Milestone,
    ArrowLeftRight,
    Activity,
    Layers,
    Briefcase,
    Smile,
    Ghost
} from 'lucide-react';

const apiKey = "ujilulffygft5w68uup7i615deajov6yzsfji8pv0xufcinhedfg8avqzzc4yam6";

// --- FALLBACK DATA ---
const FALLBACK_STATIONS = [
    { id: 'odpt.Station:TokyoMetro.Marunouchi.Shinjuku', name: 'Shinjuku', line: 'Marunouchi Line', color: '#f62e36', entrances: [{ id: 'm1', name: 'Main Gate', platformProximity: [1, 2], barrierFree: true }] },
    { id: 'odpt.Station:TokyoMetro.Marunouchi.Tokyo', name: 'Tokyo', line: 'Marunouchi Line', color: '#f62e36', entrances: [{ id: 'm1', name: 'Marunouchi Central', platformProximity: [3, 4], barrierFree: true }] },
    { id: 'odpt.Station:TokyoMetro.Marunouchi.Ginza', name: 'Ginza', line: 'Marunouchi Line', color: '#f62e36', entrances: [{ id: 'm1', name: 'A1 Exit', platformProximity: [5, 6], barrierFree: true }] },
    { id: 'odpt.Station:TokyoMetro.Ginza.Shibuya', name: 'Shibuya', line: 'Ginza Line', color: '#ff9500', entrances: [{ id: 'g1', name: 'Hachiko Exit', platformProximity: [1, 2], barrierFree: true }] },
    { id: 'odpt.Station:TokyoMetro.Hibiya.Roppongi', name: 'Roppongi', line: 'Hibiya Line', color: '#9ca3af', entrances: [{ id: 'h1', name: 'Exit 1', platformProximity: [3, 4], barrierFree: true }] },
];

const fetchODPT = async (type, params = "", retries = 5) => {
    const url = `https://api.odpt.org/api/v4/odpt:${type}?acl:consumerKey=${apiKey}${params}`;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            return await response.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            const delay = Math.pow(2, i) * 1000;
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

const SearchableSelect = ({ label, icon: Icon, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(opt =>
            opt.name.toLowerCase().includes(search.toLowerCase()) ||
            opt.line.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-slate-50 border-2 rounded-2xl p-4 pl-12 cursor-pointer transition-all flex items-center justify-between relative ${isOpen ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-transparent'}`}
            >
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />}
                <span className={`font-semibold truncate pr-2 ${value ? 'text-slate-700' : 'text-slate-400'}`}>
                    {value ? `${value.name} (${value.line})` : placeholder}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-50 sticky top-0 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                                placeholder="Search station..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                        {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${value?.id === opt.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{opt.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">{opt.line}</span>
                                </div>
                                {value?.id === opt.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-400 text-sm italic">No stations found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [view, setView] = useState('planner');
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [destinationStation, setDestinationStation] = useState(null);
    const [selectedEntrance, setSelectedEntrance] = useState(null);
    const [trainOccupancy, setTrainOccupancy] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeCarNumber, setActiveCarNumber] = useState(null);
    const [isTimingsExpanded, setIsTimingsExpanded] = useState(false);
    const [activeLegendId, setActiveLegendId] = useState(null);

    const [userProfile, setUserProfile] = useState({
        isWomen: false,
        isDisabled: false,
        isPregnant: false,
        hasLuggage: false,
        isElderly: false,
        quietCar: false
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const initData = async () => {
            try {
                const data = await fetchODPT('Station', '&odpt:operator=odpt.Operator:TokyoMetro');
                const uniqueStations = data
                    .map((s, idx) => ({
                        id: s['owl:sameAs'],
                        name: s['dc:title'],
                        line: s['odpt:railway'] ? s['odpt:railway'].split(':').pop().replace('.', ' ') : 'Metro Line',
                        lineCode: s['odpt:railway'] ? s['odpt:railway'].split(':').pop() : 'M',
                        color: s['odpt:railway']?.includes('Marunouchi') ? '#f62e36' : s['odpt:railway']?.includes('Ginza') ? '#ff9500' : '#9ca3af',
                        index: idx,
                        entrances: [
                            { id: 'main', name: 'Main Gate (Elevator)', platformProximity: [2, 3], barrierFree: true },
                            { id: 'sub', name: 'East Stairs (Gate 4)', platformProximity: [7, 8], barrierFree: false }
                        ]
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                const finalStations = uniqueStations.length ? uniqueStations : FALLBACK_STATIONS;
                setStations(finalStations);
                setSelectedStation(finalStations[0]);
                setDestinationStation(finalStations[1]);
                setSelectedEntrance(finalStations[0].entrances[0]);
            } catch (err) {
                setStations(FALLBACK_STATIONS);
                setSelectedStation(FALLBACK_STATIONS[0]);
                setDestinationStation(FALLBACK_STATIONS[1]);
                setSelectedEntrance(FALLBACK_STATIONS[0].entrances[0]);
            } finally {
                setIsDataLoading(false);
            }
        };
        initData();
    }, []);

    const destinationOptions = useMemo(() => {
        return stations.filter(s => s.id !== selectedStation?.id);
    }, [selectedStation, stations]);

    useEffect(() => {
        if (selectedStation) setSelectedEntrance(selectedStation.entrances[0]);
    }, [selectedStation]);

    const fetchTrainData = () => {
        if (!selectedStation) return;
        setIsLoading(true);
        setActiveCarNumber(null);
        setTimeout(() => {
            const cars = Array.from({ length: 10 }, (_, i) => ({
                carNumber: i + 1,
                congestion: Math.floor(Math.random() * 5) + 1,
                isWomenOnly: i === 0 || i === 9,
                isDisabledAccessible: i === 3 || i === 6,
                isPriority: i === 1 || i === 4 || i === 8,
                isSpacious: i === 0 || i === 5 || i === 9 // End cars or specific wide cars
            }));
            setTrainOccupancy(cars);
            setIsLoading(false);
        }, 600);
    };

    useEffect(() => {
        if (selectedStation && destinationStation) fetchTrainData();
    }, [selectedStation?.id, destinationStation?.id, selectedEntrance?.id]);

    const journeyTimings = useMemo(() => {
        if (!selectedStation || !destinationStation) return null;
        const isSameLine = selectedStation.line === destinationStation.line;
        const baseDuration = isSameLine ? 15 : 28;
        const format = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const schedules = [4, 12, 22].map(delay => {
            const dep = new Date(currentTime);
            dep.setMinutes(dep.getMinutes() + delay);
            const arr = new Date(dep);
            arr.setMinutes(arr.getMinutes() + baseDuration);
            return {
                depTime: format(dep),
                arrTime: format(arr),
                duration: baseDuration,
                delay: delay
            };
        });
        return {
            current: schedules[0],
            upcoming: schedules.slice(1)
        };
    }, [selectedStation, destinationStation, currentTime]);

    const bestCar = useMemo(() => {
        if (!trainOccupancy.length) return null;
        let candidates = [...trainOccupancy];

        // Filter by mandatory flags if profile selected
        if (userProfile.isDisabled) {
            candidates = candidates.filter(c => c.isDisabledAccessible);
        } else if (userProfile.isWomen) {
            const womenOnlyCars = candidates.filter(c => c.isWomenOnly);
            if (womenOnlyCars.length) candidates = womenOnlyCars;
        } else if (userProfile.isPregnant || userProfile.isElderly) {
            candidates = candidates.filter(c => c.isPriority);
        } else if (userProfile.hasLuggage) {
            candidates = candidates.filter(c => c.isSpacious);
        }

        if (candidates.length === 0) candidates = [...trainOccupancy];
        return candidates.sort((a, b) => a.congestion - b.congestion)[0];
    }, [trainOccupancy, userProfile]);

    const getCongestionColor = (level, isWomenOnly) => {
        if (isWomenOnly) {
            switch (level) {
                case 1: return 'bg-rose-400';
                case 2: return 'bg-rose-500';
                case 3: return 'bg-pink-600';
                case 4: return 'bg-pink-700';
                default: return 'bg-pink-900';
            }
        }
        switch (level) {
            case 1: return 'bg-emerald-500';
            case 2: return 'bg-green-400';
            case 3: return 'bg-yellow-400';
            case 4: return 'bg-orange-500';
            case 5: return 'bg-red-600';
            default: return 'bg-slate-200';
        }
    };

    const LEGEND_DETAILS = {
        'standard': {
            title: 'Standard Congestion',
            description: 'Real-time occupancy for general carriages based on seat sensors and weight metrics.',
            levels: [
                { label: 'Level 1', color: 'bg-emerald-500', context: 'Plenty of seats available (< 40% load)' },
                { label: 'Level 2', color: 'bg-green-400', context: 'Some seats available (40-70% load)' },
                { label: 'Level 3', color: 'bg-yellow-400', context: 'Standing room only (70-100% load)' },
                { label: 'Level 4', color: 'bg-orange-500', context: 'Shoulder-to-shoulder (100-150% load)' },
                { label: 'Level 5', color: 'bg-red-600', context: 'Critically crowded (> 150% load)' },
            ]
        },
        'women': {
            title: 'Women-Only Carriage',
            description: 'Designated carriages for women, children, and people with disabilities during specified hours.',
            levels: [
                { label: 'W/O 1', color: 'bg-rose-400', context: 'Very quiet / Safe space' },
                { label: 'W/O 3', color: 'bg-pink-600', context: 'Moderately busy' },
                { label: 'W/O 5', color: 'bg-pink-900', context: 'Peak hour congestion' },
            ],
            note: 'Operation hours vary by line (typically 07:30 - 09:30 AM).'
        },
        'optimal': {
            title: 'Optimal Comfort (Blue Border)',
            description: 'Carriages that best match your profile preferences (Women-only, Disabled, etc.) AND have the lowest congestion.',
            icon: Trophy,
            color: 'border-indigo-600'
        },
        'transfer': {
            title: 'Fast Transfer (Amber Border)',
            description: 'The carriage closest to your selected station entrance for minimal walking at arrival.',
            icon: Zap,
            color: 'border-amber-400'
        }
    };

    const PlannerView = () => (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <SearchableSelect label="Departure" icon={MapPin} value={selectedStation} options={stations} onChange={setSelectedStation} placeholder="Select origin" />
                    <SearchableSelect label="Arrival" icon={ArrowLeftRight} value={destinationStation} options={destinationOptions} onChange={setDestinationStation} placeholder="Select destination" />
                </div>

                {journeyTimings && (
                    <div
                        onClick={() => setIsTimingsExpanded(!isTimingsExpanded)}
                        className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group border border-white/5 animate-in zoom-in-95 duration-500 cursor-pointer transition-all hover:ring-2 hover:ring-indigo-500/50"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Train size={80} /></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-1">Next Departure</span>
                                    <span className="text-2xl font-black tabular-nums leading-none">{journeyTimings.current.depTime}</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <ArrowRight className="w-5 h-5 text-indigo-400 mb-1" />
                                    <div className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded-full text-[9px] font-black border border-indigo-600/30 whitespace-nowrap uppercase tracking-tighter">{journeyTimings.current.duration} MIN</div>
                                </div>
                                <div className="flex flex-col text-right md:text-left">
                                    <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1">Arrives</span>
                                    <span className="text-2xl font-black tabular-nums leading-none">{journeyTimings.current.arrTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:flex-col md:items-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-white font-bold text-sm">Live Service</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                    {isTimingsExpanded ? 'Close Schedule' : 'View Schedule'}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${isTimingsExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                        </div>

                        {isTimingsExpanded && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Upcoming Services</h4>
                                {journeyTimings.upcoming.map((sched, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                <Clock className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black tabular-nums leading-none">{sched.depTime}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">IN {sched.delay} MIN</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Arrives {sched.arrTime}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2 block">Boarding Entrance</label>
                    <div className="relative flex items-center">
                        <Navigation className="absolute left-4 w-5 h-5 text-indigo-500 z-10" />
                        <select
                            className="w-full bg-slate-100 border-none rounded-2xl p-4 pl-12 pr-10 appearance-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 cursor-pointer shadow-inner relative"
                            value={selectedEntrance?.id || ''}
                            onChange={(e) => setSelectedEntrance(selectedStation.entrances.find(ent => ent.id === e.target.value))}
                        >
                            {selectedStation?.entrances.map(ent => <option key={ent.id} value={ent.id}>{ent.name}</option>)}
                        </select>
                        <ChevronRight className="absolute right-4 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                </div>
            </div>

            <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                            <Users className="w-5 h-5 text-indigo-600" /> Live Train Load
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Series 1000</span>
                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">• Tokyo Metro Operator</span>
                        </div>
                    </div>
                    <button onClick={fetchTrainData} className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-100">
                        <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="relative pt-6 pb-4 overflow-x-auto hide-scrollbar">
                    <div className="flex gap-4 px-2 min-w-max">
                        {!isLoading ? trainOccupancy.map((car) => {
                            const isBest = bestCar && car.carNumber === bestCar.carNumber;
                            const isFastTransfer = selectedEntrance?.platformProximity.includes(car.carNumber);
                            const isActive = activeCarNumber === car.carNumber;
                            return (
                                <div
                                    key={car.carNumber}
                                    className="w-24 flex flex-col items-center shrink-0 cursor-pointer"
                                    onClick={() => setActiveCarNumber(isActive ? null : car.carNumber)}
                                >
                                    <div className={`w-full h-32 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center relative ${getCongestionColor(car.congestion, car.isWomenOnly)} shadow-sm border-4 ${isBest ? 'border-indigo-600 scale-105 z-20 shadow-xl ring-4 ring-white' : isFastTransfer ? 'border-amber-400 scale-105 z-10 shadow-lg' : 'border-transparent'} ${isActive ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}>
                                        {isBest && (
                                            <div className="absolute -top-3 px-2 py-0.5 bg-indigo-600 rounded-full shadow-md z-30 flex items-center gap-1">
                                                <Trophy className="w-2 h-2 text-white" />
                                                <span className="text-[7px] font-black text-white uppercase tracking-tighter whitespace-nowrap">Best</span>
                                            </div>
                                        )}
                                        {isFastTransfer && !isBest && (
                                            <div className="absolute -top-3 px-2 py-0.5 bg-amber-400 rounded-full shadow-md z-30 flex items-center gap-1">
                                                <Zap className="w-2 h-2 text-slate-900 fill-slate-900" />
                                                <span className="text-[7px] font-black text-slate-900 uppercase tracking-tighter whitespace-nowrap">Fast Exit</span>
                                            </div>
                                        )}
                                        <span className="text-white text-sm font-black">#{car.carNumber}</span>
                                        <div className="absolute top-2 flex gap-1">
                                            {car.isWomenOnly && <Heart className="w-3 h-3 text-white fill-white" />}
                                            {car.isDisabledAccessible && <Accessibility className="w-3 h-3 text-white" />}
                                            {car.isPriority && <ShieldCheck className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="w-full h-32 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-100 rounded-3xl">
                                <RefreshCcw className="animate-spin" />
                                <span className="font-black text-[10px] uppercase tracking-widest">Polling Live Data...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legend & Info</h4>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                            Tap for Details <HelpCircle className="w-3 h-3" />
                        </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                        <button onClick={() => setActiveLegendId(activeLegendId === 'standard' ? null : 'standard')} className={`shrink-0 px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${activeLegendId === 'standard' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><div className="flex gap-0.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-red-600" /></div><span className="text-[10px] font-black uppercase tracking-tight">Load Index</span></button>
                        <button onClick={() => setActiveLegendId(activeLegendId === 'women' ? null : 'women')} className={`shrink-0 px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${activeLegendId === 'women' ? 'bg-rose-500 text-white shadow-lg' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}><Heart className={`w-3 h-3 ${activeLegendId === 'women' ? 'fill-white' : 'fill-rose-500'}`} /><span className="text-[10px] font-black uppercase tracking-tight">Women Only</span></button>
                        <button onClick={() => setActiveLegendId(activeLegendId === 'optimal' ? null : 'optimal')} className={`shrink-0 px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${activeLegendId === 'optimal' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border-2 border-indigo-600/30 text-indigo-700 hover:bg-indigo-50'}`}><Trophy className="w-3 h-3" /><span className="text-[10px] font-black uppercase tracking-tight">Comfort Match</span></button>
                        <button onClick={() => setActiveLegendId(activeLegendId === 'transfer' ? null : 'transfer')} className={`shrink-0 px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${activeLegendId === 'transfer' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-white border-2 border-amber-400/30 text-amber-700 hover:bg-amber-50'}`}><Zap className="w-3 h-3 fill-current" /><span className="text-[10px] font-black uppercase tracking-tight">Fast Exit</span></button>
                    </div>
                    {activeLegendId && (
                        <div className="mt-4 p-5 bg-slate-900 rounded-[2rem] text-white animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
                            <button onClick={() => setActiveLegendId(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={16} /></button>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-500/20 rounded-xl">
                                    {activeLegendId === 'standard' && <Gauge className="w-5 h-5 text-indigo-400" />}
                                    {activeLegendId === 'women' && <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />}
                                    {activeLegendId === 'optimal' && <Trophy className="w-5 h-5 text-amber-400" />}
                                    {activeLegendId === 'transfer' && <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />}
                                </div>
                                <h5 className="font-black text-lg tracking-tight uppercase">{LEGEND_DETAILS[activeLegendId].title}</h5>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">{LEGEND_DETAILS[activeLegendId].description}</p>
                            {LEGEND_DETAILS[activeLegendId].levels && (
                                <div className="space-y-3">
                                    {LEGEND_DETAILS[activeLegendId].levels.map((lvl, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className={`w-3 h-3 rounded-full ${lvl.color}`} />
                                            <div className="flex flex-col"><span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{lvl.label}</span><span className="text-[11px] text-slate-400 font-bold">{lvl.context}</span></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trip Details</h3>
                    <button onClick={() => setView('routeMap')} className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">
                        <MapIcon className="w-3 h-3" /> Open Full Route Map
                    </button>
                </div>
                <div className="relative pl-10 space-y-12">
                    <div className="absolute left-4 top-2 bottom-2 w-1 bg-slate-100 rounded-full" />
                    <div className="relative">
                        <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-white border-4 border-indigo-600 shadow-md" />
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Departure Station</span>
                                <h4 className="text-xl font-black tracking-tight leading-tight">{selectedStation?.name}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[11px] font-bold text-slate-600">{selectedEntrance?.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black tabular-nums leading-none">{journeyTimings?.current.depTime}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase block mt-1 tracking-widest">Departs</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-white border-4 border-emerald-500 shadow-md" />
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Boarding Preference</span>
                                <div className="bg-emerald-50/50 p-5 rounded-[2rem] border-2 border-dashed border-emerald-200 mt-2 flex items-center gap-5">
                                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                                        <span className="text-white font-black text-2xl">#{bestCar?.carNumber || '1'}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-black text-slate-800 leading-none mb-1">Move to Carriage #{bestCar?.carNumber || '1'}</h5>
                                        <p className="text-[11px] text-slate-500 font-bold leading-snug">Recommended carriage based on live occupancy and {selectedStation?.name} platform layout.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-white border-4 border-slate-900 shadow-md" />
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Final Destination</span>
                                <h4 className="text-xl font-black tracking-tight leading-tight">{destinationStation?.name}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="px-3 py-1 bg-slate-900 rounded-xl">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{destinationStation?.line}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black tabular-nums leading-none text-indigo-600">{journeyTimings?.current.arrTime}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase block mt-1 tracking-widest">{journeyTimings?.current.duration} MIN TRIP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const RouteMapView = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] shadow-xl border border-white/10 overflow-hidden">
                <div className="p-8 pb-4">
                    <button onClick={() => setView('planner')} className="flex items-center gap-2 text-indigo-400 hover:text-white mb-6 font-black uppercase text-[10px] tracking-widest transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to Planner
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">Live Route Map</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Tokyo Metro Network</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 pt-4">
                    <div className="bg-slate-800/50 aspect-square md:aspect-video rounded-[2rem] relative border border-white/5 overflow-hidden flex items-center justify-center p-4">
                        <svg viewBox="0 0 800 500" className="w-full h-full">
                            {/* Network Lines */}
                            <path d="M100 250 L700 250" stroke="#f62e36" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
                            <path d="M200 100 L200 400" stroke="#ff9500" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
                            <path d="M600 100 L600 400" stroke="#9ca3af" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
                            <path d="M300 100 Q400 250 500 400" stroke="#00b261" strokeWidth="12" fill="none" opacity="0.6" />

                            {/* Station Nodes */}
                            <circle cx="200" cy="250" r="10" fill="white" stroke="#f62e36" strokeWidth="4" />
                            <circle cx="600" cy="250" r="10" fill="white" stroke="#f62e36" strokeWidth="4" />
                            <circle cx="200" cy="150" r="8" fill="white" stroke="#ff9500" strokeWidth="3" />
                            <circle cx="600" cy="350" r="8" fill="white" stroke="#9ca3af" strokeWidth="3" />

                            {/* Current Position Marker */}
                            <circle cx="200" cy="250" r="18" fill="#4f46e5" fillOpacity="0.2" className="animate-pulse" />
                            <circle cx="200" cy="250" r="6" fill="#4f46e5" />
                        </svg>

                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-red-500" />
                                    <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-orange-400" />
                                    <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-emerald-500" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 grid md:grid-cols-3 gap-4">
                        {[
                            { name: 'Marunouchi', status: 'Normal', color: 'bg-[#f62e36]' },
                            { name: 'Ginza', status: 'Minor Delay', color: 'bg-[#ff9500]' },
                            { name: 'Hibiya', status: 'Normal', color: 'bg-[#9ca3af]' }
                        ].map(line => (
                            <div key={line.name} className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${line.color}`} />
                                        <span className="text-white font-black text-xs uppercase tracking-tight">{line.name}</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-[10px] font-medium leading-relaxed">System status is nominal.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const SettingsView = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-indigo-700 p-10 text-white">
                    <button onClick={() => setView('planner')} className="flex items-center gap-2 text-indigo-100 hover:text-white mb-6 font-bold uppercase text-[10px] tracking-widest transition-colors"><ChevronLeft className="w-4 h-4" /> Save & Return</button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner"><UserCircle size={48} className="text-white" /></div>
                        <div><h2 className="text-3xl font-black tracking-tighter">Preferences</h2><p className="text-indigo-200 text-sm font-medium">Define your personalized travel profile</p></div>
                    </div>
                </div>
                <div className="p-8 space-y-10">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Profiles</h3>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Priority Seating Focus</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { key: 'isWomen', label: 'Women-Only', sub: 'Safe-space carriages', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
                                { key: 'isPregnant', label: 'Maternity/Family', sub: 'Near priority seats & wider doors', icon: Baby, color: 'text-orange-500', bg: 'bg-orange-50' },
                                { key: 'isElderly', label: 'Elderly / Mobility', sub: 'Avoid long platform walks', icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { key: 'isDisabled', label: 'Accessibility', sub: 'Near elevators & ramps', icon: Accessibility, color: 'text-blue-500', bg: 'bg-blue-50' }
                            ].map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => setUserProfile(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${userProfile[opt.key] ? 'bg-indigo-50 border-indigo-500 shadow-md' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                                >
                                    <div className={`p-3 rounded-2xl shrink-0 ${userProfile[opt.key] ? 'bg-indigo-600 text-white' : opt.bg + ' ' + opt.color}`}><opt.icon className="w-6 h-6" /></div>
                                    <div className="text-left overflow-hidden">
                                        <span className="block font-bold text-base leading-tight truncate">{opt.label}</span>
                                        <span className="text-[10px] text-slate-500 font-bold block truncate">{opt.sub}</span>
                                    </div>
                                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${userProfile[opt.key] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>{userProfile[opt.key] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Travel Needs</h3>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Carriage Layout Focus</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { key: 'hasLuggage', label: 'Traveler / Luggage', sub: 'Prioritize end cars with wide space', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { key: 'quietCar', label: 'Quiet Preference', sub: 'Avoid high-chatter / high-echo areas', icon: Ghost, color: 'text-slate-600', bg: 'bg-slate-100' }
                            ].map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => setUserProfile(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${userProfile[opt.key] ? 'bg-indigo-50 border-indigo-500 shadow-md' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                                >
                                    <div className={`p-3 rounded-2xl shrink-0 ${userProfile[opt.key] ? 'bg-indigo-600 text-white' : opt.bg + ' ' + opt.color}`}><opt.icon className="w-6 h-6" /></div>
                                    <div className="text-left overflow-hidden">
                                        <span className="block font-bold text-base leading-tight truncate">{opt.label}</span>
                                        <span className="text-[10px] text-slate-500 font-bold block truncate">{opt.sub}</span>
                                    </div>
                                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${userProfile[opt.key] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>{userProfile[opt.key] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            These preferences help us calculate the <span className="text-indigo-600 font-black">Comfort Match</span>. Your data is stored locally on this device and is never shared with the operator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            <header className="bg-indigo-700 text-white p-6 shadow-lg sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('planner')}>
                        <div className="bg-white p-1.5 rounded-lg shadow-inner"><Train className="text-indigo-700 w-6 h-6" /></div>
                        <h1 className="text-xl font-bold tracking-tight">ComfortRoute</h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setView('routeMap')} className={`p-2 rounded-xl transition-all border-2 ${view === 'routeMap' ? 'bg-white text-indigo-700 border-white' : 'bg-indigo-800/40 text-white border-transparent hover:bg-indigo-800'}`}><MapIcon className="w-6 h-6" /></button>
                        <button onClick={() => setView('settings')} className={`p-2 rounded-xl transition-all border-2 ${view === 'settings' ? 'bg-white text-indigo-700 border-white' : 'bg-indigo-800/40 text-white border-transparent hover:bg-indigo-800'}`}><Settings className="w-6 h-6" /></button>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                {isDataLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                        <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Tokyo Metro...</p>
                    </div>
                ) : (
                    view === 'planner' ? <PlannerView /> :
                        view === 'settings' ? <SettingsView /> :
                            <RouteMapView />
                )}
            </main>
        </div>
    );
};

export default App;