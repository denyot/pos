/*
Navicat MySQL Data Transfer

Source Server         : pos
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : g4demo

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2012-09-12 20:03:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `aig_assistant_status`
-- ----------------------------
DROP TABLE IF EXISTS `aig_assistant_status`;
CREATE TABLE `aig_assistant_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` char(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of aig_assistant_status
-- ----------------------------
INSERT INTO `aig_assistant_status` VALUES ('1', '在职');
INSERT INTO `aig_assistant_status` VALUES ('2', '离职');
INSERT INTO `aig_assistant_status` VALUES ('3', '调离');
INSERT INTO `aig_assistant_status` VALUES ('4', '调入');


/*
Navicat MySQL Data Transfer

Source Server         : pos
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : g4demo

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2012-09-12 20:03:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `aig_assistant_position`
-- ----------------------------
DROP TABLE IF EXISTS `aig_assistant_position`;
CREATE TABLE `aig_assistant_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `store_number` char(4) CHARACTER SET latin1 DEFAULT NULL,
  `degreename` varchar(20) NOT NULL COMMENT '职位名称',
  `remark` varchar(20) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COMMENT='营业员职位信息表';

-- ----------------------------
-- Records of aig_assistant_position
-- ----------------------------
INSERT INTO `aig_assistant_position` VALUES ('1', '01DL', '店长', '店长职位');
INSERT INTO `aig_assistant_position` VALUES ('2', '01DL', '后坊', '后坊职位');
INSERT INTO `aig_assistant_position` VALUES ('3', '01DL', '珠宝顾问', '珠宝顾问职位');
INSERT INTO `aig_assistant_position` VALUES ('4', '01DL', '资深顾问', '资深顾问职位');
INSERT INTO `aig_assistant_position` VALUES ('5', '01SZ', '营业员', '营业员');
INSERT INTO `aig_assistant_position` VALUES ('6', '1000', '售货员', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('7', 'SZ01', '售货员', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('8', 'WH01', '导购', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('9', 'WH01', '店长', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('10', 'SZ02', '柜长', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('11', 'SZ03', '店长', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('12', 'SZ03', '高经导购', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('13', 'SZ03', '导购', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('14', 'SZ03', '店长助理', '备注信息');
INSERT INTO `aig_assistant_position` VALUES ('16', 'WH01', '营业员', '营业员');


/*
Navicat MySQL Data Transfer

Source Server         : pos
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : g4demo

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2012-09-12 20:03:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `aig_assistant_info`
-- ----------------------------
DROP TABLE IF EXISTS `aig_assistant_info`;
CREATE TABLE `aig_assistant_info` (
  `assistantno` int(20) NOT NULL AUTO_INCREMENT,
  `store_number` char(5) CHARACTER SET latin1 DEFAULT NULL COMMENT '单位编号',
  `store_inital` char(5) NOT NULL DEFAULT '',
  `assistant_name` varchar(16) NOT NULL COMMENT '营业员',
  `telephone` varchar(20) DEFAULT NULL COMMENT '电话',
  `idno` varchar(18) DEFAULT NULL COMMENT '身份证号码',
  `position` char(5) CHARACTER SET latin1 DEFAULT NULL COMMENT '职位',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `rzsj` char(10) DEFAULT NULL,
  `lzsj` char(10) DEFAULT NULL,
  `status` int(1) DEFAULT '1',
  PRIMARY KEY (`assistantno`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COMMENT='营业员信息';

-- ----------------------------
-- Records of aig_assistant_info
-- ----------------------------
INSERT INTO `aig_assistant_info` VALUES ('1', '01DL', '01DL', 'CJ', '123456789', '2', '235465465', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('2', '01DL', '01DL', 'linda', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('3', '01DL', '01DL', '丹丹', null, '3', null, '2011-10-10', '', '1');
INSERT INTO `aig_assistant_info` VALUES ('4', '01DL', '01DL', '你好', '12312313', '3', '阿道夫撒旦法', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('5', '01DL', '01DL', '小巧玲珑', '13225648545', '1', '妹妹', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('6', '01DL', '01DL', '小红', '138265454', '1', '妈妈', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('7', '01DL', '01DL', '李梅', null, '3', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('8', '01DL', '01DL', '测试1', '13543701004', '1', '测试pos信息', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('9', '01DL', '01DL', '邱俊3', '213123213', '1', 'ffffff', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('10', '01NT', '01N', 'Lily', null, '2', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('11', '02DL', '02DL', 'linda', null, '2', 'test', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('12', '02DL', '02DL', '吉吉', null, '3', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('13', '02DL', '02DL', '梅子', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('14', '02DL', '02DL', '湘湘', null, '3', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('15', '02DL', '02DL', '燕燕', null, '3', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('16', '10007', '10007', '张三', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('17', '99999', '99999', '1111', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('18', '99999', '99999', '123', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('19', '99999', '99999', '567', null, '2', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('20', '99999', '99999', 'aaa', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('21', '99999', '99999', 'bbb', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('22', '99999', '99999', 'cc', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('23', '99999', '99999', '小张', '110', '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('24', 'BJBSX', 'BJBSX', '11111', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('25', 'BJBSX', 'BJBSX', 'abc', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('26', 'BJBSX', 'BJBSX', 'asd', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('27', 'BJBSX', 'BJBSX', 'jsifj', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('28', 'BJBSX', 'BJBSX', '杨丹', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('29', 'BJBSX', 'BJBSX', '测试2', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('30', 'DL01X', 'DL01X', 'linda', null, '2', 'ddd', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('31', 'PY01X', 'PY01X', 'l', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('32', 'PY01X', 'PY01X', 'linda', null, '1', null, null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('33', 'PY01X', 'PY01X', 'yingyieyan', null, '1', '备    注', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('34', 'PY01X', 'PY01X', '小红', null, '1', 'ok', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('35', 'PY01X', 'PY01X', '爱上对方', null, '1', '爱的色放', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('36', '01SZ', '01SZ', 'romeo', '13543701004', '5', 'romeo', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('37', '1000', '1000', 'Rose', '13523235632', null, '顶级销售员', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('38', 'SZ01', 'SZ01', '王明升', '13459684989', '7', '备注信息', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('39', '', 'WH01', '张小雅', '13565654895', '9', '备注信息', '2011-07-19', null, '3');
INSERT INTO `aig_assistant_info` VALUES ('40', 'WH01', 'WH01', '张岚', '13478965241', '9', '备注信息aaa', '2012-07-11', '', '1');
INSERT INTO `aig_assistant_info` VALUES ('41', 'WH01', 'WH01', '王小峰', '13898745624', '9', '备注信息', '2012-07-11', '', '1');
INSERT INTO `aig_assistant_info` VALUES ('45', 'SZ02', 'SZ02', '陈城', '', null, '备注信息', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('46', 'WH01', 'WH01', '肖红叶', '12343544556', '9', '备注信息aa', '2012-07-11', '', '1');
INSERT INTO `aig_assistant_info` VALUES ('47', 'SZ03', 'WH01', '戴新国', '13454567676', '9', '备注信息', '2010-10-13', '', '3');
INSERT INTO `aig_assistant_info` VALUES ('48', 'SZ03', 'SZ03', '张三', '138265000001', '2', '备注信息', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('49', 'SZ03', 'SZ03', '李四', '13826500002', '3', '备注信息', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('50', 'SZ03', 'SZ03', '王五', '13826500003', null, '备注信息', null, null, '1');
INSERT INTO `aig_assistant_info` VALUES ('52', 'WH01', 'WH01', '夏雪', '13456545453', '8', '好孩子', '2012-09-12', '', '1');
INSERT INTO `aig_assistant_info` VALUES ('53', 'WH01', 'WH01', '张飞', '13454545676', '8', '备注信息', '2012-09-12', null, '1');
INSERT INTO `aig_assistant_info` VALUES ('54', 'WH01', 'WH01', '胡月', '14565656765', '16', '妹子', '2012-09-12', null, '1');


/*
Navicat MySQL Data Transfer

Source Server         : pos
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : g4demo

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2012-09-12 20:03:46
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `aig_assistant_scheduling`
-- ----------------------------
DROP TABLE IF EXISTS `aig_assistant_scheduling`;
CREATE TABLE `aig_assistant_scheduling` (
  `schedulingno` int(11) NOT NULL AUTO_INCREMENT,
  `outtime` char(10) DEFAULT '',
  `assno` int(11) DEFAULT NULL,
  `inwerks` varchar(10) DEFAULT NULL,
  `outwerks` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`schedulingno`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of aig_assistant_scheduling
-- ----------------------------
INSERT INTO `aig_assistant_scheduling` VALUES ('12', '2012-09-11', '47', 'SZ03', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('13', '2012-09-11', '41', '1000', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('14', '2012-09-12', '39', 'WH01', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('15', '2012-09-12', '41', 'WH01', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('16', '2012-09-12', '41', '01HS', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('17', '2012-09-12', '41', 'WH01', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('18', '2012-09-12', '39', '01XT', 'WH01');
INSERT INTO `aig_assistant_scheduling` VALUES ('19', '2012-09-12', '39', '', 'WH01');


/*
Navicat MySQL Data Transfer

Source Server         : pos
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : g4demo

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2012-09-12 20:04:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `aig_promotion`
-- ----------------------------
DROP TABLE IF EXISTS `aig_promotion`;
CREATE TABLE `aig_promotion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jssj` char(10) NOT NULL,
  `assno` int(11) NOT NULL,
  `zwname` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of aig_promotion
-- ----------------------------
INSERT INTO `aig_promotion` VALUES ('20', '2012-09-11', '39', '导购');
INSERT INTO `aig_promotion` VALUES ('21', '2012-09-11', '40', '店长');
INSERT INTO `aig_promotion` VALUES ('22', '2012-09-12', '39', '店长');
INSERT INTO `aig_promotion` VALUES ('23', '2012-09-12', '52', '导购');
