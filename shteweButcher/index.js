const express = require("express")
const bcrypt = require("bcrypt")
const saltRounds = 10;
const app = express()
const port = 4000 || process.env.port
const cors = require("cors")
const db = require("./Database/connection");
const { request } = require("express");
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
const cookieparser = require("cookie-parser");
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4000"],
    })
);

app.use(cookieparser());
app.post("/", async (req, res) => {

    try {
        const { UserName, password } = req.body;
        const result = await db.query(`SELECT password FROM workers where username = ($1);`, [UserName]);
        const result2 = await db.query(`SELECT * FROM workers where username = ($1);`, [UserName]);

        await bcrypt.compare(password, result.rows[0].password).then((match) => {
            if (!match) {
                console.log("didn`t match !!!!")
            } else {
                console.log("match");
                if (result2.rows[0].catagory === "WORKER") {
                    res.cookie("username", UserName, { maxage: 18000000 });
                    res.json("successWorker");
                }
                else if (result2.rows[0].catagory === "ADMIN") {
                    res.json("successAdmin");
                }

                // res.redirect("/profile");
                // console.log("hahahh")

            }
        })


    }
    catch (err) {
        console.log("???")
    }

})
app.post("/login", async (req, res) => {

    try {
        const { UserName, password } = req.body;
        const result = await db.query(`SELECT password FROM customers where username = ($1);`, [UserName]);
        await bcrypt.compare(password, result.rows[0].password).then((match) => {
            if (!match) {
                console.log("didn`t match !!!!")
            } else {
                console.log("match");
                res.cookie("customerusername", UserName, { maxage: 18000000 });
                res.json("success");
            }
        })
    }
    catch (err) {
        console.log("???")
    }

})
app.post("/calendar", async (req, res) => {

    try {
        const { Day, Month, Year } = req.body;
        month = getMonth(Month);
        date = Year + "-" + month + "-" + Day;
        // console.log(date);
        const username2 = req.cookies.username;
        const result = await db.query(`SELECT shiftType FROM shift where username = '${username2}' and shiftdate='${date}';`);


        if ((result.rows[0]) !== undefined) {
            res.json(result.rows[0]);

        }
        else {
            res.json(" Still Not Determined");

        }
    }
    catch (err) {
        console.log("error");
    }
});
app.post("/signup", async (req, res) => {
    try {

        const { UserName, password, Email } = req.body;
        bcrypt.genSalt(saltRounds, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                var sql = `INSERT INTO customers (UserName,Password,Email) VALUES ('${UserName}','${hash}','${Email} ');`
                db.query(sql);

            });
        });
        setTimeout(async () => {
            const result = await db.query(`SELECT personid FROM customers where username='${UserName}'`)
            // console.log(result.rows[0].personid + " jdjdj")
            var sql = `INSERT INTO cart (Personid) VALUES ('${result.rows[0].personid}');`
            db.query(sql);
        }, 1000);

        res.json("success");

    }
    catch (err) {
        console.log("!!!!!")
    }
})

