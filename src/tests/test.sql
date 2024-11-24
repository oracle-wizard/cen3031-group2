SELECT * FROM "C.SMELTZER".USERS;
SELECT * FROM "C.SMELTZER".Expense;
SELECT * FROM "C.SMELTZER".BudgetCategory;

DELETE FROM "C.SMELTZER".Expense WHERE email = 'newuser@example.com';
COMMIT;

SELECT * 
FROM all_tab_privs
WHERE table_name = 'USERS';

SELECT * FROM "C.SMELTZER".BudgetCategory;
SELECT * FROM "C.SMELTZER".Expense where email = 'newuser@example.com';

Select * from "C.SMELTZER".BudgetCategory;