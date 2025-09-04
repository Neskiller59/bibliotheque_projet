<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Book;
use App\Entity\Author;
use App\Entity\Editor;
use PHPUnit\Framework\TestCase;

class BookTest extends TestCase
{
    private Book $book;

    protected function setUp(): void
    {
        $this->book = new Book();
    }

    public function testBookCreation(): void
    {
        $this->assertInstanceOf(Book::class, $this->book);
        $this->assertNull($this->book->getId());
    }

    public function testSetAndGetTitle(): void
    {
        $title = 'Le Seigneur des Anneaux';
        $result = $this->book->setTitle($title);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($title, $this->book->getTitle());
    }

    public function testSetAndGetDescription(): void
    {
        $description = "Un hobbit part à l'aventure pour détruire un anneau maléfique...";
        $result = $this->book->setDescription($description);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($description, $this->book->getDescription());
    }

    public function testSetAndGetPages(): void
    {
        $pages = 423;
        $result = $this->book->setPages($pages);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($pages, $this->book->getPages());
    }

    public function testSetAndGetGenre(): void
    {
        $genre = 'Fantasy';
        $result = $this->book->setGenre($genre);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($genre, $this->book->getGenre());
    }

    public function testSetAndGetCoverImage(): void
    {
        $coverImage = 'tolkien-seigneur-anneaux.jpg';
        $result = $this->book->setCoverImage($coverImage);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($coverImage, $this->book->getCoverImage());
    }

    public function testSetAndGetBackCover(): void
    {
        $backCover = 'Résumé du livre...';
        $result = $this->book->setBackCover($backCover);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($backCover, $this->book->getBackCover());
    }

    public function testSetAndGetPublicationYear(): void
    {
        $year = 1996;
        $result = $this->book->setPublicationYear($year);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($year, $this->book->getPublicationYear());
    }

    public function testSetAndGetAuthor(): void
    {
        $author = new Author();
        $author->setFirstName('J.R.R.')->setLastName('Tolkien');
        $result = $this->book->setAuthor($author);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($author, $this->book->getAuthor());
    }

    public function testSetAuthorToNull(): void
    {
        $author = new Author();
        $this->book->setAuthor($author);
        $this->book->setAuthor(null);
        $this->assertNull($this->book->getAuthor());
    }

    public function testSetAndGetEditor(): void
    {
        $editor = new Editor();
        $editor->setName('Bantam Books');
        $result = $this->book->setEditor($editor);
        $this->assertInstanceOf(Book::class, $result);
        $this->assertEquals($editor, $this->book->getEditor());
    }

    public function testCompleteBookSetup(): void
    {
        $author = new Author();
        $author->setFirstName('George R.R.')->setLastName('Martin');

        $editor = new Editor();
        $editor->setName('Bantam Books');

        $this->book
            ->setTitle('Game of Thrones')
            ->setDescription('Winter is coming...')
            ->setPages(694)
            ->setGenre('Fantasy')
            ->setCoverImage('got-cover.jpg')
            ->setBackCover('Résumé de Game of Thrones...')
            ->setPublicationYear(1996)
            ->setAuthor($author)
            ->setEditor($editor);

        $this->assertEquals('Game of Thrones', $this->book->getTitle());
        $this->assertEquals('Winter is coming...', $this->book->getDescription());
        $this->assertEquals(694, $this->book->getPages());
        $this->assertEquals('Fantasy', $this->book->getGenre());
        $this->assertEquals('got-cover.jpg', $this->book->getCoverImage());
        $this->assertEquals('Résumé de Game of Thrones...', $this->book->getBackCover());
        $this->assertEquals(1996, $this->book->getPublicationYear());
        $this->assertEquals($author, $this->book->getAuthor());
        $this->assertEquals($editor, $this->book->getEditor());
    }

    public function testFluentInterface(): void
    {
        $result = $this->book
            ->setTitle('Test Book')
            ->setDescription('Description test')
            ->setPages(100)
            ->setGenre('Test')
            ->setCoverImage('test.jpg')
            ->setBackCover('Back cover test')
            ->setPublicationYear(2025);

        $this->assertSame($this->book, $result);
    }

    public function testInitialNullValues(): void
    {
        $book = new Book();
        $this->assertNull($book->getTitle());
        $this->assertNull($book->getDescription());
        $this->assertNull($book->getPages());
        $this->assertNull($book->getGenre());
        $this->assertNull($book->getCoverImage());
        $this->assertNull($book->getBackCover());
        $this->assertNull($book->getPublicationYear());
        $this->assertNull($book->getAuthor());
        $this->assertNull($book->getEditor());
    }

    public function testPagesEdgeCases(): void
    {
        $this->book->setPages(1);
        $this->assertEquals(1, $this->book->getPages());

        $this->book->setPages(9999);
        $this->assertEquals(9999, $this->book->getPages());
    }

    public function testTitleWithSpecialCharacters(): void
    {
        $specialTitle = "L'Être & l'Néant: Essai d'ontologie phénoménologique";
        $this->book->setTitle($specialTitle);
        $this->assertEquals($specialTitle, $this->book->getTitle());
    }

    public function testLongDescription(): void
    {
        $longDescription = str_repeat('Lorem ipsum dolor sit amet. ', 100);
        $this->book->setDescription($longDescription);
        $this->assertEquals($longDescription, $this->book->getDescription());
        $this->assertGreaterThan(1000, strlen($this->book->getDescription()));
    }
}
