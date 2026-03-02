-- ============================================================
-- School Management System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- ------------------------------------------------------------
-- Schools
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schools (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  school_name     VARCHAR(255) NOT NULL,
  director_name   VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  contact_number  VARCHAR(20),
  address         TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Users (admin / teacher / student)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin', 'teacher', 'student') NOT NULL,
  school_id   INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Classes  (e.g. "Grade 10A", "Form 3B")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS classes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  class_name  VARCHAR(100) NOT NULL,
  school_id   INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Subjects  (e.g. "Mathematics", "Biology")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  subject_name  VARCHAR(100) NOT NULL,
  school_id     INT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Class–Subject assignments  (which teacher teaches what in which class)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS class_subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  class_id    INT NOT NULL,
  subject_id  INT NOT NULL,
  teacher_id  INT NOT NULL,
  FOREIGN KEY (class_id)   REFERENCES classes(id)  ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id)    ON DELETE CASCADE,
  UNIQUE KEY uq_class_subject (class_id, subject_id)
);

-- ------------------------------------------------------------
-- Student–Class enrollment
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_classes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  student_id  INT NOT NULL,
  class_id    INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_student_class (student_id, class_id)
);

-- ------------------------------------------------------------
-- Attendance
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  class_id     INT NOT NULL,
  date         DATE NOT NULL,
  status       ENUM('present', 'absent', 'late') NOT NULL,
  recorded_by  INT NOT NULL,
  FOREIGN KEY (student_id)  REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (class_id)    REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id)   ON DELETE CASCADE,
  UNIQUE KEY uq_attendance (student_id, class_id, date)
);

-- ------------------------------------------------------------
-- Grades
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grades (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  subject_id   INT NOT NULL,
  class_id     INT NOT NULL,
  grade        DECIMAL(5,2) NOT NULL,
  term         VARCHAR(50),
  recorded_by  INT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id)  REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (subject_id)  REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)    REFERENCES classes(id)  ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id)    ON DELETE CASCADE,
  UNIQUE KEY uq_grade (student_id, subject_id, class_id, term)
);
