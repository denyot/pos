package cn.longhaul.pos.order.service;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import cn.longhaul.sap.system.info.TransferInfo;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class OrderServiceImpl extends BaseServiceImpl implements OrderService
{
  public boolean saveOrder(Dto orderHead, List<?> orderitemal)
    throws Exception
  {
    this.g4Dao.insert("posordersystem.createorderhead", orderHead);
    for (int i = 0; i < orderitemal.size(); i++) {
      Dto orderitem = (Dto)orderitemal.get(i);
      //由于退还定金的时候金额为正 需转为负数
      if ("ZYR2".equals(orderHead.get("ordertype"))){
    	  orderitem.put("netprice","-"+orderitem.get("netprice"));
    	  orderitem.put("totalamount","-"+orderitem.get("totalamount"));
    	  
      }
      if (G4Utils.isEmpty(orderitem.getAsString("lowerlevelsnumber")))
        orderitem.put("lowerlevelsnumber", null);
      orderitem.put("salesorderid", orderHead.get("salesorderid"));
      this.g4Dao.insert("posordersystem.createorderitem", orderitem);
    }

    if (("ZJM3".equals(orderHead.get("ordertype"))) || ("ZJM8".equals(orderHead.get("ordertype"))) || ("ZYS3".equals(orderHead.get("ordertype"))) || ("ZYS8".equals(orderHead.get("ordertype")))) {
      orderHead.put("orderflag", "DO");
      this.g4Dao.update("posordersystem.updateChoiceOrderInfo", orderHead);
    } else if (("ZJR2".equals(orderHead.get("ordertype"))) || ("ZJR3".equals(orderHead.get("ordertype"))) || ("ZYR2".equals(orderHead.get("ordertype"))) || ("ZYR3".equals(orderHead.get("ordertype")))) {
      orderHead.put("orderflag", "RO");
      this.g4Dao.update("posordersystem.updateFrontMoneyInfo", orderHead);
    }

    return true;
  }
  /**
   * 普通销售订单新增
   * @param orderHead
   * @param orderitemal
   * @return
   */
  public Dto saveOderZys1(Dto orderHead, List<Dto> orderitemal){
	    
	  Dto d = new  BaseDto();
	  
	  this.g4Dao.insert("posordersystem.createorderhead", orderHead);
	    for (int i = 0; i < orderitemal.size(); i++) {
	    	 Dto  orderitem = orderitemal.get(i);
	    	 orderitem.put("salesorderid", orderHead.get("salesorderid"));
	    	 orderitem.put("storeid",orderHead.get("storeid"));
	    	 this.g4Dao.insert("posordersystem.createorderitem", orderitem);
	    }
	    
	  d.put("success", true);
	  
	  return d;
  }
  
  /**
   * 创建sap单号
   * @param orderHead
   * @param orderitem
   * @return
   */
  public Dto createSapZys1(Dto orderHead,List<Dto> orderitemal ){
	  AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
	  Dto d = new BaseDto();
      AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_VBAK");
      rfctablevbak.setValue("AUART", orderHead.get("ordertype") != null ? orderHead.get("ordertype") : "");
      rfctablevbak.setValue("KUNNR", orderHead.get("storeid") != null ? orderHead.get("storeid") : "");
      rfctablevbak.setValue("KUNNR1", orderHead.get("customerid") != null ? orderHead.get("customerid") : "");
      rfctablevbak.setValue("WERKS", orderHead.get("storeid") != null ? orderHead.get("storeid") : "");
      rfctablevbak.setValue("AUGRU", orderHead.get("orderreason") != null ? orderHead.get("orderreason") : "");
      rfctablevbak.setValue("AUDAT", orderHead.get("saledate") != null ? orderHead.get("saledate") : "");
      rfctablevbak.setValue("KTEXT", orderHead.get("remarks") != null ? orderHead.get("remarks") : "");
      rfctablevbak.setValue("BNAME", orderHead.get("salesclerk") != null ? orderHead.get("salesclerk") : "");
      rfctablevbak.setValue("TELF1", orderHead.get("storereceipt") != null ? orderHead.get("storereceipt") : "");
      rfctablevbak.setValue("VTWEG", "10");
      rfctablevbak.setValue("ZXL", orderHead.get("unionpay") != null ? orderHead.get("unionpay") : "");
      rfctablevbak.setValue("ZGWK", orderHead.get("shoppingcard") != null ? orderHead.get("shoppingcard") : "");
     // rfctablevbak.setValue("VSNMR_V", orderHead.getAsString("referrer") != null ? orderHead.get("referrer") : "");
      rfctablevbak.appendRow();
      rfctransferinfo.appendTable(rfctablevbak);
	  
      
      
      AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_VBAP");
      for (int i = 0; i < orderitemal.size(); i++) {
        Dto orderitem = orderitemal.get(i);
        orderitem.put("werks", orderHead.getAsString("storeid"));
        orderitem.put("orderdate", orderHead.get("saledate"));
        Double point = Double.valueOf(0.0D);
        Double price = Double.valueOf(0.0D);

        if (orderitem.get("salepromotion")!=null&& orderitem.get("salepromotion") != ""){
          rfctablevbap.setValue("KNUMA_PI", orderitem.get("salepromotion"));
	      price = (Double)this.g4Dao.queryForObject("posordersystem.getZ087Price", orderitem);
	      if (price != null) {
	    	  System.out.println(orderitem.get("salepromotion")); 
	          point = Double.valueOf(price.doubleValue() / 10.0D);
	          BigDecimal dec = new BigDecimal(point.doubleValue()).setScale(2, 4);
	          rfctablevbap.setValue("Z087", Double.valueOf(dec.doubleValue()));
	      } else {
	          price = (Double)this.g4Dao.queryForObject("posordersystem.getZ082Price", orderitem);
	          point = Double.valueOf(price == null ? 0.0D : price.doubleValue() / 10.0D);
	          BigDecimal dec = new BigDecimal(point.doubleValue()).setScale(2, 4);
	          rfctablevbap.setValue("Z082", Double.valueOf(dec.doubleValue()));
	      }
        } else {
        	price = (Double)this.g4Dao.queryForObject("posordersystem.getZ082Price", orderitem);
	        point = Double.valueOf(price == null ? 0.0D : price.doubleValue() / 10.0D);
	        BigDecimal dec = new BigDecimal(point.doubleValue()).setScale(2, 4);
	        rfctablevbap.setValue("Z082", Double.valueOf(dec.doubleValue()));
        }
        rfctablevbap.setValue("POSNR", orderitem.get("salesorderitem"));
        rfctablevbap.setValue("PSTYV", orderitem.get("orderitemtype"));
        rfctablevbap.setValue("WERKS", orderHead.getAsString("storeid"));
      //  rfctablevbap.setValue("VSTEL", );
        rfctablevbap.setValue("MATNR", orderitem.get("materialnumber"));
      
        rfctablevbap.setValue("CHARG", orderitem.get("batchnumber"));
        System.out.println(orderitem.getAsString("salesquantity"));
        Double count = Double.valueOf(Double.parseDouble(orderitem.getAsString("salesquantity")));
        
          count = Double.valueOf(Math.abs(count.doubleValue()));
          rfctablevbap.setValue("KWMENG", orderitem.getAsString("meins").equals("G")?orderitem.getAsString("goldweight"):count);
          rfctablevbap.setValue("ZMGOLD", orderitem.get("mGoldWeight"));
          rfctablevbap.setValue("LGORT", orderitem.get("storagelocation"));
          rfctablevbap.setValue("ZSSJ", orderitem.get("netprice"));
          rfctablevbap.setValue("ZLSJ", orderitem.get("tagprice"));
	      rfctablevbap.setValue("ZXSJJ", orderitem.get("goldprice"));
	      rfctablevbap.setValue("ZGP3", orderitem.get("settlegoldvalue"));
	      rfctablevbap.setValue("ZCGGK", orderitem.getAsString("discount1").equals("0")?0:orderitem.getAsInteger("discount1")-100);
	      rfctablevbap.setValue("ZCXGK", orderitem.getAsString("discount2").equals("0")?0:orderitem.getAsInteger("discount2")-100);
	      rfctablevbap.setValue("ZHYK", orderitem.getAsString("discount3").equals("0")?0:orderitem.getAsInteger("discount3")-100);
	      rfctablevbap.setValue("ZSHYK", orderitem.getAsString("discount4").equals("0")?0:orderitem.getAsInteger("discount4")-100);
	      rfctablevbap.setValue("ZZKJ", orderitem.getAsString("discount5").equals("0")?0:orderitem.getAsInteger("discount5")-100);
	      rfctablevbap.setValue("ZJFDX", orderitem.get("vipintegral"));
	      rfctablevbap.setValue("ZGF", orderitem.get("goodsprocessingfee"));//工费
	      rfctablevbap.setValue("ZSQ2", orderitem.get("marketticketprice"));
	      rfctablevbap.setValue("PLTYP", orderitem.get("giftMethod"));//价格清单类型
	      rfctablevbap.setValue("ZFQ2", orderitem.get("selfticketprice"));
	      rfctablevbap.setValue("ZJF4",orderitem.getAsString("currentIntegral"));
	      rfctablevbap.setValue("ZSQ", orderitem.get("marketprivilege"));//商场优惠卷
	      rfctablevbap.setValue("ZFQ", orderitem.get("selfprivilege"));//自发优惠卷
	      rfctablevbap.setValue("ZQTFY", orderitem.get("depreciationPrice"));//其他费用
	      rfctablevbap.appendRow();
      }
 
      
  
		  rfctransferinfo.appendTable(rfctablevbap);
		  SapTransferImpl transfer = new SapTransferImpl();
		  AigTransferInfo out=null;
		try {
			out = transfer.transferInfoAig("Z_RFC_STORE_19", rfctransferinfo);
			if ((out.getParameters("U_VBELN") == null) || (out.getParameters("U_VBELN") == "")) {
				d.put("error", out.getAigStructure("U_RETURN").get("MESSAGE"));
			}else{
				d.put("success", true);
				d.put("U_VBELN", out.getParameters("U_VBELN"));
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			d.put("error", e.toString());
		}
		
		 
		        
	  return d;
  }
  
  public boolean upadteOrder(Dto orderHead, List<?> orderitemal) throws Exception {
    if (this.g4Dao.update("posordersystem.updateorderhead", orderHead) == 1) {
      this.g4Dao.delete("posordersystem.deleteorderItem", orderHead);
      for (int i = 0; i < orderitemal.size(); i++) {
        Dto orderitem = (Dto)orderitemal.get(i);
        if (G4Utils.isEmpty(orderitem.get("lowerlevelsnumber")))
          orderitem.put("lowerlevelsnumber", null);
        this.g4Dao.insert("posordersystem.createorderitem", orderitem);
      }
      this.g4Dao.update("posordersystem.updateorderhead", orderHead);
    } else {
      return false;
    }
    return true;
  }

  public boolean updateOrderForSap(Dto orderHead, List<?> orderitemal) throws Exception
  {
    String orderType = (String) orderHead.get("ordertype");
    this.g4Dao.update("posordersystem.updateorderhead", orderHead);
    this.g4Dao.delete("posordersystem.deleteorderItem", orderHead);
    for (int i = 0; i < orderitemal.size(); i++) {
      Dto orderitem = (Dto)orderitemal.get(i);
      if (G4Utils.isEmpty(orderitem.get("lowerlevelsnumber")))
        orderitem.put("lowerlevelsnumber", null);
      this.g4Dao.insert("posordersystem.createorderitem", orderitem);
    }

    this.g4Dao.update("posordersystem.updateorderheadbysapvbeln", orderHead);

    if (("ZYR2".equals(orderType)) || ("ZJR2".equals(orderType)) || ("ZYS3".equals(orderType)) || ("ZJM3".equals(orderType))) {
      orderHead.put("orderflag", "SO");
      if (("ZYR2".equals(orderType)) || ("ZJR2".equals(orderType)))
        this.g4Dao.update("posordersystem.updateFrontMoneyInfo", orderHead);
      else {
        this.g4Dao.update("posordersystem.updateChoiceOrderInfo", orderHead);
      }
    }
    return true;
  }

  public boolean delOrder(List<?> orderHead) throws Exception {
    for (int i = 0; i < orderHead.size(); i++) {
      Dto delorder = (Dto)orderHead.get(i);

      Integer total = delorder.getAsInteger("total");
      String kunnr = delorder.getAsString("customerid");
      Integer integral = Integer.valueOf(total == null ? 0 : total.intValue() / 100);
      System.out.println(total);
      System.out.println(kunnr);
      System.out.println(integral);
      delorder.put("integral", integral);

      this.g4Dao.delete("posordersystem.deleteorderhead", delorder);
      this.g4Dao.delete("posordersystem.deleteorderItem", delorder);

      this.g4Dao.update("posordersystem.reduceEmpIntegral", orderHead);
    }
    return true;
  }

  public boolean delOrder(Dto orderHead, Dto returnList) throws Exception {
	  Dto dd = new BaseDto();
	  
	    this.g4Dao.delete("posordersystem.deleteorderhead", orderHead);

    List orderItem = this.g4Dao.queryForList("posordersystem.getorderitem", orderHead);

    this.g4Dao.delete("posordersystem.deleteorderItem", orderHead);
     dd.put("customerid", orderHead.getAsString("customerid"));
    for (int i = 0; i < orderItem.size(); i++) {
      Dto item = (Dto)orderItem.get(i);

      if (G4Utils.isEmpty(item.get("batchnumber"))) {
        Integer count = (Integer)this.g4Dao.queryForObject("posordersystem.ifExistsMatnr", item);
        if (count.intValue() > 0)
          this.g4Dao.update("posordersystem.reduceMatnrStore", item);
        else
          this.g4Dao.insert("posordersystem.insertMatnrStore", item); 
       }
      else {
        Integer count = (Integer)this.g4Dao.queryForObject("posordersystem.ifExistsCharg46", item);
        if (count.intValue() > 0) {
          this.g4Dao.update("posordersystem.reduceChargStore46", item);
        } else {
          count = (Integer)this.g4Dao.queryForObject("posordersystem.ifExistsCharg48", item);
          if (count.intValue() > 0)
            this.g4Dao.update("posordersystem.reduceChargStore48", item);
          else {
            this.g4Dao.insert("posordersystem.insertChargStore", item);
          }
        }
      }
      BigDecimal b =  item.getAsBigDecimal("currentintegral") ;
      if(b!=null){
    	  BigDecimal vipintegral = item.getAsBigDecimal("vipintegral");
          if(vipintegral!=null){
        	  b = b.subtract(vipintegral);
          }
          
         if(orderHead.getAsString("ordertype").equals("ZYS6")){
        	b  =  item.getAsBigDecimal("totalamount").multiply(new BigDecimal(-1));
          }
         dd.put("integral",  b);
      }
     
      
      System.out.println("删掉积分："+dd.getAsString("integral"));
      this.g4Dao.update("posordersystem.reduceEmpIntegral", dd);
    }
    
    String sapsalesorderid = orderHead.getAsString("sapsalesorderid");

    AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
    AigTransferParameter rfcimport = rfctransferinfo.getImportPara();
    rfcimport.getParameters().put("I_VBELN", sapsalesorderid);
    SapTransferImpl transfer = new SapTransferImpl();
    AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_57", rfctransferinfo);
    ArrayList retData = out.getAigTable("U_RETURN");
    String TYPE = (String)((HashMap)retData.get(0)).get("TYPE");
    String MESSAGE = (String)((HashMap)retData.get(0)).get("MESSAGE");
    if ("S".equals(TYPE)) {
      returnList.put("success", MESSAGE);
    } else {
      returnList.put("error", MESSAGE);
      throw new Exception("SAP删除出现错误:" + MESSAGE);
    }
    return true;
  }

  public boolean delOrderForNewOrder(Dto orderHead) throws Exception {
    this.g4Dao.delete("posordersystem.deleteorderhead", orderHead);
    this.g4Dao.delete("posordersystem.deleteorderItem", orderHead);
    return true;
  }

  public boolean updateOrderByDelivery(Dto orderHead) throws Exception
  {
    this.g4Dao.update("posordersystem.updateorderheadbyDelivery", orderHead);

    return true;
  }

  public boolean updateOrderByvbeln(Dto orderHead, List<Dto> orderitem)
    throws Exception
  {
    this.g4Dao.update("posordersystem.updateorderheadbysapvbeln", orderHead);
    try {
      Integer total = orderHead.getAsInteger("total");
      Integer costIntegral = Integer.valueOf(0);
      String orderType = orderHead.getAsString("ordertype");
      for (int i = 0; i < orderitem.size(); i++) {
        Dto orderItem = orderitem.get(i);
        
        if (("ZJM6".equals(orderType)) || ("ZYS6".equals(orderType)))
          costIntegral = Integer.valueOf(costIntegral.intValue() + orderItem.getAsInteger("netprice").intValue());
        else {
          costIntegral = Integer.valueOf(costIntegral.intValue() + orderItem.getAsInteger("vipintegral").intValue());
          System.out.println("cost:"+costIntegral.intValue()+"----vipintegral"+orderItem.getAsInteger("vipintegral").intValue());
        }
      }
      String kunnr = orderHead.getAsString("customerid");
   
      Integer integral = orderHead.getAsInteger("currentIntegral");

      for (int i = 0; i < orderitem.size(); i++) {
        Dto anyItem = orderitem.get(i);

        if ((!"ZJM3".equals(orderType)) && (!"ZJM8".equals(orderType)) && (!"ZJR2".equals(orderType)) && (!"ZJR3".equals(orderType)) && (!"ZYR2".equals(orderType)) && (!"ZYR3".equals(orderType)) && (!"ZYS3".equals(orderType)) && (!"ZYS8".equals(orderType)) && (!"ZYS6".equals(orderType)) && (!"ZJM6".equals(orderType)))
        {
          if (G4Utils.isEmpty(anyItem.getAsString("batchnumber")))
          {
            Double store = (Double)this.g4Dao.queryForObject("posordersystem.getStockInfoByMatnr", anyItem);
            if (("ZTNN".equals(anyItem.getAsString("orderitemtype"))) || ("ZREN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN1".equals(anyItem.getAsString("orderitemtype"))) || ("ZRNN".equals(anyItem.getAsString("orderitemtype"))) || ("ZTAN".equals(anyItem.getAsString("orderitemtype")))) {
              anyItem.put("count", anyItem.get("salesquantity"));
              if ((store != null) && (store.doubleValue() > 0.0D))
                this.g4Dao.update("posordersystem.deductInventoryByMatnr", anyItem);
              else
                this.g4Dao.update("posordersystem.deductInventoryByMatnrForK", anyItem);
            }
          }
          else {
            Dto store = (Dto)this.g4Dao.queryForObject("posordersystem.getStockInfoByCharg", anyItem);
            Dto store2 = (Dto)this.g4Dao.queryForObject("posordersystem.getStockInfoByChargForK", anyItem);
            if ((store == null) && (store2 == null)) {
              anyItem.put("lgort", anyItem.get("storagelocation"));
              anyItem.put("matnr", anyItem.get("materialnumber"));
              anyItem.put("charg", anyItem.get("batchnumber"));
              anyItem.put("inwerks", anyItem.get("werks"));
              if ("G".equals(anyItem.get("meins")))
                anyItem.put("goodscount", Double.valueOf(Math.abs(Double.parseDouble(anyItem.getAsString("goldweight")))));
              else {
                anyItem.put("goodscount", Integer.valueOf(Math.abs(anyItem.getAsInteger("salesquantity").intValue())));
              }
              anyItem.put("lgortto", anyItem.get("lgort"));
              this.g4Dao.update("stocksystem.moveLgortForAdd", anyItem);
            } else if ((store == null) && (store2 != null)) {
              anyItem.put("count", anyItem.get("salesquantity"));
              this.g4Dao.update("posordersystem.deductInventoryByChargForK", anyItem);
            } else {
              Double count = Double.valueOf(Double.parseDouble(store.getAsString("labst")));
              String meins = store.getAsString("meins");
              if (count.doubleValue() > 0.0D) {
                if ("G".equals(meins)) {
                  anyItem.put("count", anyItem.get("salesquantity"));
                  this.g4Dao.update("posordersystem.deductInventoryByCharg", anyItem);
                  if (Double.parseDouble(anyItem.getAsString("count")) * Double.parseDouble(anyItem.getAsString("goldweight")) < Double.parseDouble(store.getAsString("labst")))
                    try {
                      store.put("lgortto", "0008");
                      SapTransfer transferservice = new SapTransferImpl();
                      TransferInfo transferInfo = new TransferInfo();
                      AigTransferTable table = transferInfo.getTable("IT_ITAB");
                      table.setValue("MATNR", store.get("matnr"));
                      table.setValue("MENGE", Double.valueOf(Double.parseDouble(store.getAsString("labst")) - Double.parseDouble(anyItem.getAsString("count")) * Double.parseDouble(anyItem.getAsString("goldweight"))));
                      table.setValue("LGORT", store.get("lgort"));
                      table.setValue("BATCH", store.get("charg"));
                      table.setValue("UMLGO", store.get("lgortto"));
                      table.setValue("WERKS", store.get("werks"));
                      table.setValue("UMWRK", store.get("werks"));
                      table.appendRow();
                      transferInfo.appendTable(table);
                      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_15", transferInfo);
                      Map retResult = outinfo.getAigStructure("GT_STORE_15");
                      System.out.println(retResult.get("TYPE"));
                      String msg = (String)retResult.get("MESSAGE");
                      System.out.println(retResult.get("MESSAGE"));
                      System.out.println(retResult.get("MBLNR"));
                      System.out.println(retResult.get("MJAHR"));
                      if (!"S".equals(retResult.get("TYPE"))) continue;
                      try {
                        this.g4Dao.update("posordersystem.submitMoveLgort", store);
                      } catch (Exception e) {
                        e.printStackTrace();
                      }
                    }
                    catch (Exception e) {
                      e.printStackTrace();
                    }
                }
                else {
                  anyItem.put("count", anyItem.get("salesquantity"));
                  this.g4Dao.update("posordersystem.deductInventoryByCharg", anyItem);
                }
              }
              else if (("ZREN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN1".equals(anyItem.getAsString("orderitemtype"))) || ("ZRNN".equals(anyItem.getAsString("orderitemtype"))))
              {
                anyItem.put("count", anyItem.get("salesquantity"));

                this.g4Dao.update("posordersystem.deductInventoryByCharg", anyItem);
              }
            }

          }

        }

      }
      //System.out.println("jifen"+integral.intValue()); //这个是 前台加减后的积分
      //System.out.println("jifen2"+costIntegral.intValue());//积分兑换的积
     // zwh 2014.8.1
       // orderHead.put("integral", Integer.valueOf(integral.intValue() - costIntegral.intValue()));
      
      orderHead.put("integral", Integer.valueOf(integral.intValue()));  
      if ("ZYS6".equals(orderType)){
    	  orderHead.put("integral", Integer.valueOf(-costIntegral));  
      }
      this.g4Dao.update("posordersystem.addEmpIntegral", orderHead);
    }
    catch (Exception e) {
      e.printStackTrace();
    }

    return true;
  }
  
  

  public boolean updateOrderByvbeln2(Dto orderHead, List<Dto> orderitem)
    throws Exception
  {
    this.g4Dao.update("posordersystem.updateorderheadbysapvbeln", orderHead);
    try {
      Integer total = orderHead.getAsInteger("total");
      Integer costIntegral = Integer.valueOf(0);
      String orderType = orderHead.getAsString("ordertype");
      Integer integral = orderHead.getAsInteger("currentIntegral");

      for (int i = 0; i < orderitem.size(); i++) {
        Dto anyItem = orderitem.get(i);
        anyItem.put("storeid", orderHead.get("storeid"));
          if (G4Utils.isEmpty(anyItem.getAsString("batchnumber")))
          {
            Double store = (Double)this.g4Dao.queryForObject("posordersystem.getStockInfoByMatnr", anyItem);
            if (("ZTNN".equals(anyItem.getAsString("orderitemtype"))) || ("ZREN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN1".equals(anyItem.getAsString("orderitemtype"))) || ("ZRNN".equals(anyItem.getAsString("orderitemtype"))) || ("ZTAN".equals(anyItem.getAsString("orderitemtype")))) {
              anyItem.put("count", anyItem.get("salesquantity"));
              if ((store != null) && (store.doubleValue() > 0.0D))
                this.g4Dao.update("posordersystem.deductInventoryByMatnr", anyItem);
              else
                this.g4Dao.update("posordersystem.deductInventoryByMatnrForK", anyItem);
            }
          }
          else {
            Dto store = (Dto)this.g4Dao.queryForObject("posordersystem.getStockInfoByCharg", anyItem);
            Dto store2 = (Dto)this.g4Dao.queryForObject("posordersystem.getStockInfoByChargForK", anyItem);
            if ((store == null) && (store2 == null)) {
              anyItem.put("lgort", anyItem.get("storagelocation"));
              anyItem.put("matnr", anyItem.get("materialnumber"));
              anyItem.put("charg", anyItem.get("batchnumber"));
              anyItem.put("inwerks", anyItem.get("storeid"));
              if ("G".equals(anyItem.get("meins")))
                anyItem.put("goodscount", Double.valueOf(Math.abs(Double.parseDouble(anyItem.getAsString("goldweight")))));
              else {
                anyItem.put("goodscount", Integer.valueOf(Math.abs(anyItem.getAsInteger("salesquantity").intValue())));
              }
              anyItem.put("lgortto", anyItem.get("lgort"));
              this.g4Dao.update("stocksystem.moveLgortForAdd", anyItem);
            } else if ((store == null) && (store2 != null)) {
              anyItem.put("count", anyItem.get("salesquantity"));
              this.g4Dao.update("posordersystem.deductInventoryByChargForK", anyItem);
            } else {
              Double count = Double.valueOf(Double.parseDouble(store.getAsString("labst")));
              String meins = store.getAsString("meins");
              if (count.doubleValue() > 0.0D) {
                if ("G".equals(meins)) {
                  anyItem.put("count", anyItem.get("salesquantity"));
                  this.g4Dao.update("posordersystem.deductInventoryByCharg", anyItem);
                  if (Double.parseDouble(anyItem.getAsString("count")) * Double.parseDouble(anyItem.getAsString("goldweight")) < Double.parseDouble(store.getAsString("labst")))
                    try {
                      store.put("lgortto", "0008");
                      SapTransfer transferservice = new SapTransferImpl();
                      TransferInfo transferInfo = new TransferInfo();
                      AigTransferTable table = transferInfo.getTable("IT_ITAB");
                      table.setValue("MATNR", store.get("matnr"));
                      table.setValue("MENGE",store.getAsBigDecimal("labst").subtract(
                    		  anyItem.getAsBigDecimal("count").multiply(
                    				  anyItem.getAsBigDecimal("goldweight")	  
                    		  )	));
                      table.setValue("LGORT", store.get("lgort"));
                      table.setValue("BATCH", store.get("charg"));
                      table.setValue("UMLGO", store.get("lgortto"));
                      table.setValue("WERKS", store.get("werks"));
                      table.setValue("UMWRK", store.get("werks"));
                      table.appendRow();
                      transferInfo.appendTable(table);
                      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_15", transferInfo);
                      Map retResult = outinfo.getAigStructure("GT_STORE_15");
                      System.out.println(retResult.get("TYPE"));
                      String msg = (String)retResult.get("MESSAGE");
                      System.out.println(retResult.get("MESSAGE"));
                      System.out.println(retResult.get("MBLNR"));
                      System.out.println(retResult.get("MJAHR"));
                      if (!"S".equals(retResult.get("TYPE"))) continue;
                      try {
                        this.g4Dao.update("posordersystem.submitMoveLgort", store);
                      } catch (Exception e) {
                        e.printStackTrace();
                      }
                    }
                    catch (Exception e) {
                      e.printStackTrace();
                    }
                }
                else {
                  anyItem.put("count", anyItem.get("salesquantity"));
                  this.g4Dao.update("posordersystem.deductInventoryByCharg", anyItem);
                }
              }
              else if (("ZREN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN".equals(anyItem.getAsString("orderitemtype"))) || ("ZIN1".equals(anyItem.getAsString("orderitemtype"))) || ("ZRNN".equals(anyItem.getAsString("orderitemtype"))))
              {
                anyItem.put("count", anyItem.get("salesquantity"));

                this.g4Dao.update("posordersystem.deductInventoryByCharg", anyItem);
              }
            }

          } 
      }
   
      this.g4Dao.update("posordersystem.addEmpIntegral", orderHead);
    }
    catch (Exception e) {
      e.printStackTrace();
      return false;
    }

    return true;
  }

  public String getCustomId(String deptId) throws Exception {
    Dto dtoDept = new BaseDto("deptId", deptId);
    return (String)this.g4Dao.queryForObject("posordersystem.getCustomId", dtoDept);
  }



}