package cn.longhaul.pos.stock.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.mortbay.log.Log;

import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import cn.longhaul.sap.system.info.TransferInfo;

public class StockServiceImpl extends BaseServiceImpl
  implements StockService
{
  public boolean insertOutStockInfo(Dto stockHeader, List<Dto> stockItems)
    throws Exception
  {
    this.g4Dao.delete("stocksystem.deleteOutStockItemsFornewID", stockHeader);
    int count = 0;
    for (int i = 0; i < stockItems.size(); i++) {
      Dto stockItem = (Dto)stockItems.get(i);
      stockItem.put("outid", stockHeader.get("maxoutid"));
      count += stockItem.getAsInteger("salesquantity").intValue();
      this.g4Dao.insert("stocksystem.createStockItem", stockItem);
    }
    stockHeader.put("goodscount", Integer.valueOf(count));
    this.g4Dao.insert("stocksystem.createStockHeader", stockHeader);
    return true;
  }

  public boolean insertOutStockInfoForYHP(Dto stockHeader, List<Dto> stockItems)
    throws Exception
  {
    int count = 0;
    for (int i = 0; i < stockItems.size(); i++) {
      Dto stockItem = (Dto)stockItems.get(i);
      stockItem.put("outid", stockHeader.get("maxoutid"));
      count += stockItem.getAsInteger("salesquantity").intValue();
      this.g4Dao.insert("stocksystem.createStockItemForYHP", stockItem);
    }
    stockHeader.put("goodscount", Integer.valueOf(count));
    stockHeader.put("status", Integer.valueOf(0));
    this.g4Dao.insert("stocksystem.createStockHeaderForYHP", stockHeader);

    return true;
  }

  public boolean insertRecieveGoodInfo(Dto recieceGoodHeader, List<Dto> recieveGoodItems) throws Exception {
    for (int i = 0; i < recieveGoodItems.size(); i++) {
      Dto item = (Dto)recieveGoodItems.get(i);
      item.put("id", recieceGoodHeader.get("id"));
      this.g4Dao.insert("stocksystem.insertRecieveGoodItem", item);
      item.put("inwerks", recieceGoodHeader.get("werks"));
      item.put("goodscount", ((Dto)recieveGoodItems.get(i)).get("menge"));
      item.put("lgortto", item.get("lgort"));
      try {
        if (G4Utils.isEmpty(((Dto)recieveGoodItems.get(i)).get("charg"))) {
          Integer count = (Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", item);
          if (count.intValue() >= 1)
            this.g4Dao.update("stocksystem.moveLgortForUpdate", item);
          else
            this.g4Dao.insert("stocksystem.moveLgortForAddForMatnr", item);
        } else {
          Integer count = (Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", item);
          if (count.intValue() >= 1)
            this.g4Dao.update("stocksystem.moveLgortForUpdate", item);
          else
            this.g4Dao.insert("stocksystem.moveLgortForAdd", item);
          try {
            if (G4Utils.isNotEmpty(item.get("charg")))
              try {
                Integer con = (Integer)this.g4Dao.queryForObject("stocksystem.validateInwerksPrice", item);
                if (con.intValue() > 0)
                  this.g4Dao.update("stocksystem.updatePirceInfo", item);
                else {
                  this.g4Dao.update("stocksystem.insertPirceInfo", item);
                }
              }
              catch (Exception e)
              {
                Log.debug(e.getMessage());
                e.printStackTrace();
              }
          }
          catch (Exception e) {
            e.printStackTrace();
          }
        }
      }
      catch (Exception e) {
        e.printStackTrace();
      }
    }

    this.g4Dao.insert("stocksystem.insertStoreHeader", recieceGoodHeader);

    return true;
  }

  public boolean updateRecieveManage(List<Dto> items) throws Exception {
    List idList = new ArrayList();
    Map count = new HashMap();
    for (int i = 0; i < items.size(); i++) {
      if (count.containsKey(((Dto)items.get(i)).getAsString("id"))) {
        Integer c = Integer.valueOf(((Integer)count.get(((Dto)items.get(i)).getAsString("id"))).intValue() + 1);
        count.put(((Dto)items.get(i)).getAsString("id"), c);
      } else {
        count.put(((Dto)items.get(i)).getAsString("id"), Integer.valueOf(1));
      }
    }

    Set keys = count.keySet();
    Iterator it = keys.iterator();
    while (it.hasNext()) {
      String key = (String)it.next();
      Integer con = (Integer)this.g4Dao.queryForObject("stocksystem.getManageItemCount", key);
      Integer value = (Integer)count.get(key);
      System.out.println(value == con);
      if ((con != null) && (con.equals(value))) {
        idList.add(key);
      }
    }
    for (int i = 0; i < items.size(); i++) {
      this.g4Dao.update("stocksystem.updateRecieveManage", items.get(i));
    }

    Dto dto = new BaseDto();
    dto.put("idList", idList);
    this.g4Dao.update("stocksystem.updateRecieveManageHead", dto);

    return true;
  }

  public Dto instock(Dto chargheader, List<Dto> chargitems) throws Exception
  {
    Dto retDto = new BaseDto();
    boolean flag = false;
    for (int i = 0; i < chargitems.size(); i++) {
      Dto dto = (Dto)chargitems.get(i);
      dto.put("outwerks", chargheader.get("outwerks"));
      dto.put("werks", chargheader.get("inwerks"));
      dto.put("lgortfrom", "0018");
      dto.put("salesquantity", dto.get("goodscount"));
      if (dto.get("lgort") == null) {
        dto.put("lgort", chargheader.get("lgort"));
        dto.put("lgortto", chargheader.get("lgort"));
      } else {
        dto.put("lgortto", dto.get("lgort"));
      }
      dto.put("inwerks", chargheader.get("inwerks"));
      String meins = (String)this.g4Dao.queryForObject("stocksystem.getMeins", dto);
      dto.put("meins", meins);

      int count = ((Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", dto)).intValue();
      dto.put("lgort", "0018");
      int count2 = ((Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", dto)).intValue();
      if (count2 == 1) {
        if (count == 1) {
          this.g4Dao.update("stocksystem.moveLgortForUpdate", dto);
          this.g4Dao.update("stocksystem.submitMoveLgortForPlus", dto);
        } else {
          this.g4Dao.update("stocksystem.moveLgortForUpdateFor0018", dto);
        }
      }
      else if (count == 1) {
        this.g4Dao.update("stocksystem.moveLgortForUpdate", dto);
        this.g4Dao.update("stocksystem.submitMoveLgortForPlus", dto);//除去库存
      } else {
        this.g4Dao.update("stocksystem.moveLgortForAdd", dto);//添加库存
      }

      this.g4Dao.update("stocksystem.updateStoreDetailInfo", dto);//修改明细
    }
    //zwh 20150206 
    chargheader.put("inttim", G4Utils.getCurrentTime("yyyy-MM-dd hh:mm:ss"));
    this.g4Dao.update("stocksystem.updateStoreInfo", chargheader);//修改抬头

    return retDto;
  }

  public boolean updateOutStockInfo(Dto stockHeader, List<Dto> stockItems)
  {
    this.g4Dao.delete("stocksystem.deleteOutStockItems", stockHeader);

    int count = 0;
    for (int i = 0; i < stockItems.size(); i++) {
      Dto stockItem = (Dto)stockItems.get(i);
      stockItem.put("outid", stockHeader.get("outid"));
      count += stockItem.getAsInteger("salesquantity").intValue();
      this.g4Dao.insert("stocksystem.createStockItem", stockItem);
    }
    stockHeader.put("goodscount", Integer.valueOf(count));
    stockHeader.put("status", Integer.valueOf(0));
    this.g4Dao.update("stocksystem.updateOutStockHeader", stockHeader);

    return true;
  }

  public void updateOutStockInfoFro1000(Dto stockHeader, List<Dto> stockItems)
  {
    this.g4Dao.delete("stocksystem.deleteOutStockItems", stockHeader);

    int count = 0;
    for (int i = 0; i < stockItems.size(); i++) {
      Dto stockItem = (Dto)stockItems.get(i);
      stockItem.put("outid", stockHeader.get("outid"));
      count += stockItem.getAsInteger("salesquantity").intValue();
      this.g4Dao.insert("stocksystem.createStockItem", stockItem);
    }
    stockHeader.put("goodscount", Integer.valueOf(count));
    stockHeader.put("status", Integer.valueOf(11));
    this.g4Dao.update("stocksystem.updateOutStockHeader", stockHeader);
  }

  public Dto submitItemsManageResult(Dto dto, List<Dto> items)
    throws Exception
  {
    Dto retDto = new BaseDto();
    List idList = new ArrayList();

    Map count = new HashMap();
    List updateList = new ArrayList();
    for (int i = 0; i < items.size(); i++) {
      if (count.containsKey(((Dto)items.get(i)).getAsString("id"))) {
        Integer c = Integer.valueOf(((Integer)count.get(((Dto)items.get(i)).getAsString("id"))).intValue() + 1);
        count.put(((Dto)items.get(i)).getAsString("id"), c);
      } else {
        count.put(((Dto)items.get(i)).getAsString("id"), Integer.valueOf(1));
      }
    }
    Set keys = count.keySet();
    Iterator it = keys.iterator();
    while (it.hasNext()) {
      String key = (String)it.next();
      Integer con = (Integer)this.g4Dao.queryForObject("stocksystem.getManageResultItemCount", key);
      Integer value = (Integer)count.get(key);
      System.out.println(value == con);
      if ((con != null) && (con.equals(value))) {
        idList.add(key);
      }
    }
    SapTransfer transferservice = new SapTransferImpl();
    TransferInfo transferInfo = new TransferInfo();
    AigTransferTable table = transferInfo.getTable("IT_ITAB");
    int con = 0;
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      if (item.getAsString("manageresult").startsWith("1.")) {
        con++;
        String lgortto = null;
        if ("A".equals(item.get("goodtype")))
          lgortto = "0001";
        else if ("G".equals(item.get("goodtype")))
          lgortto = "0014";
        else if ("H".equals(item.get("goodtype"))) {
          lgortto = "0012";
        }
        item.put("lgortfrom", item.get("lgort"));
        item.put("lgortto", lgortto);

        table.setValue("MATNR", item.get("matnr"));
        table.setValue("MENGE", item.get("goodscount"));
        table.setValue("LGORT", item.get("lgort"));
        table.setValue("BATCH", item.get("charg"));
        table.setValue("UMLGO", lgortto);
        table.setValue("WERKS", item.get("werks"));
        table.setValue("UMWRK", item.get("werks"));
        table.appendRow();
        updateList.add(item);
      }
    }
    if (con > 0) {
      transferInfo.appendTable(table);

      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_15", transferInfo);
      Map retResult = outinfo.getAigStructure("GT_STORE_15");
      System.out.println(retResult.get("TYPE"));
      String msg = (String)retResult.get("MESSAGE");
      System.out.println(retResult.get("MESSAGE"));
      System.out.println(retResult.get("MBLNR"));
      System.out.println(retResult.get("MJAHR"));
      if ("S".equals(retResult.get("TYPE"))) {
        retDto.put("success", msg + "，生成凭证号：" + retResult.get("MBLNR"));
        moveLgortForHeadResult(updateList);
      } else {
        retDto.put("error", msg);
      }
    }

    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      this.g4Dao.update("stocksystem.submitItemsManageResultItem", item);
    }
    dto.put("idList", idList);
    this.g4Dao.update("stocksystem.submitItemsManageResultHead", dto);

    return retDto;
  }

  public void submitOutStockItemManage(Dto headDto, List<Dto> items)
  {
    Dto retDto = new BaseDto();
    List idList = new ArrayList();

    Map count = new HashMap();

    for (int i = 0; i < items.size(); i++) {
      if (count.containsKey(((Dto)items.get(i)).getAsString("outid"))) {
        Integer c = Integer.valueOf(((Integer)count.get(((Dto)items.get(i)).getAsString("outid"))).intValue() + 1);
        count.put(((Dto)items.get(i)).getAsString("outid"), c);
      } else {
        count.put(((Dto)items.get(i)).getAsString("outid"), Integer.valueOf(1));
      }
    }

    Set keys = count.keySet();
    Iterator it = keys.iterator();
    while (it.hasNext()) {
      String key = (String)it.next();
      Integer con = (Integer)this.g4Dao.queryForObject("stocksystem.getOutStockItemManageCount", key);
      Integer value = (Integer)count.get(key);
      System.out.println(value == con);
      if ((con != null) && (con.equals(value))) {
        idList.add(key);
      }
    }
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      this.g4Dao.update("stocksystem.submitOutStockItemManage", item);
    }

    headDto.put("idList", idList);
    this.g4Dao.update("stocksystem.submitOutStockItemManageHead", headDto);
  }

  public void submitInStockItemManageResult(Dto headDto, List<Dto> items) throws Exception
  {
    Dto retDto = new BaseDto();
    List idList = new ArrayList();

    Map count = new HashMap();
    List updateList = new ArrayList();
    for (int i = 0; i < items.size(); i++) {
      if (count.containsKey(((Dto)items.get(i)).getAsString("outid"))) {
        Integer c = Integer.valueOf(((Integer)count.get(((Dto)items.get(i)).getAsString("outid"))).intValue() + 1);
        count.put(((Dto)items.get(i)).getAsString("outid"), c);
      } else {
        count.put(((Dto)items.get(i)).getAsString("outid"), Integer.valueOf(1));
      }
    }

    Set keys = count.keySet();
    Iterator it = keys.iterator();
    while (it.hasNext()) {
      String key = (String)it.next();
      Integer con = (Integer)this.g4Dao.queryForObject("stocksystem.getInStockItemManageResultCount", key);
      Integer value = (Integer)count.get(key);
      System.out.println(value == con);
      if ((con != null) && (con.equals(value))) {
        idList.add(key);
      }
    }
    SapTransfer transferservice = new SapTransferImpl();
    TransferInfo transferInfo = new TransferInfo();
    AigTransferTable table = transferInfo.getTable("IT_ITAB");
    int con = 0;
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      if (item.getAsString("manageresult").startsWith("1.")) {
        con++;
        String goodType = (String)this.g4Dao.queryForObject("stocksystem.getmatnrmatkl", item);
        String lgortto = "0001";
        if ("ZP".equals(goodType))
          lgortto = "0014";
        else if ("BC".equals(goodType))
          lgortto = "0012";
        else if ("DJ".equals(goodType)) {
          lgortto = "0013";
        }

        item.put("lgortfrom", item.get("lgort"));
        item.put("lgortto", lgortto);
        table.setValue("MATNR", item.get("matnr"));
        table.setValue("MENGE", item.get("goodscount"));
        table.setValue("LGORT", item.get("lgort"));
        table.setValue("BATCH", item.get("charg"));
        table.setValue("UMLGO", lgortto);
        table.setValue("WERKS", item.get("werks"));
        table.setValue("UMWRK", item.get("werks"));
        table.appendRow();
        updateList.add(item);
      }
    }
    if (con > 0) {
      transferInfo.appendTable(table);

      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_15", transferInfo);
      Map retResult = outinfo.getAigStructure("GT_STORE_15");
      System.out.println(retResult.get("TYPE"));
      String msg = (String)retResult.get("MESSAGE");
      System.out.println(retResult.get("MESSAGE"));
      System.out.println(retResult.get("MBLNR"));
      System.out.println(retResult.get("MJAHR"));

      if ("S".equals(retResult.get("TYPE"))) {
        retDto.put("success", msg + "，生成凭证号：" + retResult.get("MBLNR"));
        moveLgortForHeadResult(updateList);
      } else {
        retDto.put("error", msg);
      }
    }

    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      this.g4Dao.update("stocksystem.submitInStockItemManageResult", item);
    }

    headDto.put("idList", idList);
    this.g4Dao.update("stocksystem.submitInStockHeadManageResultForItem", headDto);
  }

  public void submitMoveLgort(List<Dto> items)
  {
    for (int i = 0; i < items.size(); i++)
      try {
        Dto item = (Dto)items.get(i);
        Dto count = (Dto)this.g4Dao.queryForObject("stocksystem.getLgortCount", item);
        String meins = (String)this.g4Dao.queryForObject("stocksystem.getMeins", item);
        item.put("meins", meins);

        if (G4Utils.isNotEmpty(count)) {
          if (Double.parseDouble(item.getAsString("salesquantity")) == Double.parseDouble(count.getAsString("labst"))) {
            item.put("inwerks", item.get("werks"));
            item.put("lgort", item.get("lgortto"));
            Integer ifExits = (Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", item);
            if (ifExits.intValue() == 0) {
              this.g4Dao.update("stocksystem.submitMoveLgort", item);
            } else {
              this.g4Dao.update("stocksystem.submitMoveLgortForPlus", item);
              this.g4Dao.update("stocksystem.submitMoveLgortForUpdate", item);
            }
          } else {
            item.put("inwerks", item.get("werks"));
            item.put("lgort", item.get("lgortto"));
            Integer ifExits = (Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", item);
            this.g4Dao.update("stocksystem.submitMoveLgortForPlus", item);
            if (ifExits.intValue() == 0)
              this.g4Dao.insert("stocksystem.submitMoveLgortForAdd", item);
            else
              this.g4Dao.update("stocksystem.submitMoveLgortForUpdate", item);
          }
        }
        else {
          count = (Dto)this.g4Dao.queryForObject("stocksystem.getLgortCount48", item);

          if (Double.parseDouble(item.getAsString("salesquantity")) == Double.parseDouble(count.getAsString("labst"))) {
            item.put("inwerks", item.get("werks"));
            item.put("lgort", item.get("lgortto"));
            Integer ifExits = (Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock48", item);
            if (ifExits.intValue() == 0) {
              this.g4Dao.update("stocksystem.submitMoveLgort48", item);
            } else {
              this.g4Dao.update("stocksystem.submitMoveLgortForPlus48", item);
              this.g4Dao.update("stocksystem.submitMoveLgortForUpdate48", item);
            }
          } else {
            item.put("inwerks", item.get("werks"));
            item.put("lgort", item.get("lgortto"));
            Integer ifExits = (Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock48", item);
            this.g4Dao.update("stocksystem.submitMoveLgortForPlus48", item);
            if (ifExits.intValue() == 0)
              this.g4Dao.insert("stocksystem.submitMoveLgortForAdd", item);
            else
              this.g4Dao.update("stocksystem.submitMoveLgortForUpdate48", item);
          }
        }
      }
      catch (Exception e)
      {
        Log.debug("处理库位时出现错误:" + e.getMessage());
        e.printStackTrace();
      }
  }

  public void submitNoPriceOutStock(Dto headDto, List<Dto> orderItem)
    throws Exception
  {
    this.g4Dao.insert("stocksystem.saveNoPriceOutStockHead", headDto);
    for (int i = 0; i < orderItem.size(); i++) {
      Dto item = (Dto)orderItem.get(i);
      item.put("id", headDto.get("id"));
      this.g4Dao.insert("stocksystem.saveNoPriceOutStockItem", item);
    }
  }

  public void submitNoPriceMoveLgort(Dto dto, List<Dto> items)
  {
    this.g4Dao.update("stocksystem.updateNoPriceMoveLgrotHead", dto);
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      if (G4Utils.isEmpty(item.get("charg"))) {
        item.put("charg", "");
      }
      item.put("werks", "WJZC");
      Dto count = (Dto)this.g4Dao.queryForObject("stocksystem.getLgortCount", item);
      String meins = (String)this.g4Dao.queryForObject("stocksystem.getMeins", item);
      item.put("meins", meins);

      this.g4Dao.update("stocksystem.submitMoveLgortForPlus", item);
      Dto count2 = (Dto)this.g4Dao.queryForObject("stocksystem.getLgortToCount", item);
      if (count2 != null)
        this.g4Dao.insert("stocksystem.submitMoveLgortForUpdate", item);
      else
        this.g4Dao.insert("stocksystem.submitMoveLgortForAdd", item);
    }
  }

  public void rejTo1000(Dto stockHeader, List<Dto> stockItems)
    throws Exception
  {
    insertOutStockInfo(stockHeader, stockItems);
  }

  public void updateNoPriceOutStock(Dto headDto, List<Dto> orderItem)
  {
    this.g4Dao.update("stocksystem.updateNoPriceOutStockHead", headDto);
    this.g4Dao.delete("stocksystem.delNoPriceOutStockItem", headDto);
    for (int i = 0; i < orderItem.size(); i++) {
      Dto item = (Dto)orderItem.get(i);
      item.put("id", headDto.get("id"));
      this.g4Dao.insert("stocksystem.saveNoPriceOutStockItem", item);
    }
  }

  public void submitTransfer(Dto dto, List<Dto> stockItems)
  {	
	//增加出库日期  20150206
	dto.put("outtim",G4Utils.getCurrentTime("yyyy-MM-dd hh:mm:ss"));
    this.g4Dao.update("stocksystem.submitTransfer", dto);
    for (int i = 0; i < stockItems.size(); i++) {
      Dto item = (Dto)stockItems.get(i);
      String meins = (String)this.g4Dao.queryForObject("stocksystem.getMeins", item);
      item.put("meins", meins);
      int lgortcount = ((Integer)this.g4Dao.queryForObject("stocksystem.getLgortCountForFrom", item)).intValue();
      int con = 0;
      if (lgortcount > 0)
        con = this.g4Dao.update("stocksystem.moveLgort", item);
      else {
        con = this.g4Dao.update("stocksystem.moveLgort48", item);
      }
      item.put("lgortfrom", item.get("instock"));
      item.put("lgort", item.get("instock"));
      item.put("lgortto", item.get("instock"));
      item.put("werks", item.get("inwerks"));
      Dto count = (Dto)this.g4Dao.queryForObject("stocksystem.getLgortCount", item);
      if (G4Utils.isNotEmpty(count))
        con = this.g4Dao.update("stocksystem.moveLgortForUpdate", item);
      else
        con = this.g4Dao.update("stocksystem.moveLgortForAdd", item);
    }
  }

  public void updatePriceStatus(List<Dto> items)
    throws Exception
  {
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      item.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
      this.g4Dao.update("stocksystem.updatePriceStatus", item);
    }
  }

  public void fillStockToStockTaking(String orderStockTakingId, String werks)
  {
    Dto dto = new BaseDto();
    String maxId = (String)this.g4Dao.queryForObject("stocksystem.getmaxstockTakingid", orderStockTakingId);
    dto.put("id", maxId);
    dto.put("werks", werks);

    int con = this.g4Dao.delete("stocksystem.delStockToStockTakingDetail", dto);
    System.out.println(con);

    con = this.g4Dao.update("stocksystem.copyStockToStockTakingDetail", dto);
    System.out.println(con);
  }

  public void moveLgortForHeadResult(List<Dto> moveList)
  {
    for (int i = 0; i < moveList.size(); i++)
      try {
        Dto item = (Dto)moveList.get(i);
        item.put("lgortfrom", item.get("lgort"));
        item.put("inwerks", item.get("werks"));
        item.put("lgort", item.get("lgortto"));
        item.put("salesquantity", item.get("goodscount"));
        int count = ((Integer)this.g4Dao.queryForObject("stocksystem.validateIfHaveStock", item)).intValue();
        if (count == 1) {
          this.g4Dao.update("stocksystem.moveLgortForUpdate", item);
          this.g4Dao.update("stocksystem.submitMoveLgortForPlus", item);
        } else {
          this.g4Dao.update("stocksystem.submitMoveLgort", item);
        }
      } catch (Exception e) {
        Log.debug("处理库位时出现错误:" + e.getMessage());
        e.printStackTrace();
      }
  }

  public Dto submitInStockHeadManageResult(List<Dto> items)
    throws Exception
  {
    Dto retDto = new BaseDto();
    List moveList = new ArrayList();

    SapTransfer transferservice = new SapTransferImpl();
    TransferInfo transferInfo = new TransferInfo();
    AigTransferTable table = transferInfo.getTable("IT_ITAB");
    int con = 0;
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      if (item.getAsString("headmanageresult").startsWith("1.")) {
        List goodItems = this.g4Dao.queryForList("stocksystem.getInstockHeadItems", item);
        for (int j = 0; j < goodItems.size(); j++) {
          Dto goodItem = (Dto)goodItems.get(j);
          con++;
          String goodType = (String)this.g4Dao.queryForObject("stocksystem.getmatnrmatkl", goodItem);
          String lgortto = "0001";
          if ("ZP".equals(goodType))
            lgortto = "0014";
          else if ("BC".equals(goodType))
            lgortto = "0012";
          else if ("DJ".equals(goodType)) {
            lgortto = "0013";
          }

          goodItem.put("lgort", goodItem.get("instock"));
          goodItem.put("werks", goodItem.get("inwerks"));
          goodItem.put("lgortto", lgortto);
          table.setValue("MATNR", goodItem.get("matnr"));
          table.setValue("MENGE", goodItem.get("goodscount"));
          table.setValue("LGORT", goodItem.get("instock"));
          table.setValue("BATCH", goodItem.get("charg"));
          table.setValue("UMLGO", lgortto);
          table.setValue("WERKS", goodItem.get("inwerks"));
          table.setValue("UMWRK", goodItem.get("inwerks"));
          table.appendRow();
          moveList.add(goodItem);
        }
      }
    }
    if (con > 0) {
      transferInfo.appendTable(table);

      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE_15", transferInfo);
      Map retResult = outinfo.getAigStructure("GT_STORE_15");
      System.out.println(retResult.get("TYPE"));
      String msg = (String)retResult.get("MESSAGE");
      System.out.println(retResult.get("MESSAGE"));
      System.out.println(retResult.get("MBLNR"));
      System.out.println(retResult.get("MJAHR"));

      if ("S".equals(retResult.get("TYPE"))) {
        retDto.put("success", msg + "<br/>生成凭证号：" + retResult.get("MBLNR"));
        moveLgortForHeadResult(moveList);
      } else {
        retDto.put("error", msg);
      }
    }

    for (int i = 0; i < items.size(); i++) {
      Dto itemDto = (Dto)items.get(i);
      this.g4Dao.update("stocksystem.submitInStockHeadManageResult", itemDto);
    }

    return retDto;
  }

  public void saveJoinnerReturnOrder(Dto headDto, List<Dto> items) {
    Double totallabst = Double.valueOf(0.0D);
    int totalcount = 0;
    for (int i = 0; i < items.size(); i++) {
      Dto item = (Dto)items.get(i);
      item.put("id", headDto.get("id"));
      totallabst = Double.valueOf(totallabst.doubleValue() + Double.parseDouble(item.getAsString("labst")));
      totalcount += 1;
      this.g4Dao.insert("stocksystem.saveJoinnerReturnOrderItem", item);
    }
    headDto.put("totallabst", totallabst);
    headDto.put("totalcount", totalcount);
    this.g4Dao.insert("stocksystem.saveJoinnerReturnOrderHead", headDto);
  }
  
	public void submitJoinnerReturnOrder(Dto paramDto) {
		this.g4Dao.update("stocksystem.submitJoinnerReturnOrder", paramDto);
	}
	
	public void sendJoinnerReturnOrder(Dto paramDto) {
		this.g4Dao.update("stocksystem.sendJoinnerReturnOrder", paramDto);
	}
	
	public void deleteJoinnerReturnStore(Dto paramDto) {
		this.g4Dao.update("stocksystem.deleteJoinnerReturnStore", paramDto);
	}
	
	public void returnJoinnerReturnOrder(Dto paramDto) {
		this.g4Dao.update("stocksystem.returnJoinnerReturnOrder", paramDto);
	}
	
	public void deleteJoinnerReturnOrder(Dto paramDto) {
		this.g4Dao.delete("stocksystem.deleteJoinnerReturnOrderItem", paramDto);
		this.g4Dao.delete("stocksystem.deleteJoinnerReturnOrderHead", paramDto);
	}
	
	public void deleteStockTransferOrder(Dto paramDto) {
		this.g4Dao.delete("stocksystem.deleteStockTransferOrderAllItem", paramDto);
		this.g4Dao.delete("stocksystem.deleteStockTransferOrderHead", paramDto);
	}
	
	public void deleteStockTransferOrderItem(Dto paramDto) {
		this.g4Dao.delete("stocksystem.deleteStockTransferOrderItem", paramDto);
	}
	
	
}