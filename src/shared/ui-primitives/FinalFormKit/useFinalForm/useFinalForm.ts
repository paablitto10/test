import {toast} from '@backpackapp-io/react-native-toast'
import {zodResolver} from '@hookform/resolvers/zod'
import {dequal} from 'dequal'
import {useEffect} from 'react'
import {
  useForm,
  UseFormProps,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
  DefaultValues,
} from 'react-hook-form'
import {TypeOf, z} from 'zod'
import {useChanged} from '@shared/lib/state'

interface UseFinalFormProps<
  TFieldValues extends z.infer<TSchema>,
  TSchema extends z.Schema,
  TContext = unknown,
> extends Omit<UseFormProps<TFieldValues, TContext>, 'resolver' | 'defaultValues'> {
  schema: TSchema
  defaultValues?: DefaultValues<TFieldValues>
  isLoading?: boolean
  onSuccess?: () => void
  onError?: (error: unknown) => void
  onSubmit?: (payload: z.infer<TSchema>) => Promise<unknown> | void
  shouldResetAfterSubmit?: boolean
}

export interface UseFinalForReturn<
  TFieldValues extends z.infer<TSchema>,
  TSchema extends z.Schema,
  TContext = unknown,
> extends UseFormReturn<TFieldValues, TContext, z.infer<TSchema>> {
  isLoading: boolean
}

export function useFinalForm<
  TFieldValues extends z.infer<TSchema>,
  TSchema extends z.Schema,
  TContext = unknown,
>({
  schema,
  isLoading = false,
  values,
  defaultValues,
  onSubmit,
  onError,
  onSuccess,
  shouldResetAfterSubmit = true,
  ...props
}: UseFinalFormProps<TFieldValues, TSchema, TContext>): UseFinalForReturn<
  TFieldValues,
  TSchema,
  TContext
> {
  const defaultValuesMemoized = useChanged(defaultValues, dequal)

  const form = useForm<TFieldValues, TContext>({
    mode: 'all',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
      ...props.resetOptions,
    },
    shouldFocusError: true,
    values: values,
    defaultValues: defaultValues,
    ...props,
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit: handleSubmitNative,
    reset,
    formState,
    formState: {submitCount},
  } = form

  useEffect(() => {
    if (defaultValuesMemoized) {
      reset(defaultValuesMemoized, {
        // Reset default values but keep dirty
        keepErrors: true,
        keepDirty: true,
        keepTouched: true,
        keepIsValid: true,
        keepIsSubmitted: true,
        keepIsSubmitSuccessful: true,
        keepSubmitCount: true,
        keepValues: false,
        keepDirtyValues: true,
        keepDefaultValues: false,
      })
    }
  }, [defaultValuesMemoized])

  // It's recommended to reset inside useEffect after submission (https://react-hook-form.com/api/useform/reset/).
  useEffect(() => {
    if (submitCount && shouldResetAfterSubmit) {
      const {isSubmitSuccessful} = formState
      if (isSubmitSuccessful) {
        // Reset all
        reset(undefined, {
          keepErrors: false,
          keepDirty: false,
          keepTouched: false,
          keepIsValid: false,
          keepIsSubmitted: false,
          keepIsSubmitSuccessful: false,
          keepSubmitCount: false,
          keepValues: false,
          keepDirtyValues: false,
          keepDefaultValues: false,
        })
      }
    }
  }, [submitCount, shouldResetAfterSubmit])

  return {
    ...form,
    isLoading,
    handleSubmit: (
      onValid: SubmitHandler<z.infer<TSchema>>,
      onInvalid?: SubmitErrorHandler<TypeOf<TSchema>>
    ) =>
      handleSubmitNative(async (data) => {
        try {
          await onSubmit?.(data)

          if (onSuccess) {
            onSuccess()
          } else {
            /*enqueueSnackbar('Operation completed successfully', {
              variant: 'success',
            })*/
          }

          onValid(data)
        } catch (error) {
          if (onError) {
            onError(error)
          } else {
            toast.error('Some fields are invalid')
          }
        }
      }, onInvalid),
  }
}
