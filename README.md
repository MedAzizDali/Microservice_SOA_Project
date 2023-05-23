# Microservice_SOA_Project

Documentation des microservices


Student Microservice : 

Schémas de données :

Student:

- id (string) : Identifiant de l'étudiant
- nom (string) : Nom de l'étudiant
- email (string) : Adresse e-mail de l'étudiant
- profCode (string) : Code du professeur associé à l'étudiant

Points d'entrée : 

GetStudent :

Requête : GetStudentRequest
student_id (string) : Identifiant de l'étudiant à récupérer

Réponse : GetStudentResponse
student (Student) : Informations de l'étudiant récupéré

SearchStudents : 

Requête : SearchStudentsRequest
query (string) : Requête de recherche pour les étudiants

Réponse : SearchStudentsResponse
students (repeated Student) : Liste des étudiants correspondant à la requête de recherche

CreateStudent : 

Requête : CreateStudentRequest
student_id (string) : Identifiant de l'étudiant à créer
nom (string) : Nom de l'étudiant à créer
email (string) : Adresse e-mail de l'étudiant à créer
profCode (string) : Code du professeur associé à l'étudiant à créer

Réponse : CreateStudentResponse
student (Student) : Informations de l'étudiant créé

GetTeacherInfo : 

Requête : GetTeacherInfoRequest
student_name (string) : Nom de l'étudiant pour récupérer les informations sur l'enseignant associé

Réponse : GetTeacherInfoResponse
teacher (Teacher) : Informations de l'enseignant associé à l'étudiant 


Teacher Microservice : 

Schémas de données :

	Teacher:

- id (string) : Identifiant de l'enseignant
- nom (string) : Nom de l'enseignant
- matiere (string) : Matière enseignée par l'enseignant

Points d'entrée : 

GetTeacher

Requête : GetTeacherRequest
teacher_id (string) : Identifiant de l'enseignant à récupérer

Réponse : GetTeacherResponse
teacher (Teacher) : Informations de l'enseignant récupéré



SearchTeachers

Requête : SearchTeachersRequest
query (string) : Requête de recherche pour les enseignants

Réponse : SearchTeachersResponse
teachers (repeated Teacher) : Liste des enseignants correspondant à la requête de recherche


Interactions avec les autres microservices : 

Le microservice Student interagit avec le microservice Teacher pour récupérer les informations sur l'enseignant associé à un étudiant. L'interaction se fait via l'appel à la méthode GetTeacherInfo du microservice Teacher .

API Gateway : 

Schémas de données:

Les schémas de données utilisés par l'API Gateway correspondent aux schémas de données des microservices Student et Teacher.



