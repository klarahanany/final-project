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
    shiftType varchar(255),
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
        '160ILS',
        'LAMB',
        20,
        '/img/beef1.png'
    ),
    (
        'סטייק בקר חתוך עבה מפולפל',
        '85ILS',
        'LAMB',
        20,
        '/img/beef2.png'
    ),
    (
        'חזה עוף חתוך לקוביות רזה במיוחד',
        '40ILS',
        'CHICKEN',
        20,
        '/img/ch2.png'
    ),
    (
        'ירכי עוף ללא עצמות וללא עור (1 ק"ג)',
        '27ILS',
        'CHICKEN',
        20,
        '/img/ch1.png'
    ),
    (
        'פילה (1 ק"ג)',
        '280ILS',
        'CALF',
        20,
        '/img/phele.jpg'
    ),
    (
        'שווארמה בשר (1 ק"ג)',
        '40ILS',
        'CALF',
        20,
        '/img/shawarma3egel.jpg'
    ),
    (
        'שווארמה עוף (1 ק"ג)',
        '30ILS',
        'CHICKEN',
        20,
        '/img/shawarmachicken.jpg'
    ),
    (
        'סנטה (1 ק"ג)',
        '180ILS',
        'LAMB',
        20,
        '/img/senta3egel.jpg'
    ),
    (
        'כנפי עוף (1 ק"ג)',
        '12ILS',
        'CHICKEN',
        20,
        '/img/knafe3of.jpg'
    ),
    (
        'אנטריקות (1 ק"ג)',
        '230ILS',
        'LAMB',
        100,
        '/img/antrekot.jpg'
    ),
    (
        'צלעות (1 ק"ג)',
        '180ILS',
        'LAMB',
        100,
        '/img/tsla3ot.jpg'
    ),
    (
        'פילה מדומה (1 ק"ג)',
        '80ILS',
        'LAMB',
        100,
        '/img/feleh.jpg'
    ),
    (
        'צלי כתף (1 ק"ג)',
        '100ILS',
        'LAMB',
        100,
        '/img/tsle.jpg'
    ),
    (
        'קריספי עוף (1 ק"ג)',
        '70ILS',
        'CHICKEN',
        20,
        '/img/crispy.jpg'
    )
    ,
    (
        '(1 ק"ג)אנטריקוט מיושנת לפחות 60 יום',
        '160ILS',
        'LAMB',
        100,
        '/img/meyoshan.jpg'
    )
    ,
    (
        'אסדו מעושן',
        '450ILS',
        'LAMB',
        100,
        '/img/asado.jpg'
    ),
    (
        'בורגר עוף',
        '50ILS',
        'CHICKEN',
        100,
        '/img/3ofBurger.jpg'
    ),
    (
        'משוישת',
        '130ILS',
        'LAMB',
        100,
        '/img/mshoiesht.jpg'
    ),

    (
        '(1 ק"ג)עוף בגריל',
        '50ILS',
        'CHICKEN',
        100,
        '/img/3ofbgrel.jpg'
    ),
     (
        '(1 ק"ג)חזה עוף',
        '30ILS',
        'CHICKEN',
        100,
        '/img/haze3of.jpg'
    )
    ;
    
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
        'שתיווי',
        'אחמד',
        'ahmadshtewe',
        'ahmad.shtewe@gmail.com',
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
        '/img/ahmad.jpg'
    ),
    (
        2,
        'שתיווי',
        'עאטף',
        'atefshtewe',
        'atefshtewe@gmail.com',
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
        '/img/atef.jpg'
    ),
    (
        3,
        'שתיווי',
        'ריאד',
        'reyadShtewe',
        'reyadShtewe@gmail.com',
        '$2a$12$v8msQjDX0u3V2kvEbS10Xu4Gm4WSkWBQbbZRm3luJLlKznZlDdIGC',
        -- nada
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
        'שתיווי',
        'עלאא',
        'alaashtewe',
        'alaashtewe4@gmail.com',
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
        '/img/alaa.jpg'
    ),
    (
        5,
        'עויד',
        'שאדי',
        'shadiawied',
        'shadiawied@gmail.com',
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
        '/img/profile2.jpeg'
    ),
    (
        6,
        'שאמוט',
        'טאהא',
        'tahashamot',
        'tahashamot8@gmail.com',
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
        '/img/taha.jpg'
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
INSERT INTO shift (
        shiftDate,
        shiftType,
        UserName
    )
values(
        '2023-05-18',
        'MORNING',
        'ahmadshtewe'
    ),
    (
        '2023-06-18',
        'MORNING',
        'ahmadshtewe'
    );
INSERT INTO cart (Personid)
VALUES (1);
COMMIT;