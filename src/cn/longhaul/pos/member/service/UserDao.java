package cn.longhaul.pos.member.service;

import java.util.List;

/**
 * 会员相关
 */
public interface UserDao {
    /**
     * 查询所有过生日的会员
     * @return 简单会员对象(称呼和电话号码)集合
     */
    List<User> getUserList();
}