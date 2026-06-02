# TMS Client — Module 2 Lab Checklist

TypeScript training exercises covering type safety, discriminated unions, generics, and the Temporal API.

---

## Module 2 — Session 1

### Exercise 1: Readonly and Optional Properties

- [ ] `Student` interface has `readonly id: string` — reassigning `student.id` causes a **compile error**
- [ ] `gpa` is optional (`gpa?: number`) — accessing it without null check causes a **compile error**
- [ ] `student.gpa?.toFixed(2)` compiles and returns `undefined` when gpa is absent
- [ ] `student.gpa?.toFixed(2) ?? "Not yet graded"` prints `Not yet graded`

### Exercise 2: Strict Null Checks

- [ ] `strictNullChecks: true` is set in `tsconfig.json`
- [ ] Accessing `gpa.toFixed()` without optional chaining is a compile error
- [ ] Nullish coalescing `??` correctly falls back to `"Not yet graded"`

### Exercise 3: Type Guards — `isStudent`

- [ ] `isStudent` returns `true` for valid student objects
- [ ] `processStudent({ id: "STU-001", name: "Hana", gpa: 3.7 })` prints:
  ```
  Student Hana GPA: 3.70
  ```
- [ ] `processStudent(42)` prints:
  ```
  Invalid student data received
  ```

### Exercise 3B: Validation Function — `parseStudent`

- [ ] `parseStudent({ id: "STU-001", name: "Hana" })` returns and prints a valid `Student` object
- [ ] `parseStudent({ id: 42, name: "Test" })` throws:
  ```
  TypeError: Expected id to be a string, received number
  ```

---

## Module 2 — Session 2

### Exercise 4: Discriminated Unions — `AssessmentItem`

- [ ] `Quiz` interface has `kind: "quiz"` and `readonly id`
- [ ] `LabAssignment` interface has `kind: "lab"` and `readonly id`
- [ ] `AssessmentItem = Quiz | LabAssignment` union is defined
- [ ] `calculateGrade` uses exhaustive `switch` on `kind`
- [ ] Quiz grade: `(correctAnswers / totalQuestions) * 100` rounded
- [ ] Lab grade: `functionalityScore * 0.7 + codeQualityScore * 0.3` rounded
- [ ] `calculateGrade(quiz)` prints:
  ```
  Quiz grade: 80%
  ```
- [ ] `calculateGrade(lab)` prints:
  ```
  Lab grade: 87%
  ```
- [ ] Reassigning `quiz.id` causes a **compile error** (readonly)

### Exercise 5: Enrollment Lifecycle — `EnrollmentStatus`

- [ ] `EnrollmentStatus` is a discriminated union with variants: `PENDING | APPROVED | ACTIVE | COMPLETED | DROPPED`
- [ ] Each variant carries only its relevant fields (no shared mutable state)
- [ ] `describeEnrollment` uses exhaustive `switch` with a `never` default branch
- [ ] `describeEnrollment(pending)` prints:
  ```
  Awaiting approval since <UTC timestamp>
  ```

### Exercise 5B: Course Lifecycle — `CourseStatus`

- [ ] `CourseStatus` is a discriminated union with variants: `DRAFT | PUBLISHED | ACTIVE | ARCHIVED | CANCELLED`
- [ ] `describeCourse` uses exhaustive `switch` with a `never` default branch
- [ ] `describeCourse(webDev)` prints:
  ```
  Active with 28 students since 2026-09-01
  ```

### Exercise 6: Generic API Response — `ApiResponse<T>`

- [ ] `ApiResponse<T>` is a generic discriminated union with variants: `loading | success | error`
- [ ] `renderResponse` accepts a formatter callback `(data: T) => string`
- [ ] Works with any type — `Student`, `Course[]`, etc. — without code duplication
- [ ] `renderResponse(studentRes, ...)` prints:
  ```
  Dawit Bekele GPA: 3.4
  ```
- [ ] `renderResponse(courseListRes, ...)` prints:
  ```
  Web Development Fundamentals
  ```

### Exercise 7: Temporal API

- [ ] `Temporal.Now.instant()` captures the exact UTC moment of enrollment approval
- [ ] UTC instant prints in ISO 8601 format:
  ```
  Approved at (UTC): 2026-<date>T<time>Z
  ```
- [ ] Same instant displayed in `Africa/Addis_Ababa` (UTC+3) and `Europe/London` (UTC+1) shows correct local times with a 2-hour difference
  ```
  Addis: <time>
  London: <time>
  ```
- [ ] `Temporal.PlainDate` used for course start date (no time component)
- [ ] Days until course start calculated with `.until().total({ unit: "days" })` and printed as a positive integer
- [ ] Days until assignment deadline calculated the same way and printed as a positive integer

---

## Running the Project

```bash
# Compile
npx tsc --outDir dist

# Run
node dist/index.js
```
