const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const studentProtoPath = 'student.proto';
const teacherProtoPath = 'teacher.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

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

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get('/students', (req, res) => {
  clientStudents.searchStudents({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.students);
    }
  });
});

app.post('/students', (req, res) => {
  const { id, nom, email, profCode } = req.body;
  clientStudents.createStudent({ student_id: id, nom: nom, email: email , profCode: profCode }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.student);
    }
  });
});

app.get('/students/id/:id', (req, res) => {
  const id = req.params.id;
  clientStudents.getStudent({ student_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.student);
    }
  });
});


app.get('/students/name/:name', (req, res) => {
  const name = req.params.name;
  clientStudents.getTeacherInfo({ student_name: name }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teacher);
    }
  });
});

app.get('/teachers', (req, res) => {
  clientTeachers.searchTeachers({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teachers);
    }
  });
});

app.get('/teachers/:id', (req, res) => {
  const id = req.params.id;
  clientTeachers.getTeacher({ teacher_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teacher);
    }
  });
});




const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