app.post("/profile", async (req, res) => {
    try {
        const username2 = req.cookies.username;
        const result = await db.query(`SELECT * FROM workers where username = ($1);`, [username2]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log("wrong!!!!")
    }
})
app.post("/allEmployes", async (req, res) => {
    try {
        // const username2 = req.cookies.username;
        // console.log(username2);
        const result = await db.query(`SELECT * FROM workers Where catagory='WORKER' ;`);
        res.json(result.rows);
    }
    catch (err) {
        console.log("wrong!!!!")
    }
})
app.post("/adminCalendar", async (req, res) => {
    try {
        if (req.body.num == '2') {
            const { x, Day, Month, Year } = req.body;
            month = getMonth(Month);
            date = Year + "-" + month + "-" + Day;
            const result1 = await db.query(`SELECT * FROM shift where shiftType = 'EVENING' and shiftdate='${date}';`)
            const result2 = await db.query(`SELECT * FROM shift where shiftType = 'MORNING' and shiftdate='${date}';`)
            const result3 = await db.query(`SELECT * FROM askforchange a inner join workers w on a.username = w.username  where dateasked='${date}';`)
            const result4 = await db.query(`SELECT * FROM  workers where catagory = 'WORKER';`)
            if (result1.rows.length == 0 && result2.rows.length == 0) {
                res.json('still not determined')
            }
            else {
                array = [];
                array2 = [];
                for (var i = 0; i < result2.rows.length; i++) {
                    const result = await db.query(`SELECT * FROM workers where username = '${result2.rows[i].username}';`)
                    array.push(result.rows[0].firstname + " " + result.rows[0].lastname)
                }
                for (var i = 0; i < result1.rows.length; i++) {
                    const result = await db.query(`SELECT * FROM workers where username = '${result1.rows[i].username}';`)
                    array2.push(result.rows[0].firstname + " " + result.rows[0].lastname)
                }
                res.json([array, array2, result3.rows, result4.rows])
            }
        }
        else if (req.body.num === '1') {
            const result = await db.query(`SELECT * FROM workers  Where catagory='WORKER' ;`);
            res.json(result.rows);
        } else {
            const { Day, Month, Year, MorningEmploye, EveningEmploye } = req.body;
            month = getMonth(Month);
            date = Year + "-" + month + "-" + Day;
            const result1 = db.query(`SELECT * FROM shift where shiftType = 'EVENING' and shiftdate='${date}';`)
            const result2 = db.query(`SELECT * FROM shift where shiftType = 'MORNING' and shiftdate='${date}';`)
            if ((await result1).rows.length == 0 && (await result2).rows.length == 0) {

                var sql1 = `INSERT INTO shift (
                    shiftDate,
                    shiftType,
                    UserName
                )
            values(
                    '${date}',
                    'MORNING',
                    '${MorningEmploye}'
                );`
                db.query(sql1);
                var sql2 = `INSERT INTO shift (
                    shiftDate,
                    shiftType,
                    UserName
                )
            values(
                    '${date}',
                    'EVENING',
                    '${EveningEmploye}'
                );`
                db.query(sql2);
                res.json('success')
            }
            else {
                res.json('failed')
            }

        }
    }
    catch (err) {
        console.log("wrong!!!!")
    }
})
app.post("/changeMeatType", async (req, res) => {
    console.log(req.body.meatType)
    type = req.body.meatType
    if (type == 'chicken') {
        const result = await db.query(`SELECT * FROM products where type  = 'CHICKEN';`);
        res.json(result.rows)
    }
    else if (type == 'lamb') {
        const result = await db.query(`SELECT * FROM products where type  = 'LAMB';`);
        res.json(result.rows)
    }
    else if (type == 'calf') {
        const result = await db.query(`SELECT * FROM products where type  = 'CALF';`);
        res.json(result.rows)
    }
    else if (type == 'all') {
        const result = await db.query(`SELECT * FROM products;`);
        res.json(result.rows)
    }
})

app.post("/shopnow", async (req, res) => {
    if (req.body.fillcartdependoncustomer == 'fillcartdependoncustomer') {
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        const result3 = await db.query(`SELECT * FROM cartitems where cartid='${result2.rows[0].cartid}' ;`);
        const result4 = await db.query(`SELECT * FROM products`)
        res.json([result3.rows, result4.rows])


    }
    else if (req.body.checkifthereisthisquantity == 'checkifthereisthisquantity') {
        const result = await db.query(`SELECT quantity FROM products where description='${req.body.title}' ;`);
        if (result.rows[0].quantity < req.body.quantity) {
            const result3 = await db.query(`SELECT productid FROM products where description='${req.body.title}' ;`);
            const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
            const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
            var sql = `UPDATE cartitems SET quantity = '${result.rows[0].quantity}' WHERE productid = ${result3.rows[0].productid} AND cartid=${result2.rows[0].cartid};`
            db.query(sql);
            res.json(['failed', result.rows[0].quantity])
        }
        else {
            res.json(['success', 'o'])
        }
    }
    else if (req.body.updateQuantity == 'updateQuantity') {
        const result = await db.query(`SELECT productid FROM products where description='${req.body.title}' ;`);
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        var sql = `UPDATE cartitems SET quantity = '${req.body.quantity}' WHERE productid = ${result.rows[0].productid} AND cartid=${result2.rows[0].cartid};`
        db.query(sql);
    }
    else if (req.body.deletecart == 'deletefromcart') {
        const result = await db.query(`SELECT productid FROM products where description='${req.body.title}' ;`);
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);

        var sql = `DELETE FROM cartitems WHERE cartid='${result2.rows[0].cartid}' AND productid = '${result.rows[0].productid}';`
        db.query(sql);

        res.json("22")
    }
    else if (req.body.exist == 'checkifitemexist') {
        const result = await db.query(`SELECT quantity FROM products where description='${req.body.title}' ;`);
        if (result.rows[0].quantity >= 1) {
            res.json("success");
        }
        else {
            res.json('faild')
        }
    }
    else if (req.body.cart == 'additemtocart') {
        const result = await db.query(`SELECT productid FROM products where description='${req.body.title}' ;`);
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        var sql = `INSERT INTO cartitems (cartid,productid,quantity) VALUES ('${result2.rows[0].cartid}','${result.rows[0].productid}',1);`
        db.query(sql);

        res.json("hh")
    }
    else if (req.body.empty == 'empty') {
        const username2 = req.cookies.customerusername;
        // if(req.body.meatType == "all"){
        const result = await db.query(`SELECT * FROM products ;`);
        res.json([result.rows, username2]);

        // }
        // else if(req.body.meatType == "calf"){
        //     const  result = await db.query(`SELECT * FROM products where type = 'CALF';`);
        //    res.json([result.rows, username2]);
        // }
    }
    else {
        var result = [];
        array = req.body.array;
        var j = 0;
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        var sql2 = `INSERT INTO orders (orderdate,personid) VALUES ('${req.body.date}','${result1.rows[0].personid}');`
        db.query(sql2);
        console.log(req.body.date)
        const resultx = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        const resulty = await db.query(`SELECT * FROM orders ORDER BY ordersid DESC LIMIT 1;`);
        for (var i = 0; i < array.length; i++) {

            var array_1 = array[i].split("~");
            const result1 = await db.query(`SELECT * FROM products where description='${array_1[0]}';`)
            var q = result1.rows[0].quantity - array_1[2];

            var sql = `UPDATE products SET quantity = '${q}' WHERE productid = ${result1.rows[0].productid};`
            db.query(sql);
            var price = array_1[1].replace('ILS', '');
            var totalprice = parseFloat(price) * array_1[2]
            totalprice = totalprice.toString() + "ILS"
            var sql3 = `INSERT INTO orderdetail (ordersid,productid,totalprice,productquantity) VALUES ('${resulty.rows[0].ordersid}','${result1.rows[0].productid}','${totalprice}','${array_1[2]}');`
            db.query(await sql3);

            var sql5 = `DELETE FROM cartitems WHERE cartid='${resultx.rows[0].cartid}';`
            db.query(await sql5);
        }
        res.json("mo2akat")
    }
});
app.post("/inventory", async (req, res) => {
    if (req.body.num == '1') {
        const result = await db.query(`select * from products;`)
        res.json(result.rows)
    }
    else if (req.body.num == '2') {
        const result = await db.query(`select quantity from products where description='${req.body.value}'`)
        var q = result.rows[0].quantity;

        var sql = `UPDATE products SET quantity = '${q + parseInt(req.body.quantity)}' WHERE description = '${req.body.value}';`
        db.query(sql);
        res.json('ggs')
    }
    else if (req.body.num == '3') {
        const result = await db.query(`select productid from products where description='${req.body.value}'`)

        var sql = `DELETE FROM products WHERE productid='${result.rows[0].productid}';`
        db.query(sql);
        res.json('ggs')
    }
    else if (req.body.num == '4') {
        var sql = `UPDATE products SET price = '${parseInt(req.body.price) + "ILS"}' WHERE description = '${req.body.value}';`
        db.query(sql);
        res.json('ggs')
    }
    else if (req.body.num == '5') {
        var sql1 = `INSERT INTO products (
            description,
            price,
            type,
            quantity,
            img
        )
    values(
            '${req.body.desc}',
            '${req.body.price + "ILS"}',
            'LAMB',
            ${req.body.quantity},
            '${req.body.img}'
        );`
        db.query(sql1);
        res.json('ggs')
    }
});
app.post("/feedback", async (req, res) => {
    const username2 = req.cookies.customerusername;
    const result = await db.query(`SELECT personid FROM customers where username = '${username2}';`);
    if (username2 == undefined) {
        res.json('faild')
    }
    else {
        console.log('shhs')
        var sql = `INSERT INTO feedback (personid,feedback) VALUES ('${result.rows[0].personid}','${req.body.feedback} ');`
        db.query(sql);
        res.json("gdg")
    }
    // res.json("gsgsg")
});
app.post("/allorders", async (req, res) => {
    if (req.body.num == '1') {
        const result = await db.query(`select * from orders;`)
        let contacts = new Map()
        const resultx = await db.query(`SELECT * FROM customers;`)

        res.json([result.rows, resultx.rows])
    }
});
app.post("/income", async (req, res) => {
    if (req.body.num == '1') {
        var chicken = 0;
        var lamb = 0;
        var calf = 0
        const result = await db.query(`SELECT od.productquantity, od.ordersid, p.productid,p.type FROM orderdetail od INNER JOIN products p  ON od.productid = p.productid;`);
        for (var i = 0; i < result.rows.length; i++) {
            if (result.rows[i].type == 'CHICKEN') {
                chicken += parseInt(result.rows[i].productquantity);
            }
            else if (result.rows[i].type == 'LAMB') {
                lamb += result.rows[i].productquantity;
            }
            else {
                calf += result.rows[i].productquantity;
            }
        }
        res.json([lamb, calf, chicken])
        console.log(result.rows);
    }
    else if (req.body.num == '2') {
        const monthcount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var count = 0;
        const d = new Date();
        let name = month[d.getMonth()];
        const Year = new Date().getFullYear();
        console.log(Year)
        const result = await db.query(`select * from orders o inner join orderdetail od on o.ordersid = od.ordersid;`);
        const result1 = await db.query(`select extract(year from orderdate) from orders o inner join orderdetail od on o.ordersid = od.ordersid;`);
        const result2 = await db.query(`select extract(month from orderdate) from orders o inner join orderdetail od on o.ordersid = od.ordersid;`);
        const result3 = await db.query(`select extract(day from orderdate) from orders;`);
        for (var i = 0; i < result.rows.length; i++) {
            if (result1.rows[i].extract == Year) {
                var str = result.rows[i].totalprice
                var totalprice = str.replace('ILS', '')
                monthcount[result2.rows[i].extract] += parseFloat(totalprice);
                // if (result2.rows[i].extract == '1') {
                //     var str = result.rows[i].totalprice
                //     var totalprice = str.replace('ILS', '')
                //     monthcount[0] += parseFloat(totalprice);
                // }
                // else if (result2.rows[i].extract == '2') {
                //     var str = result.rows[i].totalprice
                //     var totalprice = str.replace('ILS', '')
                //     monthcount[1] += parseFloat(totalprice);
                // }
                // else if (result2.rows[i].extract == '3') {
                //     var str = result.rows[i].totalprice
                //     var totalprice = str.replace('ILS', '')
                //     monthcount[2] += parseFloat(totalprice);
                // }
                // else if (result2.rows[i].extract == '4') {
                //     var str = result.rows[i].totalprice
                //     var totalprice = str.replace('ILS', '')
                //     monthcount[3] += parseFloat(totalprice);
                // }
                // else if (result2.rows[i].extract == '5') {
                //     var str = result.rows[i].totalprice
                //     var totalprice = str.replace('ILS', '')
                //     monthcount[4] += parseFloat(totalprice);
                // }
                // else if (result2.rows[i].extract == '6') {
                //     var str = result.rows[i].totalprice
                //     var totalprice = str.replace('ILS', '')
                //     monthcount[5] += parseFloat(totalprice);
                // }
                // else if (result2.rows[i].extract == '7') {
                //     monthcount[6]++;
                // }
                // else if (result2.rows[i].extract == '8') {
                //     monthcount[7]++;
                // }
                // else if (result2.rows[i].extract == '9') {
                //     monthcount[8]++;
                // }
                // else if (result2.rows[i].extract == '10') {
                //     monthcount[9]++;
                // }
                // else if (result2.rows[i].extract == '11') {
                //     monthcount[10]++;
                // }
                // else if (result2.rows[i].extract == '12') {
                //     monthcount[11]++;
                // }
            }
        }
        res.json(monthcount)

    }
});
app.post("/customerfeedback", async (req, res) => {

    const result = await db.query(`select * from feedback f INNER JOIN customers c ON f.personid=c.personid;`)
    console.log(result.rows)

    res.json(result.rows)

});
app.post("/saveddata", async (req, res) => {
    const result = await db.query(`select * from temporaryshifts;`)
    const result2 = await db.query(`select * from workers where Catagory='WORKER';`)
    res.json([result.rows, result2.rows]);

});
app.post("/allworkers", async (req, res) => {
    const result2 = await db.query(`select * from workers where Catagory='WORKER';`)
    allworkers = [];
    for (var i = 0; i < result2.rows.length; i++) {
        string = result2.rows[i].firstname + " " + result2.rows[i].lastname;
        allworkers.push(string)
    }
    res.json(allworkers);

});
app.post("/updateshift", async (req, res) => {

    if (req.body.shiftType == 'בוקר') {
        const morning1 = await db.query(`SELECT * FROM temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}' AND morning1 = '${req.body.oldEmployee}' `)
        const morning2 = await db.query(`SELECT * FROM temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}' AND morning2 = '${req.body.oldEmployee}' `)
        console.log("morning2 row count: " + morning2.rowCount)
        if (morning1.rowCount > 0) {
            sql1 = `UPDATE temporaryshifts SET morning1 = '${req.body.newEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql1)
            const result1 = await db.query(`select * from temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}'`)
            if (result1.rows[0].morning1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result1.rows[0].morning2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result1.rows[0].evening1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result1.rows[0].evening2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
        }
        else if (morning2.rowCount > 0) {
            sql2 = `UPDATE temporaryshifts SET morning2 = '${req.body.newEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql2)
            const result2 = await db.query(`select * from temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}'`)
            if (result2.rows[0].morning1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")
            }
            else if (result2.rows[0].morning2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")
            }
            else if (result2.rows[0].evening1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")
            }
            else if (result2.rows[0].evening2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")
            }

        }
        else if (morning1.rowCount == 0 && morning2.rowCount == 0) {
            res.json("choose employee already in the morning shift")

        }
    }
    else if (req.body.shiftType == 'ערב') {
        const evening1 = await db.query(`SELECT * FROM temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}' AND evening1 = '${req.body.oldEmployee}' `)
        const evening2 = await db.query(`SELECT * FROM temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}' AND evening2 = '${req.body.oldEmployee}' `)

        if (evening1.rowCount > 0) {
            sql1 = `UPDATE temporaryshifts SET evening1 = '${req.body.newEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql1)
            const result3 = await db.query(`select * from temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}'`)
            if (result3.rows[0].morning1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result3.rows[0].morning2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result3.rows[0].evening1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result3.rows[0].evening2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
        }
        else if (evening2.rowCount > 0) {
            sql2 = `UPDATE temporaryshifts SET evening2 = '${req.body.newEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql2)
            const result4 = await db.query(`select * from temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}'`)
            if (result4.rows[0].morning1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result4.rows[0].morning2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET morning2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result4.rows[0].evening1 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
            else if (result4.rows[0].evening2 == req.body.newEmployee) {
                sql1 = `UPDATE temporaryshifts SET evening2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
                db.query(sql1)
                res.json("done")

            }
        }
        else if (evening1.rowCount == 0 && evening2.rowCount == 0) {
            res.json("choose employee already in the morning shift")

        }
    }

    else if (req.body.shiftType == 'חופש') {
        const result = await db.query(`SELECT * FROM temporaryshifts WHERE temporaryshift='${getIdByDayName(req.body.day)}' `)
        console.log(result.rows)
        if (result.rows[0].morning1 == req.body.newEmployee) {
            sql1 = `UPDATE temporaryshifts SET morning1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql1)
            res.json(req.body.newEmployee)
        }
        else if (result.rows[0].morning2 == req.body.newEmployee) {
            sql1 = `UPDATE temporaryshifts SET morning2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql1)
            res.json(req.body.newEmployee)
        }
        else if (result.rows[0].evening1 == req.body.newEmployee) {
            sql1 = `UPDATE temporaryshifts SET evening1 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql1)
            res.json(req.body.newEmployee)
        }
        else if (result.rows[0].evening2 == req.body.newEmployee) {
            sql1 = `UPDATE temporaryshifts SET evening2 = '${req.body.oldEmployee}' WHERE temporaryshift='${getIdByDayName(req.body.day)}' ;`
            db.query(sql1)
            res.json(req.body.newEmployee)
        }

    }

});
app.post("/deleteWorker", async (req, res) => {
    const result = await db.query(`SELECT employeeid FROM workers where firstname='${req.body.firstname}' and lastname = '${req.body.lastname}' ;`)
    sql = `DELETE FROM workers WHERE employeeid='${result.rows[0].employeeid}' ;`
    db.query(sql);
    res.json("--")

});
app.post("/changeDemand", async (req, res) => {
    const result = await db.query(`select * from workers where username = '${req.cookies.username}'`)
    console.log(req.body)
    var sql = `INSERT INTO askForChange(dateAsked,shiftType ,reason,username) VALUES ('${req.body.date}','${req.body.shifttype}','${req.body.reason}', '${req.cookies.username}');`
    db.query(sql);
    res.json(["success", result.rows[0]])

});
app.post("/uploadPhoto", async (req, res) => {
    var sql = `UPDATE workers SET  img = '${req.body.src}' WHERE username = '${req.cookies.username}';`
    db.query(sql);

});
app.post("/updatedata", async (req, res) => {
    const { firstname, lastname, username, email, password, phone, sunday, monday, tuesday, wednesday, thursday, friday } = req.body
    var sunday1 = ''; var monday1 = ''; var tuesday1 = ''; var wednesday1 = ''; var thursday1 = ''; var friday1 = '';
    if (sunday == 'חופש') {
        sunday1 = 'DAYOFF'
    }
    else if (sunday == 'בוקר') {
        sunday1 = 'MORNING'
    }
    else {
        sunday1 = 'EVENING'
    }
    if (monday == 'חופש') {
        monday1 = 'DAYOFF'
    }
    else if (monday == 'בוקר') {
        monday1 = 'MORNING'
    }
    else {
        monday1 = 'EVENING'
    }
    if (tuesday == 'חופש') {
        tuesday1 = 'DAYOFF'
    }
    else if (tuesday == 'בוקר') {
        tuesday1 = 'MORNING'
    }
    else {
        tuesday1 = 'EVENING'
    }
    if (wednesday == 'חופש') {
        wednesday1 = 'DAYOFF'
    }
    else if (wednesday == 'בוקר') {
        wednesday1 = 'MORNING'
    }
    else {
        wednesday1 = 'EVENING'
    }
    if (thursday == 'חופש') {
        thursday1 = 'DAYOFF'
    }
    else if (thursday == 'בוקר') {
        thursday1 = 'MORNING'
    }
    else {
        thursday1 = 'EVENING'
    }
    if (friday == 'חופש') {
        friday1 = 'DAYOFF'
    }
    else if (friday == 'בוקר') {
        friday1 = 'MORNING'
    }
    else {
        friday1 = 'EVENING'
    }
    if (password == '') {


        var sql = `UPDATE workers SET   firstname= '${firstname}' , lastname = '${lastname}' ,
     email = '${email}' , phone = '${phone}' , friday = '${friday1}', thursday = '${thursday1}', wednesday = '${wednesday1}' 
    , sunday = '${sunday1}', monday = '${monday1}', tuesday = '${tuesday1}' WHERE username = '${req.cookies.username}';`
        db.query(sql);
    }
    else {
        bcrypt.genSalt(saltRounds, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                var sql1 = `UPDATE workers SET  firstname= '${firstname}' ,  password= '${hash}' , lastname = '${lastname}' , email = '${email}' , phone = '${phone}' , friday = '${friday1}', thursday = '${thursday1}', wednesday = '${wednesday1}' 
            , sunday = '${sunday1}', monday = '${monday1}', tuesday = '${tuesday1}' WHERE username = '${req.cookies.username}';`
                db.query(sql1);
            });
        });

    }
});
app.post("/fillAllDataworker", async (req, res) => {
    var username = req.cookies.username;
    const result = await db.query(`select * from workers where UserName ='${username}';`);
    console.log(result.rows)
    res.json([result.rows, username])
});
app.post("/orderdetails", async (req, res) => {
    console.log(req.body.id)
    const result = await db.query(`select * from products p inner join orderdetail od on p.productid=od.productid where ordersid ='${req.body.id}';`);

    res.json(result.rows)
});
app.post("/oldorderdetails", async (req, res) => {
    console.log(req.body.id)
    const result = await db.query(`select * from products p inner join orderdetail od on p.productid=od.productid where ordersid ='${req.body.id}';`);

    res.json(result.rows)
});
app.post("/orderAgain", async (req, res) => {
    const date = new Date();
    console.log(date)
    username = req.cookies.customerusername
    const result1 = await db.query(`select * from customers where username= '${username}'`)
    console.log(result1.rows)
    var sql2 = `INSERT INTO orders (orderdate,personid) VALUES ('${req.body.date}','${result1.rows[0].personid}');`
    db.query(await sql2)
    array = req.body.details
    setTimeout(async () => {
        const resulty = await db.query(`SELECT * FROM orders ORDER BY ordersid DESC LIMIT 1;`);
        for (var i = 0; i < array.length; i++) {
            const res1 = await db.query(`select * from products where description= '${array[i][0]}' `)
            price = res1.rows[0].price
            priceAfter = price.replace('ILS', '')
            totalprice = array[i][1] * priceAfter
            q=res1.rows[0].quantity - array[i][1]
            var sql = `UPDATE products SET quantity = '${q}' WHERE productid = ${res1.rows[0].productid};`
            db.query(sql)
            var sql3 = `INSERT INTO orderdetail (ordersid,productid,totalprice,productquantity) VALUES ('${resulty.rows[0].ordersid}','${res1.rows[0].productid}','${totalprice}','${array[i][1]}');`
            db.query(sql3);
        }
    }, 1000);

    // // res.json(result.rows)
});
app.post("/updateshiftadmin", async (req, res) => {
    month = getMonth(req.body.Month)
    dayoff = []
    const result = await db.query(`select * from shift where shiftdate ='${req.body.Year + "-" + month + "-" + req.body.Day}';`);
    const result1 = await db.query(`select * from workers where catagory ='WORKER';`);
    for (var i = 0; i < result1.rows.length; i++) {
        fullname = result1.rows[i].firstname + " " + result1.rows[i].lastname
        if (fullname != req.body.morning1 && fullname != req.body.morning2 && fullname != req.body.evening1 && fullname != req.body.evening2) {
            dayoff.push(result1.rows[i].username)
        }
    }
    sql = `DELETE FROM shift WHERE shiftdate ='${req.body.Year + "-" + month + "-" + req.body.Day}';`
    db.query(sql)
    arrayname1 = req.body.morning1.split(" ")
    const name1 = await db.query(`select username from workers where  firstname = '${arrayname1[0]}' and lastname = '${arrayname1[1]}';`);
    sql1 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${req.body.Year + "-" + month + "-" + req.body.Day}','MORNING','${name1.rows[0].username}');`
    db.query(sql1)
    arrayname2 = req.body.morning2.split(" ")
    const name2 = await db.query(`select username from workers where  firstname = '${arrayname2[0]}' and lastname = '${arrayname2[1]}';`);
    sql2 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${req.body.Year + "-" + month + "-" + req.body.Day}','MORNING','${name2.rows[0].username}');`
    db.query(sql2)
    arrayname3 = req.body.evening1.split(" ")
    const name3 = await db.query(`select username from workers where  firstname = '${arrayname3[0]}' and lastname = '${arrayname3[1]}';`);
    sql3 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${req.body.Year + "-" + month + "-" + req.body.Day}','EVENING','${name3.rows[0].username}');`
    db.query(sql3)
    arrayname4 = req.body.evening2.split(" ")
    const name4 = await db.query(`select username from workers where  firstname = '${arrayname4[0]}' and lastname = '${arrayname4[1]}';`);
    sql4 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${req.body.Year + "-" + month + "-" + req.body.Day}','EVENING','${name4.rows[0].username}');`
    db.query(sql4)
    for (var j = 0; j < dayoff.length; j++) {
        sql = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${req.body.Year + "-" + month + "-" + req.body.Day}','DAYOFF','${dayoff[j]}');`
        db.query(sql)
    }
    console.log(dayoff)
});
app.post("/addWorker", async (req, res) => {
    const result1 = await db.query(`select * from workers where UserName = '${req.body.username}'`)
    if (result1.rowCount == 0) {
        catagory = '';
        if (req.body.check == 1) {
            catagory = 'WORKER'
        }
        else {
            catagory = 'ADMIN'
        }
        const result = await db.query(`SELECT max(employeeid) FROM workers;`)
        bcrypt.genSalt(saltRounds, async function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                var sql = `INSERT INTO workers(employeeId,LastName,FirstName,UserName,Email,Password,City,Catagory,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,phone) VALUES ('${result.rows[0].max + 1}','${req.body.last}','${req.body.first}','${req.body.username}','${req.body.email}','${hash}','${req.body.city}','${catagory}','DAYOFF','DAYOFF','DAYOFF','DAYOFF','DAYOFF','DAYOFF','${req.body.phone}');`
                db.query(sql);
            });
        });
        res.json("gg")
    }
    else {
        res.json("failed")
    }
});
app.post("/saveddatainshifts", async (req, res) => {
    array = req.body.lastarray
    for (var j = 0; j < array.length; j++) {
        if (array[j][0] == "חופש") {
            arrayname = array[j][1].split(" ")
            arraydate = array[j][2].split(".")
            datex = arraydate[2] + "-" + arraydate[1] + "-" + arraydate[0]
            const result = await db.query(`select username from workers where firstname = '${arrayname[0]}' and lastname = '${arrayname[1]}'`)
            sql2 = await `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${datex}','DAYOFF','${result.rows[0].username}');`
            db.query(sql2)
        }

    }
    const result = await db.query(`select * from temporaryshifts;`)
    function getDayName(dateStr, locale) {
        var date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'long' });
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    var dayname = getDayName(today, "en-US");
    const date = new Date();
    var x = 0
    for (var i = 0; i < result.rows.length; i++) {
        if (dayname == 'Monday' && x == 0) {
            date.setDate(date.getDate() + 6)
            x = 1;
        }
        if (dayname == 'Tuesday' && x == 0) {
            date.setDate(date.getDate() + 5)
            x = 1;
        }
        if (dayname == 'Wednesday' && x == 0) {
            date.setDate(date.getDate() + 4)
            x = 1;
        }
        if (dayname == 'Thursday' && x == 0) {
            date.setDate(date.getDate() + 3)
            x = 1;
        }
        if (dayname == 'Friday' && x == 0) {
            date.setDate(date.getDate() + 2)
            x = 1;
        }
        if (dayname == 'Saturday' && x == 0) {
            date.setDate(date.getDate() + 1)
            x = 1;
        }
        console.log(dayname)
        string = date.toLocaleString();
        array = string.split(",")
        const dayDate = array[0];
        console.log(dayDate + " whatttttttt")
        arayfornamemor1 = result.rows[i].morning1.split(" ")
        const result1 = await db.query(`select username from workers where FirstName='${arayfornamemor1[0]}' AND LastName='${arayfornamemor1[1]}';`)
        sql1 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${dayDate}','MORNING','${result1.rows[0].username}');`
        arayfornamemor2 = result.rows[i].morning2.split(" ")
        const result2 = await db.query(`select username from workers where FirstName='${arayfornamemor2[0]}' AND LastName='${arayfornamemor2[1]}';`)
        sql2 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${dayDate}','MORNING','${result2.rows[0].username}');`
        arayfornamemor3 = result.rows[i].evening1.split(" ")
        const result3 = await db.query(`select username from workers where FirstName='${arayfornamemor3[0]}' AND LastName='${arayfornamemor3[1]}';`)
        sql3 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${dayDate}','EVENING','${result3.rows[0].username}');`
        arayfornamemor4 = result.rows[i].evening2.split(" ")
        const result4 = await db.query(`select username from workers where FirstName='${arayfornamemor4[0]}' AND LastName='${arayfornamemor4[1]}';`)
        sql4 = `INSERT INTO shift (shiftDate,shiftType,UserName) VALUES ('${dayDate}','EVENING','${result4.rows[0].username}');`

        db.query(sql1)
        db.query(sql2)
        db.query(sql3)
        db.query(sql4)
        date.setDate(date.getDate() + 1)

    }
    sql = `DELETE FROM temporaryshifts;`
    db.query(sql)
    res.json("finish")
});
app.post("/tem", async (req, res) => {
    //save in cookies
    //check if done already there
    const done = req.cookies.done;
    if (done == 'done') {
        res.json("already done");
    }
    else {
        res.cookie("done", "done", { maxage: 72000000 });
        const allEmployeswants = [];
        const allEmployes = [];
        const result = await db.query(`select * from workers where Catagory='WORKER';`)

        for (var i = 0; i < result.rows.length; i++) {

            const array = [];
            array[0] = result.rows[i].sunday;
            array[1] = result.rows[i].monday;
            array[2] = result.rows[i].tuesday;
            array[3] = result.rows[i].wednesday;
            array[4] = result.rows[i].thursday;
            array[5] = result.rows[i].friday;

            allEmployeswants.push(array);
            allEmployes.push(result.rows[i])
        }
        // console.log(allEmployeswants)
        var morningshifts = []
        var eveningshifts = []
        var dayoffshifts = []
        for (var k = 0; k < 6; k++) {

            var morning = [];
            var evening = [];
            var dayoff = [];
            var morningx = [];
            var eveningy = [];
            for (var j = 0; j < allEmployes.length; j++) {
                if (allEmployeswants[j][k] == 'MORNING') {
                    morning.push(allEmployes[j]);
                }
                else if (allEmployeswants[j][k] == 'EVENING') {
                    evening.push(allEmployes[j]);
                }
                else if (allEmployeswants[j][k] == 'DAYOFF') {
                    dayoff.push(allEmployes[j]);
                }
            }
            var morning1;
            var morning2;
            var evening1;
            var evening2;

            if (morning.length != 0) {
                morning1 = morning[Math.floor(Math.random() * morning.length)];
                var elementToRemoveIndex1 = morning.indexOf(morning1);
                morning.splice(elementToRemoveIndex1, 1);
            }
            else {
                if (evening.length > 2) {
                    morning1 = evening[Math.floor(Math.random() * evening.length)];
                    var elementToRemoveIndex1 = evening.indexOf(morning1);
                    evening.splice(elementToRemoveIndex1, 1);
                }
                else {
                    morning1 = dayoff[Math.floor(Math.random() * dayoff.length)];
                    var elementToRemoveIndex1 = dayoff.indexOf(morning1);
                    dayoff.splice(elementToRemoveIndex1, 1);
                }
            }
            if (morning.length != 0) {
                morning2 = morning[Math.floor(Math.random() * morning.length)];
                var elementToRemoveIndex1 = morning.indexOf(morning2);
                // console.log(randomItem1);
                morning.splice(elementToRemoveIndex1, 1);
            }
            else {
                if (evening.length > 2) {
                    morning2 = evening[Math.floor(Math.random() * evening.length)];
                    var elementToRemoveIndex1 = evening.indexOf(morning2);
                    // console.log(randomItem1);
                    evening.splice(elementToRemoveIndex1, 1);
                }
                else {
                    morning2 = dayoff[Math.floor(Math.random() * dayoff.length)];
                    var elementToRemoveIndex1 = dayoff.indexOf(morning2);
                    // console.log(randomItem1);
                    dayoff.splice(elementToRemoveIndex1, 1);
                }
            }
            if (evening.length != 0) {
                evening1 = evening[Math.floor(Math.random() * evening.length)];
                var elementToRemoveIndex1 = evening.indexOf(evening1);
                // console.log(randomItem1);
                evening.splice(elementToRemoveIndex1, 1);
            }
            else {
                if (morning.length > 0) {
                    evening1 = morning[Math.floor(Math.random() * morning.length)];
                    var elementToRemoveIndex1 = morning.indexOf(evening1);
                    // console.log(randomItem1);
                    morning.splice(elementToRemoveIndex1, 1);
                }
                else {
                    evening1 = dayoff[Math.floor(Math.random() * dayoff.length)];
                    var elementToRemoveIndex1 = dayoff.indexOf(evening1);
                    // console.log(randomItem1);
                    dayoff.splice(elementToRemoveIndex1, 1);
                }
            }
            if (evening.length != 0) {
                evening2 = evening[Math.floor(Math.random() * evening.length)];
                var elementToRemoveIndex1 = evening.indexOf(evening2);
                // console.log(randomItem1);
                evening.splice(elementToRemoveIndex1, 1);
            }
            else {
                if (morning.length > 0) {
                    evening2 = morning[Math.floor(Math.random() * morning.length)];
                    var elementToRemoveIndex1 = morning.indexOf(evening2);
                    // console.log(randomItem1);
                    morning.splice(elementToRemoveIndex1, 1);
                }
                else {
                    evening2 = dayoff[Math.floor(Math.random() * dayoff.length)];
                    var elementToRemoveIndex1 = dayoff.indexOf(evening2);
                    // console.log(randomItem1);
                    dayoff.splice(elementToRemoveIndex1, 1);
                }
            }
            if (morning.length > 0) {
                for (var c = 0; c < morning.length; c++) {
                    dayoff.push(morning[c]);
                }
            }
            if (evening.length > 0) {
                for (var s = 0; s < evening.length; s++) {
                    dayoff.push(evening[s]);
                }
            }
            morningx.push(morning1)
            morningx.push(morning2)
            eveningy.push(evening1)
            eveningy.push(evening2)
            morningshifts[k] = morningx;
            eveningshifts[k] = eveningy;
            dayoffshifts[k] = dayoff;
            //add to data base 
            sql = `INSERT INTO temporaryshifts (morning1,morning2,evening1,evening2) VALUES ('${morning1.firstname + " " + morning1.lastname}','${morning2.firstname + " " + morning2.lastname}','${evening1.firstname + " " + evening1.lastname}','${evening2.firstname + " " + evening2.lastname}');`
            db.query(sql);
        }

        res.json([morningshifts, eveningshifts, dayoffshifts])
    }
});
app.get("/salary", async (req, res) => {
    try {

        // const result = await db.query(`select * from shift`)
        const result = await db.query(`SELECT *
        FROM shift 
        WHERE shiftdate >= date_trunc('month', current_date - interval '1' month)
        and shiftdate <date_trunc('day', current_date);`)
        const result2 = await db.query(`SELECT *
        FROM workers where catagory = 'WORKER'`)


        res.json([result.rows, result2.rows]);
    } catch (error) {
        console.log(error);
    }
});
app.get("/customersOrders", async (req, res) => {
    try {

        const result2 = await db.query(`select * from customers`)
        const result = await db.query(`SELECT * FROM orders;`)
        res.json([result.rows, result2.rows]);
    } catch (error) {
        console.log(error);
    }
});
app.post("/oldOrders", async (req, res) => {
    try {
        const username = req.cookies.customerusername;

        const result1 = await db.query(`select * from customers where username = '${username}';`)
        const result = await db.query(`select * from orders  where personid = '${result1.rows[0].personid}';`)
        res.json(result.rows);
    }
    catch (error) {
        console.log(error);
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/workerLogin.html")
})
app.get("/oldOrders", (req, res) => {
    res.sendFile(__dirname + "/html/oldOrders.html")
})
app.get("/addnewemployee", (req, res) => {
    res.sendFile(__dirname + "/html/addnewemployee.html")
})
app.get("/employeesSalary", (req, res) => {
    res.sendFile(__dirname + "/html/employeesSalary.html")
})
app.get("/new", (req, res) => {
    res.sendFile(__dirname + "/html/new.html")
})
app.get("/aboutus", (req, res) => {
    res.sendFile(__dirname + "/html/aboutus.html")
})
app.get("/shopnow", (req, res) => {
    res.sendFile(__dirname + "/html/shopnow.html")
})
app.get("/calendar", (req, res) => {
    res.sendFile(__dirname + "/html/workerCalendar.html")
})
app.get("/allEmployes", (req, res) => {
    res.sendFile(__dirname + "/html/adminWorkersProfiles.html")
})
app.get("/temporaryshifts", (req, res) => {
    res.sendFile(__dirname + "/html/temporaryshifts.html")
})
app.get("/income", (req, res) => {
    res.sendFile(__dirname + "/html/income.html")
})
app.get("/inventory", (req, res) => {
    res.sendFile(__dirname + "/html/adminInventory.html")
})
app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/html/home.html")
})
app.get("/adminCalendar", (req, res) => {
    res.sendFile(__dirname + "/html/adminCalendar.html")
})
app.get("/profile", (req, res) => {
    res.sendFile(__dirname + "/html/workerProfile.html")
})
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/html/LogIn.html")
})
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/html/SignUp.html")
})
app.get("/allorders", (req, res) => {
    res.sendFile(__dirname + "/html/allorders.html")
})
app.get("/feedback", (req, res) => {
    res.sendFile(__dirname + "/html/feedback.html")
})
app.get("/recipes", (req, res) => {
    res.sendFile(__dirname + "/html/recipes.html")
})
app.get("/customerfeedback", (req, res) => {
    res.sendFile(__dirname + "/html/admincustomerfeedback.html")
})
app.get("/updatePersonalInformation", (req, res) => {
    res.sendFile(__dirname + "/html/updatePersonalInformation.html")
})

app.use('/css', express.static(__dirname + '/css'))
app.use('/html', express.static(__dirname + '/html'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))



app.listen(port, () => {
    console.log('Listening at http://localhost:' + port)
})
function getMonth(month) {
    if (month === 'March') {
        return '03';
    }
    else if (month === 'February') {
        return '02';
    }
    else if (month === 'April') {
        return '04';
    }
    else if (month === 'May') {
        return '05';
    }
    else if (month === 'January') {
        return '01';
    }
    else if (month === 'June') {
        return '06';
    }
    else if (month === 'July') {
        return '07';
    }
    else if (month === 'August') {
        return '08';
    }
    else if (month === 'September') {
        return '09';
    }
    else if (month === 'October') {
        return '10';
    }
    else if (month === 'November') {
        return '11';
    }
    else if (month === 'December') {
        return '12';
    }
    else {
        console.log("getMonth function")
    }

}
function getIdByDayName(str) {
    if (str == 'יום ראשון') {
        return 1
    } else if (str == 'יום שני') {
        return 2
    } else if (str == 'יום שלישי') {
        return 3
    } else if (str == 'יום רביעי') {
        return 4
    } else if (str == 'יום חמישי') {
        return 5
    } else if (str == 'יום שישי') {
        return 6
    }
}
