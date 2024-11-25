/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50714
 Source Host           : localhost:3306
 Source Schema         : shengxianshop

 Target Server Type    : MySQL
 Target Server Version : 50714
 File Encoding         : 65001

 Date: 25/11/2024 10:42:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses`  (
  `address_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `recipient_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '收件人姓名',
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '省/州',
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '城市',
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '区',
  `street_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '街道地址',
  `is_default` tinyint(1) UNSIGNED ZEROFILL DEFAULT 0 COMMENT '是否为默认地址 0-false，1-true',
  PRIMARY KEY (`address_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '地址表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of addresses
-- ----------------------------
INSERT INTO `addresses` VALUES (21, 7, 'xiaoxiao', '福建省', '福州市', '鼓楼区', '杨家胡同', 0);
INSERT INTO `addresses` VALUES (22, 10, 'hwn', '北京市', '北京市', '东城区', '二脖子', 1);
INSERT INTO `addresses` VALUES (23, 7, 'xiaoxiao', '上海市', '上海市', '黄浦区', '陆家嘴', 1);

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '密码',
  `sex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '性别',
  `age` int(10) DEFAULT NULL COMMENT '年龄',
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '昵称',
  `user_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  `grade` int(1) DEFAULT NULL COMMENT '管理员等级',
  `admin_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '管理员创建日期',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (3, 'admin', '$2a$10$ls7ejxjR.kaxlQujDoTii.W.qRP.jKi5vNKk42YJrkPkGBgdxrbL2', '女', 56, '老大', 'images\\1714375101351-4k00e4.jpeg', 0, '2024-03-17 19:54:58', '1364497615@qq.com');

-- ----------------------------
-- Table structure for carousel
-- ----------------------------
DROP TABLE IF EXISTS `carousel`;
CREATE TABLE `carousel`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '轮播图id',
  `carousel_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '轮播图图片',
  `carousel_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '轮播图创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '轮播图表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of carousel
-- ----------------------------
INSERT INTO `carousel` VALUES (4, 'images\\1714375858429-rmm276.png', '2024-03-15 00:00:00');
INSERT INTO `carousel` VALUES (5, 'images\\shengxian2.jpg', '2024-03-16 00:00:00');
INSERT INTO `carousel` VALUES (6, 'images\\shengxian3.jpg', '2024-03-16 00:00:00');
INSERT INTO `carousel` VALUES (18, 'images\\shengxian4.jpg', '2024-03-16 00:00:00');
INSERT INTO `carousel` VALUES (19, 'images\\shengxian5.jpg', '2024-03-16 00:00:00');
INSERT INTO `carousel` VALUES (20, 'images\\shengxian6.jpg', '2024-03-16 00:00:00');
INSERT INTO `carousel` VALUES (21, 'images\\shengxian7.jpg', '2024-04-01 18:59:25');
INSERT INTO `carousel` VALUES (22, 'images\\shengxian8.jpg', '2024-04-01 18:59:30');
INSERT INTO `carousel` VALUES (23, 'images\\shengxian9.jpg', '2024-04-01 18:59:36');

-- ----------------------------
-- Table structure for carts
-- ----------------------------
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts`  (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `product_id` int(11) DEFAULT NULL COMMENT '商品ID ',
  `quantity` int(11) DEFAULT NULL COMMENT '数量',
  PRIMARY KEY (`cart_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '购物车表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of carts
-- ----------------------------
INSERT INTO `carts` VALUES (7, 10, 60, 1);
INSERT INTO `carts` VALUES (8, 10, 62, 2);
INSERT INTO `carts` VALUES (9, 10, 61, 2);
INSERT INTO `carts` VALUES (10, 10, 63, 1);
INSERT INTO `carts` VALUES (11, 10, 64, 1);
INSERT INTO `carts` VALUES (12, 10, 65, 1);
INSERT INTO `carts` VALUES (13, 10, 66, 1);
INSERT INTO `carts` VALUES (14, 10, 67, 1);
INSERT INTO `carts` VALUES (15, 10, 72, 1);
INSERT INTO `carts` VALUES (16, 10, 69, 1);
INSERT INTO `carts` VALUES (17, 10, 75, 1);
INSERT INTO `carts` VALUES (22, 7, 63, 1);
INSERT INTO `carts` VALUES (29, 7, 72, 1);

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `category_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '分类名称',
  `category_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, '水果', '2024-03-10 18:36:01');
INSERT INTO `categories` VALUES (2, '蔬菜', '2024-03-09 18:36:11');

