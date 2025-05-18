class LearningManagementSystem {
  constructor() {
    this.courseManager = {
      courses: new Map(),
      enrollments: new Map(),
      progress: new Map()
    };

    this.assessmentEngine = {
      quizzes: new Map(),
      assignments: new Map(),
      grades: new Map()
    };

    this.progressTracker = {
      milestones: new Map(),
      certificates: new Map(),
      analytics: new Map()
    };
  }

  async createCourse(courseData) {
    const courseId = `course-${Date.now()}`;
    const course = {
      id: courseId,
      ...courseData,
      modules: [],
      students: new Set(),
      status: 'active',
      analytics: {
        enrollments: 0,
        completions: 0,
        avgProgress: 0
      }
    };

    this.courseManager.courses.set(courseId, course);
    return courseId;
  }

  async addModule(courseId, moduleData) {
    const course = this.courseManager.courses.get(courseId);
    if (!course) throw new Error('Course not found');

    const moduleId = `module-${Date.now()}`;
    const module = {
      id: moduleId,
      ...moduleData,
      lessons: [],
      quizzes: [],
      assignments: []
    };

    course.modules.push(module);
    return moduleId;
  }

  async enrollStudent(courseId, studentId) {
    const course = this.courseManager.courses.get(courseId);
    if (!course) throw new Error('Course not found');

    course.students.add(studentId);
    course.analytics.enrollments++;

    const enrollment = {
      courseId,
      studentId,
      enrolledAt: Date.now(),
      progress: 0,
      status: 'active'
    };

    this.courseManager.enrollments.set(`${courseId}-${studentId}`, enrollment);
    return enrollment;
  }

  async trackProgress(courseId, studentId, lessonId) {
    const enrollmentId = `${courseId}-${studentId}`;
    const enrollment = this.courseManager.enrollments.get(enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found');

    const progressEntry = {
      lessonId,
      completedAt: Date.now(),
      status: 'completed'
    };

    const studentProgress = this.progressTracker.milestones.get(enrollmentId) || [];
    studentProgress.push(progressEntry);
    this.progressTracker.milestones.set(enrollmentId, studentProgress);

    // Update enrollment progress
    const course = this.courseManager.courses.get(courseId);
    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0);
    enrollment.progress = (studentProgress.length / totalLessons) * 100;

    // Check for completion
    if (enrollment.progress >= 100) {
      await this.completeCourse(courseId, studentId);
    }

    return enrollment.progress;
  }

  async createAssessment(courseId, moduleId, assessmentData) {
    const assessmentId = `assessment-${Date.now()}`;
    const assessment = {
      id: assessmentId,
      courseId,
      moduleId,
      ...assessmentData,
      submissions: new Map()
    };

    if (assessmentData.type === 'quiz') {
      this.assessmentEngine.quizzes.set(assessmentId, assessment);
    } else {
      this.assessmentEngine.assignments.set(assessmentId, assessment);
    }

    return assessmentId;
  }

  async submitAssessment(assessmentId, studentId, submission) {
    let assessment;
    if (this.assessmentEngine.quizzes.has(assessmentId)) {
      assessment = this.assessmentEngine.quizzes.get(assessmentId);
    } else {
      assessment = this.assessmentEngine.assignments.get(assessmentId);
    }

    if (!assessment) throw new Error('Assessment not found');

    const submissionData = {
      studentId,
      submittedAt: Date.now(),
      content: submission,
      grade: null,
      feedback: null
    };

    assessment.submissions.set(studentId, submissionData);
    return submissionData;
  }

  async gradeAssessment(assessmentId, studentId, grade, feedback) {
    let assessment;
    if (this.assessmentEngine.quizzes.has(assessmentId)) {
      assessment = this.assessmentEngine.quizzes.get(assessmentId);
    } else {
      assessment = this.assessmentEngine.assignments.get(assessmentId);
    }

    if (!assessment) throw new Error('Assessment not found');

    const submission = assessment.submissions.get(studentId);
    if (!submission) throw new Error('Submission not found');

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = Date.now();

    this.assessmentEngine.grades.set(`${assessmentId}-${studentId}`, {
      assessmentId,
      studentId,
      grade,
      feedback,
      gradedAt: Date.now()
    });

    return submission;
  }

  async completeCourse(courseId, studentId) {
    const enrollment = this.courseManager.enrollments.get(`${courseId}-${studentId}`);
    if (!enrollment) throw new Error('Enrollment not found');

    enrollment.status = 'completed';
    enrollment.completedAt = Date.now();

    const course = this.courseManager.courses.get(courseId);
    course.analytics.completions++;

    const certificate = {
      id: `cert-${Date.now()}`,
      courseId,
      studentId,
      issuedAt: Date.now(),
      metadata: {
        courseName: course.name,
        studentName: studentId, // Should be replaced with actual student name
        grade: await this.calculateFinalGrade(courseId, studentId)
      }
    };

    this.progressTracker.certificates.set(`${courseId}-${studentId}`, certificate);
    return certificate;
  }

  async calculateFinalGrade(courseId, studentId) {
    const grades = Array.from(this.assessmentEngine.grades.values())
      .filter(grade => grade.studentId === studentId);
    
    if (grades.length === 0) return null;

    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    return total / grades.length;
  }

  async getCourseAnalytics(courseId) {
    const course = this.courseManager.courses.get(courseId);
    if (!course) throw new Error('Course not found');

    const enrollments = Array.from(this.courseManager.enrollments.values())
      .filter(enrollment => enrollment.courseId === courseId);

    const analytics = {
      totalStudents: course.students.size,
      activeStudents: enrollments.filter(e => e.status === 'active').length,
      completionRate: (course.analytics.completions / course.analytics.enrollments) * 100,
      averageProgress: enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length,
      averageGrade: await this.calculateCourseAverageGrade(courseId)
    };

    this.progressTracker.analytics.set(courseId, analytics);
    return analytics;
  }
}

export default LearningManagementSystem;