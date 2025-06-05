import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail, Linkedin } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white font-sans">
      <header className="p-8 text-center">
        <h1 className="text-5xl font-bold mb-2">John Doe</h1>
        <p className="text-xl text-purple-300">Web Developer & Designer</p>
        <div className="mt-4 flex justify-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="w-6 h-6 hover:text-purple-500" />
          </a>
          <a href="mailto:email@example.com">
            <Mail className="w-6 h-6 hover:text-purple-500" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 hover:text-purple-500" />
          </a>
        </div>
      </header>

      <section className="px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((project) => (
          <Card key={project} className="bg-gray-800/70 hover:shadow-xl hover:shadow-purple-500/20 transition duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Project {project}</h2>
              <p className="mb-4 text-gray-300">
                This is a brief description of Project {project}. It showcases skills in React, Tailwind, and modern UI.
              </p>
              <Button variant="outline" className="text-white border-purple-400 hover:bg-purple-600 hover:border-transparent">
                View Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <footer className="p-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} John Doe. All rights reserved.</p>
      </footer>
    </main>
  );
}
