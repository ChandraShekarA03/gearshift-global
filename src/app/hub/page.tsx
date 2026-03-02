import { BookOpen, Wrench, Video, PlayCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const mockGuides = [
    { id: 1, title: 'How to replace Ceramic Brake Pads (Honda Civic)', difficulty: 'Medium', time: '1.5 Hours', tools: 5, category: 'Brakes', video: true },
    { id: 2, title: 'Installing a Performance Air Filter', difficulty: 'Easy', time: '15 Mins', tools: 1, category: 'Engine', video: false },
    { id: 3, title: 'Alternator Replacement Guide', difficulty: 'Hard', time: '3.0 Hours', tools: 8, category: 'Electrical', video: true },
    { id: 4, title: 'Changing LED Headlight Bulbs', difficulty: 'Easy', time: '30 Mins', tools: 2, category: 'Lighting', video: true },
];

export default function DIYHubPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">DIY Knowledge Hub</h1>
                <p className="text-gray-400">
                    Save money and learn essential mechanic skills with our step-by-step installation guides mapped directly to our parts catalog.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass p-4 rounded-full flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto items-center">
                <input type="text" placeholder="Search guides by part name or vehicle..." className="bg-transparent border-none text-white px-6 w-full focus:outline-none flex-1 placeholder-gray-500" />

                <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

                <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer px-4 w-full md:w-auto appearance-none">
                    <option className="bg-[#121212]">Category: All</option>
                    <option className="bg-[#121212]">Brakes</option>
                    <option className="bg-[#121212]">Engine</option>
                    <option className="bg-[#121212]">Electrical</option>
                </select>

                <button className="bg-[var(--color-primary)] text-white px-8 py-2 rounded-full font-bold hover:bg-[var(--color-primary-hover)] transition-colors w-full md:w-auto shrink-0 shadow-[0_0_15px_rgba(0,123,255,0.4)]">
                    Search
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockGuides.map((guide) => (
                    <Link href={`/hub/${guide.id}`} key={guide.id} className="group glass rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all hover:-translate-y-2 flex flex-col">
                        {/* Thumbnail */}
                        <div className="aspect-video bg-[#1a1a1a] relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                            {/* Image Placeholder effect */}
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:scale-110 transition-transform duration-700" />
                            {guide.video ? (
                                <PlayCircle className="text-white/40 group-hover:text-white transition-colors absolute z-10" size={48} />
                            ) : (
                                <BookOpen className="text-white/10 absolute z-10" size={48} />
                            )}

                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg backdrop-blur-md ${guide.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    guide.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {guide.difficulty}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                                {guide.title}
                            </h3>

                            <div className="flex items-center text-xs text-gray-400 mb-4 gap-4 mt-auto">
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[var(--color-primary)]" /> {guide.time}</span>
                                <span className="flex items-center gap-1.5"><Wrench size={14} className="text-[var(--color-primary)]" /> {guide.tools} Tools</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/10 pt-4 text-xs font-semibold">
                                <span className="text-gray-500 uppercase tracking-widest">{guide.category}</span>
                                {guide.video && <span className="flex items-center gap-1 text-blue-400"><Video size={14} /> Video Guide</span>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
