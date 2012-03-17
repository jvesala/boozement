-- MySQL dump 10.13  Distrib 5.5.19, for osx10.6 (i386)
--
-- Host: 127.0.0.1    Database: boozement
-- ------------------------------------------------------
-- Server version	5.1.47

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `servings`
--

DROP TABLE IF EXISTS `servings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT '1970-01-01 00:00:01',
  `type` varchar(254) NOT NULL,
  `amount` int(11) NOT NULL,
  `units` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=534 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servings`
--

LOCK TABLES `servings` WRITE;
/*!40000 ALTER TABLE `servings` DISABLE KEYS */;
INSERT INTO `servings` VALUES (1,1,'2010-12-31 17:03:00','Kapuziner Weissbier-olut',50,1.5),(2,1,'2010-12-30 17:00:00','Aulanger jouluolut',33,1.2),(3,1,'2010-12-30 12:00:00','Corona-olut',33,1),(4,1,'2010-12-30 12:30:00','Koff Porter-olut',33,1),(5,1,'2010-12-30 15:30:00','Koff III-olut',33,1),(6,1,'2010-12-31 18:30:00','Old Fashioned -drinkki',15,1),(7,1,'2010-12-31 19:15:00','Punaviini',12,1),(8,1,'2010-12-31 20:01:00','Shampanja',10,0.8),(9,1,'2010-12-31 20:30:00','Corona-olut',33,1),(10,1,'2011-01-01 14:12:00','Pink-kuohuviini',18,1.5),(11,1,'2011-01-01 16:23:00','Pink-kuohuviini',25,2),(12,1,'2011-01-06 17:30:00','Chianti',18,1.5),(13,1,'2011-01-08 16:15:00','Kuohuviini',12,1),(14,1,'2011-01-08 17:45:00','Chimay Blue-olut',33,2),(15,1,'2011-01-08 18:45:00','Henry Weston Vinta',50,3),(16,1,'2011-01-08 19:45:00','Boddington-olut',50,1.5),(17,1,'2011-01-13 17:00:00','Corona-olut',33,1),(18,1,'2011-01-15 12:35:00','Skumppa',10,0.8),(19,1,'2011-01-15 13:00:00','Koff III-olut',20,0.8),(20,1,'2011-01-15 13:45:00','Skumppa',10,0.8),(21,1,'2011-01-15 14:45:00','Meukow',4,1),(22,1,'2011-01-15 16:30:00','Valkoviini',12,1),(23,1,'2011-01-15 17:00:00','Koff III-olut',33,1),(24,1,'2011-01-15 18:45:00','Koff III-olut',33,1),(25,1,'2011-01-15 19:00:00','Koff III-olut',33,1),(26,1,'2011-01-15 19:30:00','Koff III-olut',33,1),(27,1,'2011-01-15 21:00:00','Olut',33,1),(28,1,'2011-01-15 21:30:00','Olut',33,1),(29,1,'2011-01-15 22:30:00','Olut',33,1),(30,1,'2011-01-17 19:35:00','Lidl-kolmosolut',17,0.5),(31,1,'2011-01-18 17:45:00','Ruinart-shampanja',10,0.8),(32,1,'2011-01-18 18:00:00','Muscat-valkoviini',10,0.8),(33,1,'2011-01-18 18:20:00','Aliglote',10,0.8),(34,1,'2011-01-18 18:40:00','Barbarosca-punaviini',10,0.8),(35,1,'2011-01-18 19:00:00','Chateaux d\'antugnac -valkoviini',10,0.8),(36,1,'2011-01-18 19:30:00','Bourguiel le grand clos -punaviini',10,0.8),(37,1,'2011-01-18 20:00:00','Loimer seeberg beerenauslesev -jälkiruokaviini',10,1),(38,1,'2011-01-18 20:30:00','Brigaldara',10,1),(39,1,'2011-01-20 18:00:00','Marchese Antinori',12,1),(40,1,'2011-01-20 19:30:00','Marchese Antinori',12,1),(41,1,'2011-01-21 13:00:00','Möet-shampanja',16,1.3),(42,1,'2011-01-21 14:46:00','Möet-shampanja',8,0.7),(43,1,'2011-01-21 15:35:00','Koff Porter-olut',33,1),(44,1,'2011-01-21 16:45:00','Mohito',20,1),(45,1,'2011-01-21 17:10:00','Ässämix',4,1),(46,1,'2011-01-21 18:45:00','Kriek-kirsikkaolut',25,1),(47,1,'2011-01-21 19:30:00','Fisu',4,1),(48,1,'2011-01-21 19:45:00','Olut',50,1.5),(49,1,'2011-01-28 17:00:00','Olut',50,1.5),(50,1,'2011-01-29 18:30:00','Chimay-keltainen olut',33,2),(51,1,'2011-01-29 20:00:00','Hoegaarden-olut',50,1.5),(52,1,'2011-02-03 17:00:00','Cono sur -punaviini',16,1.3),(53,1,'2011-02-03 18:00:00','Karhu III',33,1),(54,1,'2011-02-08 19:00:00','Timmermanns kriek',25,1),(55,1,'2011-02-11 17:00:00','Punaviini',12,1),(56,1,'2011-02-11 18:00:00','Århus olutta',50,1.5),(57,1,'2011-02-11 20:00:00','Punaviini',18,1.5),(58,1,'2011-02-11 22:45:00','Tuborg pilsneri-olut',33,1),(59,1,'2011-02-12 14:00:00','König Ludwig Dunkel',50,1.5),(60,1,'2011-02-12 16:15:00','Punaviini',10,1),(61,1,'2011-02-17 16:35:00','Torres Nerona-punaviini',16,1.5),(62,1,'2011-02-17 18:45:00','Kuohuviini',12,1),(63,1,'2011-02-24 10:00:00','Kuohuviini',12,1),(64,1,'2011-02-24 10:45:00','Punaviini',12,1),(65,1,'2011-02-24 11:15:00','Portviini',8,1),(66,1,'2011-02-25 17:00:00','Kuohuviini',20,1.7),(67,1,'2011-02-25 17:45:00','Valkoviini',16,1.3),(68,1,'2011-02-25 18:30:00','Punaviini',16,1.3),(69,1,'2011-02-25 18:45:00','Koskenkorva',4,1),(70,1,'2011-02-25 20:30:00','Corona-olut',33,1),(71,1,'2011-02-25 21:00:00','Dry martini',10,1),(72,1,'2011-02-25 21:55:00','Brooklyn Ale-olut',35,1),(73,1,'2011-02-25 23:00:00','Koff III -olut',33,1),(74,1,'2011-02-26 14:51:00','Olut',50,1.5),(75,1,'2011-02-26 15:28:00','Jaloviina',2,0.5),(76,1,'2011-02-26 16:00:00','Olut',20,0.8),(77,1,'2011-02-26 17:00:00','Irish Stout-olut',50,1.5),(78,1,'2011-02-26 18:00:00','Karhu III-olut',33,1),(79,1,'2011-02-26 20:00:00','Lapin kulta III-olut',33,1),(80,1,'2011-02-26 21:30:00','Lapin kulta III-olut',33,1),(81,1,'2011-02-26 23:00:00','Urho III-olut',33,1),(82,1,'2011-02-25 21:15:00','Konjakki',4,1);
/*!40000 ALTER TABLE `servings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(254) NOT NULL,
  `password` varchar(254) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'foobar@foobar.com','$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W','M',75000),(1,'jussi.vesala@iki.fi','$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W','M',75000);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-03-17 10:45:58
