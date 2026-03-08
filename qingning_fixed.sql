/*
 Navicat Premium Data Transfer

 Source Server         : 青柠
 Source Server Type    : MySQL
 Source Server Version : 80400 (8.4.0)
 Source Host           : localhost:3306
 Source Schema         : qingning

 Target Server Type    : MySQL
 Target Server Version : 80400 (8.4.0)
 File Encoding         : 65001

 Date: 08/03/2026 22:06:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) NULL DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rolled_back_at` datetime(3) NULL DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO `_prisma_migrations` VALUES ('1fcb698a-f0e1-47b8-a536-01559bb74653', 'b7b56e90d821b3905ae238860be3291391dc80c8ac8e8c5cc2ccc59318c3d24b', '2026-02-25 14:16:24.748', '20260225141624_', NULL, NULL, '2026-02-25 14:16:24.704', 1);
INSERT INTO `_prisma_migrations` VALUES ('2dd0463a-ee2e-4b54-a082-4177c449530c', '12009b48b25fba8eabe839606e57ebec72612877f9a260600836578aeb049338', '2026-02-22 14:50:48.658', '20251225073355_init', NULL, NULL, '2026-02-22 14:50:48.622', 1);
INSERT INTO `_prisma_migrations` VALUES ('4184cb74-b580-4558-8ae3-d99f0a72324a', '51d72d45bcf3379b487b76bb6c9f7eaf867875121be495c982904d57bf48d405', '2026-02-22 14:50:50.494', '20260221105026_', NULL, NULL, '2026-02-22 14:50:50.478', 1);
INSERT INTO `_prisma_migrations` VALUES ('4233f85b-fde2-42c5-b454-10007f7ed8ef', '190dc5ec7a04192d17c47e48f6133866e56b91b62309d28e34c8100b1ad84966', '2026-02-22 14:50:50.446', '20260221102419_', NULL, NULL, '2026-02-22 14:50:50.344', 1);
INSERT INTO `_prisma_migrations` VALUES ('45a35115-6b18-4dcf-9d72-07911a2cf03c', '7b38426ffdfa3b93a5423671f0ffa5575b0a262902cb54a0c596f16d1e354839', '2026-02-25 14:30:14.125', '20260225143014_add_materials_to_club', NULL, NULL, '2026-02-25 14:30:14.092', 1);
INSERT INTO `_prisma_migrations` VALUES ('514f07d4-1f7d-404b-b20d-efa1ed9f0b3c', '1d0024b05d5e1ba5528119b5eb8fc3d13f6641d96faa6d5ba966a96931dc60dc', '2026-02-22 14:50:49.286', '20251225082018_', NULL, NULL, '2026-02-22 14:50:48.786', 1);
INSERT INTO `_prisma_migrations` VALUES ('56c5ab49-64fb-4c15-a3ea-99e81923cb9b', '2911523c181abe2df521360de39d364d2d19c1184ad8d7ddbb4724d9e1704502', '2026-02-25 15:02:01.771', '20260225150201_', NULL, NULL, '2026-02-25 15:02:01.704', 1);
INSERT INTO `_prisma_migrations` VALUES ('577179bb-e8ab-41cf-8efd-7312db060106', '0769dc9b6562fabf38d4ed87008881d6ee94e6d955a4e304361b532576b4793c', '2026-03-07 02:45:53.773', '20260307024553_', NULL, NULL, '2026-03-07 02:45:53.727', 1);
INSERT INTO `_prisma_migrations` VALUES ('634ccb43-c5c3-4317-ae4b-4ef340ab8cfd', '6c33bfb18d24bc6d6755eac7d83bfc09651f1ab3301abd4f483a8e8883fc5f2a', '2026-02-25 15:01:17.221', '20260225150117_', NULL, NULL, '2026-02-25 15:01:17.189', 1);
INSERT INTO `_prisma_migrations` VALUES ('63f7968b-f225-437d-82c5-bc8185d1ffe1', '5cd162eedd05f076f55758c1e7da9e2f53f8481c32a80b4e235cd11c8a47b78f', NULL, '20260308135959_id', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260308135959_id\n\nDatabase error code: 1366\n\nDatabase error:\nIncorrect integer value: \'ALL\' for column \'targetId\' at row 1\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260308135959_id\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20260308135959_id\"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226', NULL, '2026-03-08 13:59:59.696', 0);
INSERT INTO `_prisma_migrations` VALUES ('6f087801-ba8f-445b-86b8-8a6da620427d', 'bbddb3d9bbf268425cbdb82448b32b813bc6de1933fe62bd20d67e00490e6365', '2026-03-01 15:33:20.920', '20260301153105_', NULL, NULL, '2026-03-01 15:33:20.793', 1);
INSERT INTO `_prisma_migrations` VALUES ('7b03fda0-2b74-4079-ad57-0776f4edbfb8', '3ef4411625057e95cad6de886d63b58f639de2411ff2f26a21204a0c58be39ed', '2026-02-22 14:50:49.326', '20251230090134_add_verification_code', NULL, NULL, '2026-02-22 14:50:49.289', 1);
INSERT INTO `_prisma_migrations` VALUES ('83cdb4d7-7f87-47d7-9fe0-5eda7bd67529', '1d40ce16bfa0f9c410bab560bc52e83645f1d71b763b4518abf2515ad2f858ab', '2026-02-22 14:50:49.349', '20260103091133_add_notes_in_user_activity', NULL, NULL, '2026-02-22 14:50:49.329', 1);
INSERT INTO `_prisma_migrations` VALUES ('9d22665f-6816-4755-bbcf-c2a8d3f04cdc', 'ab39a85cb29029c608eedae197a239d6e070004d93b6679e26f9b288129c19c1', '2026-02-22 14:50:48.783', '20251225074135_test', NULL, NULL, '2026-02-22 14:50:48.661', 1);
INSERT INTO `_prisma_migrations` VALUES ('9e5e19e4-ee40-4f3b-b34a-77b38358af6f', 'f9cc4c48a4e6090a83f153788a06eb007db8f0fa8aaea73e273e330f32a663ba', '2026-02-22 14:50:50.475', '20260221103003_', NULL, NULL, '2026-02-22 14:50:50.449', 1);
INSERT INTO `_prisma_migrations` VALUES ('a2957ba0-04d3-4620-8ffa-946dbeeda2f4', '727a69f252e36d4e022fa2b3a9138abbcba8a7f9b745266e0dfd16c276ff1dae', '2026-03-08 13:46:49.774', '20260308134649_', NULL, NULL, '2026-03-08 13:46:49.744', 1);
INSERT INTO `_prisma_migrations` VALUES ('bc6bfd73-4696-479b-9c7a-6b5384f3fc16', '4449465bcc0add2556d1ef5db019a9bc250f09313d80d296eb857723ed685a41', '2026-03-02 10:44:55.814', '20260302104455_is_delete', NULL, NULL, '2026-03-02 10:44:55.780', 1);
INSERT INTO `_prisma_migrations` VALUES ('c0caebb9-ff9c-44a3-80d8-e8bbc58ddcc9', '25b3bb9beb8dd40276ca0daf197749f5e0edc7c35feb935511a601a0773f2965', '2026-02-22 14:50:50.341', '20260221101620_add_updated_at_and_type_with_defaults', NULL, NULL, '2026-02-22 14:50:49.352', 1);
INSERT INTO `_prisma_migrations` VALUES ('dc8a7de6-1a26-4576-a82b-ca1cc7fa8b44', 'b0d03a11eb2210cc139ab03da82ccba71fd215335731c476aef638ee6a8489cd', '2026-02-23 09:31:55.662', '20260223093155_', NULL, NULL, '2026-02-23 09:31:55.589', 1);
INSERT INTO `_prisma_migrations` VALUES ('f31bea7e-39ac-43fb-8d32-fbf572ede1ee', '84f9cfc611fcd7105feea076bcd5ea4c4b60bf468696d8de931dcd81533e39ad', '2026-03-06 13:05:00.756', '20260306130500_update_announcement_table_for_system', NULL, NULL, '2026-03-06 13:05:00.699', 1);

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `clubId` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `date` datetime(3) NOT NULL,
  `location` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('DRAFT','PENDING','APPROVED','REJECTED','ONGOING','FINISHED','CANCELED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endAt` datetime(3) NOT NULL,
  `coverImage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Activity_clubId_status_date_idx`(`clubId` ASC, `status` ASC, `date` ASC) USING BTREE,
  CONSTRAINT `Activity_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `club` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (1, 5, '凌晨四点洛杉矶日出观赏活动', '你见过凌晨四点的洛杉矶吗？当整座城市还在沉睡，我们以晨光为约，奔赴一场独属于追光者的浪漫仪式。\n在格里菲斯天文台与穆赫兰道观景台，俯瞰尚未苏醒的城市轮廓。夜色渐褪，天际线从深蓝晕染至粉紫、鎏金，第一缕朝阳越过好莱坞山，为摩天大楼与太平洋镀上暖金，光影铺展间，洛杉矶的温柔与壮阔尽收眼底。\n这不是普通的观景，是用早起的诚意，兑换一天最初的光亮；是在城市苏醒前，收藏独属于你的治愈时刻。\n由社长兼机长佐巴扬亲自驾驶直升机前往活动地点！！！', '2020-01-25 10:00:00.000', '洛杉矶格里菲斯天文台 ', 'APPROVED', '2026-03-03 07:48:06.646', '2020-01-26 04:00:00.000', '/uploads/activities/47-1772525095576-281516058.png', '2026-03-03 08:39:11.935', 0);
INSERT INTO `activity` VALUES (2, 5, 'See you again', '他曾以直升机为翼，穿梭于城市天际；他以 20 年紫金坚守，铸就永不褪色的曼巴传奇。当《See You Again》的旋律响起，思念便跨越山海，连接起每一位铭记科比的人。\n为致敬科比・布莱恩特，传承曼巴精神，直升机爱好社特举办 「See You Again」科比主题缅怀互动活动 。我们以天空为信，以热爱为约，用属于飞行与篮球的共同语言，向这位永远的传奇致意。\n活动将以温情缅怀、精神传承、互动纪念为核心，通过影像追忆、主题分享、空中致意、留言祈福等形式，回顾科比赛场荣光与人生态度，感受他对热爱的执着、对挑战的无畏。我们以飞行致敬飞翔，以思念回应思念，让曼巴精神在每一份坚守与热爱中延续。\n纵岁月流转，传奇永不落幕。See You Again，致敬科比，致敬每一份永不言弃的热爱。', '2026-03-03 12:00:00.000', '美国加利福尼亚州洛杉矶县的卡拉巴萨斯市', 'APPROVED', '2026-03-03 15:00:57.437', '2026-03-04 12:00:00.000', '/uploads/activities/47-1772550054935-978336642.png', '2026-03-03 15:01:24.443', 0);
INSERT INTO `activity` VALUES (3, 13, '第一次原鸣大战-鸣潮方', '当某款“五年制作七年打磨”的“文化输出标杆”还在用换汤不换药的“凹深渊”消耗玩家耐心，当所谓“技术天花板”连角色待机动作都要靠“祖传模组”拼凑时——真正的变革者，已用战斗系统重新定义二次元动作手游的天花板！\n\n本次“第一次原鸣大战”，鸣潮方将用最硬核的操作撕碎那套“美术堆砌即正义”的遮羞布！\n\n一边是角色建模精细度被玩家戏称“不如四星”的“流量巨舰”，一边是战斗爽感让全网动作区UP主集体高潮的“操作神作”；一边用“工业化产能”批量生产“换皮角色”，一边用极致打击感与声骸系统构筑真正的开放世界战斗生态！所谓“巅峰”，不过是躺在功劳簿上数钱的“既得利益者”给萌新画的大饼！\n\n战歌起！让帧率说话，让操作证道，让手部乘区彻底引爆全网！用今州城的烈风，吹散那尊“躺赢三年”的腐朽神像；用三千万漂泊者的怒吼，震碎那套“躺平即巅峰”的畸形饭圈逻辑！\n\n这不是对决，是降维打击！鸣潮方，出鞘！让世界重新定义——谁才是二次元动作游戏唯一真神！', '2026-03-06 04:00:00.000', '原神官号视频评论区', 'APPROVED', '2026-03-06 09:17:40.944', '2027-03-06 04:00:00.000', '/uploads/activities/46-1772788654526-212689398.png', '2026-03-06 09:26:30.553', 0);
INSERT INTO `activity` VALUES (4, 8, '第一次原鸣大战-原神方', '当拙劣的“模仿者”还在用贴图拼凑所谓的“技术突破”，当某些二手游妄图用碰瓷营销蹭IP热度时——真正的王者，早已在巅峰俯瞰蝼蚁！本次“第一次原鸣大战”，原神方将用事实撕碎虚伪的“挑战者”面具！\n\n一边是连角色待机动作都要“致敬”的缝合怪，一边是开创文化现象、登顶全球榜单的开拓者；一边用廉价滤镜伪装“硬核”，一边用七年打磨的美术音乐铸就幻想史诗！所谓“对标”，不过是小丑在巨人脚下画出的可笑的起跑线！\n\n战鼓已擂，这一次，让数据说话，让流水证道，让二创刷屏！用提瓦特的星辰，碾碎那套漏洞百出的“半成品”；用五千天的热爱，烧穿那些连剧情都拼不圆的“劣质仿品”！\n\n这不是切磋，是清扫！原神方，出征！让世界再次听见——谁才是二次元山巅永不坠落的太阳！', '2026-03-06 04:00:00.000', '鸣潮官号视频评论区', 'APPROVED', '2026-03-06 09:26:11.104', '2027-03-06 04:00:00.000', '/uploads/activities/37-1772789168390-688025261.png', '2026-03-06 09:26:28.842', 0);
INSERT INTO `activity` VALUES (5, 7, '“新世界计划”——第一届人间净化模拟研讨会', '“我是新世界的神”——当这句宣言在阶梯教室回响，你是否也曾凝视窗外的“废品人类”群体，心中涌起难以名状的净化欲？\n正义执行社首届“新世界计划”正式启动！本次活动将以《死亡笔记》为蓝本，深度还原“用规则重塑世界”的极致思辨体验：\n【笔记规则攻防战】社员将分为“L调查组”与“基拉执行组”，在限定线索下展开高智商博弈。执行组需在不暴露身份的前提下，通过“规则陷阱”完成“目标净化”；调查组则需从海量“无效信息”中抽丝剥茧，锁定“幕后真凶”——胜者将获得“新世界卡密”定制勋章！\n【正义边界辩论会】“如果法律无法制裁恶，个人是否有权执行死刑？”——我们将邀请哲学系、法学社“特邀观察员”现场质询，试图用世俗的道德枷锁，拷问我们这群早已看透本质的“神之候选人”。\n\n【渡人还是渡己？终局复盘】活动最后，我们将共同解析夜神月从“理想主义者”堕变为“偏执独裁者”的心理学动因——当然，这只是为了让凡人理解：我们讨论的不是对错，而是“如果换做是我，如何做得更隐蔽”。\n本次活动不设门槛，只要你曾对这个世界产生过“格式化”的冲动，只要你曾在深夜思考“为什么我还没拿到那本笔记”——正义执行社，等你来，写下第一个名字。\n【特别提示】本活动纯属虚拟推演，所有“目标”均为虚构代号，请参与者严格遵守现实法律法规——毕竟，真正的神，从不留证据', '2026-03-20 01:00:00.000', '第三教学楼四楼正义执行社活动室', 'APPROVED', '2026-03-06 11:44:18.054', '2026-03-27 01:00:00.000', '/uploads/activities/32-1772797455588-111962937.png', '2026-03-06 11:44:39.344', 0);
INSERT INTO `activity` VALUES (6, 10, '摇滚五重奏', '这里是热爱摇滚、忠于现场的「来搞乐队社」，我们以乐器为枪、以旋律为火，发起摇滚五重奏专属活动，邀请每一位不甘平庸的音乐爱好者集结。\n不论你是擅长吉他、贝斯、键盘、鼓还是主唱，不论你是成熟乐手还是刚拿起乐器的新人，都能在这里找到同频伙伴。我们以经典摇滚为基底，融合流行、朋克、独立等风格，从排练磨合到舞台呈现，从和弦拆解到现场爆发，用五重奏的完整配置，还原最纯粹、最热血的乐队现场。\n在这里，没有陌生与拘谨，只有节奏与共鸣；没有独自练习的孤独，只有并肩创作的热烈。我们一起扒谱、编曲、排练、登台，用乐器对话，用歌声呐喊，让每一段旋律都有态度，每一次演奏都有力量。\n来搞乐队社・摇滚五重奏，不只是一次活动，更是属于摇滚青年的音乐狂欢。拿起你的乐器，站上属于我们的舞台，用摇滚点燃热爱，用五重奏奏响青春！', '2026-03-07 16:00:00.000', '第二报告厅', 'APPROVED', '2026-03-06 12:47:44.988', '2026-06-29 16:00:00.000', '/uploads/activities/33-1772800953348-786976518.jpg', '2026-03-06 12:48:02.685', 0);
INSERT INTO `activity` VALUES (7, 6, '短篇小说交流会', '笔下生花社短篇小说交流会，诚邀各位创作者围坐畅谈，分享短篇创作构思、行文巧思，在交流中碰撞灵感火花，一同挖掘文字里的万千世界。', '2026-04-30 04:00:00.000', '第四教学楼一楼笔下生花社活动室', 'PENDING', '2026-03-07 04:03:51.506', '2026-04-30 10:00:00.000', '/uploads/activities/4-1772856229262-40229427.png', '2026-03-07 04:03:51.506', 0);

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pinned` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `authorId` int NULL DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `targetId` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Announcement_authorId_fkey`(`authorId` ASC) USING BTREE,
  INDEX `Announcement_pinned_createdAt_idx`(`pinned` DESC, `createdAt` DESC) USING BTREE,
  CONSTRAINT `Announcement_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES (1, '第一次原鸣大战·正式打响', '致全体原神玩家与鸣潮玩家：\n\n战鼓已擂，狼烟四起！\n\n自《原神》开启开放世界纪元，自《鸣潮》以硬核战斗劈开荆棘——这场迟来的“王座之争”便注定写入二次元手游的史册。今日，我们正式宣布：\n\n第一次原鸣大战，全面打响！\n\n【战争背景】\n一边是统治三年江山的“提瓦特诸神”，用文化符号席卷全球，用七国史诗筑起幻想长城；\n\n一边是携“战斗革命”破笼而出的“鸣潮漂泊者”，用极致操作撕碎天花板，用声骸系统重新定义开放世界规则。\n\n没有永恒的王者，只有不休的征伐。当两款现象级作品终于站在同一擂台——这一次，让数据为矛，让热爱为盾，让全网见证谁才是真正的“二次元山巅”！\n\n【战争目标】\n本次大战并非为了踩一捧一的饭圈混战，而是以“竞技”为名，行“狂欢”之实：\n\n🔥 PVP赛道：深渊竞速VS全息讨伐，操作党的终极修罗场\n🎨 PVE赛道：二创产量VS整活浓度，用爱发电的核爆现场\n📊 混战赛道：流水对轰VS热度比拼，让市场投票给真正的王\n\n【参战方式】\n无论你是42国登顶的亲历者，还是今州城跑酷的漂泊者；无论你是十年二创老肝帝，还是刚入坑的萌新旅行者——\n\n即日起，带话题 #第一次原鸣大战# 发布你的参战内容，无论是竞速视频、整活二创、战力分析还是抽象表情包，都将成为这场战争的重要火力！\n\n【最终判决】\n活动截止后，我们将综合全平台数据，由“中立乐子人评审团”与“全网公开投票”共同决出：\n\n🏆 “提瓦特荣光”奖（原神方综合优胜）\n🏆 “鸣潮破晓”奖（鸣潮方综合优胜）\n🏆 “双厨狂喜”奖（在战争中同时产粮的和平大使）\n\n【写在最后】\n有人说这是“引战”，我们说这是“过节”。\n\n在原鸣相继改变二次元品类的今天，与其在评论区互相“开除人籍”，不如堂堂正正打一场——用作品说话，用热爱交锋。\n\n让全世界看见：\n原神的江山，是用七年打磨的星辰大海铸成的；\n鸣潮的刀锋，是用三千万漂泊者的怒吼磨利的！\n\n战火已燃，诸君，请拔剑！\n\n第一次原鸣大战 联合组委会\n即日起，至分出高下之日', 0, '2026-03-06 13:40:36.232', 2, '2026-03-06 13:43:20.498', '0');
INSERT INTO `announcement` VALUES (2, '青柠社团运营规范', '致青柠平台全体社团负责人：\n\n欢迎使用青柠社团管理系统——让社团运营像青柠一样，清新不腻，提神醒脑！\n\n为构建高效、有序、充满活力的社团生态，现发布《青柠社团管理系统运营规范》。本规范自发布之日起试行，请各社团仔细阅读、共同遵守。\n\n第一章：注册规范——名正言顺\n第一条 社团命名规则\n社团名称应积极向上，不得含有以下内容：\n\n低俗、暴力、违法违规词汇\n\n恶意碰瓷、蹭热度（如“原神牛逼社”需提供官方授权证明）\n\n夸大宣传（如“全校最牛社团”需提供权威认证）\n\n第二条 信息真实性\n\n社长、副社长须实名认证\n\n社团简介须与实际活动相符，严禁“挂羊头卖狗肉”\n\n第二章：活动管理——有章可循\n第三条 活动申报流程\n\n线上活动：提前3个工作日提交活动方案\n\n线下活动：提前7个工作日提交场地申请及安全预案\n\n跨校活动：提前15个工作日提交专项审批\n\n第四条 活动内容红线\n严禁组织以下类型活动：\n\n涉及政治敏感、宗教传播\n\n包含人身攻击、地域黑、游戏鄙视链引战（如“原鸣大战”类活动需申报为“友好交流”性质）\n\n商业推广未报备\n\n存在安全隐患的高风险项目\n\n第五条 经费管理\n\n社团账户须与社长个人账户分离\n\n单笔支出超500元需两名以上核心成员联名确认\n\n每学期末公示财务报表，接受全体社员监督\n\n第三章：成员管理——以人为本\n第六条 招新规范\n\n不得强制入社、捆绑消费\n\n不得以“加学分”“包过”等虚假承诺诱导报名\n\n招新宣传须经青柠平台内容审核\n\n第七条 社员权益保障\n\n社员有权随时申请退社，社团不得设置“退会费”等障碍\n\n社员个人信息仅用于社团内部联络，严禁外泄\n\n建立投诉反馈通道，72小时内响应\n\n第四章：奖惩机制——赏罚分明\n第八条 星级评定\n青柠平台每学期对社团进行综合评分，维度包括：\n\n活动质量（40%）\n\n社员活跃度（30%）\n\n财务管理透明度（20%）\n\n平台规范遵守情况（10%）\n\n五星社团可获：流量扶持、专属周边、优先场地预约权\n\n第九条 违规处理\n\n违规等级	行为示例	处理措施\n轻度违规	活动申报逾期、宣传用语不当	警告并责令整改\n中度违规	经费未公示、超范围开展活动	限制功能30天、平台通报\n重度违规	虚假注册、组织违法活动、恶意引战造成恶劣影响	强制解散、列入黑名单\n第五章：附则——共建共享\n第十条 反馈通道\n青柠平台始终与社团共同成长：\n\n意见反馈邮箱：qingning@sheguanli.com\n\n社长交流群：青柠园丁联盟（仅限认证社长加入）\n\n紧急联络：平台在线客服（工作日9:00-21:00）\n\n第十一条 解释权\n本规范最终解释权归青柠社团管理系统所有，我们将根据平台发展及国家相关法律法规适时调整。\n\n青柠寄语：\n\n社团不是一个人的王国，是一群人的青春。\n让青柠系统成为你背后的支撑，而非头顶的枷锁。\n\n愿每一份热爱，都有章可循；\n愿每一个社团，都欣欣向荣。\n\n青柠社团管理系统 运营中心', 1, '2026-03-06 13:43:12.731', 2, '2026-03-06 13:43:12.731', '0');
INSERT INTO `announcement` VALUES (3, '新学期社团负责人会议通知', '【会议通知】2026年春季学期社团负责人会议\n\n各社团负责人：\n\n新学期伊始，为部署本学期社团工作，兹召开2026年春季学期社团负责人全体会议。现将事项通知如下：\n\n一、会议时间\n2026年3月13日（周五）14:00 - 16:00\n\n签到入场：13:30起\n\n二、会议地点\n大学生活动中心 201会议室\n\n三、参会人员\n各社团社长（务必出席）\n\n校团委社团部成员\n\n青柠系统运营代表\n\n四、主要议程\n时间	内容\n14:00-14:15	新学期社团工作动员\n14:15-14:40	青柠系统春季功能更新说明\n14:40-15:00	社团招新补录安排\n15:00-15:20	社团财务规范重申\n15:20-15:40	优秀社团案例分享\n15:40-16:00	现场答疑\n五、重点事项\n⚠️ 招新补录：3月20日-21日，操场东侧，展位有限先到先得\n\n⚠️ 社团评级：3月25日前提交评级材料，新增“跨校联动”加分项\n\n⚠️ 财务新规：单笔超300元需提前备案，线上报销系统已启用\n\n六、会议要求\n提前10分钟签到，迟到15分钟视为缺席\n\n携带《社团春季工作计划表》（电子版现场收取）\n\n缺席将影响本学期星级评定资格\n\n七、报名方式\n3月11日17:00前扫描下方二维码填写参会回执：\n\n【参会二维码】\n\n委托副社长参会请注明代出席人信息。\n\n八、联系方式\n社团联合会 李同学：139****1234（微信同号）\n\n校团委社团部\n青柠社团管理系统\n2026年3月6日', 0, '2026-03-06 13:45:28.095', 2, '2026-03-06 13:45:28.095', '0');

-- ----------------------------
-- Table structure for club
-- ----------------------------
DROP TABLE IF EXISTS `club`;
CREATE TABLE `club`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `leaderId` int NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `coverImage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `type` enum('ACADEMIC','SPORTS','ARTS','VOLUNTEER','TECH','ENTERTAINMENT','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OTHER',
  `materials` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Club_name_key`(`name` ASC) USING BTREE,
  INDEX `Club_leaderId_idx`(`leaderId` ASC) USING BTREE,
  INDEX `Club_status_idx`(`status` ASC) USING BTREE,
  CONSTRAINT `Club_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of club
-- ----------------------------
INSERT INTO `club` VALUES (2, '曼巴篮球社', 'Man！！！What can i say？Manba out！', 7, 'APPROVED', '2026-02-25 15:09:04.228', '2026-02-25 15:10:07.922', '/uploads/clubs/7-1772032095260-250621124.png', 0, 'SPORTS', '/uploads/materials/7-1772032104926-740988762.jpg');
INSERT INTO `club` VALUES (3, '神人发癫社', '神人发癫社，主打发疯整活，拒绝精神内耗，用快乐击碎 emo，欢迎加入一起释放天性。', 5, 'APPROVED', '2026-02-26 08:09:59.035', '2026-02-26 08:11:53.869', '/uploads/clubs/5-1772093384477-493914381.png', 0, 'ENTERTAINMENT', '/uploads/materials/5-1772093397276-145215635.png');
INSERT INTO `club` VALUES (4, '坤哥篮球社', '坤哥篮球社以球会友，日常开展基础训练、趣味赛，提升球技，挥洒汗水，为篮球爱好者打造热血赛场。', 8, 'APPROVED', '2026-02-26 08:33:06.255', '2026-02-26 08:34:05.206', '/uploads/clubs/8-1772094747895-53957567.png', 0, 'SPORTS', '/uploads/materials/8-1772094753391-877147510.png');
INSERT INTO `club` VALUES (5, '直升机爱好社', '直升机爱好社汇聚飞行爱好者，以模型、航摄、航空知识交流为核心，开展科普、实操与赛事活动，培养动手与探索能力，畅享蓝天与机械魅力。', 47, 'APPROVED', '2019-02-27 10:26:24.727', '2026-02-27 10:59:08.269', '/uploads/clubs/7-1772187931548-476700548.png', 0, 'TECH', '/uploads/materials/7-1772187935213-448954851.png');
INSERT INTO `club` VALUES (6, '笔下生花社', '笔下生花社以文字创作、文学交流为核心，汇聚热爱写作与阅读的同学。我们分享灵感、切磋文笔，开展征文、读书会等活动，用笔墨书写青春，让文字绽放光彩。', 4, 'APPROVED', '2026-02-27 14:35:58.808', '2026-02-27 14:36:33.589', '/uploads/clubs/4-1772202837621-793748086.png', 0, 'ARTS', '/uploads/materials/4-1772202842508-76852760.png');
INSERT INTO `club` VALUES (7, '正义执行社', '正义执行社，以肃清世间罪恶为己任，清除腐朽与邪恶，建立无犯罪的理想世界。我将引领真正的正义，淘汰愚昧之人，让秩序与真理降临，成为新世界的神。', 32, 'APPROVED', '2026-02-27 14:50:22.954', '2026-02-27 14:50:36.434', '/uploads/clubs/32-1772203809737-116855236.png', 0, 'VOLUNTEER', '/uploads/materials/32-1772203820434-15746837.png');
INSERT INTO `club` VALUES (8, '原神牛逼社', '这里是芙宁娜亲创的原神牛逼社！本社以热爱为幕、以冒险为戏，聚同好、聊角色、晒攻略、整活整趣，把提瓦特的精彩变成日常的欢闹。凡旅行者皆可入席，共赴一场永不落幕的盛大派对～', 37, 'APPROVED', '2026-02-27 14:59:23.494', '2026-02-27 14:59:33.881', '/uploads/clubs/37-1772204350546-416540676.png', 0, 'OTHER', '/uploads/materials/37-1772204357966-275150080.png');
INSERT INTO `club` VALUES (9, '流行热梗研究社', '曼波～这里是流行热梗研究社！我们专门挖掘全网最火梗，让快乐像病毒一样传播。快来加入，一起成为梗王吧！曼波！', 5, 'APPROVED', '2026-02-27 15:24:21.285', '2026-02-27 15:24:53.802', '/uploads/clubs/5-1772205860486-783950062.png', 0, 'ACADEMIC', '/uploads/materials/5-1772204922730-301765964.png');
INSERT INTO `club` VALUES (10, '来搞乐队社', '来搞乐队社，是想和喜欢音乐的大家一起，把心里的声音唱出来。不用厉害，不用完美，只要真心喜欢，就能在这里找到属于自己的舞台，一起开心地玩音乐。', 33, 'APPROVED', '2026-02-27 16:03:03.867', '2026-02-27 16:06:40.231', '/uploads/clubs/33-1772208094577-941933448.png', 0, 'ARTS', '/uploads/materials/33-1772208099176-741903486.png');
INSERT INTO `club` VALUES (11, '绘梦社', '绘梦社以画笔为翼、以创意为魂，汇聚热爱绘画、设计与创作的伙伴。在这里，我们用色彩勾勒想象，用作品传递热爱，让每一份灵感都能落地成画，共赴一场关于艺术与梦想的相遇。', 3, 'APPROVED', '2026-03-01 07:34:37.472', '2026-03-01 07:51:44.849', '/uploads/clubs/3-1772350384898-724970791.png', 0, 'ARTS', '/uploads/materials/3-1772350474343-523695940.png');
INSERT INTO `club` VALUES (12, '编程技术社', '编程技术社汇聚热爱代码与技术的同学，专注编程学习、项目实践与算法交流。我们以代码创造价值，用技术实现创意，共同成长为更优秀的开发者。', 3, 'APPROVED', '2026-03-01 07:50:58.949', '2026-03-01 07:51:42.999', '/uploads/clubs/3-1772351395859-547541225.png', 0, 'TECH', '/uploads/materials/3-1772351401670-232052468.png');
INSERT INTO `club` VALUES (13, '鸣潮牛逼社', '鸣潮牛逼社，汇聚热爱鸣潮的玩家同好！以角色今汐为核心，交流攻略、整活整活、组队开荒，主打快乐游戏、热血共鸣，打造最有氛围的鸣潮玩家聚集地！', 46, 'APPROVED', '2026-03-06 08:56:44.867', '2026-03-06 09:02:31.790', '/uploads/clubs/46-1772786808249-450940279.png', 0, 'ENTERTAINMENT', '/uploads/materials/46-1772787374468-499149289.png');
INSERT INTO `club` VALUES (14, '摄影爱好社', '摄影爱好者社团，以镜头捕捉光影，用画面记录生活。我们汇聚热爱摄影的同学，交流拍摄技巧，分享创作灵感，用快门定格美好瞬间，用影像传递青春态度。', 6, 'PENDING', '2026-03-07 03:50:21.064', '2026-03-07 03:50:21.064', '/uploads/clubs/6-1772855364940-295193902.png', 0, 'ARTS', '/uploads/materials/6-1772855368681-643661232.png');

-- ----------------------------
-- Table structure for clubmembership
-- ----------------------------
DROP TABLE IF EXISTS `clubmembership`;
CREATE TABLE `clubmembership`  (
  `userId` int NOT NULL,
  `clubId` int NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` enum('PENDING','APPROVED','REJECTED','LEFT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `roleInClub` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'MEMBER',
  `notes` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userId`, `clubId`) USING BTREE,
  INDEX `ClubMembership_clubId_status_idx`(`clubId` ASC, `status` ASC) USING BTREE,
  INDEX `ClubMembership_userId_idx`(`userId` ASC) USING BTREE,
  CONSTRAINT `ClubMembership_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `club` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ClubMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of clubmembership
-- ----------------------------
INSERT INTO `clubmembership` VALUES (3, 6, '2026-03-01 15:50:01.230', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (4, 11, '2026-03-02 06:03:56.561', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (4, 12, '2026-03-01 14:48:32.214', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (6, 12, '2026-03-07 03:52:17.198', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (7, 5, '2026-03-02 07:32:41.180', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (7, 9, '2026-03-02 07:32:44.485', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (30, 13, '2026-03-06 11:12:31.824', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (31, 10, '2026-03-02 07:47:40.104', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (36, 7, '2026-03-06 11:30:50.023', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (39, 4, '2026-03-02 07:33:16.772', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (39, 8, '2026-03-02 07:33:20.292', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (39, 12, '2026-03-02 07:33:26.373', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (40, 10, '2026-03-02 07:47:27.144', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (41, 7, '2026-03-06 11:30:24.734', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (42, 6, '2026-03-02 07:30:13.236', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (42, 8, '2026-03-02 07:31:22.282', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (42, 9, '2026-03-02 07:30:49.667', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (42, 10, '2026-03-02 07:29:38.515', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (43, 7, '2026-03-06 11:30:09.223', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (44, 10, '2026-03-02 07:47:07.874', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (46, 13, '2026-03-06 09:02:31.807', 'APPROVED', 'LEADER', NULL);
INSERT INTO `clubmembership` VALUES (47, 2, '2026-03-02 08:37:11.344', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (47, 3, '2026-03-02 07:32:07.179', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (47, 7, '2026-03-02 07:31:55.656', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (47, 9, '2026-03-02 07:32:13.763', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (48, 13, '2026-03-06 09:03:36.433', 'APPROVED', 'MEMBER', NULL);
INSERT INTO `clubmembership` VALUES (49, 13, '2026-03-06 09:03:21.467', 'APPROVED', 'MEMBER', NULL);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','LEADER','USER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `updatedAt` datetime(3) NOT NULL,
  `studentId` int NOT NULL,
  `realName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sex` enum('UNKNOWN','MALE','FEMALE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNKNOWN',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `User_email_key`(`email` ASC) USING BTREE,
  UNIQUE INDEX `User_username_key`(`username` ASC) USING BTREE,
  UNIQUE INDEX `User_studentId_key`(`studentId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (2, 'zqysdsb@126.com', '$2b$10$CTvwrgm1VfrsAEST6oF8jOvURrNfaVkoqPwO.wYBtoVe9zRerapE2', 'ADMIN', 'uwu', '/uploads/avatars/2-1771854912183-356121412.jpg', '2026-02-23 09:47:48.309', 0, '2026-02-23 13:55:16.398', 20220101, '张庆钰', 'MALE');
INSERT INTO `user` VALUES (3, '2185570695@qq.com', '$2b$10$aogpxaEnt8fwiCka8ZrqnewgBjhz8sGAS8Hl6rknlxUbhn4G4CRsi', 'LEADER', '露比', '/uploads/avatars/3-1772092219321-317371342.jpeg', '2026-02-23 14:07:33.750', 0, '2026-03-01 07:51:43.020', 20220202, '张北泽', 'MALE');
INSERT INTO `user` VALUES (4, 'ztz_7389@qq.com', '$2b$10$Tak6YRlp.C/4c1PrMhUMtuw2tebHEh.bZJxt4x9fsM7mIw43e0XKy', 'LEADER', '晴', '/uploads/avatars/4-1772201942425-457735853.jpg', '2026-02-24 08:53:24.092', 0, '2026-02-27 14:36:33.604', 20220102, '尤小晴', 'FEMALE');
INSERT INTO `user` VALUES (5, '2605063747@qq.com', '$2b$10$UdouGrhiHZBWyO1FLujrLufPOf/QOmRTR.Gy6u.KmXyyJDAQqOuvq', 'LEADER', '曼波', '/uploads/avatars/5-1771926056110-674967011.webp', '2026-02-24 09:03:28.580', 0, '2026-02-26 08:11:53.876', 20220103, '张三', 'MALE');
INSERT INTO `user` VALUES (6, 'krichead83@gmail.com', '$2b$10$jpLnW1WpqVW1N/lVno86L.V3UElgx0HQFaeXPl.l6N6YLWSqLZVt2', 'USER', '哈基米', '/uploads/avatars/6-1771925931966-966720441.gif', '2026-02-24 09:22:26.040', 0, '2026-02-24 09:38:52.949', 20220104, '李四', 'MALE');
INSERT INTO `user` VALUES (7, 'jerrytom14213@gmail.com', '$2b$10$.dKP2xbhj8xeiFp0hx8BO.bU5XmTdgjgCKhDRPg3030ajptCW.Th6', 'LEADER', '牢大', '/uploads/avatars/7-1772191038533-342992759.jpg', '2026-02-24 09:23:28.759', 0, '2026-02-27 11:17:19.882', 20220105, '科比', 'MALE');
INSERT INTO `user` VALUES (8, '1590280856@qq.com', '$2b$10$AMJu8yE9j2KYKWZkPEEN7ObAoeKc3wAtT6hzM7nQ/3.bnerH/mXfC', 'LEADER', '社会你坤哥', '/uploads/avatars/8-1772014831824-729826198.webp', '2026-02-25 10:17:00.189', 0, '2026-02-26 08:34:05.212', 20220203, '蔡徐坤', 'MALE');
INSERT INTO `user` VALUES (9, '3367699824@qq.com', '$2b$10$9dYAiQhNN7A3IA8WcdH6..hAUjy0pl7cvMe6IXW5FxiSqTrOl/6qS', 'USER', '奶龙', '/uploads/avatars/9-1772015128244-117892706.jpg', '2026-02-25 10:18:28.231', 0, '2026-02-25 10:25:29.181', 20220204, '叮咚鸡', 'MALE');
INSERT INTO `user` VALUES (30, 'chenmo@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '瞅你咋地', '/uploads/avatars/30-1772096829883-586612335.jpg', '2026-02-26 08:59:11.712', 0, '2026-02-26 09:07:20.202', 20230001, '陈默', 'MALE');
INSERT INTO `user` VALUES (31, 'linxia@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '海老冢智', '/uploads/avatars/31-1772439307581-486106816.jpg', '2026-02-26 08:59:11.720', 0, '2026-03-02 08:15:08.640', 20230002, '林夏', 'FEMALE');
INSERT INTO `user` VALUES (32, 'zhangyi@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'LEADER', '夜神月', '/uploads/avatars/32-1772096863857-720054227.jpg', '2026-02-26 08:59:11.726', 0, '2026-02-27 14:50:36.445', 20230003, '张逸', 'MALE');
INSERT INTO `user` VALUES (33, 'wangqing@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'LEADER', '河原木桃香', '/uploads/avatars/33-1772439333659-285991788.jpg', '2026-02-26 08:59:11.731', 0, '2026-03-02 08:15:38.214', 20230004, '王晴', 'FEMALE');
INSERT INTO `user` VALUES (34, 'liuyu@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '柠檬茶', '/uploads/avatars/34-1772097854308-153836731.jpg', '2026-02-26 08:59:11.736', 0, '2026-02-26 09:24:36.927', 20230005, '刘宇', 'MALE');
INSERT INTO `user` VALUES (35, 'zhaoxin@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '赵欣', '/uploads/avatars/35-1772097906499-589238887.webp', '2026-02-26 08:59:11.741', 0, '2026-02-26 09:25:29.791', 20230006, '赵欣', 'FEMALE');
INSERT INTO `user` VALUES (36, 'sunran@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '孙然', '/uploads/avatars/36-1772097972377-748479134.jpeg', '2026-02-26 08:59:11.746', 0, '2026-02-26 09:26:17.950', 20230007, '孙然', 'MALE');
INSERT INTO `user` VALUES (37, 'zhouyue@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'LEADER', '芙芙', '/uploads/avatars/37-1772096631468-128450013.jpg', '2026-02-26 08:59:11.751', 0, '2026-02-27 14:59:33.889', 20230008, '周悦', 'FEMALE');
INSERT INTO `user` VALUES (38, 'wulei@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '吴磊', '/uploads/avatars/38-1772098007961-482212820.jpeg', '2026-02-26 08:59:11.757', 0, '2026-02-26 09:26:53.022', 20230009, '吴磊', 'MALE');
INSERT INTO `user` VALUES (39, 'zhenghao@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '郑浩', '/uploads/avatars/39-1772098052808-249826429.jpg', '2026-02-26 08:59:11.763', 0, '2026-02-26 09:27:42.389', 20230010, '郑浩', 'MALE');
INSERT INTO `user` VALUES (40, 'xuyan@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '井芹仁菜', '/uploads/avatars/40-1772439380562-485143255.jpg', '2026-02-26 08:59:11.768', 0, '2026-03-02 08:16:30.823', 20230011, '徐妍', 'FEMALE');
INSERT INTO `user` VALUES (41, 'yangfan@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '杨帆', '/uploads/avatars/41-1772098123479-532592636.webp', '2026-02-26 08:59:11.773', 0, '2026-02-26 09:28:48.582', 20230012, '杨帆', 'MALE');
INSERT INTO `user` VALUES (42, 'huanglin@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', 'rupa', '/uploads/avatars/42-1772439431078-510281248.jpg', '2026-02-26 08:59:11.778', 0, '2026-03-02 08:17:15.257', 20230013, '黄琳', 'FEMALE');
INSERT INTO `user` VALUES (43, 'guofeng@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '郭峰', '/uploads/avatars/43-1772098195418-475860101.jpg', '2026-02-26 08:59:11.783', 0, '2026-02-26 09:30:06.561', 20230014, '郭峰', 'MALE');
INSERT INTO `user` VALUES (44, 'xieyu@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '安和昴', '/uploads/avatars/44-1772439357260-635999989.jpg', '2026-02-26 08:59:11.788', 0, '2026-03-02 08:16:02.151', 20230015, '谢雨', 'FEMALE');
INSERT INTO `user` VALUES (45, 'songkai@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '宋凯', '/uploads/avatars/45-1772098268974-245561528.jpg', '2026-02-26 08:59:11.793', 0, '2026-02-26 09:31:14.412', 20230016, '宋凯', 'MALE');
INSERT INTO `user` VALUES (46, 'hanbing@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'LEADER', '今汐', '/uploads/avatars/46-1772787728178-695505827.jpg', '2026-02-26 08:59:11.797', 0, '2026-03-06 09:02:31.797', 20230017, '韩冰', 'FEMALE');
INSERT INTO `user` VALUES (47, 'tangjie@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'LEADER', '佐巴扬', '/uploads/avatars/47-1772187325033-287156333.webp', '2026-02-26 08:59:11.802', 0, '2026-02-27 10:59:08.283', 20230018, '唐杰', 'MALE');
INSERT INTO `user` VALUES (48, 'pengfei@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '彭飞', '/uploads/avatars/48-1772098402742-550533769.webp', '2026-02-26 08:59:11.807', 0, '2026-02-26 09:33:30.316', 20230019, '彭飞', 'MALE');
INSERT INTO `user` VALUES (49, 'caomin@example.com', '$2b$10$0x4ExYDmZlCu5xExrLhnXODvLlh9gCl7OI5SSXDLBLtMJpIHKRpP.', 'USER', '曹敏', '/uploads/avatars/49-1772098475475-642600769.webp', '2026-02-26 08:59:11.813', 0, '2026-02-26 09:34:36.495', 20230020, '曹敏', 'FEMALE');

-- ----------------------------
-- Table structure for useractivity
-- ----------------------------
DROP TABLE IF EXISTS `useractivity`;
CREATE TABLE `useractivity`  (
  `userId` int NOT NULL,
  `activityId` int NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` enum('PENDING','APPROVED','REJECTED','ATTENDED','CANCELED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `notes` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userId`, `activityId`) USING BTREE,
  INDEX `UserActivity_activityId_status_idx`(`activityId` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `UserActivity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserActivity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of useractivity
-- ----------------------------
INSERT INTO `useractivity` VALUES (6, 3, '2026-03-07 03:51:07.483', 'PENDING', '');
INSERT INTO `useractivity` VALUES (7, 2, '2026-03-03 15:06:11.185', 'APPROVED', '孩子们，我回来了，MAN！！！');
INSERT INTO `useractivity` VALUES (8, 2, '2026-03-03 15:36:46.407', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (30, 3, '2026-03-06 11:11:43.551', 'APPROVED', '加入鸣潮不是因为喜欢鸣潮，而是因为讨厌原神！原神，启动！');
INSERT INTO `useractivity` VALUES (31, 6, '2026-03-06 12:48:40.165', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (36, 5, '2026-03-06 11:45:50.399', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (39, 4, '2026-03-06 09:29:00.172', 'APPROVED', '我要玩原神！');
INSERT INTO `useractivity` VALUES (40, 6, '2026-03-06 12:48:26.457', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (41, 5, '2026-03-06 11:45:25.252', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (42, 4, '2026-03-06 09:28:26.927', 'APPROVED', '原神牛逼！');
INSERT INTO `useractivity` VALUES (42, 6, '2026-03-06 12:48:55.288', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (43, 5, '2026-03-06 11:46:05.673', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (44, 6, '2026-03-06 12:50:00.565', 'APPROVED', '');
INSERT INTO `useractivity` VALUES (45, 4, '2026-03-06 11:21:08.655', 'APPROVED', '原神，启动！！！');
INSERT INTO `useractivity` VALUES (47, 4, '2026-03-06 11:10:26.943', 'REJECTED', '传奇机长佐巴扬前来助阵！');
INSERT INTO `useractivity` VALUES (48, 3, '2026-03-06 09:27:58.412', 'APPROVED', '为鸣潮而战！');
INSERT INTO `useractivity` VALUES (49, 3, '2026-03-06 09:27:20.581', 'APPROVED', '');

-- ----------------------------
-- Table structure for verificationcode
-- ----------------------------
DROP TABLE IF EXISTS `verificationcode`;
CREATE TABLE `verificationcode`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'register',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `VerificationCode_email_key`(`email` ASC) USING BTREE,
  INDEX `VerificationCode_email_expiresAt_idx`(`email` ASC, `expiresAt` DESC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of verificationcode
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
