package org.eredlab.g4.arm.vo;

import java.sql.Timestamp;
import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class TopicVo extends BaseVo
{
  private Integer topicid;
  private String topictype;
  private String locked;
  private String userid;
  private String username;
  private String replyable;
  private Timestamp addtime;
  private Integer sortno;
  private Integer replycount;
  private Integer viewcount;
  private String title;
  private String content;
  private String content2;

  public Integer getTopicid()
  {
    return this.topicid;
  }

  public void setTopicid(Integer topicid) {
    this.topicid = topicid;
  }

  public String getTopictype() {
    return this.topictype;
  }

  public void setTopictype(String topictype) {
    this.topictype = topictype;
  }

  public String getLocked() {
    return this.locked;
  }

  public void setLocked(String locked) {
    this.locked = locked;
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

  public String getReplyable() {
    return this.replyable;
  }

  public void setReplyable(String replyable) {
    this.replyable = replyable;
  }

  public Timestamp getAddtime() {
    return this.addtime;
  }

  public void setAddtime(Timestamp addtime) {
    this.addtime = addtime;
  }

  public Integer getSortno() {
    return this.sortno;
  }

  public void setSortno(Integer sortno) {
    this.sortno = sortno;
  }

  public Integer getReplycount() {
    return this.replycount;
  }

  public void setReplycount(Integer replycount) {
    this.replycount = replycount;
  }

  public Integer getViewcount() {
    return this.viewcount;
  }

  public void setViewcount(Integer viewcount) {
    this.viewcount = viewcount;
  }

  public String getTitle() {
    return this.title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContent() {
    return this.content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getContent2() {
    return this.content2;
  }

  public void setContent2(String content2) {
    this.content2 = content2;
  }
}