-- ----------------------------
-- Table structure for order_details
-- ----------------------------
DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details`  (
  `order_detail_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单详情id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `product_id` int(11) DEFAULT NULL COMMENT '商品id',
  `quantity` int(11) DEFAULT NULL COMMENT '商品数量',
  `product_status` int(11) DEFAULT NULL COMMENT '商品状态，1待收货/使用，2已完成，3已取消，4已售后',
  `iscomment` int(11) DEFAULT 0 COMMENT '是否评价，0未评价，1以评价，2以追价',
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '商品购买时间',
  PRIMARY KEY (`order_detail_id`) USING BTREE,
  INDEX `fk_order_details_product`(`product_id`) USING BTREE,
  CONSTRAINT `fk_order_details_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 100 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '订单详情表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_details
-- ----------------------------
INSERT INTO `order_details` VALUES (1, 7, 59, 4, 4, 1, '2024-04-03 10:37:33');
INSERT INTO `order_details` VALUES (2, 7, 74, 4, 4, 2, '2024-04-03 10:37:33');
INSERT INTO `order_details` VALUES (4, 7, 64, 1, 2, 2, '2024-04-03 10:46:21');
INSERT INTO `order_details` VALUES (5, 7, 59, 1, 2, 2, '2024-04-03 11:34:15');
INSERT INTO `order_details` VALUES (7, 7, 59, 1, 2, 2, '2024-04-03 15:41:57');
INSERT INTO `order_details` VALUES (8, 10, 59, 3, 2, 2, '2024-04-03 15:46:19');
INSERT INTO `order_details` VALUES (9, 10, 59, 2, 2, 1, '2024-04-03 15:46:39');
INSERT INTO `order_details` VALUES (10, 7, 59, 1, 2, 2, '2024-04-03 15:48:52');
INSERT INTO `order_details` VALUES (11, 10, 59, 1, 2, 1, '2024-04-03 15:49:13');
INSERT INTO `order_details` VALUES (12, 10, 59, 1, 2, 1, '2024-04-03 15:50:13');
INSERT INTO `order_details` VALUES (13, 10, 59, 5, 2, 1, '2024-04-03 15:50:32');
INSERT INTO `order_details` VALUES (14, 7, 59, 2, 2, 2, '2024-04-03 15:51:01');
INSERT INTO `order_details` VALUES (15, 7, 60, 1, 2, 1, '2024-04-03 16:33:14');
INSERT INTO `order_details` VALUES (16, 7, 60, 1, 2, 1, '2024-04-03 16:33:26');
INSERT INTO `order_details` VALUES (17, 10, 60, 1, 2, 1, '2024-04-03 16:33:30');
INSERT INTO `order_details` VALUES (18, 7, 60, 1, 2, 1, '2024-04-03 16:33:44');
INSERT INTO `order_details` VALUES (19, 10, 60, 1, 2, 1, '2024-04-03 16:33:46');
INSERT INTO `order_details` VALUES (20, 10, 60, 1, 2, 1, '2024-04-03 16:33:57');
INSERT INTO `order_details` VALUES (21, 7, 60, 1, 2, 2, '2024-04-03 16:34:12');
INSERT INTO `order_details` VALUES (22, 10, 60, 1, 2, 1, '2024-04-03 16:34:24');
INSERT INTO `order_details` VALUES (23, 10, 60, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (24, 10, 62, 2, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (25, 10, 61, 2, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (26, 10, 63, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (27, 10, 64, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (28, 10, 65, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (29, 10, 66, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (30, 10, 67, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (31, 10, 72, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (32, 10, 69, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (33, 10, 75, 1, 2, 1, '2024-04-03 16:35:57');
INSERT INTO `order_details` VALUES (38, 7, 59, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (39, 7, 60, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (40, 7, 61, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (41, 7, 62, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (42, 7, 63, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (43, 7, 64, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (44, 7, 65, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (45, 7, 66, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (46, 7, 67, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (47, 7, 68, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (48, 7, 69, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (49, 7, 72, 1, 2, 1, '2024-04-03 16:37:16');
INSERT INTO `order_details` VALUES (53, 10, 60, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (54, 10, 62, 2, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (55, 10, 61, 2, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (56, 10, 63, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (57, 10, 64, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (58, 10, 65, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (59, 10, 66, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (60, 10, 67, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (61, 10, 72, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (62, 10, 69, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (63, 10, 75, 1, 2, 1, '2024-04-03 16:39:02');
INSERT INTO `order_details` VALUES (68, 7, 59, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (69, 7, 60, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (70, 7, 61, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (71, 7, 62, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (72, 7, 63, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (73, 7, 64, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (74, 7, 65, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (75, 7, 66, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (76, 7, 67, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (77, 7, 68, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (78, 7, 69, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (79, 7, 72, 1, 2, 1, '2024-04-03 16:40:50');
INSERT INTO `order_details` VALUES (83, 10, 60, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (84, 10, 62, 2, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (85, 10, 61, 2, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (86, 10, 63, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (87, 10, 64, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (88, 10, 65, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (89, 10, 66, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (90, 10, 67, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (91, 10, 72, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (92, 10, 69, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (93, 10, 75, 1, 2, 1, '2024-04-03 16:41:59');
INSERT INTO `order_details` VALUES (94, 7, 59, 1, 2, 1, '2024-05-23 23:23:02');
INSERT INTO `order_details` VALUES (95, 7, 59, 1, 2, 1, '2024-05-24 08:00:52');
INSERT INTO `order_details` VALUES (96, 7, 59, 2, 2, 2, '2024-05-24 08:05:50');
INSERT INTO `order_details` VALUES (97, 7, 59, 1, 2, 2, '2024-05-24 08:18:16');
INSERT INTO `order_details` VALUES (98, 7, 63, 1, 2, 0, '2024-05-24 21:20:59');
INSERT INTO `order_details` VALUES (99, 7, 72, 1, 2, 2, '2024-05-24 21:20:59');

-- ----------------------------
-- Table structure for product_detail
-- ----------------------------
DROP TABLE IF EXISTS `product_detail`;
CREATE TABLE `product_detail`  (
  `detail_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品详情id',
  `product_id` int(11) DEFAULT NULL COMMENT '商品id，外键',
  `detail_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '商品详情图片',
  `detail_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '商品详情图片创建时间',
  PRIMARY KEY (`detail_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `product_detail_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 98 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品详情轮播图表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_detail
-- ----------------------------
INSERT INTO `product_detail` VALUES (37, 59, 'images\\pg1.jpg', '2024-03-31 14:43:25');
INSERT INTO `product_detail` VALUES (38, 59, 'images\\pg2.jpg', '2024-03-31 08:00:00');
INSERT INTO `product_detail` VALUES (39, 59, 'images\\pg3.jpg', '2024-03-31 14:43:40');
INSERT INTO `product_detail` VALUES (40, 60, 'images\\li1.jpg', '2024-03-31 08:00:00');
INSERT INTO `product_detail` VALUES (41, 60, 'images\\lz2.jpg', '2024-03-31 15:28:58');
INSERT INTO `product_detail` VALUES (42, 60, 'images\\li2.jpg', '2024-03-31 08:00:00');
INSERT INTO `product_detail` VALUES (43, 61, 'images\\cz1.jpg', '2024-03-31 15:30:16');
INSERT INTO `product_detail` VALUES (44, 61, 'images\\cz2.jpg', '2024-03-31 15:30:46');
INSERT INTO `product_detail` VALUES (45, 62, 'images\\xj1.jpg', '2024-03-31 15:32:18');
INSERT INTO `product_detail` VALUES (46, 62, 'images\\xj2.jpg', '2024-03-31 15:32:45');
INSERT INTO `product_detail` VALUES (47, 63, 'images\\pt1.jpg', '2024-03-31 15:34:42');
INSERT INTO `product_detail` VALUES (48, 63, 'images\\pt2.jpg', '2024-03-31 15:34:46');
INSERT INTO `product_detail` VALUES (49, 64, 'images\\cm1.jpg', '2024-03-31 15:37:17');
INSERT INTO `product_detail` VALUES (50, 64, 'images\\cm2.jpg', '2024-03-31 15:37:24');
INSERT INTO `product_detail` VALUES (51, 64, 'images\\cm3.jpg', '2024-03-31 15:37:28');
INSERT INTO `product_detail` VALUES (52, 64, 'images\\cm4.jpg', '2024-03-31 15:37:34');
INSERT INTO `product_detail` VALUES (53, 65, 'images\\tz1.jpg', '2024-03-31 15:39:33');
INSERT INTO `product_detail` VALUES (54, 65, 'images\\tz2.jpg', '2024-03-31 15:39:39');
INSERT INTO `product_detail` VALUES (55, 66, 'images\\ningmeng.jpg', '2024-03-31 15:41:13');
INSERT INTO `product_detail` VALUES (56, 67, 'images\\xg1.jpg', '2024-03-31 16:10:47');
INSERT INTO `product_detail` VALUES (57, 67, 'images\\xg2.jpg', '2024-03-31 16:10:52');
INSERT INTO `product_detail` VALUES (58, 67, 'images\\xg3.jpg', '2024-03-31 16:10:58');
INSERT INTO `product_detail` VALUES (59, 68, 'images\\mg1.jpg', '2024-03-31 16:12:02');
INSERT INTO `product_detail` VALUES (60, 68, 'images\\mg2.jpg', '2024-03-31 16:12:13');
INSERT INTO `product_detail` VALUES (61, 68, 'images\\mg3.jpg', '2024-03-31 16:12:17');
INSERT INTO `product_detail` VALUES (62, 69, 'images\\bl1.jpg', '2024-03-31 16:13:39');
INSERT INTO `product_detail` VALUES (63, 69, 'images\\bl2.jpg', '2024-03-31 16:13:43');
INSERT INTO `product_detail` VALUES (64, 70, 'images\\clz1.jpg', '2024-03-31 16:14:49');
INSERT INTO `product_detail` VALUES (65, 70, 'images\\clz2.jpg', '2024-03-31 16:14:53');
INSERT INTO `product_detail` VALUES (66, 70, 'images\\clz3.jpg', '2024-03-31 16:14:57');
INSERT INTO `product_detail` VALUES (67, 71, 'images\\lz1.jpg', '2024-03-31 08:00:00');
INSERT INTO `product_detail` VALUES (68, 71, 'images\\lizi2.jpg', '2024-03-31 16:17:52');
INSERT INTO `product_detail` VALUES (69, 72, 'images\\mihoutao.jpg', '2024-03-31 16:25:27');
INSERT INTO `product_detail` VALUES (70, 72, 'images\\mht4.jpg', '2024-03-31 16:25:46');
INSERT INTO `product_detail` VALUES (71, 72, 'images\\mht3.jpg', '2024-03-31 16:25:50');
INSERT INTO `product_detail` VALUES (72, 72, 'images\\mht2.jpg', '2024-03-31 16:25:57');
INSERT INTO `product_detail` VALUES (73, 73, 'images\\ll1.jpg', '2024-03-31 16:27:11');
INSERT INTO `product_detail` VALUES (74, 73, 'images\\ll2.jpg', '2024-03-31 16:27:16');
INSERT INTO `product_detail` VALUES (75, 73, 'images\\ll3.jpg', '2024-03-31 16:27:20');
INSERT INTO `product_detail` VALUES (76, 74, 'images\\xhs1.jpg', '2024-03-31 17:24:34');
INSERT INTO `product_detail` VALUES (77, 74, 'images\\xhs2.jpg', '2024-03-31 17:24:39');
INSERT INTO `product_detail` VALUES (78, 74, 'images\\xihongshi.jpg', '2024-03-31 17:24:43');
INSERT INTO `product_detail` VALUES (79, 75, 'images\\hg.jpg', '2024-03-31 17:26:24');
INSERT INTO `product_detail` VALUES (80, 75, 'images\\hg1.jpg', '2024-03-31 17:26:29');
INSERT INTO `product_detail` VALUES (81, 76, 'images\\hlb1.jpg', '2024-03-31 17:30:05');
INSERT INTO `product_detail` VALUES (82, 77, 'images\\td1.jpg', '2024-03-31 17:32:28');
INSERT INTO `product_detail` VALUES (83, 77, 'images\\td2.jpg', '2024-03-31 17:32:34');
INSERT INTO `product_detail` VALUES (84, 78, 'images\\bc1.jpg', '2024-03-31 17:44:29');
INSERT INTO `product_detail` VALUES (85, 78, 'images\\bc2.jpg', '2024-03-31 17:44:34');
INSERT INTO `product_detail` VALUES (86, 79, 'images\\sc1.jpg', '2024-03-31 17:45:30');
INSERT INTO `product_detail` VALUES (88, 80, 'images\\bc1.jpg', '2024-03-31 17:47:08');
INSERT INTO `product_detail` VALUES (89, 80, 'images\\bc.jpg', '2024-03-31 18:08:36');
INSERT INTO `product_detail` VALUES (90, 81, 'images\\ng1.jpg', '2024-03-31 18:09:28');
INSERT INTO `product_detail` VALUES (91, 81, 'images\\ng2.jpg', '2024-03-31 18:09:34');
INSERT INTO `product_detail` VALUES (92, 82, 'images\\qj1.jpg', '2024-03-31 18:11:19');
INSERT INTO `product_detail` VALUES (93, 82, 'images\\qj2.jpg', '2024-03-31 18:11:24');
INSERT INTO `product_detail` VALUES (94, 83, 'images\\lajiao1.jpg', '2024-03-31 18:12:25');
INSERT INTO `product_detail` VALUES (95, 83, 'images\\lajiao2.jpg', '2024-03-31 18:12:30');
INSERT INTO `product_detail` VALUES (96, 84, 'images\\qiezi1.jpg', '2024-03-31 18:14:21');
INSERT INTO `product_detail` VALUES (97, 84, 'images\\qiezi.jpg', '2024-03-31 18:14:26');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `product_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '商品头像',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '商品名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '商品描述',
  `price` decimal(10, 2) DEFAULT NULL COMMENT '价格',
  `old_price` decimal(10, 2) DEFAULT NULL COMMENT '旧价格',
  `stock` int(11) DEFAULT NULL COMMENT '库存',
  `category_id` int(11) DEFAULT NULL COMMENT '分类ID',
  PRIMARY KEY (`product_id`) USING BTREE,
  INDEX `category_id`(`category_id`) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 85 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (59, 'images\\1714374819017-pp2gdg.jpg', '苹果', '这是一个非常好的苹果', 10.00, 15.00, 65, 1);
INSERT INTO `products` VALUES (60, 'images\\li.jpg', '梨子', '这是一个非常好的梨子', 5.00, 20.00, 197, 1);
INSERT INTO `products` VALUES (61, 'images\\chengzi.jpg', '橙子', '这是一个非常好的橙子', 10.00, 0.00, 52, 1);
INSERT INTO `products` VALUES (62, 'images\\xj1.jpg', '香蕉', '香蕉好啊香蕉，吃了通便', 4.50, 3.00, 22, 1);
INSERT INTO `products` VALUES (63, 'images\\putao.jpg', '葡萄', '葡萄好，非常甜的葡萄', 5.99, 7.00, 14, 1);
INSERT INTO `products` VALUES (64, 'images\\caomei.jpg', '草莓', '草莓甜的了', 19.00, 0.00, 50, 1);
INSERT INTO `products` VALUES (65, 'images\\taozi.jpg', '桃子', '桃子好啊桃子', 5.00, 6.00, 115, 1);
INSERT INTO `products` VALUES (66, 'images\\ningmeng.jpg', '柠檬', '好柠檬，酸死你', 3.00, 0.00, 60, 1);
INSERT INTO `products` VALUES (67, 'images\\xigua.jpg', '西瓜', '好西瓜', 7.00, 12.00, 40, 1);
INSERT INTO `products` VALUES (68, 'images\\mugua.jpg', '木瓜', '好木瓜', 30.00, 45.00, 21, 1);
INSERT INTO `products` VALUES (69, 'images\\boluo.jpg', '菠萝', '菠萝', 12.00, 0.00, 7, 1);
INSERT INTO `products` VALUES (70, 'images\\chelizi.jpg', '车厘子', '车厘子', 2.00, 5.00, 100, 1);
INSERT INTO `products` VALUES (71, 'images\\lizi.jpg', '李子', '例子', 6.00, 9.00, 30, 1);
INSERT INTO `products` VALUES (72, 'images\\mht.jpg', '猕猴桃', '猕猴桃', 14.00, 0.00, 54, 1);
INSERT INTO `products` VALUES (73, 'images\\liulian.jpg', '榴莲', '留恋啊', 50.00, 0.00, 89, 1);
INSERT INTO `products` VALUES (74, 'images\\xhs3.jpg', '西红柿', '西红柿', 3.00, 0.00, 26, 2);
INSERT INTO `products` VALUES (75, 'images\\hg1.jpg', '黄瓜', '黄瓜黄瓜黄瓜黄瓜黄瓜黄瓜黄瓜黄瓜黄瓜黄瓜', 2.00, 3.50, 43, 2);
INSERT INTO `products` VALUES (76, 'images\\hlb.jpg', '胡萝卜', '胡萝卜', 6.00, 0.00, 23, 2);
INSERT INTO `products` VALUES (77, 'images\\td.jpg', '土豆', '土豆', 3.20, 0.00, 0, 2);
INSERT INTO `products` VALUES (78, 'images\\bc.jpg', '白菜', '白菜', 3.30, 0.00, 62, 2);
INSERT INTO `products` VALUES (79, 'images\\sc.jpg', '生菜', '生菜生菜', 5.00, 8.00, 32, 2);
INSERT INTO `products` VALUES (80, 'images\\bc1.jpg', '菠菜', '菠菜', 2.00, 3.20, 46, 2);
INSERT INTO `products` VALUES (81, 'images\\ng.jpg', '南瓜', '南瓜', 6.00, 0.00, 78, 2);
INSERT INTO `products` VALUES (82, 'images\\qj.jpg', '青椒', '青椒', 1.20, 2.00, 13, 2);
INSERT INTO `products` VALUES (83, 'images\\lajiao.jpg', '辣椒', '辣椒超辣', 3.10, 5.00, 96, 2);
INSERT INTO `products` VALUES (84, 'images\\qiezi.jpg', '茄子', '茄子，大茄子，长茄子', 5.50, 7.90, 79, 2);

-- ----------------------------
-- Table structure for reviews
-- ----------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews`  (
  `review_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `product_id` int(11) DEFAULT NULL COMMENT '商品ID',
  `rating` int(11) DEFAULT NULL COMMENT '评分',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '评论内容 ',
  `review_date` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评价日期',
  PRIMARY KEY (`review_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 98 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评价表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reviews
-- ----------------------------
INSERT INTO `reviews` VALUES (1, 7, 59, 5, '非常好非常好，很好吃', '2024-04-03 10:38:40');
INSERT INTO `reviews` VALUES (3, 7, 74, 4, '还比较满意，他就是点烂了\n', '2024-04-03 10:39:13');
INSERT INTO `reviews` VALUES (7, 7, 59, 5, '真的很甜', '2024-04-03 15:43:07');
INSERT INTO `reviews` VALUES (8, 7, 59, 3, '一般般，还是回头客', '2024-04-03 15:43:25');
INSERT INTO `reviews` VALUES (9, 10, 59, 1, '太垃圾了，里面都有虫子', '2024-04-03 15:47:08');
INSERT INTO `reviews` VALUES (10, 10, 59, 2, '而且里面还有烂的苹果，再也不会来买了', '2024-04-03 15:47:48');
INSERT INTO `reviews` VALUES (11, 10, 59, 3, '第二次买了，还行吧', '2024-04-03 15:48:18');
INSERT INTO `reviews` VALUES (12, 7, 59, 1, '垃圾', '2024-04-03 15:49:46');
INSERT INTO `reviews` VALUES (13, 7, 59, 1, '太垃圾', '2024-04-03 15:49:52');
INSERT INTO `reviews` VALUES (14, 7, 59, 3, '一般', '2024-04-03 15:50:00');
INSERT INTO `reviews` VALUES (15, 10, 59, 5, '好好喝', '2024-04-03 15:51:17');
INSERT INTO `reviews` VALUES (16, 10, 59, 1, '不好', '2024-04-03 15:51:22');
INSERT INTO `reviews` VALUES (17, 10, 59, 3, '一啊不能', '2024-04-03 15:51:27');
INSERT INTO `reviews` VALUES (18, 7, 59, 5, '还行吧', '2024-04-03 15:52:29');
INSERT INTO `reviews` VALUES (19, 10, 60, 1, 'laji', '2024-04-03 16:37:44');
INSERT INTO `reviews` VALUES (20, 10, 60, 3, 'haixing1', '2024-04-03 16:37:49');
INSERT INTO `reviews` VALUES (21, 10, 60, 4, '一般般', '2024-04-03 16:37:54');
INSERT INTO `reviews` VALUES (22, 10, 60, 5, '爱好了', '2024-04-03 16:37:58');
INSERT INTO `reviews` VALUES (23, 10, 60, 5, '吃的挺甜', '2024-04-03 16:38:05');
INSERT INTO `reviews` VALUES (24, 10, 62, 1, '不好', '2024-04-03 16:38:12');
INSERT INTO `reviews` VALUES (25, 10, 61, 2, '', '2024-04-03 16:38:15');
INSERT INTO `reviews` VALUES (26, 10, 63, 3, '', '2024-04-03 16:38:18');
INSERT INTO `reviews` VALUES (27, 10, 64, 2, '还行', '2024-04-03 16:38:23');
INSERT INTO `reviews` VALUES (28, 10, 69, 5, '挺好', '2024-04-03 16:38:33');
INSERT INTO `reviews` VALUES (29, 10, 72, 3, '不好', '2024-04-03 16:38:37');
INSERT INTO `reviews` VALUES (30, 10, 67, 3, '一般', '2024-04-03 16:38:42');
INSERT INTO `reviews` VALUES (31, 10, 66, 3, '不好吃', '2024-04-03 16:38:47');
INSERT INTO `reviews` VALUES (32, 10, 65, 5, '', '2024-04-03 16:38:50');
INSERT INTO `reviews` VALUES (33, 10, 75, 5, '挺长', '2024-04-03 16:38:55');
INSERT INTO `reviews` VALUES (34, 7, 64, 1, '不好吃', '2024-04-03 16:39:32');
INSERT INTO `reviews` VALUES (35, 7, 60, 5, '还行', '2024-04-03 16:39:36');
INSERT INTO `reviews` VALUES (36, 7, 60, 4, '一般不能', '2024-04-03 16:39:45');
INSERT INTO `reviews` VALUES (37, 7, 60, 5, '商家给钱', '2024-04-03 16:39:52');
INSERT INTO `reviews` VALUES (38, 7, 60, 5, '哈哈哈', '2024-04-03 16:39:57');
INSERT INTO `reviews` VALUES (39, 7, 59, 2, '欧拉', '2024-04-03 16:40:03');
INSERT INTO `reviews` VALUES (40, 7, 61, 2, '嗯呢', '2024-04-03 16:40:09');
INSERT INTO `reviews` VALUES (41, 7, 60, 3, '啊倒萨', '2024-04-03 16:40:12');
INSERT INTO `reviews` VALUES (42, 7, 63, 4, 'asd', '2024-04-03 16:40:15');
INSERT INTO `reviews` VALUES (43, 7, 62, 5, '阿三大苏打', '2024-04-03 16:40:18');
INSERT INTO `reviews` VALUES (44, 7, 64, 1, '爱仕达说', '2024-04-03 16:40:20');
INSERT INTO `reviews` VALUES (45, 7, 65, 3, '阿达', '2024-04-03 16:40:23');
INSERT INTO `reviews` VALUES (46, 7, 66, 5, 'adasd', '2024-04-03 16:40:26');
INSERT INTO `reviews` VALUES (47, 7, 67, 4, '阿三大苏打', '2024-04-03 16:40:29');
INSERT INTO `reviews` VALUES (48, 7, 68, 5, '阿三大苏打', '2024-04-03 16:40:35');
INSERT INTO `reviews` VALUES (49, 7, 69, 2, '', '2024-04-03 16:40:37');
INSERT INTO `reviews` VALUES (50, 7, 72, 1, '啊大苏打', '2024-04-03 16:40:40');
INSERT INTO `reviews` VALUES (51, 10, 60, 5, '啊大苏打', '2024-04-03 16:41:01');
INSERT INTO `reviews` VALUES (52, 10, 62, 5, 'asdasd', '2024-04-03 16:41:05');
INSERT INTO `reviews` VALUES (53, 10, 61, 5, '啊实打实的', '2024-04-03 16:41:09');
INSERT INTO `reviews` VALUES (54, 10, 63, 3, '阿大撒大撒', '2024-04-03 16:41:12');
INSERT INTO `reviews` VALUES (55, 10, 64, 5, '解开了', '2024-04-03 16:41:29');
INSERT INTO `reviews` VALUES (56, 10, 65, 4, '敬礼敬礼', '2024-04-03 16:41:33');
INSERT INTO `reviews` VALUES (57, 10, 66, 1, '尽快了解了', '2024-04-03 16:41:36');
INSERT INTO `reviews` VALUES (58, 10, 67, 3, '敬礼敬礼', '2024-04-03 16:41:39');
INSERT INTO `reviews` VALUES (59, 10, 72, 5, 'jljlj', '2024-04-03 16:41:42');
INSERT INTO `reviews` VALUES (60, 10, 69, 4, '交流交流距离', '2024-04-03 16:41:47');
INSERT INTO `reviews` VALUES (61, 10, 75, 4, '聚了聚看了', '2024-04-03 16:41:52');
INSERT INTO `reviews` VALUES (62, 7, 59, 5, '胜多负少', '2024-04-03 16:42:43');
INSERT INTO `reviews` VALUES (63, 7, 60, 5, 'sdfs', '2024-04-03 16:42:46');
INSERT INTO `reviews` VALUES (64, 7, 61, 2, 'sdfsd', '2024-04-03 16:42:49');
INSERT INTO `reviews` VALUES (65, 7, 62, 5, '是否收到f', '2024-04-03 16:42:53');
INSERT INTO `reviews` VALUES (66, 7, 63, 3, '胜多负少地方', '2024-04-03 16:42:56');
INSERT INTO `reviews` VALUES (67, 7, 64, 1, '十分士大夫', '2024-04-03 16:42:59');
INSERT INTO `reviews` VALUES (68, 7, 65, 3, '发射点士大夫士大夫', '2024-04-03 16:43:03');
INSERT INTO `reviews` VALUES (69, 7, 66, 5, '胜多负少地方', '2024-04-03 16:43:05');
INSERT INTO `reviews` VALUES (70, 7, 67, 5, '十分士大夫', '2024-04-03 16:43:09');
INSERT INTO `reviews` VALUES (71, 7, 68, 3, '士大夫胜多负少', '2024-04-03 16:43:12');
INSERT INTO `reviews` VALUES (72, 7, 69, 4, '十分士大夫', '2024-04-03 16:43:15');
INSERT INTO `reviews` VALUES (73, 7, 72, 5, '十分士大夫士大夫十分', '2024-04-03 16:43:18');
INSERT INTO `reviews` VALUES (74, 10, 60, 4, 'f士大夫', '2024-04-03 16:43:27');
INSERT INTO `reviews` VALUES (75, 10, 62, 5, '胜多负少地方', '2024-04-03 16:43:29');
INSERT INTO `reviews` VALUES (76, 10, 61, 1, '发士大夫士大夫', '2024-04-03 16:43:33');
INSERT INTO `reviews` VALUES (77, 10, 63, 5, '胜多负少地方', '2024-04-03 16:43:36');
INSERT INTO `reviews` VALUES (78, 10, 64, 3, 'sdfdfs', '2024-04-03 16:43:39');
INSERT INTO `reviews` VALUES (79, 10, 65, 4, '胜多负少地方', '2024-04-03 16:43:41');
INSERT INTO `reviews` VALUES (80, 10, 66, 5, '胜多负少地方', '2024-04-03 16:43:44');
INSERT INTO `reviews` VALUES (81, 10, 67, 1, '胜多负少地方', '2024-04-03 16:43:47');
INSERT INTO `reviews` VALUES (82, 10, 72, 4, '胜多负少地方', '2024-04-03 16:43:50');
INSERT INTO `reviews` VALUES (83, 10, 69, 4, '撒旦发射点', '2024-04-03 16:43:55');
INSERT INTO `reviews` VALUES (84, 10, 75, 4, '胜多负少发送', '2024-04-03 16:44:02');
INSERT INTO `reviews` VALUES (85, 7, 59, 3, '好吃', '2024-05-24 08:01:33');
INSERT INTO `reviews` VALUES (86, 7, 59, 3, '好吃', '2024-05-24 08:06:43');
INSERT INTO `reviews` VALUES (87, 7, 59, 3, '', '2024-05-24 08:18:43');
INSERT INTO `reviews` VALUES (88, 7, 72, 3, '黄不拉几的', '2024-05-24 21:21:33');
INSERT INTO `reviews` VALUES (89, 7, 60, 4, '挺好的', '2024-05-24 21:21:56');
INSERT INTO `reviews` VALUES (90, 7, 59, 3, '嘿嘿', '2024-05-24 21:22:05');
INSERT INTO `reviews` VALUES (91, 7, 74, 4, '速度', '2024-05-24 21:22:13');
INSERT INTO `reviews` VALUES (92, 7, 59, 4, '方法对付', '2024-05-24 21:22:31');
INSERT INTO `reviews` VALUES (93, 7, 64, 5, '啊发的发放', '2024-05-24 21:22:40');
INSERT INTO `reviews` VALUES (94, 7, 72, 1, '不好', '2024-05-24 21:22:53');
INSERT INTO `reviews` VALUES (95, 7, 59, 2, '不哈', '2024-05-24 21:23:06');
INSERT INTO `reviews` VALUES (96, 7, 59, 4, '去问问请问', '2024-05-24 21:23:14');
INSERT INTO `reviews` VALUES (97, 7, 59, 4, 'wqe', '2024-05-24 21:23:22');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '密码',
  `sex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '性别',
  `age` int(10) DEFAULT NULL COMMENT '年龄',
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '昵称(网名)',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '地址',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '手机号码',
  `user_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户头像',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '邮箱',
  `user_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户创建日期',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'wangd', 'wangd123', '男', 18, '小可爱', NULL, '12465789415', NULL, '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (2, 'wangs', '$2a$10$7wYOw.AgyZiRA7cImD53lulP23ZM4uPiBU5gFXKjU4/n0K4SfZwMu', NULL, NULL, '雏鹰', NULL, '12465789415', NULL, '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (3, 'wang', '$2a$10$SzHn/aVSrwKsEdy8nFIBqOnfjEdW9dISsX4Lqir/gEgmiugjemwh6', NULL, NULL, '红烧虾', NULL, '12465789415', NULL, '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (4, 'heis', '$2a$10$9k6birCxcv587.piUsmhoOhR9ldq6hgXpTt5f/tT7kJ1X1IV9Ga3O', NULL, NULL, '大驴子', NULL, '12465789415', NULL, '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (5, 'liujie', '$2a$10$gUXdZ5j0IqvndwDLYfjMxOtSlITiJkvoESx5gASIegwCYLvkWvsT2', NULL, NULL, '可爱名', NULL, '12465789415', NULL, '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (6, 'swk', '$2a$10$JoDznotwSPSwFeKurHwSDezKeF4NsduV68nn2rePVPNqmKW4mXx4C', '男', 23, '铠甲勇士', NULL, '12465789415', '', 'kaijiayongshi@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (7, 'xiaoxiao', '$2a$10$8TtL893U1rgy7at/Rgm1qeItbmS.R15PwnrF8gkIKcRLgl0qscu3i', '女', 18, '工程师罗西', NULL, '10000644497', 'images\\1714371795453-a3tu6h.jpeg', '1234567898@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (8, 'kaikai', '$2a$10$AhUI9TPEXiszU6BiApj1euNBoDFv3mTN9uTwcg.ecM8Vegwx6kVbe', NULL, NULL, '鱼香肉丝', NULL, '12465789415', '', '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (9, 'jiejie', '$2a$10$ms9rTzFIMKm6pOsmfDHyYepz21KxyTdWKwUScPAhaFchYdYLadzIK', NULL, NULL, '大猩猩', NULL, '12465789415', NULL, '12444469764@qq.com', '2024-03-17 18:28:45');
INSERT INTO `users` VALUES (10, 'hwn', '$2a$10$xas25eTCIJIOhTUmCS7QJuaNasofAVNv.rJQpBEBbsk.mMMREQ3Om', '女', 23, 'aaa', NULL, '16479334567', NULL, '3469996434@qq.com', '2024-04-03 14:20:53');

SET FOREIGN_KEY_CHECKS = 1;
