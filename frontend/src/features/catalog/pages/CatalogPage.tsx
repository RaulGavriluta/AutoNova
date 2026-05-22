import { useState } from 'react';

export default function CatalogPage() {
  const [selectedBrand, setSelectedBrand] = useState('');

  const featuredProductsPlaceholder = [
    { id: 1, name: 'Brembo Brake Disc Line', brand: 'BREMBO', price: '$189.99', category: 'Braking Systems' },
    { id: 2, name: 'Bosch Carbon Cabin Filter', brand: 'BOSCH', price: '$34.50', category: 'Filters' },
    { id: 3, name: 'Sachs Performance Shock Absorber', brand: 'SACHS', price: '$145.00', category: 'Suspension' },
    { id: 4, name: 'Castrol Edge 5W-30 Advanced Engine Oil', brand: 'CASTROL', price: '$59.99', category: 'Fluids' },
  ];

  return (
    <div className="w-full font-body-custom flex flex-col gap-16 pb-16">
      
      {/* 1. HERO SECTION (Dark Brown Background - Text matches Light Beige) */}
      <section className="relative bg-primary text-bg-main rounded-3xl overflow-hidden shadow-sm mx-4 sm:mx-0">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center flex flex-col items-center gap-6">
          <span className="text-xs font-bold uppercase tracking-widest text-bg-main bg-bg-surface/10 px-3 py-1 rounded-full">
            Original & Premium Quality Only
          </span>
          <h1 className="text-4xl md:text-6xl font-custom font-bold text-bg-surface tracking-tight max-w-2xl leading-tight">
            Engineered Parts for <span className="text-text-base">Uncompromising</span> Performance
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-xl leading-relaxed">
            Find and source certified automotive components tailored precisely to your vehicle's factory specifications.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#selector" className="bg-secondary hover:bg-secondary border border-secondary text-bg-surface font-medium py-3 px-6 rounded-xl transition-colors">
              Find Your Vehicle
            </a>
            <a href="#products" className="bg-transparent border border-bg-main/30 text-bg-main hover:bg-bg-surface/5 font-medium py-3 px-6 rounded-xl transition-colors">
              Browse Parts
            </a>
          </div>
        </div>
      </section>

      {/* 2. QUICK VEHICLE SELECTOR (White Surface - Text matches Dark Base) */}
      <section id="selector" className="max-w-4xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-bg-surface border border-border-custom p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-custom font-bold text-text-base">Select Your Vehicle</h2>
            <p className="text-text-muted text-sm mt-1">Guaranteed fitment for your specific model.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-bg-main border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors cursor-pointer text-sm"
            >
              <option value="">Select Brand</option>
              <option value="audi">Audi</option>
              <option value="bmw">BMW</option>
              <option value="vw">Volkswagen</option>
            </select>

            <select className="bg-bg-main border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors cursor-pointer text-sm" disabled={!selectedBrand}>
              <option value="">Select Model</option>
              <option value="a4">A4</option>
              <option value="3series">3 Series</option>
            </select>

            <button className="bg-primary hover:bg-primary-hover text-bg-main font-medium rounded-xl p-3 transition-colors shadow-sm cursor-pointer text-sm">
              Search Compatible Parts
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (White Grid Cards) */}
      <section id="products" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-border-custom pb-4">
          <div>
            <h2 className="text-2xl font-custom font-bold text-text-base">Featured Components</h2>
            <p className="text-text-muted text-sm mt-1">Most demanded original parts in stock.</p>
          </div>
          <button className="text-sm font-medium text-primary hover:text-primary-hover transition-colors hidden sm:block">
            View All Parts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProductsPlaceholder.map((product) => (
            <div key={product.id} className="bg-bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all duration-200">
              
              <div className="bg-bg-main h-48 w-full flex items-center justify-center border-b border-border-custom text-text-muted/40">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-center text-xs font-bold text-secondary">
                  <span>{product.brand}</span>
                  <span className="bg-bg-main px-2 py-0.5 rounded text-text-muted font-normal">{product.category}</span>
                </div>
                <h3 className="text-base font-custom font-bold text-text-base line-clamp-2 min-h-12">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-auto pt-2">
                  <span className="text-lg font-bold text-text-base">{product.price}</span>
                  <button className="bg-primary/5 hover:bg-primary text-primary hover:text-bg-main border border-primary/20 hover:border-primary text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. VALUES / FEATURES (Dark Brown Background - Text matches Light Beige) */}
      <section className="bg-primary text-bg-main rounded-3xl p-8 sm:p-12 mx-4 sm:mx-0 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-bg-surface/10 text-secondary rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-custom font-bold text-bg-surface">100% Certified Parts</h3>
            <p className="text-text-muted text-sm mt-1">Direct from leading European manufacturers with full warranty protection.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-3 bg-bg-surface/10 text-secondary rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-custom font-bold text-bg-surface">Fast Logistics</h3>
            <p className="text-text-muted text-sm mt-1">Optimized distribution network ensures prompt secure delivery.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-3 bg-bg-surface/10 text-secondary rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-custom font-bold text-bg-surface">Expert Technical Support</h3>
            <p className="text-text-muted text-sm mt-1">Our mechanical specialists are always available to double-check compatibility.</p>
          </div>
        </div>
      </section>

    </div>
  );
}