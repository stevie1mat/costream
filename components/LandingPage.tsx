import React, { useRef } from 'react';
import { Film, Users, Zap, Globe, Shield, Radio, Smartphone, Lock, Sparkles } from 'lucide-react';
import { Lobby } from './Lobby';

interface LandingPageProps {
    onJoin: (roomId: string, isHost: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoin }) => {
    const lobbyRef = useRef<HTMLDivElement>(null);

    const scrollToLobby = () => {
        lobbyRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 relative">
            {/* Global Background Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-20 blur-[100px]" />
            </div>
            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-medium text-zinc-300">Live Sync Technology</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                        Watch Together.<br />
                        <span className="text-red-500">Everywhere.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Experience movies and shows in perfect sync with friends.
                        Crystal clear voice chat, zero latency, and pure immersion.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={scrollToLobby}
                            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]"
                        >
                            Start Watching Now
                        </button>
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-semibold text-lg backdrop-blur-sm transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            Why Co-Watch?
                        </h2>
                        <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            We've reimagined the shared viewing experience from the ground up.
                            Simple, powerful, and beautiful.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Instant Sync"
                            description="Our adaptive sync engine ensures everyone sees the exact same frame at the exact same time, down to the millisecond."
                        />
                        <FeatureCard
                            icon={<Radio className="w-6 h-6 text-green-400" />}
                            title="Crystal Audio"
                            description="High-fidelity voice chat built right into the browser. No external apps needed, just pure immersion."
                        />
                        <FeatureCard
                            icon={<Globe className="w-6 h-6 text-blue-400" />}
                            title="Universal Access"
                            description="Works on any modern browser. No downloads, no plugins, just share the link and play."
                        />
                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6 text-purple-400" />}
                            title="Mobile Friendly"
                            description="Optimized for all devices. Watch on your phone, tablet, or desktop with a responsive interface."
                        />
                        <FeatureCard
                            icon={<Lock className="w-6 h-6 text-red-400" />}
                            title="Private Rooms"
                            description="Create exclusive rooms for you and your friends. You control who joins and who watches."
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
                            title="Premium Quality"
                            description="Support for high-definition video and rich audio, ensuring the best possible viewing experience."
                        />
                    </div>
                </div>
            </div>

            {/* Lobby / Join Section */}
            <div ref={lobbyRef} className="min-h-screen flex items-center justify-center relative py-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-zinc-950" />

                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Jump In?</h2>
                        <p className="text-zinc-400 text-xl mb-8">
                            Create a room instantly or join your friends. No account required for basic viewing.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-zinc-500">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>End-to-end Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>Unlimited Participants</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <Lobby onJoin={onJoin} embedded />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Film className="w-6 h-6 text-red-500" />
                        <span className="font-bold text-xl">Co-Watch</span>
                    </div>
                    <div className="text-zinc-500 text-sm">
                        © 2024 Co-Watch. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
        <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-zinc-100">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);
