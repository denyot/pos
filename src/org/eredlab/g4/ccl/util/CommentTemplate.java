package org.eredlab.g4.ccl.util;

import java.util.HashMap;
import java.util.Map;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class CommentTemplate extends BaseDto
{
  private String instanceVarable1;

  public Map methodA(String pId, Dto pDto)
    throws Exception
  {
    Map map = new HashMap();

    map.put("a", "01");
    String strTest = null;

    strTest = "A";

    return map;
  }
}