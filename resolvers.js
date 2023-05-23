const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const studentProtoPath = 'student.proto';
const teacherProtoPath = 'teacher.proto';
const studentProtoDefinition = protoLoader.loadSync(studentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const teacherProtoDefinition = protoLoader.loadSync(teacherProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const studentProto = grpc.loadPackageDefinition(studentProtoDefinition).student;
const teacherProto = grpc.loadPackageDefinition(teacherProtoDefinition).teacher;
const clientStudents = new studentProto.StudentService('localhost:50051', grpc.credentials.createInsecure());
const clientTeachers = new teacherProto.TeacherService('localhost:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    student: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientStudents.getStudent({ student_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.student);
          }
        });
      });
    },
    students: () => {
      return new Promise((resolve, reject) => {
        clientStudents.searchStudents({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.students);
          }
        });
      });
    },
    teacher: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientTeachers.getTeacher({ teacher_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.teacher);
          }
        });
      });
    },
    teachers: () => {
      return new Promise((resolve, reject) => {
        clientTeachers.searchTeachers({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.teachers);
          }
        });
      });
    },


    studentName: (_, { nom }) => {
      return new Promise((resolve, reject) => {
        clientStudents.getTeacherInfo({ student_name: nom }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.teacher);
          }
        });
      });
    },
    

  },
  Mutation: {
    createStudent: (_, { nom, email, profCode }) => {
      return new Promise((resolve, reject) => {
        clientStudents.createStudent({ nom: nom, email: email , profCode: profCode }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.student);
          }
        });
      });
    },
    // createTeacher: (_, { id, name, email, department }) => {
    //   return new Promise((resolve, reject) => {
    //     clientTeachers.createTeacher({ teacherId: id, name: name, email: email, department: department }, (err, response) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(response.teacher);
    //       }
    //     });
    //   });
    // },
  }
};

module.exports = resolvers;
