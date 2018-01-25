package org.eredlab.g4.ccl.id.loader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ResourcesLoader
{
  private static final Log logger = LogFactory.getLog(ResourcesLoader.class);

  private static String getSequenceFile(String pWebHome)
  {
    return pWebHome + "/WEB-INF/classes/" + 
      "g4-id-sequence-store.properties";
  }

  public static void load(String pWebHome) throws LoadResourcesException
  {
    if (pWebHome == null) {
      return;
    }
    String sequenceFile = getSequenceFile(pWebHome);
    File file = new File(sequenceFile);
    if (file.exists()) {
      return;
    }
    InputStream in = ResourcesLoader.class
      .getResourceAsStream("g4-id-sequence-store.properties");
    try {
      FileOutputStream fos = new FileOutputStream(sequenceFile);
      int cache = 1024;
      byte[] b = new byte[1024];
      int aa = 0;
      while ((aa = in.read(b)) != -1)
        fos.write(b, 0, aa);
    }
    catch (Exception ex) {
      String MSG = "导出Sequence文件:" + sequenceFile + "失败!";
      logger.error(MSG, ex);
      throw new LoadResourcesException(MSG, ex);
    }
  }
}