import { useState } from 'react'

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  return [values, handleChange]

}