package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Document(collection = "users") 
public class User implements UserDetails{

    @Id
    private ObjectId id; //Autogenerado
    private String name;
    private String surname;
    @Indexed //Para optimizar la búsqueda
    private String fullname; //Para facilitar y no enrevesar las busquedas por nombre, creo como parte de user un campo que será su nombre completo
    private String email; //A efectos prácticos actúa como nombre de usuario
    private String password; 
    private String organization;
    private ArrayList <ObjectId> groupsIds= new ArrayList <>();
    private ArrayList <ObjectId> tasksIds= new ArrayList <>(); //Refactorizar a que la lista de tareas sean las keys del mapa?
    private Map <String, UserResponse> responses= new HashMap<>();
    private UserType userType;
    private List <Role> roles= new ArrayList<>();
    private List <ObjectId> chats = new ArrayList<>();

    public User() {
        this.roles.add(Role.ROLE_USER);
    }

    public User(String name, String surname, String email, String password, String organization, UserType userType){
        this.name = name;
        this.surname = surname;
        this.fullname = name + " " + surname;
        this.email = email;
        this.password = password;
        this.organization = organization;
        this.roles.add(Role.ROLE_USER);
        this.userType = userType;
    }

    public User(String name, String surname, String email, String password, String organization, String userType){
        this.name = name;
        this.surname = surname;
        this.fullname = name + " " + surname;
        this.email = email;
        this.password = password;
        this.organization = organization;
        this.roles.add(Role.ROLE_USER);
        if (Objects.equals("PROFESSOR", userType)){
            this.userType = UserType.PROFESSOR;
        } else this.userType = UserType.STUDENT;
    }

    public void addGroup(ObjectId groupId){
        if (!this.groupsIds.contains(groupId)){
            this.groupsIds.add(0, groupId); //Añado el grupo al principio de la lista para que los más recientes se muestren primero
        } else throw new IllegalArgumentException("El usuario ya pertenece al grupo");
    }

    public void addTask(ObjectId taskId){
        if (!this.tasksIds.contains(taskId)){
            this.tasksIds.add(0, taskId); //Añado la tarea al principio de la lista para que las más recientes se muestren primero
            addResponse(taskId.toHexString(), new UserResponse()); //Añado entrada para la tarea en el mapa
        }
    }

    public void removeGroup(ObjectId groupId){
        if (this.groupsIds.contains(groupId)){
            this.groupsIds.remove(groupId);
        } else throw new IllegalArgumentException("El usuario no pertenece al grupo que se quiere eliminar");  
    }

    public void removeTask(ObjectId taskId){
        if (this.tasksIds.contains(taskId)){
            this.tasksIds.remove(taskId);
            deleteResponse(taskId.toHexString()); //Elimino la entrada de la tarea del mapa de respuestas
        } else throw new IllegalArgumentException("El usuario no tiene acceso a la tarea que se quiere eliminar");
    }

    public void addResponse(String key, UserResponse data){
        responses.put(key, data);
    }

    public void deleteResponse(String key){
        responses.remove(key);
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public ObjectId getId(){
        return this.id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getOrganization() {
        return organization;
    }

    public ArrayList<ObjectId> getGroupsIds() {
        return groupsIds;
    }

    public UserType getUserType() {
        return userType;
    }

    public Object getResponse(String key){
        return responses.get(key);
    }


    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surn) {
        this.surname = surn;
    }

    public void setPassword (String pwd) {
        this.password = pwd;
    }

    public void setOrganization(String org) {
        this.organization = org;
    }


    public void setGroupsIds(ArrayList<ObjectId> groupsIds) {
        this.groupsIds = groupsIds;
    }

    public ArrayList<ObjectId> getTasksIds() { //Refactorizable a getKeys del mapa de respuestas
        return tasksIds;
    }

    public void setTasksIds(ArrayList<ObjectId> tasksIds) {
        this.tasksIds = tasksIds;
    }

    public Map<String, UserResponse> getResponses() {
        return responses;
    }

    public void setResponses(Map<String, UserResponse> responses) {
        this.responses = responses;
    }

    public List<ObjectId> getChats() {
        return chats;
    }

    public void setChats(List<ObjectId> chats) {
        this.chats = chats;
    }

    public void addChat(ObjectId chatId) {
        this.chats.add(chatId);
    }

    public void removeChat(ObjectId chatId) {
        this.chats.remove(chatId);
    }

    @Override
    public boolean equals(Object o){
        if (o == this) return true;
        if (o == null || !(o instanceof User)) return false;
        User u = (User) o;
        return u.id.equals(this.id);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }
    
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}