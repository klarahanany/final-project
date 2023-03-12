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
            console.log("4");
        }
        else {
            console.log("3");
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
            const result1 = db.query(`SELECT * FROM shift where shiftType = 'EVENING' and shiftdate='${date}';`)
            const result2 = db.query(`SELECT * FROM shift where shiftType = 'MORNING' and shiftdate='${date}';`)

            if ((await result1).rows.length == 0 && (await result2).rows.length == 0) {
                res.json('still not determined')
            }
            else {
                const result = (await result1).rows[0].username + " " + (await result2).rows[0].username;
                res.json(result)
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
            console.log(date);
            console.log("1");
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
app.post("/shopnow", async (req, res) => {
    if (req.body.fillcartdependoncustomer == 'fillcartdependoncustomer') {
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        const result3 = await db.query(`SELECT * FROM cartitems where cartid='${result2.rows[0].cartid}' ;`);
        const result4 = await db.query(`SELECT * FROM products`)
        console.log(result3.rows);
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
        console.log(req.cookies.customerusername);
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        var sql = `UPDATE cartitems SET quantity = '${req.body.quantity}' WHERE productid = ${result.rows[0].productid} AND cartid=${result2.rows[0].cartid};`
        db.query(sql);
    }
    else if (req.body.deletecart == 'deletefromcart') {
        const result = await db.query(`SELECT productid FROM products where description='${req.body.title}' ;`);
        console.log(req.cookies.customerusername);
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        const result2 = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        console.log(result2.rows[0].cartid)
        console.log(result.rows[0].productid)
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

        console.log(result.rows[0].productid + " " + result1.rows[0].personid);

        res.json("hh")
    }
    else if (req.body.empty == 'empty') {
        const username2 = req.cookies.customerusername;
        const result = await db.query(`SELECT * FROM products ;`);
        res.json([result.rows, username2]);
    }
    else {
        var result = [];
        array = req.body.array;
        console.log(array)
        var j = 0;
        const result1 = await db.query(`SELECT personid FROM customers where username='${req.cookies.customerusername}' ;`);
        var sql2 = `INSERT INTO orders (orderdate,personid) VALUES ('${req.body.date}','${result1.rows[0].personid}');`
        db.query(sql2);
        const resultx = await db.query(`SELECT cartid FROM cart where personid='${result1.rows[0].personid}' ;`);
        const resulty = await db.query(`SELECT * FROM orders ORDER BY ordersid DESC LIMIT 1;`);
        console.log(resulty.rows[0].ordersid)
        for (var i = 0; i < array.length; i++) {

            var array_1 = array[i].split("~");
            const result1 = await db.query(`SELECT * FROM products where description='${array_1[0]}';`)
            var q = result1.rows[0].quantity - array_1[2];

            var sql = `UPDATE products SET quantity = '${q}' WHERE productid = ${result1.rows[0].productid};`
            db.query(sql);
            console.log(array_1[1])
            var price = array_1[1].replace('$', '');
            var totalprice = parseFloat(price) * array_1[2]
            totalprice = totalprice.toString() + "$"
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
        var sql = `UPDATE products SET price = '${parseInt(req.body.price) + "$"}' WHERE description = '${req.body.value}';`
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
            '${req.body.price+"$"}',
            'LAMB',
            ${req.body.quantity},
            '${req.body.img}'
        );`
        db.query(sql1);
        res.json('ggs')
    }
});
app.post("/feedback", async (req, res) => {
    const username2 = req.cookies.username;
        const result = await db.query(`SELECT personid FROM shift where username = '${username2}' and shiftdate='${date}';`);
    if(username2 == undefined){
        res.log('fhhdh')
        res.json('faild')
    }
    else{
        console.log('shhs')
        var sql = `INSERT INTO feedback (personid,feedback) VALUES ('${result.rows[0].personid}','${req.body.feedback} ');`
        db.query(sql);
    res.json("gdg")
    }
    res.json("gsgsg")
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
        const result = await db.query(`SELECT od.ordersid, p.productid,p.type FROM orderdetail od INNER JOIN products p  ON od.productid = p.productid;`);
        for (var i = 0; i < result.rows.length; i++) {
            if (result.rows[i].type == 'CHICKEN') {
                chicken++;
            }
            else if (result.rows[i].type == 'LAMB') {
                lamb++;
            }
            else {
                calf++;
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
        const result = await db.query(`select orderdate from orders;`);
        const result1 = await db.query(`select extract(year from orderdate) from orders;`);
        const result2 = await db.query(`select extract(month from orderdate) from orders;`);
        const result3 = await db.query(`select extract(day from orderdate) from orders;`);

        console.log(result1.rows)
        console.log(result2.rows)
        console.log(result3.rows)
        for (var i = 0; i < result.rows.length; i++) {
            if (result1.rows[i].extract == Year) {
                if(result2.rows[i].extract == '1')
                {
                    monthcount[0]++;
                }
                else if(result2.rows[i].extract == '2')
                {
                    monthcount[1]++;
                }
                else if(result2.rows[i].extract == '3')
                {
                    monthcount[2]++;
                }
                else if(result2.rows[i].extract == '4')
                {
                    monthcount[3]++;
                }
                else if(result2.rows[i].extract == '5')
                {
                    monthcount[4]++;
                }
                else if(result2.rows[i].extract == '6')
                {
                    monthcount[5]++;
                }
                else if(result2.rows[i].extract == '7')
                {
                    monthcount[6]++;
                }
                else if(result2.rows[i].extract == '8')
                {
                    monthcount[7]++;
                }
                else if(result2.rows[i].extract == '9')
                {
                    monthcount[8]++;
                }
                else if(result2.rows[i].extract == '10')
                {
                    monthcount[9]++;
                }
                else if(result2.rows[i].extract == '11')
                {
                    monthcount[10]++;
                }
                else if(result2.rows[i].extract == '12')
                {
                    monthcount[11]++;
                }
            }
        }
        res.json(monthcount)

    }
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/workerLogin.html")
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
app.get("/income", (req, res) => {
    res.sendFile(__dirname + "/html/income.html")
})
app.get("/inventory", (req, res) => {
    res.sendFile(__dirname + "/html/adminInventory.html")
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
    else {
        console.log("getMonth function")
    }

}
function reverseInPlace(str) {
    var words = [];
    words = str.match(/\S+/g);
    var result = "";
    for (var i = words.length - 1; i >= 0; i--) {
        result += words[i].split('').reverse().join('') + " ";
    }
    return result
}
