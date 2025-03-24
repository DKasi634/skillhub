
import FilterSection from '../filter-section/filter-section.component'
import CheckboxOption from '../inputs/check-box.component'
import RadioOption from '../inputs/radio-input.component'

type FilterSideBarProps = {
    className?:string
}
const FilterSidebar = ({className=""}:FilterSideBarProps) => {
  return (
    <div className={`${className} w-72 p-6 border-r border-gray-800`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-xl font-semibold">Filters</h2>
                  <button className="text-purple-500 text-sm">Reset All</button>
                </div>
    
                <div className="space-y-6">
                  <FilterSection title="Sort By">
                    <RadioOption label="Most Experienced" checked />
                    <RadioOption label="A-Z" />
                    <RadioOption label="Low Hour Rate" />
                  </FilterSection>
    
                  <FilterSection title="Hour Rate">
                    <div className="mt-2">
                      <div className="relative h-2 bg-gray-700 rounded-full">
                        <div className="absolute h-full w-1/2 bg-purple-600 rounded-full" />
                      </div>
                      <div className="flex justify-between mt-2 text-gray-400 text-sm">
                        <span>$8</span>
                        <span>$39</span>
                      </div>
                    </div>
                  </FilterSection>
    
                  <FilterSection title="Experience">
                    <CheckboxOption label="1-3" />
                    <CheckboxOption label="4-8" checked />
                    <CheckboxOption label="9-14" checked />
                    <CheckboxOption label="15+" checked />
                  </FilterSection>
    
                  <FilterSection title="Dialogue">
                    <CheckboxOption label="Zoom" />
                    <CheckboxOption label="Google Meet" />
                    <CheckboxOption label="Skype" checked />
                    <CheckboxOption label="Cisco Webex" />
                  </FilterSection>
                </div>
              </div>
  )
}

export default FilterSidebar