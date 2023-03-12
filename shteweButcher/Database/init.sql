BEGIN;
DROP TABLE IF EXISTS customers,
cart,
workers,
shift,
products,
orders,
orderdetail,cartitems;
CREATE TABLE customers (
    personid SERIAL,
    username varchar(255) UNIQUE,
    Email varchar(255),
    Password varchar(255),
    PRIMARY KEY (personid) -- cartId varchar(255) REFERENCES workers (CartId)
);

 CREATE TABLE products (
    productid SERIAL UNIQUE,
    description varchar(255),
    price VARCHAR(225),
    type varchar(255) CHECK(
        type = 'CHICKEN'
        OR type = 'LAMB'
        OR type = 'CALF'
    ),
    quantity INT,
    img VARCHAR(255) UNIQUE,
    PRIMARY KEY (productid)
);
CREATE TABLE cart (
    cartid SERIAL,
    personid INT REFERENCES customers (personid) UNIQUE,
    PRIMARY KEY(cartid)
);
CREATE TABLE cartitems(
    cartid INT REFERENCES cart (cartid),
    productid INT REFERENCES products (productid),
    quantity INT
);
CREATE TABLE orders (
    ordersid SERIAL UNIQUE,
    orderdate DATE,
    personid INT REFERENCES customers (personid),
    PRIMARY KEY (ordersid)
);
CREATE TABLE orderdetail (
    ordersid INT REFERENCES orders (ordersid),
    productid INT REFERENCES products (productid),
    totalprice VARCHAR(225),
    productquantity INT
);
CREATE TABLE workers (
    employeeId int,
    LastName varchar(255),
    FirstName varchar(255),
    UserName varchar(255) UNIQUE,
    Email varchar(255),
    Password varchar(255),
    Address varchar(255),
    City varchar(255),
    Catagory varchar(255) CHECK(
        Catagory = 'ADMIN'
        OR Catagory = 'WORKER'
    ),
    phone varchar(15) NOT NULL UNIQUE,
    PRIMARY KEY(employeeId)
);
CREATE TABLE shift(
    shiftid SERIAL,
    shiftDate DATE,
    shiftType varchar(255) CHECK(
        shiftType = 'MORNING'
        OR shiftType = 'EVENING'
        OR shiftType = 'DAYOFF'
    ),
    PRIMARY KEY (shiftid),
    UserName varchar(255) REFERENCES workers (UserName)
);
INSERT INTO products (
        description,
        price,
        type,
        quantity,
        img
    )
values(
        'סטייק בשר בקר x4',
        '7$',
        'LAMB',
        20,
        '/img/beef1.png'
    );
INSERT INTO products (
      description,
        price,
        type,
        quantity,
        img
    )
values(
        'סטייק בקר חתוך עבה מפולפל',
        '5.8$',
        'LAMB',
        20,
        '/img/beef2.png'
    );
INSERT INTO products (
       description,
        price,
        type,
        quantity,
        img
    )
values(
        'חזה עוף חתוך לקוביות רזה במיוחד',
        '5.6$',
        'CHICKEN',
        20,
        '/img/ch2.png'
    );
INSERT INTO products (
      description,
        price,
        type,
        quantity,
        img
    )
values(
        'ירכי עוף ללא עצמות וללא עור (1 ק"ג)',
        '5.2$',
        'CHICKEN',
        20,
        '/img/ch1.png'
    );
    INSERT INTO products (
       description,
        price,
        type,
        quantity,
        img
    )
values(
        'פילה (1 ק"ג)',
        '5.2$',
        'CALF',
        20,
        '/img/phele.jpg'
    );
INSERT INTO products (
       description,
        price,
        type,
        quantity,
        img
    )
values(
        'שווארמה בשר (1 ק"ג)',
        '5.2$',
        'CALF',
        20,
        '/img/shawarma3egel.jpg'
    );
INSERT INTO products (
   description,
        price,
        type,
        quantity,
        img
    )
values(
        'שווארמה עוף (1 ק"ג)',
        '5.2$',
        'CHICKEN',
        20,
        '/img/shawarmachicken.jpg'
    );
INSERT INTO products (
       description,
        price,
        type,
        quantity,
        img
    )
