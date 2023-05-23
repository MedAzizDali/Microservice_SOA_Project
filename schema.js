const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Student {
    id: String!
    nom: String!
    email: String!
    profCode: String!
  }

  type Teacher {
    id: String!
    nom: String!
    matiere: String!
  }

  type Query {
    student(id: String!): Student
    students: [Student]
    teacher(id: String!): Teacher
    teachers: [Teacher]
    studentName(nom: String!): Teacher
  }

  type Mutation {
    createStudent(id: String!, nom: String!, email: String! , profCode:String! ): Student
  }
`;

module.exports = typeDefs;
