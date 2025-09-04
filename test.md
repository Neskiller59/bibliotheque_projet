## Rapport de test avec phpUnit
-Création du dossier tests/Unit/UtilsTest.php 
**Résultat du premier test** : 
PHPUnit 9.6.25 by Sebastian Bergmann and contributors.

Testing App\Tests\Unit\UtilsTest .. 2 / 2 (100%)

Time: 00:00.006, Memory: 6.00 MB

OK (2 tests, 4 assertions)

-Création du dossier entity qui accueillera les test concernant les entitées (Book, Author, Editor): 
___

Book (App\Tests\Unit\Entity\Book)
 ✔ Book creation 
 ✔ Set and get title
 ✔ Set and get description
 ✔ Set and get pages
 ✔ Set and get genre
 ✔ Set and get cover image
 ✔ Set and get back cover
 ✔ Set and get publication year
 ✔ Set and get author
 ✔ Set author to null
 ✔ Set and get editor
 ✔ Complete book setup
 ✔ Fluent interface
 ✔ Initial null values
 ✔ Pages edge cases
 ✔ Title with special characters
 ✔ Long description

OK, but there were issues!
Tests: 17, Assertions: 45, PHPUnit Deprecations: 1.

-Création de .env.test 
résultat : php bin/console doctrine:database:create --env=test
Created database `app_test_test` for connection named default

zahry@Requiem MINGW64 ~/bibliotheque_projet/backend (master)
$ php bin/console doctrine:migrations:migrate --env=test

 WARNING! You are about to execute a migration in database "app_test_test" that could result in schema changes and data loss. Are you sure you wish to continue? (yes/no) [y
es]:
 > y

[notice] Migrating up to DoctrineMigrations\Version20250901072058
[notice] finished in 279.7ms, used 18M memory, 5 migrations executed, 10 sql queries
                                                                                                                        
 [OK] Successfully migrated to version: DoctrineMigrations\Version20250901072058   
 ___                                     
                                                                                                                        



-Création de tests/Repository/BookRepositoryTest.php
___

-Création de tests/Functional/Controller/BookControllerTest.php
 php vendor\bin\phpunit --testdox tests/Functional/Controller/BookControllerTest.php
 
 ___


## Information Importante
___
**Sur windows utiliser** :
.\vendor\bin\phpunit = ./bin/phpunit --version (Mac)
php vendor/bin/phpunit + le chemin vers le dossier Ex: .\vendor\bin\phpunit tests\Unit\UtilsTest.php
ex : php vendor/bin/simple-phpunit tests/Unit/UtilsTest.php

-Modifier composer.json en ajoutant :
'''  
"autoload": {
        "psr-4": {
            "App\\": "backend/src/"
        }
    }
'''

## Github
https://github.com/Neskiller59/bibliotheque_projet.git