values(
        'סנטה (1 ק"ג)',
        '5.2$',
        'LAMB',
        20,
        '/img/senta3egel.jpg'
    );
INSERT INTO products (
      description,
        price,
        type,
        quantity,
        img
    )
values(
        'כנפי עוף (1 ק"ג)',
        '5.2$',
        'LAMB',
        20,
        '/img/knafe3of.jpg'
    );
INSERT INTO products (
     description,
        price,
        type,
        quantity,
        img
    )
values(
        'אנטריקות (1 ק"ג)',
        '5.2$',
        'LAMB',
        20,
        '/img/antrekot.jpg'
    );

INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        1,
        'hanany',
        'klara',
        'klarahanany',
        'klarosh.hanany@gmail.com',
        '$2a$10$HPJhNJ7H/tSNcGwpsrGycun0lj0hQIfEHHJt6pKCp3Q9cmDKkF/qi',
        'maker',
        'acre',
        'WORKER',
        '0545555555'
    );
INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        2,
        'hanany',
        'rania',
        'raniahanany',
        'rania.hanany@gmail.com',
        '$2a$12$uNGDdGgN4SkqfSNAkOjOMODKzXqzsMpRiRYUWd6kPDKx9nLwN9CtS',
        'maker',
        'acre',
        'WORKER',
        '0546666666'
    );
INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        3,
        'shtewe',
        'nada',
        'nadashtewe',
        'nadashtewe8@gmail.com',
        '$2a$12$v8msQjDX0u3V2kvEbS10Xu4Gm4WSkWBQbbZRm3luJLlKznZlDdIGC',
        'nazareth',
        'nazareth',
        'ADMIN',
        '0547777777'
    );
INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        4,
        'shtewe',
        'shahdd',
        'shahdshtewe',
        'shahdshtewe8@gmail.com',
        '$2a$12$e8JUvtasb6kPHgtXerkR/Oo4UChdolrq5CZtkf14FBWWWhEM30w9q',
        'nazareth',
        'nazareth',
        'WORKER',
        '0548888888'
    );
INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        5,
        'shtewe',
        'reyad',
        'reyadshtewe',
        'reyadshtewe8@gmail.com',
        '$2a$10$cChh302B29Y.DRZOm2Ra3.akKdo..3y4crsELZ0F..NbNbbqrEu16',
        'nazareth',
        'nazareth',
        'WORKER',
        '0541010101'
    );
    INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        6,
        'hanany',
        'soha',
        'rt',
        'rt.hanany@gmail.com',
        '$2a$10$HPJhNJ7H/tSNcGwpsrGycun0lj0hQIfEHHJt6pKCp3Q9cmDKkF/qi',
        'maker',
        'acre',
        'WORKER',
        '05455555'
    );
        INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        7,
        'hanany',
        'so',
        'r',
        'r.hanany@gmail.com',
        '$2a$10$HPJhNJ7H/tSNcGwpsrGycun0lj0hQIfEHHJt6pKCp3Q9cmDKkF/qi',
        'maker',
        'acre',
        'WORKER',
        '0543455555'
    );
            INSERT INTO workers (
        employeeId,
        LastName,
        FirstName,
        UserName,
        Email,
        Password,
        Address,
        City,
        Catagory,
        phone
    )
values(
        8,
        'hanany',
        'so3',
        'r3',
        'r3.hanany@gmail.com',
        '$2a$10$HPJhNJ7H/tSNcGwpsrGycun0lj0hQIfEHHJt6pKCp3Q9cmDKkF/qi',
        'maker',
        'acre',
        'WORKER',
        '0543725555'
    );
-- INSERT INTO shift (
--         shiftDate,
--         shiftType,
--         UserName
--     )
-- values(
--         '2023-03-17',
--         'MORNING',
--         'klarahanany'
--     );
INSERT INTO customers (
        UserName,
        Email,
        Password
    )
values(
        'klarahanany',
        'klarosh.hanany@gmail.com',
        '$2a$10$HPJhNJ7H/tSNcGwpsrGycun0lj0hQIfEHHJt6pKCp3Q9cmDKkF/qi'
    );
    INSERT INTO cart (Personid) VALUES (1);
COMMIT;