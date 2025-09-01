<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Author;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class BookFixtures extends Fixture
{
    public function load(ObjectManager $manager) : void
    {
        // Création des auteurs
        $author1 = new Author();
        $author1->setFirstName('Antoine');
        $author1->setLastName('de Saint-Exupéry');
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

        // Création des livres
        $book1 = new Book();
        $book1->setTitle('Le Petit Prince')
               ->setDescription('L\'histoire d\'un petit prince qui voyage de planète en planète.')
               ->setPages(96)
               ->setGenre('Conte philosophique')
               ->setCoverImage('/image/Book/LePetitPrince.jpg')
               ->setBackCover('L\'histoire d\'un petit prince qui voyage de planète en planète et rencontre des adultes aux comportements étranges. Une réflexion poétique sur l\'amitié, l\'amour et la nature humaine.')
               ->setPublicationYear(1943)
               ->setAuthor($author1);
        $manager->persist($book1);

        $book2 = new Book();
        $book2->setTitle('1984')
               ->setDescription('Un roman dystopique sur la surveillance de masse.')
               ->setPages(368)
               ->setGenre('Dystopie')
               ->setCoverImage('/image/Book/1984.jpg')
               ->setBackCover('Dans un monde totalitaire où Big Brother surveille tout, Winston Smith travaille au ministère de la Vérité. Une œuvre prophétique sur la surveillance et la manipulation.')
               ->setPublicationYear(1949)
               ->setAuthor($author2);
        $manager->persist($book2);

        $book3 = new Book();
        $book3->setTitle('Harry Potter à l\'école des sorciers')
               ->setDescription('Le début des aventures du célèbre sorcier.')
               ->setPages(320)
               ->setGenre('Fantasy')
               ->setCoverImage('/image/Book/HarryPotter.jpg')
               ->setBackCover('Harry Potter découvre qu\'il est un sorcier et entre à Poudlard. Le début d\'une saga magique qui mêle amitié, aventure et mystère.')
               ->setPublicationYear(1997)
               ->setAuthor($author3);
        $manager->persist($book3);

        // Exécution finale
        $manager->flush();
    }
}
