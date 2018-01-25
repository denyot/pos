package cn.longhaul.pos.storerange.service.impl;

import cn.longhaul.pos.storerange.service.ManagerService;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

public class ManagerServiceImpl extends BaseServiceImpl
  implements ManagerService
{
  public List getBrandList(Dto dto)
    throws Exception
  {
    List list = this.g4Dao.queryForList("BrandManager.getBrandlist", dto);

    return list;
  }

  public int getBrandCount(Dto dto) throws Exception
  {
    Integer totalCount = (Integer)this.g4Dao.queryForObject(
      "BrandManager.getBrandCount", dto);
    return totalCount.intValue();
  }

  public void saveBrand(Dto dto) throws Exception
  {
    this.g4Dao.insert("BrandManager.saveBrand", dto);
  }

  public void updateBrand(Dto dto) throws Exception
  {
    this.g4Dao.update("BrandManager.updateBrand", dto);
  }

  public void delBrand(Dto dto)
    throws Exception
  {
    String idstr = dto.getAsString("strChecked");
    Dto pDto = new BaseDto();
    if ((idstr != null) && (!idstr.equals(""))) {
      String[] ids = idstr.split(",");
      for (int i = 0; i < ids.length; i++) {
        pDto.put("id", ids[i]);
        this.g4Dao.delete("BrandManager.delBrand", pDto);
      }
    }
  }

  public void saveBrandSale(Dto dto) throws Exception
  {
    this.g4Dao.delete("BrandManager.delBrandSale", dto);
    this.g4Dao.insert("BrandManager.saveBrandSale", dto);
  }

  public int getBrandSaleCount(Dto dto) throws Exception
  {
    Integer totalCount = (Integer)this.g4Dao.queryForObject(
      "BrandManager.getBrandSaleCount", dto);
    return totalCount.intValue();
  }

  public List getBrandSaleList(Dto dto) throws Exception
  {
    String datetype = dto.getAsString("datatype");
    List list = new ArrayList();
    List list2 = new ArrayList();
    String extend = dto.getAsString("extend");
    if (datetype != null) {
      if (datetype.equals("y")) {
        list = this.g4Dao.queryForList(
          "BrandManager.getBrandSaleListByYear", dto);
      }
      if (datetype.equals("m"))
      {
        list = this.g4Dao.queryForList(
          "BrandManager.getBrandSaleListByMonth", dto);
        String[] exts = extend.split("-");
        dto.put("year", exts[0]);
        dto.put("mouth", exts[1]);
        list2 = this.g4Dao.queryForList(
          "BrandManager.getBrandSaleListByMonth", dto);
        HashMap map2 = null;
        for (int i = 0; i < list.size(); i++) {
          HashMap map = (HashMap)list.get(i);
          map.put("sort", Integer.valueOf(0));
          map.put("compare", Integer.valueOf(0));
          String brandname = (String)map.get("brandname");
          for (int j = 0; j < list2.size(); j++) {
            map2 = (HashMap)list2.get(j);
            if ((brandname.equals((String)map2.get("brandname"))) && 
              (map2.get("brandsale") != null))
            {
              if (!((Double)map2.get("brandsale"))
                .equals(""))
              {
                map.put("sort", Integer.valueOf(j + 1));
                map.put("compare", Integer.valueOf(j - i));
                break;
              }
            }
          }
          list.set(i, map);
        }
      }
      if (datetype.equals("w"))
      {
        list = this.g4Dao.queryForList(
          "BrandManager.getBrandSaleListByWeek", dto);
        String[] exts = extend.split("-");
        dto.put("year", exts[0]);
        dto.put("mouth", exts[1]);
        dto.put("week", exts[2]);
        list2 = this.g4Dao.queryForList(
          "BrandManager.getBrandSaleListByWeek", dto);
        HashMap map2 = null;
        for (int i = 0; i < list.size(); i++) {
          HashMap map = (HashMap)list.get(i);
          map.put("sort", Integer.valueOf(0));
          map.put("compare", Integer.valueOf(0));
          String brandname = (String)map.get("brandname");
          for (int j = 0; j < list2.size(); j++) {
            map2 = (HashMap)list2.get(j);
            if ((brandname.equals((String)map2.get("brandname"))) && 
              ((String)map2.get("brandsale") != null))
            {
              if (!((String)map2.get("brandsale"))
                .equals(""))
              {
                map.put("sort", Integer.valueOf(j + 1));
                map.put("compare", Integer.valueOf(j - i));
                break;
              }
            }
          }
          list.set(i, map);
        }
      }
    }

    return list;
  }

  public Dto getDeptTree(Dto dto) throws Exception
  {
    Dto outDto = new BaseDto();
    String parentId = dto.getAsString("node");
    List list = this.g4Dao.queryForList("BrandManager.getdepttreelist", dto);
    Dto rfcDto = new BaseDto();
    for (int i = 0; i < list.size(); i++) {
      rfcDto = (BaseDto)list.get(i);
      if (rfcDto.getAsString("leaf").equals("1")) {
        rfcDto.put("leaf", new Boolean(true));
      } else {
        rfcDto.put("leaf", new Boolean(false));
        rfcDto.put("expanded", new Boolean(false));
      }
      if (rfcDto.getAsString("id").length() == parentId.length() + 3)
        rfcDto.put("expanded", new Boolean(false));
      rfcDto.put("id", rfcDto.getAsString("id"));
      rfcDto.put("parentid", rfcDto.getAsString("parentid"));
    }
    outDto.put("jsonString", JsonHelper.encodeObject2Json(list));
    return outDto;
  }

  public void saveBrandSale2(Dto dto) throws Exception
  {
    Connection con = this.g4Dao.getConnection();
    Statement stmt = null;
    StringBuffer sql = new StringBuffer();

    String oldbrandsales = dto.getAsString("oldbrandsales");
    String newbrandsales = dto.getAsString("newbrandsales");
    try {
      con.setAutoCommit(false);
      stmt = con.createStatement();

      if ((newbrandsales != null) && (!newbrandsales.equals("")))
      {
        String[] newbrands = newbrandsales.split("@");
        for (int i = 0; i < newbrands.length; i++) {
          sql = new StringBuffer();
          String id = IDHelper.getUserID();

          sql
            .append(
            "INSERT INTO aig_brand(id,brandname,deptid) VALUES('")
            .append(id).append("','").append(
            newbrands[i].split(",")[0]).append("','")
            .append(dto.get("deptid")).append("')");
          stmt.addBatch(sql.toString());
          System.out.println(sql.toString());

          sql = new StringBuffer();
          sql
            .append(
            "INSERT INTO aig_brandsale(brandid,brandsale,datetype,year,mouth,week,deptid) VALUES ('")
            .append(id).append("','").append(
            newbrands[i].split(",")[1]).append("','")
            .append(dto.get("datetype")).append("','").append(
            dto.get("year")).append("','").append(
            dto.get("mouth")).append("','").append(
            dto.get("week")).append("','").append(
            dto.get("deptid")).append("')");
          stmt.addBatch(sql.toString());
        }
      }

      if ((oldbrandsales != null) && (!oldbrandsales.equals("")))
      {
        String[] oldbrands = oldbrandsales.split("@");
        for (int j = 0; j < oldbrands.length; j++) {
          String[] oldbrand = oldbrands[j].split(",");

          sql = new StringBuffer();
          sql.append("UPDATE aig_brand SET brandname ='").append(
            oldbrand[1]).append("' where id ='").append(
            oldbrand[0]).append("' and deptid='").append(
            dto.get("deptid")).append("'");
          stmt.addBatch(sql.toString());

          sql = new StringBuffer();
          sql.append("DELETE FROM aig_brandsale where brandid= '")
            .append(oldbrand[0]).append("' and datetype= '")
            .append(dto.get("datetype"))
            .append("' and year= '").append(dto.get("year"))
            .append("' and mouth= '").append(dto.get("mouth"))
            .append("' and deptid= '")
            .append(dto.get("deptid")).append("'");
          if ((dto.get("week") != null) && 
            (!dto.get("week").toString().equals(""))) {
            sql.append(" and week= '").append(dto.get("week"))
              .append("'");
          }
          System.out.println(sql.toString());
          stmt.addBatch(sql.toString());

          sql = new StringBuffer();
          sql
            .append(
            "INSERT INTO aig_brandsale(brandid,brandsale,datetype,year,mouth,week,deptid) VALUES ('")
            .append(oldbrand[0]).append("','").append(
            oldbrand[2]).append("','").append(
            dto.get("datetype")).append("','").append(
            dto.get("year")).append("','").append(
            dto.get("mouth")).append("','").append(
            dto.get("week")).append("','").append(
            dto.get("deptid")).append("')");
          stmt.addBatch(sql.toString());
        }
      }

      stmt.executeBatch();
      con.commit();
    } catch (Exception e) {
      con.rollback();
      throw e;
    } finally {
      stmt.close();
      con.close();
    }
  }
}