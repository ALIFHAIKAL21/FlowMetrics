'use client';

import { Github, Mail, User, BookOpen, Rocket } from 'lucide-react';

export default function Developer() {
    return (
        <main className="container mx-auto p-6 md:p-10 mt-12 font-sans">
            {/* Wrapper Card */}
            <div className="p-8 rounded-2xl bg-[#0A0A0A] shadow-lg shadow-emerald-500/30 text-center">
                {/* Profile Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500 rounded-full">
                        <User className="text-emerald-400" size={32} />
                    </div>
                </div>

                {/* Name & Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Alif Haikal
                </h1>
                <p className="text-gray-400 text-sm md:text-base mb-6">
                    Informatics Engineering Student at Bina Insani University – Indonesia
                </p>

                {/* About Text */}
                <p className="text-gray-300 text-sm md:text-base mb-8 max-w-2xl mx-auto">
                    I created <span className="text-emerald-400 font-medium">FlowMetrics</span> as a personal
                    portfolio project and experimental platform. The application showcases real-time forex
                    charts and pivot indicators, intended strictly for educational and demonstration purposes —
                    not for trading activities.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
                    <a
                        href="https://github.com/ALIFHAIKAL21" // Ganti dengan username kamu
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm md:text-base font-medium transition"
                    >
                        <Github size={18} /> View GitHub
                    </a>
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=haikalsialip999@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 px-6 py-3 border border-emerald-500 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm md:text-base font-medium transition"
>
  <Mail size={18} /> Contact Me
</a>


                </div>

                {/* Skills / Showcase Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-emerald-500/20 flex items-start gap-3">
                        <Rocket className="text-emerald-400 mt-1" size={20} />
                        <div>
                            <h3 className="text-white font-semibold mb-1">Project Purpose</h3>
                            <p className="text-gray-400 text-sm">
                                Portfolio showcase and learning experiment focused on forex data visualization.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-emerald-500/20 flex items-start gap-3">
                        <BookOpen className="text-emerald-400 mt-1" size={20} />
                        <div>
                            <h3 className="text-white font-semibold mb-1">Tech Stack</h3>
                            <p className="text-gray-400 text-sm">
                                Built with Next.js, React.js, TailwindCSS, and Lightweight Charts API for modern and fast UI.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-emerald-500/20 flex items-start gap-3">
                        <User className="text-emerald-400 mt-1" size={20} />
                        <div>
                            <h3 className="text-white font-semibold mb-1">Background</h3>
                            <p className="text-gray-400 text-sm">
                                Undergraduate Informatics Engineering student passionate about frontend & data visualization.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
