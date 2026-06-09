import React from 'react';
import { Shirt, Award, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop"
            alt="Fabric background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-tight">
            Redefining Everyday Luxury Streetwear
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            At NanuGujar, we believe clothes should do more than look good—they should feel incredible and stand the test of time.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">What Makes Us Different</h2>
          <p className="text-sm text-slate-500">
            We inspect every spool, seam, and button to deliver clothing that lives up to premium standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-50 p-8 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Shirt size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Premium Fabrics</h3>
            <p className="text-sm text-slate-500">
              Using 100% organic long-staple combed cotton and breathable Belgian linen.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Custom Fits</h3>
            <p className="text-sm text-slate-500">
              Tailored sizing structures designed specifically to offer both ease of movement and sharp styling.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Durability Tested</h3>
            <p className="text-sm text-slate-500">
              Pre-shrunk, double-stitched seams, and high-density dye guarantees resistance against wash cycles.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Heart size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Sustainable Mindset</h3>
            <p className="text-sm text-slate-500">
              Responsible production practices, recyclable packaging, and fair labor agreements.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">Crafting Excellence in Gujarat</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Rooted in the rich textile heritage of Gujarat, NanuGujar combines historical handloom expertise with contemporary modern aesthetics. From our head design studio in Ahmedabad, we draft patterns, select custom colors, and produce shirts and pants that let you stand out.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We operate with a direct-to-consumer model. By skipping intermediaries, we are able to source premium materials and pay our weavers fairly, while delivering top-quality streetwear directly to your door at an honest price.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop"
              alt="Tailoring design process"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
