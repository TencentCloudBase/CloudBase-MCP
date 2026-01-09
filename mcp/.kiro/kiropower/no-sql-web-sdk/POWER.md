---
name: "tcb-no-sql-web-sdk"
displayName: "TCB NoSQL Web SDK"
description: "Use CloudBase document database Web SDK to query, create, update, and delete data. Supports complex queries, pagination, aggregation, and geolocation queries."
keywords: ["cloudbase", "nosql", "database", "web sdk", "document database", "云开发", "文档数据库", "NoSQL", "数据库操作", "查询", "增删改查"]
author: "CloudBase Team"
---

# TCB NoSQL Web SDK

## Overview

This power provides comprehensive guidance for using the CloudBase document database Web SDK for data operations in web applications. It covers all aspects of NoSQL database operations including CRUD operations, complex queries, pagination, aggregation, geolocation queries, and real-time data synchronization.

Whether you're building data-driven web applications, implementing real-time features, or managing complex data relationships, this power provides the essential patterns and best practices for CloudBase document database operations.

## Core Concepts

### Initialization

Before using any database operations, initialize the CloudBase SDK:

```javascript
import cloudbase from "@cloudbase/js-sdk";
// UMD version
// If you are not using npm, And want to use UMD version instead. You should refer to https://docs.cloudbase.net/quick-start/#web-%E5%BF%AB%E9%80%9F%E4%BD%93%E9%AA%8C for latest version of UMD version.

const app = cloudbase.init({
  env: "your-env-id", // Replace with your environment id
});

const db = app.database();
const _ = db.command; // Get query operators

// ... login
```
Remember to sign in(auth) is ***REQUIRED** before actually querying the database.

### Collection Reference

Access collections using:
```javascript
db.collection('collection-name')
```

### Query Operators

CloudBase provides query operators via `db.command` (aliased as `_`):
- `_.gt(value)` - Greater than
- `_.gte(value)` - Greater than or equal
- `_.lt(value)` - Less than
- `_.lte(value)` - Less than or equal
- `_.eq(value)` - Equal to
- `_.neq(value)` - Not equal to
- `_.in(array)` - Value in array
- `_.nin(array)` - Value not in array

## Basic Operations

### Query Single Document

Query by document ID:
```javascript
const result = await db.collection('todos')
    .doc('docId')
    .get();
```

### Query Multiple Documents

Query with conditions:
```javascript
const result = await db.collection('todos')
    .where({
        completed: false,
        priority: 'high'
    })
    .get();
```

**Note:** `get()` returns 100 records by default, maximum 1000.

### Query Methods Chaining

Combine methods for complex queries:
- `.where(conditions)` - Filter conditions
- `.orderBy(field, direction)` - Sort by field ('asc' or 'desc')
- `.limit(number)` - Limit results (default 100, max 1000)
- `.skip(number)` - Skip records for pagination
- `.field(object)` - Specify fields to return (true/false)

## Advanced Features

For detailed information on specific topics, refer to:

### CRUD Operations
See `./crud-operations.md` for:
- Creating documents (add, batch add)
- Updating documents (partial updates, operators)
- Deleting documents (conditional delete, soft delete)
- Complete CRUD manager examples

### Complex Queries
See `./complex-queries.md` for:
- Using query operators
- Combining multiple conditions
- Field selection
- Sorting and limiting results

### Pagination
See `./pagination.md` for:
- Implementing page-based navigation
- Calculating skip and limit values
- Cursor-based pagination
- Infinite scroll patterns

### Aggregation Queries
See `./aggregation.md` for:
- Grouping data
- Statistical calculations
- Pipeline operations
- Time-based aggregations

### Geolocation Queries
See `./geolocation.md` for:
- Proximity searches
- Area-based queries
- Geographic indexing requirements
- Distance-based features

### Realtime Database
See `./realtime.md` for:
- Real-time data synchronization using watch() method
- Setting up listeners for document changes
- Handling real-time updates in chat and collaboration apps
- Performance optimization and error handling
- Common patterns for real-time applications

### Security Rules
See `./security-rules.md` for:
- Configuring database permissions
- Simple permissions vs custom rules
- Permission categories and usage
- Security rule syntax and examples

## Common Patterns

### Error Handling
Always wrap database operations in try-catch:
```javascript
try {
    const result = await db.collection('todos').get();
    console.log(result.data);
} catch (error) {
    console.error('Database error:', error);
}
```

