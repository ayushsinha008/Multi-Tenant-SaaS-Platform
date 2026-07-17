# Database Schema & ER Diagram

This document contains the Entity-Relationship (ER) Diagram for the Multi-Tenant SaaS Platform. You can view this directly if your Markdown viewer supports Mermaid.js, or copy the code block below into [Mermaid Live Editor](https://mermaid.live/).

```mermaid
erDiagram
    USER ||--o{ MEMBER : "is part of"
    USER ||--o{ NOTIFICATION : receives
    USER {
        ObjectId _id PK
        String name
        String email
        String password
        String avatar
        String googleId "optional"
        Date createdAt
        Date updatedAt
    }

    ORGANIZATION ||--o{ MEMBER : has
    ORGANIZATION ||--o{ PROJECT : contains
    ORGANIZATION ||--o{ TASK : contains
    ORGANIZATION ||--o{ ACTIVITY_LOG : "audited via"
    ORGANIZATION ||--o{ FILE : "owns"
    ORGANIZATION {
        ObjectId _id PK
        String name
        String description
        String logo
        ObjectId ownerId FK "Ref: USER"
        String subscriptionPlan "FREE/PRO/ENTERPRISE"
        Date createdAt
        Date updatedAt
    }

    MEMBER }o--|| ORGANIZATION : belongs_to
    MEMBER }o--|| USER : corresponds_to
    MEMBER {
        ObjectId _id PK
        ObjectId userId FK "Ref: USER"
        ObjectId organizationId FK "Ref: ORGANIZATION"
        String role "Admin/Member"
        Date createdAt
        Date updatedAt
    }

    PROJECT ||--o{ TASK : contains
    PROJECT {
        ObjectId _id PK
        ObjectId organizationId FK "Ref: ORGANIZATION"
        String name
        String description
        String status "Active/Completed/Archived"
        ObjectId createdBy FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }

    TASK ||--o{ COMMENT : has
    TASK {
        ObjectId _id PK
        ObjectId organizationId FK "Ref: ORGANIZATION"
        ObjectId projectId FK "Ref: PROJECT"
        String title
        String description
        String status "Todo/InProgress/Done"
        String priority "Low/Medium/High"
        ObjectId assigneeId FK "Ref: USER"
        ObjectId createdBy FK "Ref: USER"
        Date dueDate
        Date createdAt
        Date updatedAt
    }

    COMMENT {
        ObjectId _id PK
        ObjectId taskId FK "Ref: TASK"
        ObjectId authorId FK "Ref: USER"
        String content
        Date createdAt
        Date updatedAt
    }

    ACTIVITY_LOG {
        ObjectId _id PK
        ObjectId organizationId FK "Ref: ORGANIZATION"
        ObjectId userId FK "Ref: USER"
        String action
        String entityType
        ObjectId entityId
        JSON details
        Date createdAt
    }

    FILE {
        ObjectId _id PK
        ObjectId organizationId FK "Ref: ORGANIZATION"
        ObjectId uploadedBy FK "Ref: USER"
        String filename
        String url
        Number size
        String resourceType
        Date createdAt
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId recipientId FK "Ref: USER"
        String title
        String message
        String type "TaskAssigned/Mention/System"
        Boolean read
        Date createdAt
    }
```
