import { MapPin, Star, Clock, Wrench } from 'lucide-react';

const mockGarages = [
    { id: 1, name: "EcoTuning Autocare", rating: 4.9, open: true, distance: "1.2 miles", cert: "Eco-Certified Partner", address: "1423 Sustainability Blvd, San Jose, CA" },
    { id: 2, name: "Performance Garage Bros", rating: 4.7, open: true, distance: "3.4 miles", cert: "Verified Installer", address: "89 Gear Ave, Santa Clara, CA" },
    { id: 3, name: "City Center Mechanics", rating: 4.2, open: false, distance: "5.1 miles", cert: "Verified Installer", address: "10 Main St, San Jose, CA" }
];

export default function GaragePage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Garage Connect</h1>
                <p className="text-gray-400 text-sm mt-1">Find a certified local installer to fit your purchased parts.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Map Placeholder */}
                <div className="flex-1 glass rounded-2xl relative overflow-hidden min-h-[300px] border border-[var(--color-primary)]/20 shadow-[0_0_30px_rgba(0,123,255,0.05)]">
                    <div className="absolute inset-0 bg-[#0a0a0a] opacity-90 flex items-center justify-center flex-col z-10">
                        {/* Decorative grid inside map */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

                        <MapPin className="text-[var(--color-primary)] mb-4 animate-bounce" size={48} />
                        <h2 className="text-xl font-bold text-white mb-2 relative z-20">Interactive Map View</h2>
                        <p className="text-gray-400 text-sm max-w-sm text-center relative z-20">
                            Integration with Mapbox / Google Maps will display verified partners in the surrounding area.
                        </p>
                    </div>
                </div>

                {/* List View */}
                <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-2">
                    <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Nearby Installers</h3>

                    {mockGarages.map((garage) => (
                        <div key={garage.id} className="glass p-5 rounded-xl hover:border-[var(--color-primary)]/40 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{garage.name}</h4>
                                <span className="flex items-center text-xs text-yellow-500 font-medium">
                                    <Star size={12} fill="currentColor" className="mr-1" /> {garage.rating}
                                </span>
                            </div>

                            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><MapPin size={12} /> {garage.address}</p>

                            <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-white/5">
                                <span className="flex items-center gap-1 text-gray-300">
                                    <Clock size={12} className={garage.open ? "text-green-500" : "text-red-500"} />
                                    {garage.open ? 'Open Now' : 'Closed'}
                                </span>
                                <span className="text-gray-400">{garage.distance}</span>
                            </div>

                            <div className="mt-4 pt-4 flex gap-2">
                                <button className="flex-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] py-2 rounded-lg text-xs font-semibold hover:bg-[var(--color-primary)]/20 transition-colors">
                                    View Profile
                                </button>
                                <button className="flex-1 bg-white/5 text-white py-2 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors flex justify-center items-center gap-1">
                                    <Wrench size={12} /> Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
