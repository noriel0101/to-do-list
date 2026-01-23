import express from 'express';
import session from 'express-session';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = 3000;

app.use(express.json());


app.use(
  session({
    name: 'user-session',
    secret: 'superSecretKey', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, 
    },
  })
);



app.get('/get-list', async ( req, res) => {

  const list = await pool.query('SELECT * FROM list');

  res.status(200).json({ success: true, list:list.rows });
});

app.post('/add-list', async(req, res) => {
  const { listTitle } = req.body;

  await pool.query(`INSERT INTO list (title, status)VALUES ($1, $2)` , [listTitle, "pending"]);

  res.status(200).json({  success: true,  message: "List Succesfully Added"});
  
});
  

app.post('/edit-list/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  try {
    const updated = await pool.query('UPDATE list SET title = $1, status = $2 WHERE id = $3 RETURNING *',[title, status, id]);

    res.status(200).json({success: true,message: 'List successfully updated',data: updated.rows[0]});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




app.post('/delete-list/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM list WHERE id = $1', [id]);

    res.status(200).json({ success: true, message: 'List successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



app.get('/get-items/:id', async (req, res) => {
  const items = await pool.query('SELECT * FROM items');
  res.status(200).json({success:true,items: items.rows});
});


app.post('/add-items', async (req, res) => {
  const {listId, desc} =req.body;

  await pool.query('INSERT INTO items (list_id,description, status)VALUES($1, $2, $3)',[listId,desc, "pending"]);
   res.status(200).json({success:true,message: "ITEMS Added Successfully"});
   console.log(listId);
});

app.post('/edit-items', async (req, res) => {
 const {id,desc} =req.body; 
 await pool.query('UPDATE items SET description=$2 WHERE id=$1',[id, desc]);
   res.status(200).json({success:true,message: "ITEMS Updated Successfully"});
});
 
app.post('/delete-items', async (req, res) => {
 const {id} =req.body;
 await pool.query('DELETE FROM items WHERE id=$1',[id]);
   res.status(200).json({success:true,message: "ITEMS Deleted Successfully"});
  
});


app.post('/register', async (req, res) => {
  try {
    const { username, password, confirm } = req.body;

    if (!username || !password || !confirm) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirm) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    const hashedPassword = await hashPassword(password);

    await pool.query(
      'INSERT INTO user_accounts (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.status(200).json({
      success: true,
      message: "Registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// ---------------- LOGIN ----------------
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userResult = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const user = userResult.rows[0];

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    req.session.user = {
      id: user.id,
      name: user.name
    };

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get('/get-session', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ session: true, user: req.session.user });
  }

  res.status(200).json({ session: false });
});


app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to logout" });
    }

    res.clearCookie('user-session');
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});