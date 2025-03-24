

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
  }
  
  const FilterSection = ({ title, children }: FilterSectionProps)=> {
    return (
      <div>
        <h3 className="text-white mb-3">{title}</h3>
        <div className="space-y-2">{children}</div>
      </div>
    );
  }

export default FilterSection
  