<?php
namespace App\Tests\Unit;
use PHPUnit\Framework\TestCase;
class UtilsTest extends TestCase
{
 /**
 * Test que 2 + 2 = 4
 * (Oui c'est basique, mais c'est pour comprendre !)
 */
 public function testAddition() : void
 {
 // Arrange (Préparation des données)
 $a = 2;
 $b = 2;
 // Act (Exécution de la fonction à tester)
 $result = $a + $b;
 // Assert (Vérification du résultat)
 $this->assertEquals(4, $result);
 }
 /**
 * Test avec plusieurs cas
 */
 public function testMultipleAdditions() : void
 {
 $this->assertEquals(4, 2+2);
 $this->assertEquals(0, -1+1);
 $this->assertEquals(10, 7+3);
 }
}