


interface CheckboxOptionProps {
    label: string;
    checked?: boolean;
  }
  
  const CheckboxOption = ({ label, checked }: CheckboxOptionProps)=> {
    return (
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className={`w-4 h-4 rounded border ${
          checked ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
        }`}>
          {checked && <div className="w-2 h-2 bg-white rounded mx-auto mt-1" />}
        </div>
        <span className="text-gray-400">{label}</span>
      </label>
    );
  }


  export default CheckboxOption