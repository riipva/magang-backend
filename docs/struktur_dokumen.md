# Struktur Dokumen Todo-List Management

## 1. User
- name: String
- email: String
- password: String
- createdAt: Date
- updatedAt: Date

## 2. Todo
- title: String
- description: String
- status: String
- priority: String
- dueDate: Date
- user: ObjectId
- category: ObjectId
- createdAt: Date
- updatedAt: Date

## 3. Category
- name: String
- description: String
- user: ObjectId
- createdAt: Date
- updatedAt: Date

## 4. Activity Log
- user: ObjectId
- todo: ObjectId
- action: String
- details: String
- createdAt: Date