<?php

namespace App\Tests\Repository;

use App\Entity\Author;
use App\Entity\Book;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class BookRepositoryTest extends KernelTestCase
{
    protected static function getKernelClass(): string
    {
        return \App\Kernel::class;
    }

    private function getEntityManager()
    {
        self::bootKernel();
        return self::getContainer()->get('doctrine')->getManager();
    }

    private function cleanDatabase(): void
    {
        $em = $this->getEntityManager();
        $em->createQuery('DELETE FROM App\Entity\Book')->execute();
        $em->createQuery('DELETE FROM App\Entity\Author')->execute();
        $em->clear();
    }

    private function createTestBook(): Book
    {
        $em = $this->getEntityManager();

        $author = new Author();
        $author->setFirstName('J.R.R.');
        $author->setLastName('Tolkien');
        $author->setCountry('UK');

        $book = new Book();
        $book->setTitle('Le Seigneur des Anneaux');
        $book->setImage('tolkien.jpg');
        $book->setDescription('Un hobbit part à l\'aventure...');
        $book->setPages(423);
        $book->setAuthor($author);

        $em->persist($author);
        $em->persist($book);
        $em->flush();
        $em->clear();

        return $book;
    }

    public function testFindById(): void
    {
        $this->cleanDatabase();
        $book = $this->createTestBook();

        $em = $this->getEntityManager();
        $repo = $em->getRepository(Book::class);

        $foundBook = $repo->find($book->getId());

        $this->assertNotNull($foundBook);
        $this->assertEquals('Le Seigneur des Anneaux', $foundBook->getTitle());
    }

    public function testFindAll(): void
    {
        $this->cleanDatabase();
        $this->createTestBook();

        $em = $this->getEntityManager();
        $repo = $em->getRepository(Book::class);

        $books = $repo->findAll();

        $this->assertCount(1, $books);
        $this->assertEquals('Le Seigneur des Anneaux', $books[0]->getTitle());
    }
}