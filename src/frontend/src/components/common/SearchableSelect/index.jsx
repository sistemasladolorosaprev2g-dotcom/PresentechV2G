import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Seleccione una opción",
  label
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value.toString() === value?.toString());

  return (
    <div className="space-y-1" ref={dropdownRef}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <div 
          className={`w-full flex items-center justify-between rounded-md border bg-background px-4 py-3 min-h-12 text-base shadow-sm cursor-pointer ${
            isOpen ? "border-primary ring-1 ring-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-md border border-border bg-background py-1 shadow-md">
            <div className="sticky top-0 flex items-center border-b border-border bg-background px-4 py-3">
              <Search className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                className="w-full bg-transparent text-base focus:outline-none"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-base text-muted-foreground">No se encontraron resultados.</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-between px-4 py-3 text-base hover:bg-muted ${
                    value?.toString() === option.value.toString() ? "bg-muted/50 font-medium text-primary" : "text-foreground"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  {option.label}
                  {value?.toString() === option.value.toString() && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
