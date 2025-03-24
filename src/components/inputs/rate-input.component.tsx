// components/RateInput.tsx
import { useFormContext } from 'react-hook-form'
import  GenericInput  from '@/components/generic-input/generic-input.component'
import { cn } from '@/utils/index'

interface RateInputProps {
  name: string
  label: string
  currency?: string
  className?: string
}

export const RateInput = ({
  name,
  label,
  currency = 'USD',
  className
}: RateInputProps) => {
  const { register, formState: { errors } } = useFormContext()

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value.replace(/[^0-9]/g, '')) || 0)
  }

  const validateRate = (value: string) => {
    const rate = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(rate)) return 'Rate is required'
    if (rate < 10) return 'Minimum rate is $10/hour'
    if (rate > 200) return 'Maximum rate is $200/hour'
    if (rate % 5 !== 0) return 'Rate must be in increments of $5'
    return true
  }

  return (
    <div className={cn('space-y-2', className)}>
      <GenericInput
        label={label}
        type="text"
        name={name}
        value={formatCurrency(String(register(name, {
          validate: validateRate
        })))}
        onChange={(e) => {
          register(name).onChange(e)
        }}
        placeholder={`Enter ${currency} rate`}
        error={errors[name]?.message?.toString()}
      />
    </div>
  )
}
