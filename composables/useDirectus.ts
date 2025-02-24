import { createDirectus, rest, authentication } from '@directus/sdk'

// Define your types based on the schema
interface Schema {
  students: {
    id: string
    name: string
    klas: string
    cijfers: Array<{
      student_subject_period_id: {
        grade: string
        subject_period: {
          vak: {
            name: string
          }
          periode: number
        }
      }
    }>
  }
}

export default function useDirectus() {
  const config = useRuntimeConfig()
  const client = createDirectus<Schema>(config.public.directusUrl as string)
    .with(rest())
    .with(authentication())

  return { client }
} 
