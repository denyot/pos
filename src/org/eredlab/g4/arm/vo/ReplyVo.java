package org.eredlab.g4.arm.vo;

import java.sql.Timestamp;
import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class ReplyVo extends BaseVo
{
  private Integer replyid;
  private Integer topicid;
  private String userid;
  private String username;
  private Timestamp replytime;
  private Integer floor;
  private String replycontent;
  private String replycontent2;

  public String getReplycontent2()
  {
    return this.replycontent2;
  }

  public void setReplycontent2(String replycontent2) {
    this.replycontent2 = replycontent2;
  }

  public Integer getReplyid() {
    return this.replyid;
  }

  public void setReplyid(Integer replyid) {
    this.replyid = replyid;
  }

  public Integer getTopicid() {
    return this.topicid;
  }

  public void setTopicid(Integer topicid) {
    this.topicid = topicid;
  }

  public String getUserid() {
    return this.userid;
  }

  public void setUserid(String userid) {
    this.userid = userid;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Timestamp getReplytime() {
    return this.replytime;
  }

  public void setReplytime(Timestamp replytime) {
    this.replytime = replytime;
  }

  public Integer getFloor() {
    return this.floor;
  }

  public void setFloor(Integer floor) {
    this.floor = floor;
  }

  public String getReplycontent() {
    return this.replycontent;
  }

  public void setReplycontent(String replycontent) {
    this.replycontent = replycontent;
  }
}