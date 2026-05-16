const express = require('express');
const app = express();
app.get('/api/customers/:id', (req, res) => {
    res.json({ id: req.params.id, hasAt: req.params.id.includes('@') });
});
app.listen(8001, () => console.log('started'));
