SELECT * FROM "C.SMELTZER".USERS;

DELETE FROM "C.SMELTZER".users WHERE email = 'newuser1@example.com';
COMMIT;

SELECT * 
FROM all_tab_privs
WHERE table_name = 'USERS';