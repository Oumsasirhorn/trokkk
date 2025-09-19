-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant_db
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `drink_base_prices`
--

DROP TABLE IF EXISTS `drink_base_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drink_base_prices` (
  `drink_id` int NOT NULL,
  `temperature` enum('ร้อน','เย็น','ปั่น') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`drink_id`,`temperature`),
  CONSTRAINT `drink_base_prices_ibfk_1` FOREIGN KEY (`drink_id`) REFERENCES `drinks` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drink_base_prices`
--

LOCK TABLES `drink_base_prices` WRITE;
/*!40000 ALTER TABLE `drink_base_prices` DISABLE KEYS */;
INSERT INTO `drink_base_prices` VALUES (1,'ร้อน',35.00),(1,'เย็น',40.00),(1,'ปั่น',45.00),(2,'ร้อน',40.00),(2,'เย็น',45.00),(2,'ปั่น',50.00),(3,'ร้อน',30.00),(3,'เย็น',35.00),(3,'ปั่น',40.00);
/*!40000 ALTER TABLE `drink_base_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drinks`
--

DROP TABLE IF EXISTS `drinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drinks` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sweetness` enum('ไม่หวาน','น้อย','ปกติ','มาก') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_data` tinyblob,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `image_data` (`image_data`(255))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drinks`
--

