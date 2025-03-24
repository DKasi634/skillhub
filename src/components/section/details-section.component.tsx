interface DetailSectionProps {
    title: string;
    value: string;
    subvalue: string;
  }
  
  const DetailSection = ({ title, value, subvalue }: DetailSectionProps)=> {
    return (
      <div>
        <h4 className="text-white mb-2">{title}</h4>
        <div className="flex justify-between">
          <span className="text-gray-400">{value}</span>
          <span className="text-gray-400">{subvalue}</span>
        </div>
      </div>
    );
  }

export default DetailSection