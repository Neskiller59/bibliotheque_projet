<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Author; // Ajout de l'import manquant

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $author1 = new Author();
        $author1->setFirstName('Antoine');
        $author1->setLastName('de Saint Exupéry');
        $author1->setCountry('France');
        $manager->persist($author1);

        $author2 = new Author();
        $author2->setFirstName('George');
        $author2->setLastName('Orwell');
        $author2->setCountry('Royaume-Uni');
        $manager->persist($author2);

        $author3 = new Author();
        $author3->setFirstName('Joanne');
        $author3->setLastName('Rowling');
        $author3->setCountry('Royaume-Uni');
        $manager->persist($author3);

        $manager->flush();
    }
}
