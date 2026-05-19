import SearchWidget from './SearchWidget';

export default function Hero() {
  return (
    <section className="relative h-[819px] min-h-[600px] flex items-center justify-center px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Modern eco-cabin in a lush forest" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-primary/30"></div>
      </div>
      <div className="relative z-10 max-w-[var(--spacing-container-max)] mx-auto w-full text-center flex flex-col items-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-[48px] text-on-primary mb-6 drop-shadow-md">
          Escape into the Heart of Nature
        </h1>
        <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mb-12 drop-shadow-sm">
          Discover sustainable stays that connect you with the outdoors.
        </p>
        
        <SearchWidget />
      </div>
    </section>
  );
}
