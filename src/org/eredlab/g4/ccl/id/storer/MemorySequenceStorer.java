package org.eredlab.g4.ccl.id.storer;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.StoreSequenceException;

public class MemorySequenceStorer
  implements SequenceStorer
{
  private final Log logger = LogFactory.getLog(MemorySequenceStorer.class);

  private Map cache = new HashMap();

  public void init() {
  }

  public long load(String sequenceID) throws StoreSequenceException {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug("获取序号值,序号ＩＤ:" + sequenceID);
    }
    if (!this.cache.containsKey(sequenceID)) {
      updateMaxValueByFieldName(0L, sequenceID);
    }
    Long result = (Long)this.cache.get(sequenceID);
    return result.longValue();
  }

  public void updateMaxValueByFieldName(long sequence, String sequenceID) throws StoreSequenceException
  {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug("保存序号,序号ＩＤ:[" + sequenceID + "]序号值:" + sequence);
    }
    this.cache.put(sequenceID, new Long(sequence));
  }
}