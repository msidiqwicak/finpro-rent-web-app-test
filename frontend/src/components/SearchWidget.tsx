export default function SearchWidget() {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement actual search redirection with query params
    console.log('Search initiated');
  };

  return (
    <form onSubmit={handleSearch} className="bg-surface p-4 rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center border border-outline-variant/30">
      <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-outline-variant/30 text-left">
        <label className="block font-caption text-caption text-on-surface-variant mb-1">Location</label>
        <select className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface outline-none">
          <option value="" disabled selected>Where to?</option>
          <option value="Bali">Bali</option>
          <option value="Bandung">Bandung</option>
          <option value="Yogyakarta">Yogyakarta</option>
          <option value="Lombok">Lombok</option>
        </select>
      </div>
      
      <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-outline-variant/30 text-left">
        <label className="block font-caption text-caption text-on-surface-variant mb-1">Dates</label>
        <input 
          type="date" 
          className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface outline-none" 
          placeholder="Add dates" 
        />
      </div>
      
      <div className="flex-1 w-full px-4 py-2 text-left">
        <label className="block font-caption text-caption text-on-surface-variant mb-1">Guests</label>
        <input 
          type="number" 
          min="1"
          className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface outline-none" 
          placeholder="Add guests" 
        />
      </div>
      
      <button type="submit" className="w-full md:w-auto bg-primary text-on-primary p-4 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center min-w-[56px]">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </form>
  );
}
