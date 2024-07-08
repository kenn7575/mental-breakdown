# Database Graph Documentation

## Entities and Relationships

### User
- **Attributes**: 
  - None specified
- **Relationships**:
  - `Are_Friends_With`: Relationship between two `User` entities indicating friendship.
  - `Followed`: Relationship between two `User` entities indicating one user follows another.
  - `Is_Member_Of`: Relationship indicating that a `User` is a member of a `Group`.
  - `Commented_On`: Relationship indicating that a `User` has commented on a `Post`.
  - `Reacted_To`: Relationship indicating that a `User` has reacted to a `Post`.
  - `Posted`: Relationship indicating that a `User` has posted a `Post`.
  - `achieved`: Relationship indicating that a `User` has achieved an `achievement`.

### Group
- **Attributes**: 
  - None specified
- **Relationships**:
  - `Posted_In`: Relationship indicating that a `Post` was posted in a `Group`.

### Post
- **Attributes**: 
  - None specified
- **Relationships**:
  - `Posted_In`: Relationship indicating that a `Post` was posted in a `Group`.
  - `Commented_On`: Relationship indicating that a `User` has commented on a `Post`.
  - `Reacted_To`: Relationship indicating that a `User` has reacted to a `Post`.
  - `Posted`: Relationship indicating that a `User` has posted a `Post`.

### achievement
- **Attributes**: 
  - None specified
- **Relationships**:
  - `achieved`: Relationship indicating that a `User` has achieved an `achievement`.

## Summary

The database graph consists of four main entities: `User`, `Group`, `Post`, and `achievement`. The `User` entity has multiple relationships with itself and other entities, including friendships, following, group memberships, post interactions (comments and reactions), and achievements. The `Post` entity is associated with the `Group` entity through the `Posted_In` relationship and has interactions with the `User` entity. The `achievement` entity is linked to the `User` entity through the `achieved` relationship.

This graph provides a comprehensive overview of the interactions and relationships within a social network or community platform.
