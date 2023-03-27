BEGIN;
DROP TABLE IF EXISTS customers,
cart,
workers,
shift,
products,
orders,
orderdetail,
cartitems,
feedback,
temporaryshifts,
shiftTemp,
askForChange;
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
    img VARCHAR(65535) UNIQUE,
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

CREATE TABLE feedback(
    feedbackid SERIAL UNIQUE,
    personid INT REFERENCES customers (personid),
    feedback VARCHAR(255),
    PRIMARY KEY(feedbackid)
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
    City varchar(255),
    img varchar(65535),
    Catagory varchar(255) CHECK(
        Catagory = 'ADMIN'
        OR Catagory = 'WORKER'
    ),
    phone varchar(15) NOT NULL UNIQUE,
    Sunday varchar(255) CHECK(
        Sunday = 'MORNING'
        OR Sunday = 'EVENING'
        OR Sunday = 'DAYOFF'
    ),
    Monday varchar(255) CHECK(
        Monday = 'MORNING'
        OR Monday = 'EVENING'
        OR Monday = 'DAYOFF'
    ),
    Tuesday varchar(255) CHECK(
        Tuesday = 'MORNING'
        OR Tuesday = 'EVENING'
        OR Tuesday = 'DAYOFF'
    ),
    Wednesday varchar(255) CHECK(
        Wednesday = 'MORNING'
        OR Wednesday = 'EVENING'
        OR Wednesday = 'DAYOFF'
    ),
    Thursday varchar(255) CHECK(
        Thursday = 'MORNING'
        OR Thursday = 'EVENING'
        OR Thursday = 'DAYOFF'
    ),
    Friday varchar(255) CHECK(
        Friday = 'MORNING'
        OR Friday = 'EVENING'
        OR Friday = 'DAYOFF'
    ),
    PRIMARY KEY(employeeId)
);
-- CREATE TABLE temporaryshifts (
--     temporaryshift SERIAL,
--     morning1 varchar(255) REFERENCES workers (UserName),
--     morning2 varchar(255) REFERENCES workers (UserName),
--     evening1 varchar(255) REFERENCES workers (UserName),
--     evening2 varchar(255) REFERENCES workers (UserName) 
-- );
CREATE TABLE askForChange(
    askId SERIAL UNIQUE,
    dateAsked DATE,
    shiftType varchar(255) ,
    reason varchar(255),
    username varchar(255) REFERENCES workers (UserName),
    PRIMARY KEY(askId)
);
CREATE TABLE temporaryshifts (
    temporaryshift SERIAL,
    morning1 varchar(255),
    morning2 varchar(255),
    evening1 varchar(255),
    evening2 varchar(255),
    PRIMARY KEY(temporaryshift)
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
CREATE TABLE shiftTemp(
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
        '7ILS',
        'LAMB',
        20,
        '/img/beef1.png'
    ),
    (
        'סטייק בקר חתוך עבה מפולפל',
        '5.8ILS',
        'LAMB',
        20,
        '/img/beef2.png'
    ),
    (
        'חזה עוף חתוך לקוביות רזה במיוחד',
        '5.6ILS',
        'CHICKEN',
        20,
        '/img/ch2.png'
    ),
    (
        'ירכי עוף ללא עצמות וללא עור (1 ק"ג)',
        '5.2ILS',
        'CHICKEN',
        20,
        '/img/ch1.png'
    ),
    (
        'פילה (1 ק"ג)',
        '5.2ILS',
        'CALF',
        20,
        '/img/phele.jpg'
    ),
    (
        'שווארמה בשר (1 ק"ג)',
        '5.2ILS',
        'CALF',
        20,
        '/img/shawarma3egel.jpg'
    ),
    (
        'שווארמה עוף (1 ק"ג)',
        '5.2ILS',
        'CHICKEN',
        20,
        '/img/shawarmachicken.jpg'
    ),
    (
        'סנטה (1 ק"ג)',
        '5.2ILS',
        'LAMB',
        20,
        '/img/senta3egel.jpg'
    ),
    (
        'כנפי עוף (1 ק"ג)',
        '5.2ILS',
        'LAMB',
        20,
        '/img/knafe3of.jpg'
    ),
    (
        'אנטריקות (1 ק"ג)',
        '5.2ILS',
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
        City,
        Catagory,
        Sunday,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        phone,
        img
    )
values(
        1,
        'חנאני',
        'קלרה',
        'klarahanany',
        'klarosh.hanany@gmail.com',
        '$2a$10$HPJhNJ7H/tSNcGwpsrGycun0lj0hQIfEHHJt6pKCp3Q9cmDKkF/qi',
        'עכו',
        'WORKER',
        'DAYOFF',
        'MORNING',
        'EVENING',
        'MORNING',
        'MORNING',
        'EVENING',
        '0545555555',
        'https://bootdey.com/img/Content/avatar/avatar1.png'
    ),
    (
        2,
        'hanany',
        'rania',
        'raniahanany',
        'rania.hanany@gmail.com',
        '$2a$12$uNGDdGgN4SkqfSNAkOjOMODKzXqzsMpRiRYUWd6kPDKx9nLwN9CtS',
        'acre',
        'WORKER',
        'MORNING',
        'DAYOFF',
        'EVENING',
        'MORNING',
        'MORNING',
        'EVENING',
        '0546666666',
        'https://bootdey.com/img/Content/avatar/avatar1.png'
    ),
    (
        3,
        'shtewe',
        'nada',
        'nadashtewe',
        'nadashtewe8@gmail.com',
        '$2a$12$v8msQjDX0u3V2kvEbS10Xu4Gm4WSkWBQbbZRm3luJLlKznZlDdIGC',
        'nazareth',
        'ADMIN',
        'DAYOFF',
        'DAYOFF',
        'DAYOFF',
        'DAYOFF',
        'DAYOFF',
        'DAYOFF',
        '0547777777',
        'https://bootdey.com/img/Content/avatar/avatar1.png'
    ),
    (
        4,
        'shtewe',
        'nona',
        'nonashtewe',
        'nonashtewe8@gmail.com',
        '$2a$12$v8msQjDX0u3V2kvEbS10Xu4Gm4WSkWBQbbZRm3luJLlKznZlDdIGC',
        'nazareth',
        'WORKER',
        'MORNING',
        'EVENING',
        'MORNING',
        'EVENING',
        'EVENING',
        'DAYOFF',
        '0547777377',
        'https://bootdey.com/img/Content/avatar/avatar1.png'
    ),
    (
        5,
        'shtewe',
        '---',
        '---shtewe',
        '---shtewe8@gmail.com',
        '$2a$12$v8msQjDX0u3V2kvEbS10Xu4Gm4WSkWBQbbZRm3luJLlKznZlDdIGC',
        'nazareth',
        'WORKER',
        'EVENING',
        'EVENING',
        'MORNING',
        'EVENING',
        'DAYOFF',
        'MORNING',
        '0544977377',
        'https://bootdey.com/img/Content/avatar/avatar1.png'
    ),
    (
        6,
        'shtewe',
        'aaa',
        'aaashtewe',
        'aaashtewe8@gmail.com',
        '$2a$12$v8msQjDX0u3V2kvEbS10Xu4Gm4WSkWBQbbZRm3luJLlKznZlDdIGC',
        'nazareth',
        'WORKER',
        'MORNING',
        'EVENING',
        'MORNING',
        'EVENING',
        'DAYOFF',
        'MORNING',
        '054497337',
        'https://bootdey.com/img/Content/avatar/avatar1.png'
    );
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
INSERT INTO cart (Personid)
VALUES (1);
COMMIT;