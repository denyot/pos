/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2012/8/13 15:29:55                           */
/*==============================================================*/


drop table if exists pos_aftersales_service;

drop table if exists pos_aftersales_type;

drop table if exists pos_certificate;

drop table if exists pos_facelift_bag;

drop table if exists pos_goldmaterial;

drop table if exists pos_goldquality;

drop table if exists pos_quality_person;

drop table if exists pos_repair_failed_record;

drop table if exists pos_repair_status;

drop table if exists pos_replacement;

drop table if exists pos_sales_service;

/*==============================================================*/
/* Table: pos_aftersales_service                                */
/*==============================================================*/
create table pos_aftersales_service
(
   code                 varchar(8) not null,
   name                 varchar(18),
   primary key (code)
);

alter table pos_aftersales_service comment '售后服务项目';

/*==============================================================*/
/* Table: pos_aftersales_type                                   */
/*==============================================================*/
create table pos_aftersales_type
(
   code                 varchar(8) not null,
   name                 varchar(10),
   primary key (code)
);

alter table pos_aftersales_type comment '售后类型表';

/*==============================================================*/
/* Table: pos_certificate                                       */
/*==============================================================*/
create table pos_certificate
(
   code                 varchar(8) not null,
   name                 varchar(40),
   certificatecost      int(4),
   primary key (code)
);

alter table pos_certificate comment '证书费用';

/*==============================================================*/
/* Table: pos_facelift_bag                                      */
/*==============================================================*/
create table pos_facelift_bag
(
   code                 varchar(8) not null,
   style                varchar(8),
   price1               int(4),
   price2               int(4),
   price3               int(4),
   primary key (code)
);

alter table pos_facelift_bag comment '改款款式';

/*==============================================================*/
/* Table: pos_goldmaterial                                      */
/*==============================================================*/
create table pos_goldmaterial
(
   code                 varchar(8) not null,
   name                 varchar(20),
   loss                 double(10,2),
   primary key (code)
);

alter table pos_goldmaterial comment '金料';

/*==============================================================*/
/* Table: pos_goldquality                                       */
/*==============================================================*/
create table pos_goldquality
(
   code                 varchar(8) not null,
   name                 varchar(18),
   primary key (code)
);

alter table pos_goldquality comment '金料成色';

/*==============================================================*/
/* Table: pos_quality_person                                    */
/*==============================================================*/
create table pos_quality_person
(
   code                 varchar(4) not null,
   name                 varchar(18),
   primary key (code)
);

alter table pos_quality_person comment '质量部人员信息';

/*==============================================================*/
/* Table: pos_repair_failed_record                              */
/*==============================================================*/
create table pos_repair_failed_record
(
   id                   int not null auto_increment,
   service_number       varchar(20),
   commodity_barcode    varchar(20),
   factory_receive_date datetime,
   record_date          datetime,
   failed_reason        varchar(20),
   after_type           varchar(8),
   primary key (id)
);

alter table pos_repair_failed_record comment '维修不合格记录表';

/*==============================================================*/
/* Table: pos_repair_status                                     */
/*==============================================================*/
create table pos_repair_status
(
   status_id            char(2) not null,
   description          varchar(8),
   primary key (status_id)
);

alter table pos_repair_status comment '维修状态';

/*==============================================================*/
/* Table: pos_replacement                                       */
/*==============================================================*/
create table pos_replacement
(
   code                 varchar(8) not null,
   name                 varchar(18),
   price                double(10,2),
   primary key (code)
);

alter table pos_replacement comment '配件';

