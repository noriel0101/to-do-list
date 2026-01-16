import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

const PORT = 3000;


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



app.listen(PORT, () => {
    console.log('Server listening on port ${PORT}');
});