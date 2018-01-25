package org.eredlab.g4.ccl.id.sequence;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.id.CreateSequnceException;
import org.eredlab.g4.ccl.id.InitSequenceGeneratorException;
import org.eredlab.g4.ccl.id.SequenceGenerator;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.storer.FileSequenceStorer;

public class DefaultSequenceGenerator
  implements SequenceGenerator
{
  protected long minValue = 0L;

  protected long maxValue = 9223372036854775807L;

  protected int cache = 100;

  protected boolean cycle = true;

  protected SequenceStorer sequenceStorer = new FileSequenceStorer();

  protected long currCount = 0L;
  protected long maxCount = this.cache + this.currCount;
  protected String id = "anonymity";
  protected boolean initiated = false;

  protected final Log logger = LogFactory.getLog(DefaultSequenceGenerator.class);

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public DefaultSequenceGenerator()
  {
  }

  public DefaultSequenceGenerator(String pId) {
    this.id = pId;
  }

  public void init() {
    this.initiated = true;
    long initValue = this.sequenceStorer.load(getId());
    initValue = Math.max(initValue, this.minValue);

    if (initValue > this.maxValue) {
      if (this.cycle) {
        initValue = this.minValue;
      } else {
        String msg = this.id + " 序号生成器的序号已经达到最大值:" + this.maxValue + 
          " 了！系统无法在分配序号！";
        this.logger.error(msg);
        throw new InitSequenceGeneratorException(msg);
      }
    }
    this.currCount = initValue;
    this.maxCount = (this.currCount + this.cache);
    this.maxCount = Math.min(this.maxCount, this.maxValue);
    this.sequenceStorer.updateMaxValueByFieldName(this.maxCount, getId());
  }

  public long next() throws CreateSequnceException {
    if (!this.initiated) {
      init();
    }
    if (this.currCount == this.maxCount) {
      long tmp = this.maxCount + this.cache;
      if (tmp >= this.maxValue) {
        if (this.cycle) {
          tmp = this.minValue;
        } else {
          String msg = this.id + " 序号生成器的序号已经达到最大值:" + this.maxValue + 
            " 了！系统无法在分配序号！";
          this.logger.error(msg);
          throw new CreateSequnceException(msg);
        }
      }
      this.sequenceStorer.updateMaxValueByFieldName(tmp, getId());
      this.maxCount = tmp;
    }
    this.currCount += 1L;
    return this.currCount;
  }

  public long getMinValue() {
    return this.minValue;
  }

  public void setMinValue(long minValue) {
    this.minValue = minValue;
  }

  public long getMaxValue() {
    return this.maxValue;
  }

  public void setMaxValue(long maxValue) {
    this.maxValue = maxValue;
  }

  public int getCache() {
    return this.cache;
  }

  public void setCache(int cache) {
    this.cache = cache;
  }

  public boolean isCycle() {
    return this.cycle;
  }

  public void setCycle(boolean cycle) {
    this.cycle = cycle;
  }

  public void setSequenceStorer(SequenceStorer sequenceStorer) {
    this.sequenceStorer = sequenceStorer;
  }
}