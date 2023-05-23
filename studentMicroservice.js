const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2/promise');

const studentProtoPath = 'student.proto';
const studentProtoDefinition = protoLoader.loadSync(studentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const studentProto = grpc.loadPackageDefinition(studentProtoDefinition).student;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school',
});

const studentService = {
  getStudent: async (call, callback) => {
    const [rows, fields] = await pool.execute('SELECT * FROM students WHERE id = ?', [call.request.student_id]);

    
  if (rows.length === 0) {
    callback({ code: grpc.status.NOT_FOUND, message: 'Student not found' });
    return;
  }
    const student = {
      id: rows[0].id,
      nom: rows[0].nom,
      email: rows[0].email,
      profCode : rows[0].profCode,
    };
    callback(null, {student});
  },
  searchStudents: async (call, callback) => {
    try {
      // Fetch all students from the database
      const [rows, fields] = await pool.execute('SELECT * FROM students');
      const students = rows.map((row) => ({
        id: row.id,
        nom: row.nom,
        email: row.email,
        profCode: row.profCode,
      }));
      callback(null, { students });
    } catch (err) {
      console.error('Error retrieving students:', err);
      callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
    }
  },
  createStudent: async (call, callback) => {
    const { nom, email , profCode } = call.request;
  
    try {
      const connection = await pool.getConnection();
      
      // Insert the student record without specifying the 'id' column
      const [result] = await connection.execute('INSERT INTO students (nom, email,profCode) VALUES (?, ? , ?)', [nom, email , profCode]);
      
      connection.release();
  
      const student = {
        id: result.insertId, // Get the auto-generated 'id' value
        nom,
        email,
        profCode,
      };
  
      callback(null, { student });
    } catch (err) {
      console.error('Error creating student:', err);
      callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
    }
  },

   getTeacherInfo : async (call, callback) => {
    const { student_name } = call.request;
  
    try {
      const [rows, fields] = await pool.execute('SELECT * FROM teachers WHERE id IN (SELECT profCode FROM students WHERE nom = ?)',
      [student_name],);
      
      if (rows.length === 0) {
        callback({ code: grpc.status.NOT_FOUND, message: 'Teacher not found' });
        return;
      }
  
      const teacher = {
        id: rows[0].id,
        nom: rows[0].nom,
        matiere: rows[0].matiere,
      };
  
      callback(null, { teacher });
    } catch (err) {
      console.error('Error retrieving teacher:', err);
      callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
    }
  }
};

const server = new grpc.Server();
server.addService(studentProto.StudentService.service, studentService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Student microservice running on port ${port}`);