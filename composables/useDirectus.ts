import { createDirectus, rest, authentication, readItems, readItem } from '@directus/sdk'
import { useAuthStore } from '~/stores/auth'

// Define student type
interface Student {
  id: string
  name: string
  image: object
  studentNumber: string
  attendance_op1: string
  attendance_op2: string
  attendance_op3: string
  mentor_message_vsa: string
  mentor_message_bsa: string
}

// Schema typing for Directus v19
type Schema = {
  students: Student
}

export function useDirectus() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // Create the client with more explicit initialization
  const directus = createDirectus(config.public.directusUrl)
    .with(rest())
    .with(authentication())
  
  // Simpler token handling
  if (authStore.token && import.meta.client) {
    try {
      // Set token directly
      directus.setToken(authStore.token)
    } catch (error) {
      console.error('Failed to set token:', error)
    }
  }

  return {
    directus,
    async getStudents() {
      try {
        // Direct HTTP request as fallback if SDK issues persist
        const headers = {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
        
        const response = await fetch(
          `${config.public.directusUrl}/items/students?fields=*,klas.*`, 
          { headers }
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch students (${response.status})`)
        }
        
        const result = await response.json()
        
        // Ensure we're returning in consistent format
        // Directus API returns { data: [...] }
        return result
      } catch (error) {
        console.error('Error fetching students:', error)
        throw error
      }
    },
    // Helper methods for common operations
    async getStudent(id: string) {
      try {
        if (!authStore.token) {
          throw new Error('No authentication token available')
        }

        // Direct HTTP request to match our getStudents approach
        const headers = {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
        
        const response = await fetch(
          `${config.public.directusUrl}/items/students/${id}?fields=id,studentNumber,name,image,attendance_op1,attendance_op2,attendance_op3,mentor_message_vsa,mentor_message_bsa,klas.*`, 
          { headers }
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch student (${response.status})`)
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error fetching student:', error)
        throw error
      }
    }
  }
} 
