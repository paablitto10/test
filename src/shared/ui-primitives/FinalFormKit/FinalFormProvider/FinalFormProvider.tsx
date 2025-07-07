import {ReactNode} from 'react'
import {FieldValues, FormProvider, UseFormReturn} from 'react-hook-form'
import {FormDetailsProvider} from './context'

interface FormProps<TFieldValues extends FieldValues, TContext>
  extends UseFormReturn<TFieldValues, TContext, FieldValues> {
  children: ReactNode
  isLoading: boolean
}

export function FinalFormProvider<TFieldValues extends FieldValues, TContext>({
  children,
  isLoading,
  ...props
}: FormProps<TFieldValues, TContext>) {
  return (
    <FormProvider {...props}>
      <FormDetailsProvider isLoading={isLoading}>{children}</FormDetailsProvider>
    </FormProvider>
  )
}
