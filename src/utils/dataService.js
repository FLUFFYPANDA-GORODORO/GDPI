import studentData from '../data/studentData.json';

export function getAllStudents() {
  return studentData.students || [];
}

export function getStudentById(id) {
  const students = getAllStudents();
  return students.find((s) => s.id === id) || students[0];
}

export function getSpecializationTopScore(specialization) {
  if (studentData.specTopScores && studentData.specTopScores[specialization]) {
    return studentData.specTopScores[specialization];
  }
  return 98.5; // default benchmark if spec not found
}