/*==============================================================*/
/* Table: pos_sales_service                                     */
/*==============================================================*/
create table pos_sales_service
(
   service_number       varchar(18) not null,
   member_name          varchar(18),
   telephone            varchar(18),
   accept_date          datetime,
   old_commodity_barcode varchar(18),
   clinch_price         double(10,2),
   after_ss_project     varchar(40),
   replacement          varchar(8),
   gold_loss_ratio      double(10,2),
   store_repair_costs   double(10,2),
   cus_requirement      varchar(40),
   replacement_price    double(10,2),
   expected_repair_costs double(10,2),
   repair_count         int,
   receive_date         datetime,
   weigh                double(10,2),
   stone_detection      varchar(8),
   product_image        varchar(40),
   dept_receive_date    datetime,
   repair_after_weight  double(10,2),
   loss_value           double(10,2),
   loss_rate            double(10,2),
   real_repair_amount   double(10,2),
   repair_charges       double(10,2),
   canadian_gold        double(10,2),
   gole_price           double(10,2),
   stone_costs          double(10,2),
   stone_process_fees   double(10,2),
   factory_repair_number int(2),
   mailing_date         datetime,
   goods_outward        varchar(80),
   repair_charges_cus   double(10,2),
   canadian_gold_cus    double(10,2),
   gole_price_cus       double(10,2),
   stone_costs_cus      double(10,2),
   stone_process_fees_cus double(10,2),
   replacement_cost_cus double(10,2),
   real_repair_amount_cus double(10,2),
   old_goods_weight     double(10,2),
   real_goods_weight    double(10,2),
   old_certificate_number varchar(18),
   prepared_commodity_barcode varchar(18),
   facelift_bag         varchar(18),
   gold_material        varchar(18),
   ring                 varchar(18),
   isfree_process_fees  varchar(2),
   isdo_certificate     varchar(2),
   certificate_type     varchar(18),
   integral             int(6),
   member_cardnumber    varchar(15),
   complaints_number    varchar(15),
   expected_pickup_date datetime,
   trade_name           varchar(20),
   sell_date            datetime,
   old_stone_weight     double(10,2),
   facelift_labor_charge double(10,2),
   gold_material_loss   double(10,2),
   isincluding_vicestone varchar(2),
   vicestone            varchar(10),
   vicestone_process_fees double(10,2),
   expected_cost        double(10,2),
   certificate_cost     double(10,2),
   process_factory      varchar(18),
   counter_name         varchar(18),
   real_receive_date    datetime,
   expect_picture       varchar(40),
   service_type         varchar(8),
   mf_mold_number       varchar(18),
   mf_gold_material     varchar(18),
   mf_stone             varchar(18),
   mf_stone_amount      int(6),
   mf_stone_detail      varchar(18),
   mf_stone_kind        varchar(18),
   mf_stone_format      varchar(18),
   mf_stone_clarity     varchar(18),
   mf_stone_weight      double(10,2),
   mf_stone_color       varchar(18),
   new_certificate_number varchar(18),
   new_commodity_barcode varchar(18),
   replacement_cost     double(10,2),
   to_purchase_date     datetime,
   purchase_receive_people varchar(20),
   factory_receive_date datetime,
   factory_receive_people varchar(20),
   factory_expected_ship_date datetime,
   factory_repair_result varchar(8),
   failed_reason        varchar(20),
   old_gold_weight      double(10,2),
   new_gold_weight      double(10,2),
   mainstone_process_fees double(10,2),
   total_vicestone_process_fees double(10,2),
   old_gold_price       double(10,2),
   new_gold_price       double(10,2),
   vicestone_cost       double(10,2),
   version_cost         double(10,2),
   real_facelift_amount int,
   old_gold_weight_cus  double(10,2),
   new_gold_weight_cus  double(10,2),
   mainstone_process_fees_cus double(10,2),
   total_vicestone_process_fees_cus double(10,2),
   old_gold_price_cus   double(10,2),
   new_gold_price_cus   double(10,2),
   vicestone_cost_cus   double(10,2),
   gold_material_loss_cus double(10,2),
   certificate_cost_cus double(10,2),
   version_cost_cus     double(10,2),
   real_facelift_amount_cus int,
   to_cabinet_date      datetime,
   real_customer_amount double(10,2),
   satisfaction         varchar(8),
   not_satisfied_reason varchar(40),
   status               varchar(8),
   store_number         varchar(18),
   record_date          datetime,
   customer_pickup_date datetime,
   link_number          varchar(18),
   operator_first       varchar(18),
   operator_first_time  datetime,
   operator_second      varchar(18),
   operator_second_time datetime,
   operator_third       varchar(18),
   operator_third_time  datetime,
   remark1              varchar(50),
   remark2              varchar(50),
   remark3              varchar(50),
   expect_commodity_barcode varchar(18),
   accept_people_first  varchar(18),
   accept_people_second varchar(18),
   accept_people_third  varchar(18),
   luodan_certificate_number varchar(18),
   luodan_certificate_type varchar(18),
   gold_material_quality varchar(18),
   cw_receive_amount    double(10,2),
   accounting_documents varchar(40),
   cw_receive_status    varchar(8),
   accept_people_cw     varchar(8),
   operator_date_cw     datetime,
   is_delete            varchar(1),
   primary key (service_number)
);

alter table pos_sales_service comment '售后服务信息表';