LOCK TABLES `drinks` WRITE;
/*!40000 ALTER TABLE `drinks` DISABLE KEYS */;
INSERT INTO `drinks` VALUES (1,'ชาเขียว','มาก',NULL),(2,'กาแฟ','น้อย',NULL),(3,'โกโก้','มาก',NULL),(4,'ชาเขียว','ปกติ',NULL),(5,'กาแฟ','น้อย',NULL),(6,'โกโก้','มาก',NULL),(7,'น้ำมะนาว','ปกติ',NULL),(8,'นมสด','น้อย',NULL),(9,'ชาเย็น','ปกติ',NULL),(10,'ลาเต้','ปกติ',NULL),(11,'อเมริกาโน่','ไม่หวาน',NULL),(12,'คาปูชิโน่','ปกติ',NULL),(13,'ชานม','มาก',NULL),(14,'ชาไทย','น้อย',NULL),(15,'ชาเขียวมัทฉะ','น้อย',NULL),(16,'โซดามะนาว','ปกติ',NULL),(17,'โซดาสตรอว์เบอร์รี','มาก',NULL),(18,'โซดาบ๊วย','ปกติ',NULL),(19,'โซดาลิ้นจี','ปกติ',NULL),(20,'โซดาส้ม','ปกติ',NULL),(21,'โซดาบลูฮาวาย','ปกติ',NULL);
/*!40000 ALTER TABLE `drinks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_dishes`
--

DROP TABLE IF EXISTS `main_dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `main_dishes` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_dishes`
--

LOCK TABLES `main_dishes` WRITE;
/*!40000 ALTER TABLE `main_dishes` DISABLE KEYS */;
INSERT INTO `main_dishes` VALUES (1,'ข้าวผัดต้มยำ','',50.00),(2,'ข้าวผัดต้มยำ+หมูแดง','',60.00),(3,'ข้าวหมูกรอบผัดผงกระหรี่','',50.00),(4,'ข้าวกระเพราเนื้อ','',50.00),(5,'ข้าวผัดต้มยำ','',50.00),(6,'ข้าาาวกระเพราเนื้อ-หมูยอทอด','',60.00),(7,'ข้าวทะเลไข่เค็ม','',50.00),(8,'ข้วหมูกรอบผัดไข่','',50.00),(9,'ข้าวกุ้งพริกขี้หนูสวน','',50.00),(10,'ข้าวหมูุชิ้นผัดพริกไทย','',50.00),(11,'ข้าวผัดฉ่าสามชั้น','',50.00),(12,'ก๋วยเตี๋ยวคั่วไก่','',50.00),(13,'หมี่ไก่ฉีก+หมูกระจก','',50.00),(14,'ผัดกระเพราวุ้นเส้น','',50.00),(15,'มาม่าปลากระป๋อง','',60.00),(16,'ก๋วยจั๊บญวน','',50.00),(17,'Set ย่างตามใจ','',50.00),(18,'ต้มยำปลากระป๋อง','',60.00),(20,'ข้าวพริกแกงไก่กรอบ','',50.00),(21,'ข้าวคลุกน้ำพริก+ปลาทู','',50.00),(22,'ข้าวคลุุกน้ำพริก+หมูแดด','',50.00),(23,'ข้าาวคลุกน้ำพริก+ไข่ชะอม','',50.00),(24,'ข้าวผัดต้มยำ','',50.00),(25,'ข้าวผัดต้มยำ+หมูแดง','',60.00),(26,'ข้าวหมูกรอบผัดผงกระหรี่','',50.00),(27,'ข้าวกระเพราเนื้อ','',50.00),(28,'ข้าวผัดต้มยำ','',50.00),(29,'ข้าาาวกระเพราเนื้อ-หมูยอทอด','',60.00),(30,'ข้าวทะเลไข่เค็ม','',50.00),(31,'ข้วหมูกรอบผัดไข่','',50.00),(32,'ข้าวกุ้งพริกขี้หนูสวน','',50.00),(33,'ข้าวหมูุชิ้นผัดพริกไทย','',50.00),(34,'ข้าวผัดฉ่าสามชั้น','',50.00),(35,'ก๋วยเตี๋ยวคั่วไก่','',50.00),(36,'หมี่ไก่ฉีก+หมูกระจก','',50.00),(37,'ผัดกระเพราวุ้นเส้น','',50.00),(38,'มาม่าปลากระป๋อง','',60.00),(39,'ก๋วยจั๊บญวน','',50.00),(40,'Set ย่างตามใจ','',50.00),(41,'ต้มยำปลากระป๋อง','',60.00),(43,'ข้าวพริกแกงไก่กรอบ','',50.00),(44,'ข้าวคลุกน้ำพริก+ปลาทู','',50.00),(45,'ข้าวคลุุกน้ำพริก+หมูแดด','',50.00),(46,'ข้าาวคลุกน้ำพริก+ไข่ชะอม','',50.00),(47,'ข้าวผัดต้มยำ','',50.00),(48,'ข้าวผัดต้มยำ+หมูแดง','',60.00),(49,'ข้าวหมูกรอบผัดผงกระหรี่','',50.00),(50,'ข้าวกระเพราเนื้อ','',50.00),(51,'ข้าาวกระเพราเนื้อ-หมูยอทอด','',60.00),(52,'ข้าวทะเลไข่เค็ม','',50.00),(53,'ข้าวหมูกรอบผัดไข่','',50.00),(54,'ข้าวกุ้งพริกขี้หนูสวน','',50.00),(55,'ข้าวหมูชิ้นผัดพริกไทย','',50.00),(56,'ข้าวผัดฉ่าสามชั้น','',50.00),(57,'ก๋วยเตี๋ยวคั่วไก่','',50.00),(58,'หมี่ไก่ฉีก+หมูกระจก','',50.00),(59,'ผัดกระเพราวุ้นเส้น','',50.00),(60,'มาม่าปลากระป๋อง','',60.00),(61,'ก๋วยจั๊บญวน','',50.00),(62,'Set ย่างตามใจ','',50.00),(63,'ต้มยำปลากระป๋อง','',60.00),(65,'ข้าวพริกแกงไก่กรอบ','',50.00),(66,'ข้าวคลุกน้ำพริก+ปลาทู','',50.00),(67,'ข้าวคลุกน้ำพริก+หมูแดด','',50.00),(68,'ข้าวคลุกน้ำพริก+ไข่ชะอม','',50.00),(69,'ข้าวผัดต้มยำ','',50.00),(70,'ข้าวผัดต้มยำ+หมูแดง','',60.00),(71,'ข้าวหมูกรอบผัดผงกระหรี่','',50.00),(72,'ข้าวกระเพราเนื้อ','',50.00),(73,'ข้าาวกระเพราเนื้อ-หมูยอทอด','',60.00),(74,'ข้าวทะเลไข่เค็ม','',50.00),(75,'ข้าวหมูกรอบผัดไข่','',50.00),(76,'ข้าวกุ้งพริกขี้หนูสวน','',50.00),(77,'ข้าวหมูชิ้นผัดพริกไทย','',50.00),(78,'ข้าวผัดฉ่าสามชั้น','',50.00),(79,'ก๋วยเตี๋ยวคั่วไก่','',50.00),(80,'หมี่ไก่ฉีก+หมูกระจก','',50.00),(81,'ผัดกระเพราวุ้นเส้น','',50.00),(82,'มาม่าปลากระป๋อง','',60.00),(83,'ก๋วยจั๊บญวน','',50.00),(84,'Set ย่างตามใจ','',50.00),(85,'ต้มยำปลากระป๋อง','',60.00),(87,'ข้าวพริกแกงไก่กรอบ','',50.00),(88,'ข้าวคลุกน้ำพริก+ปลาทู','',50.00),(89,'ข้าวคลุกน้ำพริก+หมูแดด','',50.00),(90,'ข้าวคลุกน้ำพริก+ไข่ชะอม','',50.00),(91,'ข้าวผัดต้มยำ','',50.00),(92,'ข้าวผัดต้มยำ+หมูแดง','',60.00),(93,'ข้าวหมูกรอบผัดผงกระหรี่','',50.00),(94,'ข้าวกระเพราเนื้อ','',50.00),(95,'ข้าาวกระเพราเนื้อ-หมูยอทอด','',60.00),(96,'ข้าวทะเลไข่เค็ม','',50.00),(97,'ข้าวหมูกรอบผัดไข่','',50.00),(98,'ข้าวกุ้งพริกขี้หนูสวน','',50.00),(99,'ข้าวหมูชิ้นผัดพริกไทย','',50.00),(100,'ข้าวผัดฉ่าสามชั้น','',50.00),(101,'ก๋วยเตี๋ยวคั่วไก่','',50.00),(102,'หมี่ไก่ฉีก+หมูกระจก','',50.00),(103,'ผัดกระเพราวุ้นเส้น','',50.00),(104,'มาม่าปลากระป๋อง','',60.00),(105,'ก๋วยจั๊บญวน','',50.00),(106,'Set ย่างตามใจ','',50.00),(107,'ต้มยำปลากระป๋อง','',60.00),(109,'ข้าวพริกแกงไก่กรอบ','',50.00),(110,'ข้าวคลุกน้ำพริก+ปลาทู','',50.00),(111,'ข้าวคลุกน้ำพริก+หมูแดด','',50.00),(112,'ข้าวคลุกน้ำพริก+ไข่ชะอม','',50.00);
/*!40000 ALTER TABLE `main_dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `item_type` enum('main_dish','snack','drink') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,'main_dish',1,2,50.00,100.00),(2,1,'drink',1,1,35.00,35.00),(3,1,'snack',5,3,10.00,30.00),(4,2,'main_dish',2,1,60.00,60.00),(5,2,'drink',3,2,40.00,80.00),(6,2,'snack',15,1,60.00,60.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `order_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('รอดำเนินการ','กำลังทำ','เสิร์ฟแล้ว','ชำระเงินแล้ว','ยกเลิก') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'รอดำเนินการ',
  PRIMARY KEY (`order_id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables-in` (`table_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-08-26 18:10:00','รอดำเนินการ'),(2,2,'2025-08-26 18:35:00','รอดำเนินการ');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('เงินสด','บัตรเครดิต','โอน/พร้อมเพย์') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (3,1,165.00,'เงินสด','2025-08-26 18:45:00'),(4,2,200.00,'บัตรเครดิต','2025-08-26 19:00:00');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `reservation_id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `customer_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reservation_time` datetime NOT NULL,
  `status` enum('รอดำเนินการ','ยืนยันแล้ว','เช็คอินแล้ว','ยกเลิก') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'รอดำเนินการ',
  `check_in_time` datetime DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables-in` (`table_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,1,'นายสมชาย','0812345678','2025-08-26 18:00:00','เช็คอินแล้ว','2025-08-26 18:05:00'),(2,2,'นางสาวสุนิสา','0898765432','2025-08-26 18:30:00','ยืนยันแล้ว',NULL);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `snacks`
--

DROP TABLE IF EXISTS `snacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `snacks` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `snacks`
--

LOCK TABLES `snacks` WRITE;
/*!40000 ALTER TABLE `snacks` DISABLE KEYS */;
INSERT INTO `snacks` VALUES (1,'ลูกชิ้นหมู','',10.00),(2,'ลูกชิ้นเอ็นหมู','',10.00),(3,'ลูกชิ้นไก่','',10.00),(4,'ไส้กรอกแดง','',10.00),(5,'ลูกชิ้นเนื้อ','',10.00),(6,'ลูกชิ้นเอ็นเนื้อ','',10.00),(7,'ไส้กรอกรมควัน','',10.00),(8,'เต้าหู้หมู','',10.00),(9,'ปูอัด','',15.00),(10,'ไส้กรอกชีส','',15.00),(11,'ไส้กรอกเบคอน','',20.00),(12,'จ๊อ 5 ดาว','',20.00),(13,'ไส้กรอกควันชีส','',10.00),(14,'ลูกชิ้นกุ้ง','',10.00),(15,'เฟรนฟราย','',60.00),(16,'เอ็นไก่','',60.00),(17,'ไก่ป๊อบ','',60.00),(18,'ไก่ป๊อบสไปรซี่','',60.00),(19,'นักเก็ต','',60.00),(20,'ถุงทอดไส้กุ้ง','',60.00),(21,'แฮชบรานน์','',60.00),(22,'ปลาเกล็ดขนมปัง','',60.00),(23,'ปอเปี๊ยวุ้นเส้น','',60.00),(24,'ฮิปิโรลไส้กุ้ง','',60.00),(25,'ปอเปี๊ยกุ้งวุ้นเส้น','',60.00),(26,'ชีสบอล','',60.00),(27,'ไส้กรอกอีสาน ส.ขอนแก่น','',60.00),(28,'ไส้กรอกอีสาน หมูวุ้นเส้น','',60.00);
/*!40000 ALTER TABLE `snacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables-in`
--

DROP TABLE IF EXISTS `tables-in`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables-in` (
  `table_id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ว่าง','จองแล้ว','กำลังใช้งาน') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ว่าง',
  `qr_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`table_id`),
  UNIQUE KEY `table_number` (`table_number`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables-in`
--

LOCK TABLES `tables-in` WRITE;
/*!40000 ALTER TABLE `tables-in` DISABLE KEYS */;
INSERT INTO `tables-in` VALUES (1,'A1','ว่าง','QR-A1'),(2,'A2','ว่าง','QR-A2'),(3,'A3','ว่าง','QR-A3'),(4,'A4','ว่าง','QR-A4'),(5,'A5','ว่าง','QR-A5'),(6,'A6','ว่าง','QR-A6'),(7,'A7','ว่าง','QR-A7'),(8,'A8','ว่าง','QR-A8'),(9,'A9','ว่าง','QR-A9'),(10,'A10','ว่าง','QR-A10'),(11,'A11','ว่าง',NULL),(12,'A12','ว่าง',NULL),(13,'A13','ว่าง',NULL),(14,'A14','ว่าง',NULL),(15,'A15','ว่าง',NULL),(16,'A16','ว่าง',NULL),(17,'A17','ว่าง',NULL),(18,'A18','ว่าง',NULL);
/*!40000 ALTER TABLE `tables-in` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables-out`
--

DROP TABLE IF EXISTS `tables-out`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables-out` (
  `table_id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ว่าง','จองแล้ว','กำลังใช้งาน') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ว่าง',
  `qr_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`table_id`),
  UNIQUE KEY `table_number` (`table_number`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables-out`
--

LOCK TABLES `tables-out` WRITE;
/*!40000 ALTER TABLE `tables-out` DISABLE KEYS */;
INSERT INTO `tables-out` VALUES (1,'A19','ว่าง','QR_A19.png'),(2,'A20','ว่าง','QR_A20.png'),(3,'A21','ว่าง','QR_A21.png'),(4,'A22','ว่าง','QR_A22.png'),(5,'A23','ว่าง','QR_A23.png'),(6,'A24','ว่าง','QR_A24.png'),(7,'A25','ว่าง','QR_A25.png'),(8,'A26','ว่าง','QR_A26.png'),(9,'A27','ว่าง','QR_A27.png'),(10,'A28','ว่าง','QR_A28.png'),(11,'A29','ว่าง','QR_A29.png'),(12,'A30','ว่าง','QR_A30.png');
/*!40000 ALTER TABLE `tables-out` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'restaurant_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-19 16:46:52