### Return Value Structure
Database operations return:
```javascript
{
    data: [...], // Array of documents
    // Additional metadata
}
```

## Important Notes

1. **Environment ID**: Replace `"your-env-id"` with actual CloudBase environment ID
2. **Default Limits**: `get()` returns 100 records by default
3. **Collection Names**: Use string literals for collection names
4. **Geolocation Index**: Geographic queries require proper indexing
5. **Async/Await**: All database operations are asynchronous

## Best Practices

1. Initialize SDK once at application startup
2. Reuse database instance across the application
3. Use query operators for complex conditions
4. Implement pagination for large datasets
5. Select only needed fields to reduce data transfer
6. Handle errors appropriately
7. Create indexes for frequently queried fields

### Coding Rules

- It is **HIGHLY RECOMMENDED** to have a type definition and model layer for each collection in your document database. This will help you to avoid errors and make your code more robust. That would be the single source of truth for your database schema. Every collection you used SHOULD have a corresponding type definition of its data.
- Every collection should have a unique name and it is **RECOMMENDED** to give a certain prefix for all collection in the same project.
- Collections should have well defined and meaningful security rules(policy) for create, read, write and delete permission according to the business logic. Details refer to `./security-rules.md`. When writing expressions in security rules, The type definition of the collection mention above can be used as the type reference.

## Quick Reference

Common query examples:

```javascript
// Simple query
db.collection('todos').where({ status: 'active' }).get()

// With operators
db.collection('users').where({ age: _.gt(18) }).get()

// Pagination
db.collection('posts')
    .orderBy('createdAt', 'desc')
    .skip(20)
    .limit(10)
    .get()

// Field selection
db.collection('users')
    .field({ name: true, email: true, _id: false })
    .get()
```

For more detailed examples and advanced usage patterns, refer to the companion reference files in this directory.

## Error handling
**EVERY** database operation(including `get()`, `add()`, `update()`, `delete()` etc)should check the return value's code for any errors. For example:
```javascript
const result = await db.collection('todos').add(newTodo);
if(typeof result.code === 'string') {
    // Handle error ...
}
```

Error **MUST** be handled with detail and human-readable message and friendly UI.

## Troubleshooting

### Common Issues

**Problem:** Database operations fail with permission errors
**Cause:** Collection security rules not properly configured
**Solution:**
1. Configure appropriate security rules for the collection
2. Use `writeSecurityRule` tool to set permissions
3. Wait 2-5 minutes for cache to clear before testing

**Problem:** Queries return empty results unexpectedly
**Cause:** Authentication required but user not logged in
**Solution:**
1. Ensure user is authenticated before database operations
2. Check login state with `auth.getLoginState()`
3. Implement proper authentication flow

**Problem:** Geolocation queries not working
**Cause:** Geographic index not created
**Solution:**
1. Create geographic index for location fields in console
2. Ensure location data is stored in proper GeoPoint format
3. Use appropriate geolocation query operators

## Performance Optimization

1. **Indexing**: Create indexes for frequently queried fields
2. **Field Selection**: Use `.field()` to select only needed fields
3. **Pagination**: Implement proper pagination for large datasets
4. **Batch Operations**: Use batch operations for multiple document updates
5. **Connection Reuse**: Reuse database instance across application

## Security Considerations

1. **Authentication**: Always authenticate users before database operations
2. **Security Rules**: Configure appropriate collection-level security rules
3. **Data Validation**: Validate data on both client and server side
4. **Sensitive Data**: Use cloud functions for operations involving sensitive data
5. **Rate Limiting**: Implement rate limiting for high-frequency operations

## Related Resources

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase 数据库文档](https://docs.cloudbase.net/database/)
- [CloudBase Web SDK 文档](https://docs.cloudbase.net/api-reference/webv2/database/)

## Summary

This skill covers all CloudBase document database Web SDK scenarios:

- **Basic Operations** - CRUD operations with proper error handling
- **Advanced Queries** - Complex queries, pagination, and aggregation
- **Real-time Features** - Real-time data synchronization and updates
- **Security** - Authentication and security rule configuration
- **Performance** - Optimization techniques and best practices

**Key principle:** All examples are based on official CloudBase Web SDK interfaces, with proper error handling and security considerations.