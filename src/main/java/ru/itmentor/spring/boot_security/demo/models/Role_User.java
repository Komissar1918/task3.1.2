//package ru.itmentor.spring.boot_security.demo.models;
//
//import org.springframework.data.annotation.Transient;
//import org.springframework.security.core.GrantedAuthority;
//
//import javax.persistence.*;
//import java.util.Set;
//
//@Entity
//@Table(name = "t_role")
//public class Role_User implements GrantedAuthority {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id", nullable = false)
//    private Integer id;
//
//    private String name;
//    @Transient
//    @ManyToMany(mappedBy = "roles")
//    private Set<User> users;
//
//
//
//    public void setId(Integer id) {
//        this.id = id;
//    }
//
//    public Role_User() {
//    }
//
//    public Role_User(int id) {
//        this.id = id;
//    }
//
//    public Role_User(int id, String name) {
//        this.id = id;
//        this.name = name;
//    }
//
//    public int getId() {
//        return id;
//    }
//
//    public void setId(int id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public Set<User> getUsers() {
//        return users;
//    }
//
//    public void setUsers(Set<User> users) {
//        this.users = users;
//    }
//
//    @Override
//    public String getAuthority() {
//        return getName();
//    }
//}
