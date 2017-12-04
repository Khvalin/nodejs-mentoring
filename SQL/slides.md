##  Agenda

## SQL DATA STRUCTURE
	Relational model

## SQL
	relational database

## SQL Server COMMANDS
SQL is used to communicate with a database, it is the standard language for relational database management systems. 

It is more or less standardized, and used by almost all relational database management systems: SQL Server, Oracle, MySQL, PostgreSQL, DB2, Informix, etc.

TSQL is a proprietary procedural language used by Microsoft in SQL Server.

Types of SQL Statements 

* Data Manipulation Language - DML
DML commands are mainly used for manipulation with the records in our table, so with them we can select/read data with some criteria or not, we can insert new data or edit existing ones... and ofcourse we can delete records if we don't need them anymore.

 DML commands are:

SELECT - select/read records from table in our database,
INSERT - we can insert new records in our table,
UPDATE - edit/update existing records,
DELETE - delete existing records in our table

* Data Definition Language (DDL)
DDL commands we use for definition and creation objects in database (Table, Procedure, Views...). These commands are mainly used for design and definition the structure of our database.
DDL commands are:

CREATE - we can create new table, database, procedure, view, trigger...
ALTER - usually we use for editing database objects (table, procedure, view...) fo example add or delete column from table
DROP - we use for deleting database objects

* Data Control Language (DCL) 
 DCL commands are used for access control and permission management for users in our database. With them we can easily allow or deny some actions for users on the tables or records (row level security).

DCL commands are:

GRANT -  we can give certain permissions on the table (and other objects) for certain users of database,
DENY - bans certain permissions from users.
REVOKE - with this command we can take back permission from users.

* Transaction Control Language (TCL)
With TCL commands we can mange and control T-SQL transactions so we can be sure that our transaction are successfully done and that integrity of our database is not violated.

TCL commands are:
With TCL commands we can mange and control T-SQL transactions so we can be sure that our transaction are successfully done and that integrity of our database is not violated.

BEGIN TRAN - begin of transaction
COMMIT TRAN - commit for completed transaction
ROLLBACK - go back to beginning if something was not right in transaction.

## SETTING UP A CONNECTION

## SETTING UP A CONNECTION

## QUERIES

## ORM

