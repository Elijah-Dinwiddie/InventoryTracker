Purpose: A Web application that allows a user to add items to a stores inventory and also track the inventory of the store currently. The current database is set up so we can expand the we applications functions in the future.



Database: Can view dbdiagram here: https://dbdiagram.io/d/6883ffbfcca18e685ccf9840

Table menuItems {
  item_id int [pk, increment]
  item_name varchar
  item_price double
  vegan bool
}

Table Recipe {
  item_id int [ref :> menuItems.item_id]
  ingredient_id int [ref :> ingredients.ingredient_id]
  amount int
}

Table Store {
  store_name varchar
  store_id int [pk, increment]
  location varchar
  manager varchar
  contact_info varchar
}

Table Inventory {
  store_id int [ref :> Store.store_id]
  ingredient_id int [ref :> ingredients.ingredient_id]
  amount int

  indexes {
  (store_id, ingredient_id) [pk]
  }
}

Table StoreMenuItems {
  store_id int [ref: > Store.store_id]
  item_id int [ref: > menuItems.item_id]

  indexes {
    (store_id, item_id) [pk]
  }
}

table ingredients {
  ingredient_id int [pk, increment]
  ingredient_name varchar
}

constraints added: 
Alter table Recipe
Add constraint FK_Recipe_MenuItems
foreign key (item_id)
references MenuItems(item_id)
on delete cascade

alter table Inventory
add constraint FK_Inventory_Store
foreign key (store_id)
references Store(store_id)
on delete cascade

alter table StoreMenuItems
add constraint FK_StoreMenuItems_MenuItems
foreign key (item_id)
references MenuItems(item_id)
on delete cascade

alter table StoreMenuItems
add constraint FK_StoreMenuItems_Store
foreign key (store_id)
references Store(store_id)
on delete cascade;

CREATE TRIGGER trg_AddMenuItemToAllStores
ON menuItems
AFTER INSERT
AS
BEGIN
    -- Insert a row for each store for each new menu item
    INSERT INTO StoreMenuItems (store_id, item_id)
    SELECT s.store_id, i.item_id
    FROM Store s
    CROSS JOIN inserted i;
END;