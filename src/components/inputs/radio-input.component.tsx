interface RadioOptionProps {
    label: string;
    checked?: boolean;
  }
  
  const RadioOption = ({ label, checked }: RadioOptionProps)=> {
    return (
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className={`w-4 h-4 rounded-full border ${
          checked ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
        }`}>
          {checked && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />}
        </div>
        <span className="text-gray-400">{label}</span>
      </label>
    );
  }


export default RadioOption;

