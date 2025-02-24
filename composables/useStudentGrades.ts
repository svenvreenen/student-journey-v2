export const useStudentGrades = () => {
  const { directus } = useDirectus()
  
  const fetchStudentGrades = async (studentId: string) => {
    try {
      const student = await directus.items('students').readOne(studentId, {
        fields: [
          'id',
          'name',
          'image',
          'cijfers.student_subject_period_id.grade',
          'cijfers.student_subject_period_id.subject_period.vak.name',
          'cijfers.student_subject_period_id.subject_period.periode'
        ]
      })
      return student
    } catch (error) {
      console.error('Error fetching grades:', error)
      throw error
    }
  }

  return {
    fetchStudentGrades
  }
} 
