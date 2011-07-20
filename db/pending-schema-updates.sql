alter table users add column gender enum('M', 'F') not null;
alter table users add column weight int(11) not null;
update users set weight = 75000;
  
alter table servings add column units double not null;
update servings set units = 1.0;

