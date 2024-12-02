SELECT * FROM "C.SMELTZER".USERS;
SELECT * FROM "C.SMELTZER".USER_USERS;

SELECT * FROM "C.SMELTZER".Expense;
SELECT * FROM "C.SMELTZER".BudgetCategory;
SELECT * FROM "C.SMELTZER".Expense;
SELECT * FROM "C.SMELTZER".BudgetCategory;

SELECT * 
FROM all_tab_privs
WHERE table_name = 'USERS';

SELECT * FROM "C.SMELTZER".BudgetCategory where email = 'cats@gmail.com';
SELECT * FROM "C.SMELTZER".Expense where email = 'newuser@example.com';
SELECT * FROM "C.SMELTZER".Money where email = 'newuser@example.com';

UPDATE "C.SMELTZER".BudgetCategory
SET TOTAL_SPENT =
(
    SELECT SUM(EXPENSE_AMOUNT) FROM "C.SMELTZER".Expense 
    Where "C.SMELTZER".Expense.CATEGORY_ID = "C.SMELTZER".BudgetCategory.CATEGORY_ID AND
    email = 'newuser@example.com'
)
WHERE EMAIL = 'newuser@example.com';

UPDATE "C.SMELTZER".BudgetCategory
SET TOTAL_SPENT = 0
WHERE EMAIL = 'newuser@example.com';

DELETE FROM "C.SMELTZER".Expense WHERE email = 'newuser@example.com';
COMMIT;

DELETE FROM "C.SMELTZER".BudgetCategory where email = 'newuser@example.com';
COMMIT;

DELETE FROM "C.SMELTZER".USERS WHERE email = 'newuser@example.com';
COMMIT;
