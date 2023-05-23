# Microservice Documentation

This README file provides an overview of the microservices, their data schemas, entry points, and interactions. Each microservice is described below, along with the relevant information.

## Student Microservice

The Student Microservice handles operations related to students.

### Data Schema

#### Student
- `id` (string): The ID of the student.
- `nom` (string): The name of the student.
- `email` (string): The email address of the student.
- `profCode` (string): The code of the professor associated with the student.

#### Teacher
- `id` (string): The ID of the teacher.
- `nom` (string): The name of the teacher.
- `matiere` (string): The subject taught by the teacher.

### gRPC API

The Student Microservice exposes the following gRPC API:

#### GetStudent
- Request: `GetStudentRequest`
  - `student_id` (string): The ID of the student to retrieve.
- Response: `GetStudentResponse`
  - `student` (Student): The retrieved student.

#### SearchStudents
- Request: `SearchStudentsRequest`
  - `query` (string): The search query to filter students.
- Response: `SearchStudentsResponse`
  - `students` (repeated Student): The list of students matching the search query.

#### CreateStudent
- Request: `CreateStudentRequest`
  - `student_id` (string): The ID of the student to create.
  - `nom` (string): The name of the student.
  - `email` (string): The email address of the student.
  - `profCode` (string): The code of the professor associated with the student.
- Response: `CreateStudentResponse`
  - `student` (Student): The created student.

#### GetTeacherInfo
- Request: `GetTeacherInfoRequest`
  - `student_name` (string): The name of the student to retrieve the associated teacher's information.
- Response: `GetTeacherInfoResponse`
  - `teacher` (Teacher): The teacher associated with the student.

### Implementation Details

The Student Microservice is implemented in Node.js using the following files:

- `studentMicroservice.js`: Defines the gRPC server for the Student Microservice and handles the database interactions for student-related operations.

### Running the Microservice

To run the Student Microservice, execute the following command:

```
node studentMicroservice.js
```

The microservice will be available on port 50051.

## Teacher Microservice

The Teacher Microservice handles operations related to teachers.

### Data Schema

#### Teacher
- `id` (string): The ID of the teacher.
- `nom` (string): The name of the teacher.
- `matiere` (string): The subject taught by the teacher.

### gRPC API

The Teacher Microservice exposes the following gRPC API:

#### GetTeacher
- Request: `GetTeacherRequest`
  - `teacher_id` (string): The ID of the teacher to retrieve.
- Response: `GetTeacherResponse`
  - `teacher` (Teacher): The retrieved teacher.

#### SearchTeachers
- Request: `SearchTeachersRequest`
  - `query` (string): The search query to filter teachers.
- Response: `SearchTeachersResponse`
  - `teachers` (repeated Teacher): The list of teachers matching the search query.

### Implementation Details

The Teacher Microservice is implemented in Node.js using the following files:

- `teacherMicroservice.js`: Defines the gRPC server for the Teacher Microservice and handles the database interactions for teacher-related operations.

### Running the Microservice

To run the Teacher Microservice, execute the following command:

```
node teacherMicroservice.js
```

The microservice will be available on port 50052.


## Using the API

You can now send GraphQL queries and mutations to the API gateway at `http://localhost:3000/graphql`. Here are some example requests:

### Get a student by ID

```graphql
query {
  student(id: "1") {
    id
    nom
    email
    profCode
  }
}
```

### Get all students

```graphql
query {
  students {
    id
    nom
    email
    profCode
  }
}
```

### Create a student

```graphql
mutation {
  createStudent(id: "3", nom: "John Doe", email: "john.doe@example.com", profCode: "P1234") {
    id
    nom
    email
    profCode
  }
}
```

### Get a teacher by ID

```graphql
query {
  teacher(id: "1") {
    id
    nom
    matiere
  }
}
```

### Get all teachers

```graphql
query {
  teachers {
    id
    nom
    matiere
  }
}
```

### Get teacher information for a student

```graphql
query {
  studentName(nom: "John Doe") {
    id
    nom
    matiere
  }
}
```

## REST API Endpoints

In addition to the GraphQL API, the API gateway provides some REST API endpoints to interact with the microservices directly. Here are some example requests:

### Get all students

```http
GET /students
```

### Create a student

```http
POST /students

{
  "id": "3",
  "nom": "John Doe",
  "email": "john.doe@example.com",
  "profCode": "P1234"
}
```

### Get a student by ID

```http
GET /students/id/1
```



## Communication between Microservices

The Student Microservice and the Teacher Microservice communicate with each other using gRPC. They interact through the following methods:

- **GetTeacherInfo**: The Student Microservice calls this method to retrieve the teacher associated with a specific student. The request includes the name of the student, and the response contains the teacher information.





## Additional Notes

- Both microservices use Node.js and gRPC for their implementation and communication.
- The microservices should be run on separate ports to enable communication without conflicts.
- The microservices connect to their respective databases for data storage and retrieval.
-




