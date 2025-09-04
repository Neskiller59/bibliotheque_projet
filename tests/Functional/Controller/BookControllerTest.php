<?php

namespace App\Tests\Functional\Controller;

use App\Entity\Author;
use App\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class BookControllerTest extends WebTestCase
{
    /**
     * Indique à PHPUnit quel Kernel utiliser
     */
    protected static function getKernelClass(): string
    {
        return \App\Kernel::class;
    }

    private function getEntityManager(): EntityManagerInterface
    {
        return static::getContainer()->get('doctrine')->getManager();
    }

    private function cleanDatabase(): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->createQuery('DELETE FROM App\Entity\Book')->execute();
        $entityManager->createQuery('DELETE FROM App\Entity\Author')->execute();
        $entityManager->clear();
    }

    public function testGetBooksCollection(): void
    {
        $client = static::createClient();
        $this->cleanDatabase();
        $this->createTestBooks();

        $client->request('GET', '/api/books');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $response = json_decode($client->getResponse()->getContent(), true);

        if (!isset($response['hydra:member'])) {
            $this->assertIsArray($response);
            $this->assertGreaterThan(0, count($response));
        } else {
            $this->assertArrayHasKey('hydra:member', $response);
            $this->assertCount(2, $response['hydra:member']);
        }
    }

    public function testGetBookItem(): void
    {
        $client = static::createClient();
        $this->cleanDatabase();

        $book = $this->createTestBooks()[0];
        $client->request('GET', '/api/books/' . $book->getId());

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Le Seigneur des Anneaux', $response['title']);
        $this->assertEquals('tolkien.jpg', $response['image']);
    }

    public function testCreateBook(): void
    {
        $client = static::createClient();
        $this->cleanDatabase();

        $entityManager = $this->getEntityManager();
        $author = new Author();
        $author->setFirstName('George R.R.')
               ->setLastName('Martin')
               ->setCountry('USA');
        $entityManager->persist($author);
        $entityManager->flush();

        $bookData = [
            'title' => 'Game of Thrones',
            'image' => 'got.jpg',
            'description' => 'Winter is coming...',
            'pages' => 694,
            'author' => '/api/authors/' . $author->getId()
        ];

        $client->request('POST', '/api/books', [], [], [
            'CONTENT_TYPE' => 'application/ld+json',
        ], json_encode($bookData));

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Game of Thrones', $response['title']);
        $this->assertEquals(694, $response['pages']);
    }

    public function testUpdateBook(): void
    {
        $client = static::createClient();
        $this->cleanDatabase();

        $book = $this->createTestBooks()[0];

        $updatedData = [
            'title' => 'Le Seigneur des Anneaux - Edition Collector',
            'image' => 'tolkien-collector.jpg',
            'description' => 'Description mise à jour',
            'pages' => 500
        ];

        $client->request('PUT', '/api/books/' . $book->getId(), [], [], [
            'CONTENT_TYPE' => 'application/ld+json',
        ], json_encode($updatedData));

        $this->assertResponseIsSuccessful();

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Le Seigneur des Anneaux - Edition Collector', $response['title']);
        $this->assertEquals(500, $response['pages']);
    }

    public function testDeleteBook(): void
    {
        $client = static::createClient();
        $this->cleanDatabase();

        $book = $this->createTestBooks()[0];
        $bookId = $book->getId();

        $client->request('DELETE', '/api/books/' . $bookId);
        $this->assertResponseStatusCodeSame(204);

        $client->request('GET', '/api/books/' . $bookId);
        $this->assertResponseStatusCodeSame(404);
    }

    public function testGetNonExistentBook(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/books/999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreateBookWithInvalidData(): void
    {
        $client = static::createClient();
        $this->cleanDatabase();

        $invalidBookData = [];
        $client->request('POST', '/api/books', [], [], [
            'CONTENT_TYPE' => 'application/ld+json',
        ], json_encode($invalidBookData));

        $this->assertGreaterThanOrEqual(400, $client->getResponse()->getStatusCode());
    }

    private function createTestBooks(): array
    {
        $entityManager = $this->getEntityManager();

        $author1 = new Author();
        $author1->setFirstName('J.R.R.')
                ->setLastName('Tolkien')
                ->setCountry('UK');

        $author2 = new Author();
        $author2->setFirstName('Isaac')
                ->setLastName('Asimov')
                ->setCountry('USA');

        $book1 = new Book();
        $book1->setTitle('Le Seigneur des Anneaux')
              ->setImage('tolkien.jpg')
              ->setDescription('Un hobbit part à l\'aventure...')
              ->setPages(423)
              ->setAuthor($author1);

        $book2 = new Book();
        $book2->setTitle('Foundation')
              ->setImage('asimov.jpg')
              ->setDescription('L\'empire galactique s\'effondre...')
              ->setPages(244)
              ->setAuthor($author2);

        $entityManager->persist($author1);
        $entityManager->persist($author2);
        $entityManager->persist($book1);
        $entityManager->persist($book2);
        $entityManager->flush();

        return [$book1, $book2];
    }
}
