const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2/promise');

const teacherProtoPath = 'teacher.proto';
const teacherProtoDefinition = protoLoader.loadSync(teacherProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const teacherProto = grpc.loadPackageDefinition(teacherProtoDefinition).teacher;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school',
});

const teacherService = {
  getTeacher: async (call, callback) => {
    const { teacher_id } = call.request;

    try {
      // Fetch teacher from the database based on the provided teacher_id
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM teachers WHERE id = ?', [teacher_id]);
      connection.release();

      if (rows.length === 0) {
        // Teacher not found
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
  },
  searchTeachers: async (call, callback) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM teachers');
      connection.release();
  
      const teachers = rows.map(row => ({
        id: row.id,
        nom: row.nom,
        matiere: row.matiere,
      }));
  
      callback(null, { teachers });
    } catch (err) {
      console.error('Error retrieving teachers:', err);
      callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
    }
  },
};

const server = new grpc.Server();
server.addService(teacherProto.TeacherService.service, teacherService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Server is running on port ${port}`);
  server.start();
});
console.log(`Teacher microservice running on port ${port}`);
