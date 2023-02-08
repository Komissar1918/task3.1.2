package ru.itmentor.spring.boot_security.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.repositories.UserRepository;
import ru.itmentor.spring.boot_security.demo.security.UserDetailsImpl;


import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    //private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
       // this.passwordEncoder = passwordEncoder;
    }



    public List<User> findAll() {
        return userRepository.findAll();
    }


    public User findOne(Integer id) {
        Optional<User> findUser = userRepository.findById(id);
        return findUser.orElse(null);
    }


    @Transactional
    public void save(User user) {
//        String encodePass = passwordEncoder.encode(user.getPassword());
//        user.setPassword(encodePass);
        user.setRole("ROLE_USER");
        userRepository.save(user);
    }




    @Transactional
    public void update(Integer id, User user) {
        user.setId(id);
        userRepository.save(user);
    }


    @Transactional
    public void delete(Integer id) {
        userRepository.deleteById(id);
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByName(username);
        if(user.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }
        return new UserDetailsImpl(user.get());
    }
}
