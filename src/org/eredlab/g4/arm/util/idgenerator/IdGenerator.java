package org.eredlab.g4.arm.util.idgenerator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.fomater.DefaultSequenceFormater;
import org.eredlab.g4.ccl.id.generator.DefaultIDGenerator;
import org.eredlab.g4.ccl.id.sequence.DefaultSequenceGenerator;
import org.eredlab.g4.ccl.util.G4Utils;

public class IdGenerator
{
  private static Log log = LogFactory.getLog(IdGenerator.class);
  private static int catche = 1;
  private static IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
  private String fieldname;

  public IdGenerator(String pFieldName)
  {
    setFieldname(pFieldName);
  }

  public IdGenerator()
  {
  }

  public DefaultIDGenerator getDefaultIDGenerator()
  {
    Dto dto = new BaseDto();
    dto.put("fieldname", getFieldname());
    dto = (BaseDto)g4Dao.queryForObject("IdGenerator.getEaSequenceByFieldName", dto);
    DefaultIDGenerator idGenerator = new DefaultIDGenerator();
    DefaultSequenceFormater sequenceFormater = new DefaultSequenceFormater();
    sequenceFormater.setPattern(dto.getAsString("pattern"));
    DefaultSequenceGenerator sequenceGenerator = new DefaultSequenceGenerator(getFieldname());
    SequenceStorer sequenceStorer = new DBSequenceStorer();
    sequenceGenerator.setSequenceStorer(sequenceStorer);
    sequenceGenerator.setCache(catche);
    idGenerator.setSequenceFormater(sequenceFormater);
    idGenerator.setSequenceGenerator(sequenceGenerator);
    return idGenerator;
  }

  public static String getMenuIdGenerator(String pParentid)
  {
    String maxSubMenuId = (String)g4Dao.queryForObject("IdGenerator.getMaxSubMenuId", pParentid);
    String menuId = null;
    if (G4Utils.isEmpty(maxSubMenuId)) {
      menuId = "01";
    } else {
      int length = maxSubMenuId.length();
      String temp = maxSubMenuId.substring(length - 2, length);
      int intMenuId = Integer.valueOf(temp).intValue() + 1;
      if ((intMenuId > 0) && (intMenuId < 10))
        menuId = "0" + String.valueOf(intMenuId);
      else if ((10 <= intMenuId) && (intMenuId <= 99))
        menuId = String.valueOf(intMenuId);
      else if (intMenuId > 99)
        log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成菜单编号越界了.同级兄弟节点编号为[01-99]\n请和您的系统管理员联系!");
      else {
        log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成菜单编号发生未知错误,请和开发人员联系!");
      }
    }
    return pParentid + menuId;
  }

  public static String getDeptIdGenerator(String pParentid)
  {
    String maxSubDeptId = (String)g4Dao.queryForObject("IdGenerator.getMaxSubDeptId", pParentid);
    String deptid = null;
    if (G4Utils.isEmpty(maxSubDeptId)) {
      deptid = "001";
    } else {
      int length = maxSubDeptId.length();
      String temp = maxSubDeptId.substring(length - 3, length);
      int intDeptId = Integer.valueOf(temp).intValue() + 1;
      if ((intDeptId > 0) && (intDeptId < 10))
        deptid = "00" + String.valueOf(intDeptId);
      else if ((10 <= intDeptId) && (intDeptId <= 99))
        deptid = "0" + String.valueOf(intDeptId);
      else if ((100 <= intDeptId) && (intDeptId <= 999))
        deptid = String.valueOf(intDeptId);
      else if (intDeptId > 999)
        log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成部门编号越界了.同级兄弟节点编号为[001-999]\n请和您的系统管理员联系!");
      else {
        log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成部门编号发生未知错误,请和开发人员联系!");
      }
    }
    return pParentid + deptid;
  }

  public static String getRfcIdGenerator(String pParentid)
  {
    String maxSubRfcId = (String)g4Dao.queryForObject("IdGenerator.getMaxSubRfcId", pParentid);
    String rfcid = null;
    if (G4Utils.isEmpty(maxSubRfcId)) {
      rfcid = "001";
    } else {
      int length = maxSubRfcId.length();
      String temp = maxSubRfcId.substring(length - 3, length);
      int intRfcId = Integer.valueOf(temp).intValue() + 1;
      if ((intRfcId > 0) && (intRfcId < 10))
        rfcid = "00" + String.valueOf(intRfcId);
      else if ((10 <= intRfcId) && (intRfcId <= 99))
        rfcid = "0" + String.valueOf(intRfcId);
      else if ((100 <= intRfcId) && (intRfcId <= 999))
        rfcid = String.valueOf(intRfcId);
      else if (intRfcId > 999)
        log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成RFC编号越界了.同级兄弟节点编号为[001-999]\n请和您的系统管理员联系!");
      else {
        log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成RFC编号发生未知错误,请和开发人员联系!");
      }
    }
    return pParentid + rfcid;
  }
  public String getFieldname() {
    return this.fieldname;
  }
  public void setFieldname(String fieldname) {
    this.fieldname = fieldname;
  }
}